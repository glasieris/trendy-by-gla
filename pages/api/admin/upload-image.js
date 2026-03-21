import { withAdminAuth } from '../../../lib/adminAuth'
import supabaseAdmin from '../../../lib/supabaseAdmin'

export const config = { api: { bodyParser: { sizeLimit: '5mb' } } }

export default withAdminAuth(async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { base64, productId, mimeType } = req.body
  if (!base64 || !productId) return res.status(400).json({ error: 'Faltan datos' })

  const buffer = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ''), 'base64')
  const ext = (mimeType || 'image/jpeg').split('/')[1] || 'jpg'
  const path = `products/${productId}.${ext}`

  const { error } = await supabaseAdmin.storage.from('product-images').upload(path, buffer, {
    contentType: mimeType || 'image/jpeg',
    upsert: true,
  })

  if (error) return res.status(500).json({ error: error.message })

  const { data: { publicUrl } } = supabaseAdmin.storage.from('product-images').getPublicUrl(path)
  return res.status(200).json({ url: publicUrl })
})
