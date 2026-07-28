async function test() {
  const url = "https://leviathan-core.onrender.com/v1/chat/completions";
  const key = process.env.LEVIATHAN_API_KEY;
  
  const system = `You are an SEO analyzer. Return ONLY JSON: {"scores":[{"index":index_number,"searchDemand":0,"trendVelocity":0,"lowCompetition":0,"viralPotential":0,"relevance":0}, ...]} with one entry per idea.`;

  const user = `Score these ideas from 0-100:
1. Title: Best Remote Tech Job Platforms for Freelancers in 2026
   Keyword: best remote tech jobs
   Category: Remote Work
   Angle: Niche platforms only

2. Title: 5 Critical AI Agent Security Risks & How to Protect You
   Keyword: ai agent security
   Category: AI Tools
   Angle: Security best practices

3. Title: 10 Passive Income Ideas Using AI Automation
   Keyword: passive income ai
   Category: Online Income
   Angle: High leverage automated side hustles
`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: "leviathan-auto",
      messages: [
        {role: 'system', content: system},
        {role: 'user', content: user}
      ],
      max_tokens: 4000
    })
  });
  
  const data = await res.text();
  console.log("Raw response length:", data.length);
  const parsed = JSON.parse(data);
  console.log("Content:", parsed.choices?.[0]?.message?.content);
  console.log("Usage:", parsed.usage);
  console.log("Finish reason:", parsed.choices?.[0]?.finish_reason);
}

test();
