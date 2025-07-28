import { NextRequest, NextResponse } from 'next/server';

// Remove the edge runtime directive
// export const runtime = 'edge';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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

    // Forward the request to the Vercel API route that handles user creation
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://bahaycebu-properties.vercel.app';
    const authResponse = await fetch(`${apiUrl}/api/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        googleId: userInfo.sub,
      }),
    });

    if (!authResponse.ok) {
      const errorData = await authResponse.json();
      return NextResponse.json(
        { error: errorData.error || 'Authentication failed' },
        { status: authResponse.status, headers: corsHeaders }
      );
    }

    const data = await authResponse.json();
    return NextResponse.json(data, { headers: corsHeaders });

  } catch (error) {
    console.error('Google auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
} 