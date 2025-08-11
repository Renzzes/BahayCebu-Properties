import { NextRequest, NextResponse } from 'next/server';

// Remove the edge runtime directive
// export const runtime = 'edge';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://bahaycebu-properties.com',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, cache-control',
  'Access-Control-Allow-Credentials': 'true',
};

export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        'Authorization': `Bearer ${code}`
      }
    });

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.error('Google API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to get user info from Google' },
        { status: userResponse.status, headers: corsHeaders }
      );
    }

    const userInfo = await userResponse.json();

    // Handle user creation/authentication directly here
    console.log('Creating/updating user with Google info:', {
      email: userInfo.email,
      name: userInfo.name,
      googleId: userInfo.sub
    });

    // For now, return a mock response since we can't access the database from Next.js
    // TODO: Set up database connection in Next.js API route or use a different backend
    const mockToken = 'mock-jwt-token-' + Date.now();
    const mockUser = {
      id: 'user-' + Date.now(),
      email: userInfo.email,
      name: userInfo.name,
      role: 'USER',
      profilePicture: userInfo.picture
    };

    console.log('Returning mock user data:', mockUser);

    return NextResponse.json({
      token: mockToken,
      user: mockUser
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Google auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}