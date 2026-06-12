import { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';

const router = Router();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

router.post('/generate', async (req, res) => {
  const { business } = req.body;
  if (!business) return res.status(400).json({ error: 'business data required' });

  const { name, address, websiteStatus, opportunityScore, phone } = business;

  const websiteContext =
    websiteStatus === 'none'
      ? "They have no website at all."
      : websiteStatus === 'weak'
      ? "They have a website but it appears outdated or built on a basic page builder."
      : "Their website is hard to reach or may have issues.";

  const prompt = `You are a digital agency outreach specialist for Gateway Digital Co., a web design and digital marketing agency.

Write a short, personalized cold outreach email to a local business prospect. Keep it under 150 words, conversational, and focused on their specific pain point — not a generic pitch.

Business details:
- Name: ${name}
- Location: ${address}
- Web presence: ${websiteContext}
- Opportunity level: ${opportunityScore}

Rules:
- Open with a specific observation about THEIR situation (no "I hope this email finds you well")
- Mention Gateway Digital Co. once naturally
- One clear call to action: a free 15-minute call
- No pricing, no fluff, no bullet lists
- Sign off as "The Gateway Digital Team"

Output ONLY the email text with Subject: line first.`;

  try {
    const stream = anthropic.messages.stream({
      model: 'claude-opus-4-8',
      max_tokens: 400,
      thinking: { type: 'adaptive' },
      messages: [{ role: 'user', content: prompt }],
    });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    console.error('Outreach generation error:', err);
    res.status(500).json({ error: 'Failed to generate outreach message' });
  }
});

export default router;
