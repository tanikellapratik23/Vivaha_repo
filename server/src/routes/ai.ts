import express from 'express';

const router = express.Router();

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.1-8b-instant';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-3-5-haiku-20241022';

async function generateReply(system: string, message: string, maxTokens: number, temperature: number) {
  if (ANTHROPIC_API_KEY) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: maxTokens,
        temperature,
        system,
        messages: [{ role: 'user', content: message }],
      }),
    });
    if (!response.ok) throw new Error(`Claude API error: ${await response.text()}`);
    const data = await response.json() as any;
    return data.content?.filter((block: any) => block.type === 'text').map((block: any) => block.text).join('') || '';
  }

  if (!GROQ_API_KEY) throw new Error('AI service not configured');
  const response = await fetch(GROQ_ENDPOINT, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: 'system', content: system }, { role: 'user', content: message }],
      temperature,
      max_tokens: maxTokens,
    }),
  });
  if (!response.ok) throw new Error(`Groq API error: ${await response.text()}`);
  const data = await response.json() as any;
  return data.choices?.[0]?.message?.content || data.choices?.[0]?.text || '';
}

// AI Assistant endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, systemPrompt } = req.body;

    if (!ANTHROPIC_API_KEY && !GROQ_API_KEY) {
      return res.status(500).json({ error: 'AI service not configured' });
    }

    const content = await generateReply(systemPrompt || 'You are a helpful wedding planning assistant.', message, 800, 0.6);

    // Clean content: remove code fences and excessive whitespace
    let cleaned = String(content || '').replace(/```[\s\S]*?```/g, '').trim();

    // If model returned raw JSON, try to parse it and provide structured format for ceremony parsing
    let structured = null;
    try {
      // attempt to find JSON substring
      const jsonStart = cleaned.indexOf('{');
      const jsonEnd = cleaned.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        const jsonStr = cleaned.slice(jsonStart, jsonEnd + 1);
        structured = JSON.parse(jsonStr);
        // Remove the JSON from cleaned text - only show human-friendly format
        cleaned = cleaned.substring(0, jsonStart) + cleaned.substring(jsonEnd + 1);
      }
    } catch (err) {
      // ignore parse errors
      structured = null;
    }

    // Strip all remaining JSON-like content and code fences
    cleaned = cleaned
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`+/g, '')
      .replace(/\{[\s\S]*?\}/g, '') // Remove JSON objects
      .replace(/\[[\s\S]*?\]/g, '')  // Remove JSON arrays
      .replace(/["'`]/g, '')          // Remove quotes
      .trim();

    res.json({ reply: cleaned, structured });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Budget optimization endpoint
router.post('/budget-suggestions', async (req, res) => {
  try {
    const { budget, guestCount, city, priorities } = req.body;

    if (!ANTHROPIC_API_KEY && !GROQ_API_KEY) {
      return res.status(500).json({ error: 'AI service not configured' });
    }

    const prompt = `You are a wedding budget optimization expert. Generate 3-5 specific, actionable budget suggestions for a wedding with these details:

Budget: $${budget.toLocaleString()}
Guest Count: ${guestCount}
Location: ${city}
Priorities: ${priorities.join(', ') || 'Not specified'}

For each suggestion:
- Start with a relevant emoji
- Be specific with dollar amounts or percentages
- Focus on realistic cost-saving strategies
- Consider the city's cost of living
- Prioritize their stated preferences

Format each suggestion as: "emoji Suggestion text"
Example: "💐 Consider in-season flowers to save $1,500-$2,000 on florals"

Generate 4 actionable suggestions:`;

    const content = await generateReply(
      'You are a wedding budget optimization expert. Provide specific, actionable, and realistic budget advice.',
      prompt,
      500,
      0.7,
    );
    
    // Parse suggestions from response
    const suggestions = content
      .split('\n')
      .filter((line: string) => line.trim().match(/^[^\w\s]/))
      .map((line: string) => line.trim())
      .slice(0, 4);

    res.json({ suggestions });
  } catch (error) {
    console.error('Budget suggestions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
