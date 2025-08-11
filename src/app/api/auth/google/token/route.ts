import { NextRequest, NextResponse } from 'next/server';

// Configure CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://bahaycebu-properties.com',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, cache-control',
  'Access-Control-Allow-Credentials': 'true',
  'Content-Type': 'application/json'
};

export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    // Log request details
    console.log('Received token exchange request');
    
    const body = await request.json();
    console.log('Request body:', { ...body, code: '[REDACTED]' });

    const { code, redirect_uri } = body;

    if (!code) {
      console.log('Missing code in request');
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Exchange code for tokens
    console.log('Exchanging code for tokens...');
    console.log('Using redirect URI:', redirect_uri);

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri,
        grant_type: 'authorization_code',
      }).toString(),
    });

    // Log response details
    console.log('Token response status:', tokenResponse.status);
    
    const responseText = await tokenResponse.text();
    console.log('Raw token response:', responseText);

    let tokens;
    try {
      tokens = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse token response:', e);
      return NextResponse.json(
        { error: 'Invalid response from Google' },
        { status: 500, headers: corsHeaders }
      );
    }

    if (!tokenResponse.ok) {
      console.error('Token exchange error:', tokens);
      return NextResponse.json(
        { error: tokens.error || 'Failed to exchange code for token' },
        { status: tokenResponse.status, headers: corsHeaders }
      );
    }

    console.log('Successfully exchanged code for tokens');
    return NextResponse.json(tokens, { headers: corsHeaders });

  } catch (error) {
    console.error('Token exchange error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}