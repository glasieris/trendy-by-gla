import { withAdminAuth } from '../../../lib/adminAuth'
import supabaseAdmin from '../../../lib/supabaseAdmin'

export default withAdminAuth(async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin.from('fabric_colors').select('*').order('sort_order')
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    const { name, hex } = req.body
    if (!name || !hex) return res.status(400).json({ error: 'Nombre y color requeridos' })
    const { data: existing } = await supabaseAdmin.from('fabric_colors').select('sort_order').order('sort_order', { ascending: false }).limit(1)
    const sort_order = (existing?.[0]?.sort_order ?? 0) + 1
    const { data, error } = await supabaseAdmin.from('fabric_colors').insert({ name, hex, sort_order }).select().single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }

  return res.status(405).end()
})
