export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
    }

    const { clientName, address, projectType, subCategory, status, notes, fieldLog } = req.body || {};

    const prompt = `You are writing a professional project report for Restoration Group of Metro Detroit (RGMD), a restoration and reconstruction company.

Generate a formal, well-structured project report based on the following job details. The report will be used for insurance documentation and client records.

JOB DETAILS:
- Client: ${clientName || 'N/A'}
- Address: ${address || 'N/A'}
- Project Type: ${projectType || 'N/A'}${subCategory ? ` — ${subCategory}` : ''}
- Current Status: ${(status || '').replace(/_/g, ' ')}

INITIAL NOTES:
${notes || 'None provided'}

FIELD LOG ENTRIES:
${fieldLog || 'None provided'}

Write a professional project report with these sections (use the section name as a label on its own line followed by the content):

PROJECT OVERVIEW:
Summarize the project scope, property, and the nature of the damage or work required.

SCOPE OF WORK:
Describe the services performed or to be performed based on the project type and notes.

WORK PERFORMED:
Detail the specific actions taken, materials used, and methods employed based on the field log entries.

CURRENT STATUS & OUTCOME:
Describe the current state of the project and any completed milestones.

RECOMMENDATIONS:
List any follow-up actions, next steps, or recommendations for the client or insurance carrier.

Write in professional, third-person language. Be specific where details are provided. Keep each section concise but thorough. Do not include any placeholders like [insert date] — work only with the information provided.`;

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                model: 'claude-opus-4-8',
                max_tokens: 1500,
                messages: [{ role: 'user', content: prompt }],
            }),
        });

        if (!response.ok) {
            const err = await response.text();
            return res.status(502).json({ error: `Anthropic API error: ${err}` });
        }

        const data = await response.json();
        const report = data.content?.[0]?.text || '';
        return res.status(200).json({ report });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
