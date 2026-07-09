import { withAdminAuth } from '../../../../lib/adminAuth'
import supabaseAdmin from '../../../../lib/supabaseAdmin'

export default withAdminAuth(async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'PATCH') {
    const allowed = ['name','category_slug','is_hair','has_fabrics','price_detal','price_mayor','min_mayor','description','image_url','active','sort_order','cost','provider','archived']
    const updates = {}
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key]
    }
    // Archiving (soft-delete) also hides the product and its variants; restoring
    // reverses both. Keep active in sync so it drops out of / returns to the
    // storefront and reports.
    if (updates.archived === true) updates.active = false
    if (updates.archived === false) updates.active = true

    const { data, error } = await supabaseAdmin.from('products').update(updates).eq('id', id).select().single()
    if (error) return res.status(500).json({ error: error.message })

    if (updates.archived !== undefined) {
      await supabaseAdmin.from('product_variants').update({ active: !updates.archived }).eq('product_id', id)
    }
    return res.status(200).json(data)
  }

  if (req.method === 'DELETE') {
    const { error } = await supabaseAdmin.from('products').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ ok: true })
  }

  return res.status(405).end()
})
