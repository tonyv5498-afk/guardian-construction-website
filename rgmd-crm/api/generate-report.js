module.exports = async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return res.status(503).json({ error: 'NO_API_KEY' });

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

Write a professional project report with these exact section headers (use the section name as a label followed by a colon, on its own line):

PROJECT OVERVIEW:
SCOPE OF WORK:
WORK PERFORMED:
CURRENT STATUS & OUTCOME:
RECOMMENDATIONS:

Write in professional, third-person language suitable for insurance documentation. Be specific where details are provided. Do not use placeholders.`;

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
            return res.status(502).json({ error: `API error: ${err}` });
        }

        const data = await response.json();
        const report = data.content?.[0]?.text || '';
        return res.status(200).json({ report });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
