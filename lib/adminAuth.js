import { getIronSession } from 'iron-session'
import { sessionOptions } from './session'

// Wraps an API route and checks for admin session
export function withAdminAuth(handler) {
  return async function (req, res) {
    const session = await getIronSession(req, res, sessionOptions)
    if (!session.admin) {
      return res.status(401).json({ error: 'No autorizado' })
    }
    req.session = session
    return handler(req, res)
  }
}
