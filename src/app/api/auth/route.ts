import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Get admin credentials from environment variables
// In production, these should be set in your hosting environment (Dreamhost)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password'; // Default for development only
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Validate the JWT secret is strong in production
if (process.env.NODE_ENV === 'production' && 
    (JWT_SECRET === 'your-secret-key' || !JWT_SECRET || JWT_SECRET.length < 32)) {
  console.warn('WARNING: Using a weak JWT_SECRET in production is a security risk. Set a strong JWT_SECRET environment variable.');
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if credentials match the admin account
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: 'admin',
        email: ADMIN_EMAIL,
        role: 'admin'
      },
      JWT_SECRET,
      { expiresIn: '7d' } // Token valid for 7 days
    );

    // Return success response with token
    return NextResponse.json({
      success: true,
      token,
      user: {
        email: ADMIN_EMAIL,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 