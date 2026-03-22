import { withAdminAuth } from '../../../../../../lib/adminAuth'
import supabaseAdmin from '../../../../../../lib/supabaseAdmin'

export default withAdminAuth(async function handler(req, res) {
  const { id, imageId } = req.query

  if (req.method === 'DELETE') {
    // Get the image before deleting to know if it's the first
    const { data: img } = await supabaseAdmin
      .from('product_images')
      .select('url, sort_order')
      .eq('id', imageId)
      .single()

    const { error } = await supabaseAdmin
      .from('product_images')
      .delete()
      .eq('id', imageId)
      .eq('product_id', id)
    if (error) return res.status(500).json({ error: error.message })

    // If it was the first image, update product's image_url to next image
    if (img?.sort_order === 0) {
      const { data: next } = await supabaseAdmin
        .from('product_images')
        .select('url')
        .eq('product_id', id)
        .order('sort_order')
        .limit(1)
      await supabaseAdmin
        .from('products')
        .update({ image_url: next?.[0]?.url || null })
        .eq('id', id)
    }

    return res.status(200).json({ ok: true })
  }

  return res.status(405).end()
})
