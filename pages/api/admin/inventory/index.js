import { withAdminAuth } from '../../../../lib/adminAuth'
import supabaseAdmin from '../../../../lib/supabaseAdmin'

export default withAdminAuth(async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('inventory')
      .select('*')
      .order('id', { ascending: false })

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data || [])
  }

  if (req.method === 'POST') {
    const {
      sku,
      category,
      description,
      stock,
      purchase_price,
      sale_price,
      supplier
    } = req.body

   const cleanDescription = String(description || '').trim()

const payload = {
  sku: String(sku || '').trim(),
  category: String(category || '').trim(),
  description: cleanDescription,
  product_name: cleanDescription,
  stock: Number(stock || 0),
  purchase_price: Number(purchase_price || 0),
  sale_price: Number(sale_price || 0),
  supplier: String(supplier || '').trim()
}

    const { data, error } = await supabaseAdmin
      .from('inventory')
      .insert([payload])
      .select()
      .single()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  return res.status(405).end()
})
