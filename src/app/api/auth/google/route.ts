import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

interface GoogleUserInfo {
  email: string;
  name: string;
  picture: string;
  sub: string;
}

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
    
    // Get user info from Google
    const userInfo = await getUserInfo(tokens.access_token);

    // Find or create user
    const user = await findOrCreateUser(userInfo);

    // Create JWT token or session
    // Add your session/token logic here
    
    // Redirect to success page
    return NextResponse.redirect('/login?success=true');
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

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to exchange code: ${JSON.stringify(error)}`);
  }

  return response.json();
}

async function getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get user info from Google');
  }

  return response.json();
}

async function findOrCreateUser(userInfo: GoogleUserInfo) {
  const { email, name, picture: profilePicture, sub: googleId } = userInfo;

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