import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from './session'

// Wraps an API route and checks for admin session
export function withAdminAuth(handler) {
  return withIronSessionApiRoute(async function (req, res) {
    if (!req.session?.admin) {
      return res.status(401).json({ error: 'No autorizado' })
    }
    return handler(req, res)
  }, sessionOptions)
}
