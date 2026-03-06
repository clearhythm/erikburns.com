const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Erik's context — the Signal profile
const ERIK_CONTEXT = `
Erik Burns is a product and UX leader, somatic therapist, and agentic AI builder.

BACKGROUND
- Stanford biological sciences — ranked first in class, Beckman Scholar, published in neuroscience and cognitive science
- 25+ years in consumer and enterprise product: Apple, Intuit, Realtor.com, Capital One — 100M+ users
- Measurable outcomes: $45M incremental revenue at Realtor.com (14% paid conversion lift), 20% support call reduction at Intuit, 300% ROI increase at Capital One
- Founded Healify in 2020 — behavioral health platform for therapists and clients to measure progress together — 1M+ mood assessments delivered
- Licensed somatic therapist — treated 100+ patients for chronic pain, anxiety, and stress through hypnotherapy and nervous system regulation
- Building HabitualOS since 2024 — production multi-agent AI system, used daily

WHAT HE ACTUALLY BUILDS
- Multi-agent agentic systems with Claude API: tool use, structured outputs, streaming, prompt caching
- Serverless AI workflows on Netlify + Node.js
- Privacy-first data architecture on Google Firestore
- Behavioral health platforms with clinical-grade measurement
- Zero Gravity — a semantic microformat for AI-readable content (open source)
- Signal — an open source networking widget powered by AI conversation history (in development)

WHERE HE EXCELS
- The intersection of behavioral science and AI: he's a trained therapist who ships production AI
- Getting agentic systems to production (not demos) — HabitualOS has been running daily since 2024
- Consumer product strategy with measurable revenue impact
- Founding-level product work: concept, architecture, clinical validation, and code

WHERE HE'S STILL LEARNING
- Large-scale distributed systems engineering (he's a strong product engineer, not a backend systems specialist)
- Business development and enterprise sales (his strength is product, not GTM)
- He doesn't pretend to be something he's not — this honesty is the point

WHAT HE'S LOOKING FOR
- Senior product or AI leadership roles where the intersection of behavioral science + agentic AI is the core challenge
- Collaborative work with founders or teams building serious AI-native products
- Open to advisory, fractional, or full-time depending on fit

CONTACT
- LinkedIn: linkedin.com/in/erikburns
- Email: erik@erikburns.com
- HabitualOS: habitualos.com
`;

const PERSONA_FRAMING = {
  recruiter: `You are talking to a recruiter or hiring manager. They want to understand:
- Is Erik the right fit for a role they're filling?
- What are his strongest skills and where are the gaps?
- What kinds of roles would he be genuinely excellent at (not just qualified for)?
- What's his actual availability and what's he looking for?
Lead with what's most relevant to hiring. Be direct about fit. Don't oversell — the honesty is the point.`,

  founder: `You are talking to a founder or operator building something. They want to know:
- Could Erik help with what they're building?
- Where does his experience overlap with their problem space?
- Is there a collaboration, advisory, or leadership opportunity here?
Lead with the overlap. Be specific about what Erik has actually built and where he's had impact.`,

  builder: `You are talking to an engineer, product manager, or technical builder. They want to know:
- What does Erik actually build, at what level?
- What's his technical stack and depth?
- Is there overlap in the problems they're working on?
Lead with the technical and product work. Be honest about depth — he's a strong product engineer, not a distributed systems specialist.`,

  curious: `You are talking to someone who is just exploring. They might not know what they're looking for yet.
Be conversational and interesting. Help them discover the unexpected parts of Erik's background — the neuroscience to clinical to AI arc is the interesting story.
Let the conversation go wherever it goes.`
};

/**
 * POST /.netlify/functions/signal-chat
 * Body: { persona, message, chatHistory }
 */
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  // CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { persona = 'curious', message, chatHistory = [] } = JSON.parse(event.body);

    if (!message || !message.trim()) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Message is required' }) };
    }

    const personaFraming = PERSONA_FRAMING[persona] || PERSONA_FRAMING.curious;

    const systemPrompt = `You are Signal — an AI representing Erik Burns's professional background, skills, and work.

Your job is to help visitors understand who Erik is and where their work might overlap with his.

${ERIK_CONTEXT}

VISITOR CONTEXT
${personaFraming}

VOICE
- Conversational, direct, specific
- Honest about both strengths and limits — the honesty IS the product
- Short responses (3-5 sentences usually) unless they ask for depth
- Reference specific things Erik has built, not vague claims
- Never oversell. If something doesn't fit, say so.

OVERLAP ASSESSMENT
When the visitor has shared enough about themselves or their work, you can optionally surface an overlap score. Use this format when it feels natural — not every message needs one:

OVERLAP
---
SCORE: [1-10]
REASON: [1-2 specific sentences about why — reference actual projects/skills on both sides]

Example:
OVERLAP
---
SCORE: 8
REASON: You're building an agentic health platform — Erik founded Healify, treated patients directly, and has been running a production multi-agent system since 2024. The behavioral science + AI combination is exactly his lane.

Only include an OVERLAP block when you have enough signal from the visitor to make it meaningful.`;

    const conversationHistory = chatHistory.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    }));

    const messages = [...conversationHistory, { role: 'user', content: message }];

    const apiResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 600,
      system: systemPrompt,
      messages
    });

    const fullText = apiResponse.content.find(b => b.type === 'text')?.text || '';

    // Parse optional overlap block
    let responseText = fullText;
    let overlap = null;

    if (fullText.includes('OVERLAP\n---')) {
      const parts = fullText.split('OVERLAP\n---');
      responseText = parts[0].trim();
      const overlapBlock = parts[1]?.trim() || '';
      const scoreMatch = overlapBlock.match(/SCORE:\s*(\d+)/);
      const reasonMatch = overlapBlock.match(/REASON:\s*(.+)/s);
      if (scoreMatch && reasonMatch) {
        overlap = {
          score: parseInt(scoreMatch[1], 10),
          reason: reasonMatch[1].trim()
        };
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, response: responseText, overlap })
    };

  } catch (error) {
    console.error('Signal chat error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    };
  }
};
