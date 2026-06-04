import { withAdminAuth } from '../../../../lib/adminAuth'
import supabaseAdmin from '../../../../lib/supabaseAdmin'

export default withAdminAuth(async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'PATCH') {
    const allowedFields = [
      'sku',
      'category',
      'description',
      'stock',
      'purchase_price',
      'sale_price',
      'supplier'
    ]

    const updates = {}

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (['stock', 'purchase_price', 'sale_price'].includes(field)) {
          updates[field] = Number(req.body[field] || 0)
        } else {
          updates[field] = String(req.body[field] || '').trim()
        }
      }
    }

    const { data, error } = await supabaseAdmin
      .from('inventory')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'DELETE') {
    const { error } = await supabaseAdmin
      .from('inventory')
      .delete()
      .eq('id', id)

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ ok: true })
  }

  return res.status(405).end()
})
