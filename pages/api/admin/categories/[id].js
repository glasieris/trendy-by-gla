import { withAdminAuth } from '../../../../lib/adminAuth'
import supabaseAdmin from '../../../../lib/supabaseAdmin'

export default withAdminAuth(async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'DELETE') {
    const cat = await supabaseAdmin.from('categories').select('slug').eq('id', id).single()
    if (cat.data) {
      const { count } = await supabaseAdmin.from('products').select('*', { count: 'exact', head: true }).eq('category_slug', cat.data.slug)
      if (count > 0) return res.status(400).json({ error: `Esta categoría tiene ${count} producto(s). Muévelos primero.` })
    }
    const { error } = await supabaseAdmin.from('categories').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ ok: true })
  }

  return res.status(405).end()
})
