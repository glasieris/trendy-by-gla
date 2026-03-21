import { getIronSession } from 'iron-session'
import { sessionOptions } from '../../../lib/session'
import supabaseAdmin from '../../../lib/supabaseAdmin'

export default async function handler(req, res) {
  const session = await getIronSession(req, res, sessionOptions)

  if (req.method === 'POST') {
    const { email, password } = req.body
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password })
    if (error || !data.session) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' })
    }
    session.admin = { email, token: data.session.access_token }
    await session.save()
    return res.status(200).json({ ok: true })
  }

  if (req.method === 'DELETE') {
    session.destroy()
    return res.status(200).json({ ok: true })
  }

  return res.status(405).end()
}
