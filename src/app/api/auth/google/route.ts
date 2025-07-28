import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  // Handle the OAuth callback
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  
  if (!code) {
    return NextResponse.redirect('/login?error=no_code');
  }

  try {
    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code);
    const userData = await getUserInfo(tokens.access_token);

    // Find or create user
    const user = await findOrCreateUser(userData);

    // Set session/token
    const response = NextResponse.redirect('/');
    // Add your session/token logic here
    
    return response;
  } catch (error) {
    console.error('Google auth error:', error);
    return NextResponse.redirect('/login?error=auth_failed');
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, name, picture, googleId } = await request.json();

    if (!email || !name || !googleId) {
      return NextResponse.json({ 
        error: "Validation Error",
        message: "Email, name, and googleId are required"
      }, { status: 400 });
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Create new user
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          profilePicture: picture,
          googleId
        }
      });
    } else {
      // Update existing user
      user = await prisma.user.update({
        where: { email },
        data: {
          googleId,
          profilePicture: picture || user.profilePicture
        }
      });
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      profilePicture: user.profilePicture
    });
  } catch (error) {
    console.error('Google auth error:', error);
    return NextResponse.json({ 
      error: "Authentication failed",
      message: error instanceof Error ? error.message : "Unknown error occurred"
    }, { status: 500 });
  }
}

async function exchangeCodeForTokens(code: string) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      grant_type: 'authorization_code',
    }),
  });

  return response.json();
}

async function getUserInfo(accessToken: string) {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.json();
}

async function findOrCreateUser(userData: any) {
  const { email, name, picture: profilePicture, id: googleId } = userData;

  let user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        profilePicture,
        googleId
      }
    });
  }

  return user;
} 