import { withAdminAuth } from '../../../../../../lib/adminAuth'
import supabaseAdmin from '../../../../../../lib/supabaseAdmin'

// Update or delete a single variant by id (scoped to its product).
export default withAdminAuth(async function handler(req, res) {
  const { id, variantId } = req.query

  if (req.method === 'PATCH') {
    const allowed = ['label', 'image_url', 'stock', 'active', 'sort_order']
    const updates = {}
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key]
    }
    if (Object.keys(updates).length === 0) return res.status(400).json({ error: 'Nada que actualizar' })
    const { data, error } = await supabaseAdmin
      .from('product_variants')
      .update(updates)
      .eq('id', variantId)
      .eq('product_id', id)
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'DELETE') {
    const { error } = await supabaseAdmin
      .from('product_variants')
      .delete()
      .eq('id', variantId)
      .eq('product_id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ ok: true })
  }

  return res.status(405).end()
})
