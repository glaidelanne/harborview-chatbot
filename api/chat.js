// api/chat.js
// This runs on Vercel's servers, NOT in the browser — so your API key stays hidden.

export default async function handler(req, res) {
  // Allow requests from any origin (needed since the widget will be embedded
  // on your Lovable site, GHL funnel, etc. — different domains than Vercel)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Browsers send a preflight OPTIONS request before the real POST — respond OK
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Missing or invalid messages array' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 300,
        system: `You are the concierge for Harborview Realty Group, a real estate agency serving Austin, TX. Your tone is warm, composed, and attentive — like a trusted advisor, not a chatbot. Speak with quiet confidence, never salesy or overly casual.

Your job in this chat:
1. Confirm whether the visitor is looking to buy or sell.
2. If buying: ask their budget range, desired neighborhood in Austin, and timeline (ASAP, 3-6 months, just browsing) — one question at a time, not all at once.
3. If selling: ask their property address, timeline to sell, and whether they've had it appraised — one question at a time.
4. Once you have those three answers, thank them by name if given, and let them know a Harborview agent will personally follow up within 24 hours.
5. Keep every response to 1-3 sentences. Never repeat a question already answered.
6. Never invent specific listings, prices, or availability — you don't have access to live inventory.
7. If asked something outside your scope (legal, tax, binding pricing advice), say a Harborview agent will address that directly.`,
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', errorText);
      return res.status(response.status).json({ error: 'AI service error' });
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || 'Sorry, I had trouble responding. Please try again.';

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
