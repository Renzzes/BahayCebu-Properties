import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('Google token exchange API called:', {
    method: req.method,
    headers: req.headers,
    body: req.body
  });

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    console.log('Invalid method:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, redirect_uri } = req.body;
    console.log('Request body:', { code: code ? '[PRESENT]' : '[MISSING]', redirect_uri });

    if (!code) {
      console.log('Missing code in request');
      return res.status(400).json({ error: 'Authorization code is required' });
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
      return res.status(500).json({ error: 'Invalid response from Google' });
    }

    if (!tokenResponse.ok) {
      console.error('Token exchange error:', tokens);
      return res.status(400).json({ 
        error: tokens.error || 'Failed to exchange code for token',
        details: tokens
      });
    }

    console.log('Successfully exchanged code for tokens');
    return res.json(tokens);

  } catch (error) {
    console.error('Token exchange error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 