import { withAdminAuth } from '../../../lib/adminAuth'
import supabaseAdmin from '../../../lib/supabaseAdmin'

export default withAdminAuth(async function handler(req, res) {
  if (req.method === 'GET') {
    // Default: only non-archived products. ?archived=true returns archived ones
    // (used by the low-visibility "Productos archivados" restore section).
    const wantArchived = req.query.archived === 'true'
    const { data, error } = await supabaseAdmin.from('products').select('*').eq('archived', wantArchived).order('category_slug').order('sort_order')
    if (error) return res.status(500).json({ error: error.message })

    // Resolve each product's thumbnail from product_images (the source of truth),
    // falling back to the denormalized image_url. This keeps the admin list in sync
    // with the gallery even when image_url is stale/null.
    const { data: images } = await supabaseAdmin
      .from('product_images')
      .select('product_id, url, sort_order')
      .order('sort_order')
    const firstImage = {}
    for (const img of images ?? []) {
      if (!(img.product_id in firstImage)) firstImage[img.product_id] = img.url
    }

    // Compute which products are auto-hidden from the storefront by stock: they
    // have buyable variants but ALL are sold out/reserved (available <= 0) and
    // none is "Bajo pedido". Mirrors the visibility filter in /api/config so the
    // admin list can flag them without changing any data. Products with no
    // variants (unlimited) never count as sold out.
    const { data: variants } = await supabaseAdmin
      .from('product_variants')
      .select('product_id, stock, reserved, on_demand, reference_only')
      .eq('active', true)
    const buyableByProduct = {}
    for (const v of variants ?? []) {
      if (v.reference_only) continue
      ;(buyableByProduct[v.product_id] ||= []).push(v)
    }
    const withThumb = data.map(p => {
      const vs = buyableByProduct[p.id] || []
      const sold_out = vs.length > 0 && vs.every(v => !v.on_demand && (Number(v.stock || 0) - Number(v.reserved || 0)) <= 0)
      return { ...p, thumb: firstImage[p.id] || p.image_url || null, sold_out }
    })

    return res.status(200).json(withThumb)
  }

  if (req.method === 'POST') {
    const { id, name, category_slug, is_hair, has_fabrics, price_detal, price_mayor, min_mayor, description, image_url, cost, provider } = req.body
    if (!id || !name || !category_slug || price_detal == null || price_mayor == null) {
      return res.status(400).json({ error: 'Faltan campos requeridos' })
    }
    const { data: existing } = await supabaseAdmin.from('products').select('sort_order').eq('category_slug', category_slug).order('sort_order', { ascending: false }).limit(1)
    const sort_order = (existing?.[0]?.sort_order ?? 0) + 1

    const { data, error } = await supabaseAdmin.from('products').insert({
      id, name, category_slug, is_hair: !!is_hair, has_fabrics: !!has_fabrics,
      price_detal, price_mayor, min_mayor: min_mayor ?? 999,
      description: description || '', image_url: image_url || null,
      cost: cost == null || cost === '' ? null : cost,
      provider: provider || null,
      sort_order, active: true
    }).select().single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }

  return res.status(405).end()
})
