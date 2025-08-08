import { NextRequest, NextResponse } from 'next/server';

// Remove the edge runtime directive
// export const runtime = 'edge';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://bahaycebu-properties.com',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
  'Access-Control-Allow-Credentials': 'true',
};

export async function OPTIONS() {
  return new NextResponse(null, { 
    headers: {
      ...corsHeaders,
      'Access-Control-Allow-Credentials': 'true'
    } 
  });
}

export async function POST(request: NextRequest) {
  // Log the entire request for debugging
  console.log('Received Google Auth Request:', {
    method: request.method,
    url: request.url,
    headers: Object.fromEntries(request.headers.entries())
  });

  try {
    // Attempt to parse request body with comprehensive error handling
    let requestBody;
    try {
      requestBody = await request.json();
      console.log('Raw request body:', JSON.stringify(requestBody));
    } catch (parseError: unknown) {
      console.error('Failed to parse request body:', parseError);
      
      // Try to get raw text to understand what was sent
      const rawBody = await request.text();
      console.error('Raw request body text:', rawBody);
      
      return NextResponse.json(
        { 
          error: 'Invalid request body', 
          details: parseError instanceof Error ? parseError.message : 'Unknown parsing error',
          rawBody: rawBody 
        },
        { 
          status: 400, 
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          } 
        }
      );
    }

    const { email, name, picture, googleId } = requestBody;

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { 
          status: 400, 
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          } 
        }
      );
    }

    console.log('Parsed user data:', { 
      email, 
      name, 
      googleId, 
      picture: picture ? 'present' : 'missing' 
    });

    // Generate a mock token (replace with actual token generation in production)
    const mockToken = `mock-jwt-token-${Date.now()}`;
    
    // Return successful response
    return NextResponse.json(
      {
        token: mockToken,
        user: {
          id: `user-${Date.now()}`,
          email,
          name,
          role: 'USER',
          profilePicture: picture
        }
      },
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );

  } catch (error) {
    console.error('Unexpected error in Google auth route:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { 
        status: 500, 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  }
}