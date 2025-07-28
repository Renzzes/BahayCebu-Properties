import { NextRequest, NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    // Handle preflight request
    if (request.method === 'OPTIONS') {
      return NextResponse.json({}, { headers: corsHeaders });
    }

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

    // First try to get the response as text
    const responseText = await tokenResponse.text();
    let responseData;

    try {
      // Try to parse as JSON
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse token response as JSON:', responseText);
      return NextResponse.json({ 
        error: 'Invalid response from Google',
        details: 'Received non-JSON response'
      }, { 
        status: 500,
        headers: corsHeaders
      });
    }

    if (!tokenResponse.ok) {
      console.error('Token exchange error:', responseData);
      
      // Check for specific error types
      if (responseData.error === 'redirect_uri_mismatch') {
        return NextResponse.json({ 
          error: 'Invalid redirect URI configuration',
          details: responseData
        }, { 
          status: 400,
          headers: corsHeaders
        });
      }
      
      return NextResponse.json({ 
        error: 'Failed to exchange code for token',
        details: responseData
      }, { 
        status: 500,
        headers: corsHeaders
      });
    }

    return NextResponse.json(responseData, { headers: corsHeaders });
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