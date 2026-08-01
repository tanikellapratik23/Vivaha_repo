import express from 'express';

const router = express.Router();

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
// Let Vercel select the exact Claude model; Sonnet is the production default.
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6';

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

  throw new Error('Anthropic AI service is not configured');
}

// AI Assistant endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, systemPrompt } = req.body;

    if (!ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'Anthropic AI service is not configured' });
    }

    const content = await generateReply(systemPrompt || 'You are a helpful wedding planning assistant. Be concise and conversational.', message, 450, 0.5);

    // Preserve Claude's headings, bullets and emphasis so the chat remains
    // readable; only remove accidental code fences.
    let cleaned = String(content || '').replace(/```(?:markdown)?/g, '').trim();

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

    cleaned = cleaned.trim();

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

    if (!ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'Anthropic AI service is not configured' });
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
