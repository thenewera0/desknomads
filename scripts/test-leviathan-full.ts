async function test() {
  const url = "https://leviathan-core.onrender.com/v1/chat/completions";
  const key = process.env.LEVIATHAN_API_KEY;
  
  const system = `You are the editor-in-chief of DeskNomads, an authority site about AI tools, remote work, and online income. Your SEO strategy is to win LONG-TAIL, LOW-COMPETITION searches — specific, practical, "how-to" and "best free X" content that ranks fast because big sites ignore the niche. You turn trending signals into these specific article opportunities. You only propose ideas that genuinely fit these categories: AI Tools & Workflows, Remote Work, Online Income.`;

  const user = `Here are trending signals gathered today from Hacker News, Reddit, Google Trends, and news sources:

1. [Hacker News] Claude 3.5 Sonnet (eng:1500)
2. [Reddit r/ChatGPT] How to prompt properly (eng:500)
3. [Google Trends] Remote data entry jobs
4. [News/Tavily] 5 New AI tools launched this week

Propose 4 strong article opportunities for DeskNomads. STRATEGY — be specific and beat low-competition long-tail queries instead of fighting big publishers on broad head terms.

Use a MIX of these high-click-through title formats (vary them across the batch):
- Listicle: "Top 10 AI Tools for <specific job>"
- How-to / step-by-step: "How to <do X> — Step-by-Step (2026)"

RULES:
- REAL SEARCH DEMAND IS REQUIRED.
- Titles must be SPECIFIC.
- Most ideas should be searchIntent "informational". Include the year (2026) where natural.
- Each of the 4 ideas must be about a DISTINCT topic.

Return ONLY JSON of the shape:
{"opportunities":[{"title":"specific, high-CTR title","topic":"1-sentence description","category":"one of the allowed categories","primaryKeyword":"the specific long-tail search keyword","secondaryKeywords":["related long-tail variants"],"searchIntent":"informational|commercial|transactional|navigational","angle":"the specific niche/use-case that makes this low-competition","sourceUrls":["url1","url2"]}]}
`;

  try {
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
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
