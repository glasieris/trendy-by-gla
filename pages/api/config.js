import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  try {
    const [settingsRes, categoriesRes, fabricsRes, productsRes, imagesRes] = await Promise.all([
      supabase.from('settings').select('value').eq('key', 'bcv_rate').single(),
      supabase.from('categories').select('*').order('sort_order'),
      supabase.from('fabric_colors').select('*').order('sort_order'),
      supabase.from('products').select('*').eq('active', true).order('sort_order'),
      supabase.from('product_images').select('product_id, url, sort_order').order('sort_order'),
    ])

    const bcv_rate = settingsRes.data?.value ? parseFloat(settingsRes.data.value) : 443.26
    const categories = categoriesRes.data ?? []
    const fabrics = (fabricsRes.data ?? []).map(f => ({ name: f.name, hex: f.hex }))

    // Build images map: product_id → [url, url, ...]
    const imagesByProduct = {}
    ;(imagesRes.data ?? []).forEach(img => {
      if (!imagesByProduct[img.product_id]) imagesByProduct[img.product_id] = []
      imagesByProduct[img.product_id].push(img.url)
    })

    const products = (productsRes.data ?? []).map(p => {
      const imgs = imagesByProduct[p.id] ?? (p.image_url ? [p.image_url] : [])
      return {
        id: p.id,
        name: p.name,
        category: p.category_slug,
        is_hair: p.is_hair,
        has_fabrics: p.has_fabrics,
        price_detal: parseFloat(p.price_detal),
        price_mayor: parseFloat(p.price_mayor),
        min_mayor: p.min_mayor,
        description: p.description || '',
        image_url: imgs[0] || null,
        images: imgs,
      }
    })

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
    return res.status(200).json({ bcv_rate, categories, fabrics, products })
  } catch (err) {
    console.error('Config API error:', err)
    return res.status(500).json({ error: 'Error cargando configuración' })
  }
}
