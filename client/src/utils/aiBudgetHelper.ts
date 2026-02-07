// AI Budget Optimization using Groq
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.1-8b-instant';

export async function generateAIBudgetSuggestions(
  budget: number,
  guestCount: number,
  city: string,
  priorities: string[]
): Promise<string[]> {
  if (!GROQ_API_KEY) {
    console.warn('No Groq API key found, using fallback suggestions');
    return [];
  }

  try {
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

    const response = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { 
            role: 'system', 
            content: 'You are a wedding budget optimization expert. Provide specific, actionable, and realistic budget advice.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    // Parse suggestions from response
    const suggestions = content
      .split('\n')
      .filter((line: string) => line.trim().match(/^[^\w\s]/)) // Lines starting with emoji
      .map((line: string) => line.trim())
      .slice(0, 4);

    return suggestions.length > 0 ? suggestions : [];
  } catch (error) {
    console.error('AI Budget Suggestions Error:', error);
    return [];
  }
}
