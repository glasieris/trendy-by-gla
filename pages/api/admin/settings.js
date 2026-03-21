import { withAdminAuth } from '../../../lib/adminAuth'
import supabaseAdmin from '../../../lib/supabaseAdmin'

export default withAdminAuth(async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin.from('settings').select('*').single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'PATCH') {
    const { bcv_rate } = req.body
    if (!bcv_rate || isNaN(Number(bcv_rate))) return res.status(400).json({ error: 'Tasa BCV inválida' })
    const { data: current, error: fetchErr } = await supabaseAdmin.from('settings').select('id').single()
    if (fetchErr || !current) return res.status(500).json({ error: 'No se encontró configuración' })
    const { data, error } = await supabaseAdmin.from('settings').update({ bcv_rate: Number(bcv_rate), updated_at: new Date().toISOString() }).eq('id', current.id).select().single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  return res.status(405).end()
})
