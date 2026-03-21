import { withAdminAuth } from '../../../lib/adminAuth'
import supabaseAdmin from '../../../lib/supabaseAdmin'

export default withAdminAuth(async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin.from('categories').select('*').order('sort_order')
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    const { slug, label, description } = req.body
    if (!slug || !label) return res.status(400).json({ error: 'slug y label son requeridos' })
    const { data: existing } = await supabaseAdmin.from('categories').select('sort_order').order('sort_order', { ascending: false }).limit(1)
    const sort_order = (existing?.[0]?.sort_order ?? 0) + 1
    const { data, error } = await supabaseAdmin.from('categories').insert({ slug, label, description: description || '', sort_order }).select().single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }

  return res.status(405).end()
})
