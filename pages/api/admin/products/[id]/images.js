import { withAdminAuth } from '../../../../../lib/adminAuth'
import supabaseAdmin from '../../../../../lib/supabaseAdmin'

export const config = { api: { bodyParser: { sizeLimit: '10mb' } } }

export default withAdminAuth(async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('product_images')
      .select('*')
      .eq('product_id', id)
      .order('sort_order')
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data ?? [])
  }

  if (req.method === 'POST') {
    const { base64, mimeType } = req.body
    if (!base64) return res.status(400).json({ error: 'base64 requerido' })

    const clean = base64.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(clean, 'base64')
    const ext = (mimeType || 'image/jpeg').split('/')[1] || 'jpg'
    const filename = `products/${id}_${Date.now()}.${ext}`

    const { error: uploadError } = await supabaseAdmin.storage
      .from('product-images')
      .upload(filename, buffer, { contentType: mimeType || 'image/jpeg', upsert: false })
    if (uploadError) return res.status(500).json({ error: uploadError.message })

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('product-images')
      .getPublicUrl(filename)

    // Determine next sort_order
    const { data: existing } = await supabaseAdmin
      .from('product_images')
      .select('sort_order')
      .eq('product_id', id)
      .order('sort_order', { ascending: false })
      .limit(1)
    const sort_order = (existing?.[0]?.sort_order ?? -1) + 1

    const { data, error } = await supabaseAdmin
      .from('product_images')
      .insert({ product_id: id, url: publicUrl, sort_order })
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })

    // If first image, update product's image_url
    if (sort_order === 0) {
      await supabaseAdmin.from('products').update({ image_url: publicUrl }).eq('id', id)
    }

    return res.status(201).json(data)
  }

  return res.status(405).end()
})
