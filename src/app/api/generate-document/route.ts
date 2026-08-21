import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import type { GenerateDocumentRequest } from '../../../../lib/types';

const MAX_FIELD_LENGTH = 3000;

export async function POST(req: NextRequest) {
  // Fail fast with a clear message if the API key is missing
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set');
    return NextResponse.json(
      { error: 'Server configuration error: GEMINI_API_KEY is not set. Please add it to your .env.local file.' },
      { status: 500 }
    );
  }

  try {
    const body: GenerateDocumentRequest = await req.json();
    const { taskTitle, taskDescription, userInput } = body;

    if (!taskTitle || !taskDescription || !userInput) {
      return NextResponse.json(
        { error: 'taskTitle, taskDescription, and userInput are required' },
        { status: 400 }
      );
    }

    if (userInput.length > MAX_FIELD_LENGTH) {
      return NextResponse.json(
        { error: `userInput must be ${MAX_FIELD_LENGTH} characters or fewer.` },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

    const prompt = `You are helping someone draft a real letter or email for the following task: "${taskTitle}" — described as: "${taskDescription}"
Their situation: "${userInput}"
Write a clear, respectful, professional draft they can send or copy-paste with minimal editing. Keep it concise (under 200 words), warm but businesslike in tone. Include placeholders like [Your Name] and [Date] where personal details are needed.
Respond with ONLY the letter/email text, no preamble, no markdown formatting.`;

    const result = await model.generateContent(prompt);

    let draft = result.response.text();

    // Defensive fence stripping in case Gemini wraps the response
    draft = draft.replace(/^```[a-z]*\s*/i, '').replace(/\s*```$/i, '').trim();

    return NextResponse.json({ draft });
  } catch (err) {
    console.error('generate-document error:', err);
    return NextResponse.json({ error: 'Failed to generate document' }, { status: 500 });
  }
}
