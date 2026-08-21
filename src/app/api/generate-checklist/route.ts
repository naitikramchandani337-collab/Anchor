import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import type { GenerateChecklistRequest, Task, UrgencyLevel } from '../../../../lib/types';

const MAX_INPUT_LENGTH = 3000;

function normalizeUrgency(raw: string): UrgencyLevel {
  return raw?.toLowerCase() === 'urgent' ? 'urgent' : 'can wait';
}

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
    const body: GenerateChecklistRequest = await req.json();
    const { userInput } = body;

    if (!userInput || !userInput.trim()) {
      return NextResponse.json({ error: 'userInput is required' }, { status: 400 });
    }

    const trimmed = userInput.trim();

    if (trimmed.length > MAX_INPUT_LENGTH) {
      return NextResponse.json(
        { error: `Your description is too long. Please keep it under ${MAX_INPUT_LENGTH} characters.` },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.6-flash',
      systemInstruction:
        'You are a calm, compassionate assistant helping someone handle administrative tasks after losing a loved one.',
    });

    const prompt = `The user described their situation as: "${trimmed}"
Generate a checklist of 5-8 practical tasks they likely need to handle, based on this situation. For each task, provide:
- A short title (a few words)
- A one-sentence plain-English description of what it involves
- An urgency level: "urgent" (should be done within days) or "can wait" (no immediate deadline)
Respond ONLY in JSON format, like this:
[
  {"title": "...", "description": "...", "urgency": "urgent"},
  {"title": "...", "description": "...", "urgency": "can wait"}
]
No preamble, no markdown formatting, no code fences, just the raw JSON array.`;

    const result = await model.generateContent(prompt);

    let text = result.response.text();

    // Strip markdown code fences if Gemini wraps the response anyway
    text = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

    const parsed = JSON.parse(text);

    const tasks: Omit<Task, 'id' | 'done'>[] = parsed.map(
      (item: { title: string; description: string; urgency: string }) => ({
        title: item.title,
        description: item.description,
        urgency: normalizeUrgency(item.urgency),
      })
    );

    return NextResponse.json({ tasks });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('generate-checklist error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
