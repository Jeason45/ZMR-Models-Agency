import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'your-secret-key'
);

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('member-session-token')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    // Vérifier le token JWT
    const { payload } = await jwtVerify(token, JWT_SECRET);

    if (!payload.isMember) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: payload.id,
        email: payload.email,
        name: payload.name,
        image: payload.image,
      },
    });
  } catch (error) {
    console.error('Error getting member session:', error);
    return NextResponse.json({ authenticated: false, user: null });
  }
}
