import { withAdminAuth } from '../../../../lib/adminAuth'
import supabaseAdmin from '../../../../lib/supabaseAdmin'

export default withAdminAuth(async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'PATCH') {
    const updates = { updated_at: new Date().toISOString() }
    if (req.body.name !== undefined) {
      const cleanName = String(req.body.name || '').trim()
      if (!cleanName) return res.status(400).json({ error: 'El nombre no puede estar vacío' })
      updates.name = cleanName
    }
    if (req.body.qty !== undefined) {
      updates.qty = Number.isFinite(Number(req.body.qty)) ? Math.trunc(Number(req.body.qty)) : 0
    }
    if (req.body.unit_cost !== undefined) {
      updates.unit_cost = req.body.unit_cost === '' || req.body.unit_cost == null ? null : Number(req.body.unit_cost)
    }

    const { data, error } = await supabaseAdmin
      .from('packaging_inventory')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'DELETE') {
    // categories.packaging_id is ON DELETE SET NULL, so removing a material
    // simply unlinks any category that referenced it.
    const { error } = await supabaseAdmin
      .from('packaging_inventory')
      .delete()
      .eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ ok: true })
  }

  return res.status(405).end()
})
