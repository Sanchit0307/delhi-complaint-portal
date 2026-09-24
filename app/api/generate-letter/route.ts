import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

// Title Case Helper Function
function toTitleCase(str: string): string {
  if (!str) return str;
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function POST(req: Request) {
  try {
    const { department, name, phone, address, problem, urgency, lang } = await req.json();

    if (!department || !name || !address || !problem) {
      return NextResponse.json(
        { error: 'Missing required fields: department, name, address, problem' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY environment variable is missing.');
      return NextResponse.json(
        { error: 'GEMINI_API_KEY environment variable is missing.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const formattedName = toTitleCase(name.trim());
    const formattedAddress = toTitleCase(address.trim());

    const systemInstruction = `You are an expert civic advocate and legal draftsman for Delhi NCR civic administration grievances.
Your task is to draft a formal, professionally formatted grievance representation letter addressed to the specified department.

STRICT FORMATTING & STYLISTIC RULES:
1. TITLE CASE: Always format citizen names and addresses in proper Title Case (e.g., "Rajesh Sharma", "Pocket B, Mayur Vihar Phase 1, Delhi 110091").
2. FLUENT PROSE: Convert the user's problem description into well-structured, coherent prose paragraphs. DO NOT use bullet points, numbered lists, or raw comma-separated lists.
3. FORMAL LEGAL STRUCTURE:
   - Header title: PUBLIC GRIEVANCE REPRESENTATION NOTICE
   - Organization line: Government of National Capital Territory of Delhi (GNCTD) Grievance Format
   - Reference Code: DEL-2026-${department.toUpperCase()}-XXXXX
   - Date, Addressee salutation, Formal Subject line
   - Detailed body paragraphs explaining the context, exact location, duration, and legal/civic obligation of the agency
   - Formal concluding sign-off: "Yours Sincerely, ${formattedName}" followed by "(Resident & Citizen of Delhi NCR)".
4. STAMP REMOVAL (CRITICAL): DO NOT include any physical rubber stamps, seal circles, or "VERIFIED FORMAL" stamp markers anywhere in the document text.
5. LANGUAGE: Write the letter in ${lang === 'hi' ? 'Hindi (Devanagari script)' : 'Formal English'}.
6. TONE: Highly formal, legal, assertive, and respectful.`;

    const prompt = `Department Concerned: ${department}
Complainant Name: ${formattedName}
Contact Number/Email: ${phone || 'N/A'}
Locality / Full Address: ${formattedAddress}
Urgency Level: ${urgency || 'Normal'}
Problem Context: ${problem}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3,
      },
    });

    const letterText = response.text || '';

    return NextResponse.json({ letter: letterText });
  } catch (error: any) {
    console.error('Error generating letter with Gemini API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate grievance letter' },
      { status: 500 }
    );
  }
}
