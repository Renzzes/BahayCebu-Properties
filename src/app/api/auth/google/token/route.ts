import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge'; // Add this line to use Edge Runtime

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
    const { code, redirect_uri } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Exchange code for tokens
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

    const responseText = await tokenResponse.text();
    let tokens;
    
    try {
      tokens = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse token response:', responseText);
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

    return NextResponse.json(tokens, { headers: corsHeaders });
  } catch (error) {
    console.error('Token exchange error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
} 