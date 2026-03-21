import { withAdminAuth } from '../../../lib/adminAuth'
import supabaseAdmin from '../../../lib/supabaseAdmin'

export default withAdminAuth(async function handler(req, res) {
  if (req.method === 'GET') {
    const { status } = req.query
    let query = supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false })
    if (status && status !== 'todos') query = query.eq('status', status)
    const { data, error } = await query
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }
  return res.status(405).end()
})
