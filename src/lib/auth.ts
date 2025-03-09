import jwt from 'jsonwebtoken';

// JWT secret from environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development';

// Verify JWT token
export function verifyJwtToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('Error verifying JWT token:', error);
    return null;
  }
}

// Generate JWT token
export function generateJwtToken(payload: any, expiresIn = '7d') {
  // @ts-ignore - Ignoring type error for now
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
} 