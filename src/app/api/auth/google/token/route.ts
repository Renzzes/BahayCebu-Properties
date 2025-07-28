import { NextRequest, NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Authorization code is required' }, { 
        status: 400,
        headers: corsHeaders
      });
    }

    // Log configuration in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Google OAuth Config:', {
        clientId: process.env.GOOGLE_CLIENT_ID,
        redirectUri: process.env.GOOGLE_REDIRECT_URI
      });
    }

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
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

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json();
      console.error('Token exchange error:', error);
      
      // Check for specific error types
      if (error.error === 'redirect_uri_mismatch') {
        return NextResponse.json({ 
          error: 'Invalid redirect URI configuration',
          details: error
        }, { 
          status: 400,
          headers: corsHeaders
        });
      }
      
      return NextResponse.json({ 
        error: 'Failed to exchange code for token',
        details: error
      }, { 
        status: 500,
        headers: corsHeaders
      });
    }

    const tokens = await tokenResponse.json();
    return NextResponse.json(tokens, { headers: corsHeaders });
  } catch (error) {
    console.error('Token exchange error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { 
      status: 500,
      headers: corsHeaders
    });
  }
} 