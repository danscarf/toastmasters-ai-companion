// app/(api)/process-agenda/route.ts
import { NextResponse } from 'next/server';
import { sanitizeTextWithPII, rehydrateAssignedRoles } from '../../../app/_lib/pii';
import { getStructuredRolesFromGemini } from '../../../app/_lib/gemini';

export async function POST(request: Request) {
  try {
    const { text, attendees } = await request.json();

    if (!text) {
      return NextResponse.json({ message: 'No text provided for processing.' }, { status: 400 });
    }

    // 1. Sanitize PII
    const { sanitizedText, piiMap } = sanitizeTextWithPII(text, attendees || []);

    // 2. Call Gemini API with sanitized text
    let structuredRoles;
    try {
      structuredRoles = await getStructuredRolesFromGemini(sanitizedText);
    } catch (aiError: unknown) {
      // Gracefully inform user and revert to manual if AI call fails (FR-009)
      console.error("Gemini API call failed:", aiError);
      return NextResponse.json(
        { message: `AI processing failed. Please try manual entry. Error: ${(aiError as Error).message || 'Unknown AI error.'}` },
        { status: 500 }
      );
    }
    
    const rehydratedRoles = rehydrateAssignedRoles(structuredRoles, piiMap);

    const response = NextResponse.json(rehydratedRoles);

    // Set CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*'); // Adjust this to specific origin in production
    response.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;

  } catch (error: unknown) {
    console.error("Error in API route:", error);
    return NextResponse.json({ message: `Internal server error: ${(error as Error).message || 'Unknown error.'}` }, { status: 500 });
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*'); // Adjust this to specific origin in production
  response.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}
