import { withAdminAuth } from '../../../lib/adminAuth'
import supabaseAdmin from '../../../lib/supabaseAdmin'
import { sendTelegram } from '../../../lib/telegram'

export default withAdminAuth(async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin.from('settings').select('value').eq('key', 'bcv_rate').single()
    // PGRST116 = no rows found — return default
    if (error && error.code !== 'PGRST116') return res.status(500).json({ error: error.message })
    return res.status(200).json({ bcv_rate: data?.value ? parseFloat(data.value) : 443.26 })
  }

  if (req.method === 'PATCH') {
    const { bcv_rate } = req.body
    if (!bcv_rate || isNaN(Number(bcv_rate))) return res.status(400).json({ error: 'Tasa BCV inválida' })
    const rate = Number(bcv_rate)

    // Read the previous value so the Telegram notice can show old -> new.
    let previous = null
    const { data: prev } = await supabaseAdmin.from('settings').select('value').eq('key', 'bcv_rate').single()
    if (prev?.value) previous = parseFloat(prev.value)

    const { error } = await supabaseAdmin
      .from('settings')
      .upsert({ key: 'bcv_rate', value: String(rate) }, { onConflict: 'key' })
    if (error) return res.status(500).json({ error: error.message })

    // Notify Telegram (manual update).
    await sendTelegram(
      `✏️ <b>BCV actualizado (manual)</b>\n` +
      `Nueva tasa: <b>${rate} Bs/USD</b>` +
      (previous !== null ? `\nAntes: ${previous} Bs` : '')
    )

    return res.status(200).json({ bcv_rate: rate })
  }

  return res.status(405).end()
})
