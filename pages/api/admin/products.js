import { withAdminAuth } from '../../../lib/adminAuth'
import supabaseAdmin from '../../../lib/supabaseAdmin'

export default withAdminAuth(async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin.from('products').select('*').order('category_slug').order('sort_order')
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    const { id, name, category_slug, is_hair, has_fabrics, price_detal, price_mayor, min_mayor, description, image_url } = req.body
    if (!id || !name || !category_slug || price_detal == null || price_mayor == null) {
      return res.status(400).json({ error: 'Faltan campos requeridos' })
    }
    const { data: existing } = await supabaseAdmin.from('products').select('sort_order').eq('category_slug', category_slug).order('sort_order', { ascending: false }).limit(1)
    const sort_order = (existing?.[0]?.sort_order ?? 0) + 1

    const { data, error } = await supabaseAdmin.from('products').insert({
      id, name, category_slug, is_hair: !!is_hair, has_fabrics: !!has_fabrics,
      price_detal, price_mayor, min_mayor: min_mayor ?? 999,
      description: description || '', image_url: image_url || null,
      sort_order, active: true
    }).select().single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }

  return res.status(405).end()
})
