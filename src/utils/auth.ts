/**
 * Authentication Utilities
 * JWT token generation and validation
 * Password hashing and verification
 */

import { sign, verify } from 'hono/jwt'

// JWT Secret - In production, use environment variable
const JWT_SECRET = 'your-super-secret-jwt-key-change-in-production'

export interface JWTPayload {
  userId: number
  email: string
  role: string
  exp: number
}

/**
 * Generate JWT token for authenticated user
 */
export async function generateToken(userId: number, email: string, role: string): Promise<string> {
  const payload: JWTPayload = {
    userId,
    email,
    role,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7), // 7 days
  }
  return await sign(payload, JWT_SECRET)
}

/**
 * Verify JWT token and return payload
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const payload = await verify(token, JWT_SECRET) as JWTPayload
    return payload
  } catch (error) {
    return null
  }
}

/**
 * Simple password hashing using Web Crypto API
 * Note: In production, use bcrypt or similar on server side
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}
