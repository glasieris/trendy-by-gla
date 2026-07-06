import supabaseAdmin from '../../../lib/supabaseAdmin'
import { sendTelegram } from '../../../lib/telegram'

const DOLARAPI_URL = 'https://ve.dolarapi.com/v1/dolares/oficial'

// Daily automatic update of the BCV rate.
// Triggered by Vercel Cron (which sends Authorization: Bearer <CRON_SECRET>).
// On success it saves the new rate to settings.bcv_rate (same value the manual
// admin form updates) and notifies Telegram. On failure it keeps the previous
// value and notifies Telegram that the update failed — it never throws.
export default async function handler(req, res) {
  // Only Vercel Cron (or someone with the secret) may trigger this.
  const secret = process.env.CRON_SECRET
  if (secret) {
    if (req.headers.authorization !== `Bearer ${secret}`) {
      return res.status(401).json({ error: 'No autorizado' })
    }
  }

  // 1. Read the currently stored rate (to report old -> new and to fall back on failure).
  let previous = null
  try {
    const { data } = await supabaseAdmin.from('settings').select('value').eq('key', 'bcv_rate').single()
    if (data?.value) previous = parseFloat(data.value)
  } catch (_) {
    // ignore — treated as "no previous value"
  }

  // 2. Fetch the official rate from dolarapi.
  let rate = null
  try {
    const r = await fetch(DOLARAPI_URL, { headers: { accept: 'application/json' } })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    const d = await r.json()
    const value = Number(d?.promedio)
    if (!value || isNaN(value)) throw new Error('Respuesta sin tasa válida (campo "promedio")')
    rate = Math.round(value * 100) / 100 // keep 2 decimals, like the manual entry
  } catch (err) {
    // Failure: keep the previous value, notify, and do not break anything.
    await sendTelegram(
      `⚠️ <b>BCV — la actualización automática falló</b>\n` +
      `No se pudo obtener la tasa desde dolarapi hoy.\n` +
      `Se mantiene el valor anterior: <b>${previous ?? 'desconocido'} Bs/USD</b>.\n` +
      `Motivo: ${err.message}`
    )
    return res.status(200).json({ ok: false, error: err.message, kept: previous })
  }

  // 3. Save the new rate (same upsert the manual save uses).
  const { error } = await supabaseAdmin
    .from('settings')
    .upsert({ key: 'bcv_rate', value: String(rate) }, { onConflict: 'key' })
  if (error) {
    await sendTelegram(
      `⚠️ <b>BCV — error al guardar</b>\n` +
      `Se obtuvo la tasa (${rate} Bs) pero falló el guardado en la base de datos.\n` +
      `Motivo: ${error.message}`
    )
    return res.status(500).json({ error: error.message })
  }

  // 4. Notify Telegram (always, per configuration).
  const changed = previous === null || Math.abs(previous - rate) > 0.0001
  await sendTelegram(
    `🤖 <b>BCV actualizado (automático)</b>\n` +
    `Nueva tasa: <b>${rate} Bs/USD</b>` +
    (previous !== null ? `\n${changed ? `Antes: ${previous} Bs` : 'Sin cambios respecto al valor anterior.'}` : '')
  )

  return res.status(200).json({ ok: true, rate, previous, changed })
}
