import { withAdminAuth } from '../../../../lib/adminAuth'
import supabaseAdmin from '../../../../lib/supabaseAdmin'

export default withAdminAuth(async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('packaging_inventory')
      .select('*')
      .order('name')
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data || [])
  }

  if (req.method === 'POST') {
    const { name, qty, unit_cost } = req.body
    const cleanName = String(name || '').trim()
    if (!cleanName) return res.status(400).json({ error: 'El nombre es requerido' })

    const payload = {
      name: cleanName,
      qty: Number.isFinite(Number(qty)) ? Math.trunc(Number(qty)) : 0,
      unit_cost: unit_cost === '' || unit_cost == null ? null : Number(unit_cost),
    }
    const { data, error } = await supabaseAdmin
      .from('packaging_inventory')
      .insert(payload)
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }

  return res.status(405).end()
})
