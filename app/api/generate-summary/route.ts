import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: NextRequest) {
  try {
    const { profile, dominantType } = await request.json();

    const prompt = `As a typical Singaporean mother commenting on career prospects, create a naggy but loving response in Singlish. Focus on salary potential and job stability:

Requirements:
- Start with "Aiyah boy/girl ah..."
- Compare with cousin/neighbor's kid who earns good money
- Mention specific job roles and their salary ranges
- Add typical Singlish particles (lah, leh, hor, sia, one)
- Include concerns about job security and career growth
- Must mention something about saving money/CPF
- End with encouraging but still slightly naggy tone
- Reference jobs that pay $70k-$130k annually

Keep it in one paragraph. Make it sound like a real Singaporean parent giving career advice. Must be authentic Singlish! Focus on practical career and money matters.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: prompt
      }],
      temperature: 0.9,
      max_tokens: 400
    });

    return NextResponse.json({ 
      content: completion.choices[0]?.message?.content 
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate summary' },
      { status: 500 }
    );
  }
}