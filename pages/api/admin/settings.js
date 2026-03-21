import { withAdminAuth } from '../../../lib/adminAuth'
import supabaseAdmin from '../../../lib/supabaseAdmin'

export default withAdminAuth(async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin.from('settings').select('value').eq('key', 'bcv_rate').single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ bcv_rate: parseFloat(data.value) })
  }

  if (req.method === 'PATCH') {
    const { bcv_rate } = req.body
    if (!bcv_rate || isNaN(Number(bcv_rate))) return res.status(400).json({ error: 'Tasa BCV inválida' })
    const { error } = await supabaseAdmin.from('settings').update({ value: String(Number(bcv_rate)) }).eq('key', 'bcv_rate')
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ bcv_rate: Number(bcv_rate) })
  }

  return res.status(405).end()
})
