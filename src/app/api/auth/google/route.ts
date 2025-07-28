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

    const responseText = await userResponse.text();
    let userInfo;
    
    try {
      userInfo = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse user info response:', responseText);
      return NextResponse.json(
        { error: 'Invalid response from Google' },
        { status: 500, headers: corsHeaders }
      );
    }

    if (!userResponse.ok) {
      console.error('Google user info error:', userInfo);
      return NextResponse.json(
        { error: userInfo.error || 'Failed to get user info' },
        { status: userResponse.status, headers: corsHeaders }
      );
    }

    // Return the user info
    return NextResponse.json(userInfo, { headers: corsHeaders });
  } catch (error) {
    console.error('Google auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
} 