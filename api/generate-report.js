export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { jobName, clientName, address, serviceType, startDate, completionDate, notes } = body;

  if (!jobName || !notes) {
    return new Response(JSON.stringify({ error: 'jobName and notes are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const prompt = `You are writing a professional project completion report for Guardian Construction, a Metro Detroit general contractor. Write a polished, formal report based on the following project details.

Project Name: ${jobName}
Client Name: ${clientName || 'N/A'}
Property Address: ${address || 'N/A'}
Service Type: ${serviceType || 'General Construction'}
Start Date: ${startDate || 'N/A'}
Completion Date: ${completionDate || 'N/A'}

Project Notes / Field Log:
${notes}

Write a professional project report with the following sections:
1. Project Overview — a 2–3 sentence summary of the project scope and objectives
2. Work Completed — a detailed description of all work performed based on the notes
3. Materials & Methods — any materials, techniques, or notable methods mentioned in the notes
4. Project Outcome — a professional summary of the results and quality of work delivered
5. Client Notes — any client-related observations or final walkthrough notes (if mentioned)

Keep the tone professional and appropriate for sharing with a homeowner or insurance company. Do not invent details not present in the notes. Format with clear section headings.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return new Response(JSON.stringify({ error: `Claude API error: ${err}` }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const reportText = data.content?.[0]?.text ?? '';

    return new Response(JSON.stringify({ report: reportText }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
