import { withAdminAuth } from '../../../../../../lib/adminAuth'
import supabaseAdmin from '../../../../../../lib/supabaseAdmin'

// Variants for a product. A variant is an uploaded photo that has been given a
// name (label) and its own stock. Keyed by (product_id, image_url) so the admin
// can turn any existing photo into a buyable variant.
export default withAdminAuth(async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('product_variants')
      .select('*')
      .eq('product_id', id)
      .order('sort_order')
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data ?? [])
  }

  if (req.method === 'POST') {
    // Upsert a variant for a given photo (image_url).
    const { image_url, label, stock, sort_order, on_demand, reference_only } = req.body
    if (!image_url) return res.status(400).json({ error: 'image_url requerido' })

    const cleanLabel = String(label || '').trim()

    const { data: existing } = await supabaseAdmin
      .from('product_variants')
      .select('id')
      .eq('product_id', id)
      .eq('image_url', image_url)
      .maybeSingle()

    // Empty label => this photo is no longer a variant: remove it if it existed.
    if (!cleanLabel) {
      if (existing) await supabaseAdmin.from('product_variants').delete().eq('id', existing.id)
      return res.status(200).json({ deleted: true })
    }

    // "Solo referencia" is mutually exclusive with the buyable modes: force
    // on_demand=false and stock=0 so a reference photo never carries stock/cost.
    const isReference = !!reference_only
    const payload = {
      product_id: id,
      image_url,
      label: cleanLabel,
      stock: isReference ? 0 : Number(stock || 0),
      on_demand: isReference ? false : !!on_demand,
      reference_only: isReference,
      sort_order: Number(sort_order || 0),
    }

    const result = existing
      ? await supabaseAdmin.from('product_variants').update(payload).eq('id', existing.id).select().single()
      : await supabaseAdmin.from('product_variants').insert(payload).select().single()

    if (result.error) return res.status(500).json({ error: result.error.message })
    return res.status(200).json(result.data)
  }

  return res.status(405).end()
})
