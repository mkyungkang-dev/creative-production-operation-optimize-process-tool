/**
 * Authentication Middleware
 * Validates JWT tokens and enforces role-based access control
 */

import { Context, Next } from 'hono'
import { verifyToken, JWTPayload } from '../utils/auth'

// Extend Hono context to include user info
export interface AuthContext {
  user?: JWTPayload
}

/**
 * Middleware to verify JWT token and attach user to context
 */
export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized: No token provided' }, 401)
  }

  const token = authHeader.substring(7)
  const payload = await verifyToken(token)

  if (!payload) {
    return c.json({ error: 'Unauthorized: Invalid token' }, 401)
  }

  // Check if token is expired
  if (payload.exp < Math.floor(Date.now() / 1000)) {
    return c.json({ error: 'Unauthorized: Token expired' }, 401)
  }

  // Attach user info to context
  c.set('user', payload)
  
  await next()
}

/**
 * Middleware to check if user has required role
 */
export function requireRole(...allowedRoles: string[]) {
  return async (c: Context, next: Next) => {
    const user = c.get('user') as JWTPayload

    if (!user) {
      return c.json({ error: 'Unauthorized: Authentication required' }, 401)
    }

    if (!allowedRoles.includes(user.role)) {
      return c.json({ error: 'Forbidden: Insufficient permissions' }, 403)
    }

    await next()
  }
}
