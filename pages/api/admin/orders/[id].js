import { withAdminAuth } from '../../../../lib/adminAuth'
import supabaseAdmin from '../../../../lib/supabaseAdmin'

export default withAdminAuth(async function handler(req, res) {
  const { id } = req.query
  if (req.method === 'PATCH') {
    const { status, notes } = req.body
    const updates = {}
    if (status !== undefined) updates.status = status
    if (notes !== undefined) updates.notes = notes
    const { data, error } = await supabaseAdmin.from('orders').update(updates).eq('id', id).select().single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }
  return res.status(405).end()
})
