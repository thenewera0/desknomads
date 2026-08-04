/** Hand-authored articles to publish via scripts/publish-authored.ts. */
export interface AuthoredArticle {
  file: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  category: string;
  excerpt: string;
  faqs: { question: string; answer: string }[];
}

export const ARTICLES: AuthoredArticle[] = [
  {
    file: "chatgpt-for-free.html",
    slug: "how-to-use-chatgpt-for-free-2026",
    seoTitle: "How to Use ChatGPT for Free in 2026 (Full Guide)",
    seoDescription:
      "Use ChatGPT free in 2026: what the free plan includes, how to get GPT-5 access at no cost, smart limits, and the best free alternatives when you hit a cap.",
    primaryKeyword: "how to use chatgpt for free",
    secondaryKeywords: ["chatgpt free", "chatgpt free unlimited", "free chatgpt alternatives", "chatgpt free plan"],
    category: "ChatGPT",
    excerpt:
      "A clear, honest guide to using ChatGPT for free in 2026 — what the free tier really gives you, how to stretch it, and free tools to fall back on.",
    faqs: [
      { question: "Is ChatGPT free to use in 2026?", answer: "Yes. OpenAI offers a free ChatGPT plan you can use with just an account. It includes access to a capable default model, with usage limits that reset over time. Paid plans add higher limits, faster responses, and priority access to the newest models." },
      { question: "Can I use ChatGPT for free without signing up?", answer: "OpenAI has offered a no-login mode in the past, but features and limits change often. Creating a free account is the most reliable way to use ChatGPT, save your chat history, and get consistent access." },
      { question: "How do I get free ChatGPT that feels unlimited?", answer: "You can't get truly unlimited use on the free plan, but you can stretch it by writing clearer prompts, spacing out heavy sessions, and switching to free alternatives like Google Gemini, Microsoft Copilot, or Claude's free tier when you hit a cap." },
      { question: "What is the best free alternative to ChatGPT?", answer: "Google Gemini and Microsoft Copilot are the strongest free alternatives — both are free with an account and are built on frontier models. Claude also offers a capable free tier that's excellent for writing and analysis." },
    ],
  },
  {
    file: "best-ai-tools-for-students.html",
    slug: "best-free-ai-tools-for-students-2026",
    seoTitle: "13 Best Free AI Tools for Students in 2026",
    seoDescription:
      "The best free AI tools for students in 2026 for studying, research, writing, note-taking, and math — with what each does best and how to use them honestly.",
    primaryKeyword: "best ai tools for students",
    secondaryKeywords: ["free ai tools for students", "ai tools for studying", "ai tools for research", "best ai for students"],
    category: "AI Tools",
    excerpt:
      "13 genuinely free AI tools that help students study smarter — for research, writing, note-taking, flashcards, and math — plus how to use them without cheating.",
    faqs: [
      { question: "What is the best free AI tool for students?", answer: "There's no single winner — it depends on the task. Google Gemini and ChatGPT's free tier are best for general help, NotebookLM is best for studying from your own notes and PDFs, and Quizlet is best for flashcards. Most students use two or three together." },
      { question: "Are AI tools allowed in school and university?", answer: "Policies vary by institution and instructor. Using AI to understand concepts, generate practice questions, or check your work is widely accepted; submitting AI-written work as your own is usually considered academic misconduct. Always check your course's specific policy." },
      { question: "Can students use AI tools for free?", answer: "Yes. Every tool in this list has a genuinely free tier. Many also offer student discounts or extended free access with a verified .edu email." },
      { question: "Is it cheating to use AI to study?", answer: "Using AI to explain topics, quiz yourself, or summarize your own notes is studying, not cheating. It becomes cheating when you pass off AI-generated answers as your original work on graded assignments." },
    ],
  },
  {
    file: "make-money-with-ai.html",
    slug: "how-to-make-money-with-ai-no-experience-2026",
    seoTitle: "How to Make Money With AI in 2026 (No Experience)",
    seoDescription:
      "Realistic ways to make money with AI in 2026 with no experience — freelancing, content, automation, and digital products — plus honest earning expectations.",
    primaryKeyword: "how to make money with ai with no experience",
    secondaryKeywords: ["make money with ai", "how to make money with ai", "ai side hustle", "earn money with ai"],
    category: "Online Income",
    excerpt:
      "Seven realistic ways to make money with AI in 2026 even with no experience — what actually works, what to avoid, and honest expectations for each path.",
    faqs: [
      { question: "Can I really make money with AI with no experience?", answer: "Yes, but not instantly. The realistic entry paths — AI-assisted freelancing, content creation, and simple automation services — reward skill-building and consistency more than prior experience. Expect a ramp-up period before steady income." },
      { question: "How much money can you make with AI?", answer: "It ranges widely. Beginners offering AI-assisted services often start with small side income, while those who build a reputation, a portfolio, or a product can grow it into a substantial income over months. Anyone promising instant riches is selling a course, not a method." },
      { question: "What is the easiest way to start making money with AI?", answer: "AI-assisted freelancing on platforms like Upwork or Fiverr is the lowest-barrier start: pick a service (writing, editing, design, data cleanup), use AI to work faster, and deliver quality. You get paid for the outcome, not the tool." },
      { question: "Is making money with AI legit or a scam?", answer: "The methods are legit — real people earn real income using AI to deliver services and products. The scams are the 'passive AI income' courses and bots that promise guaranteed earnings. Focus on delivering genuine value and you avoid the scam trap." },
    ],
  },
  {
    file: "best-free-ai-video-generators.html",
    slug: "best-free-ai-video-generators-2026",
    seoTitle: "7 Best Free AI Video Generators in 2026",
    seoDescription:
      "The best free AI video generators in 2026 for text-to-video, faceless content, and social clips — what each free plan includes and where the watermarks are.",
    primaryKeyword: "best free ai video generator",
    secondaryKeywords: ["free ai video generator", "ai video generator no watermark", "text to video ai", "ai video maker free"],
    category: "AI Tools",
    excerpt:
      "Seven of the best free AI video generators in 2026 — for text-to-video, faceless YouTube, and social clips — with each free plan's real limits and watermarks.",
    faqs: [
      { question: "What is the best free AI video generator?", answer: "It depends on your goal. For text-to-video from a script, Runway and Pika have strong free tiers. For talking-avatar or presenter videos, HeyGen and Synthesia offer limited free minutes. For social clips from long videos, Opus Clip's free plan is excellent." },
      { question: "Is there a free AI video generator with no watermark?", answer: "Most free tiers add a watermark. CapCut and Canva let you export some AI-assisted videos without a watermark on their free plans, and a few tools remove it during promotions. For fully watermark-free HD output, a paid plan is usually required." },
      { question: "Can I make YouTube videos with free AI tools?", answer: "Yes. Many creators build faceless YouTube channels using free tiers for script-to-video, AI voiceover, and clip editing. Free plans limit length, resolution, and monthly exports, so serious creators eventually upgrade one tool in their stack." },
      { question: "Are AI-generated videos allowed on YouTube and TikTok?", answer: "Yes, but both platforms require you to disclose realistic AI-generated or altered content, and low-effort, mass-produced AI videos can be demonetized. Use AI to assist genuinely useful content rather than spamming." },
    ],
  },
  {
    file: "chatgpt-for-resume.html",
    slug: "how-to-use-chatgpt-for-resume-2026",
    seoTitle: "How to Use ChatGPT for Your Resume (2026 + Prompts)",
    seoDescription:
      "Use ChatGPT to write and tailor your resume in 2026: step-by-step prompts for bullet points, ATS keywords, and cover letters — without sounding generic.",
    primaryKeyword: "how to use chatgpt for resume",
    secondaryKeywords: ["chatgpt resume prompts", "chatgpt resume", "ai resume writer", "chatgpt cover letter"],
    category: "ChatGPT",
    excerpt:
      "A step-by-step guide to using ChatGPT for your resume in 2026 — copy-paste prompts for stronger bullets, ATS keywords, and tailored cover letters.",
    faqs: [
      { question: "Can ChatGPT write my resume?", answer: "ChatGPT can draft and polish your resume, but it works best as an editor, not a ghostwriter. Feed it your real experience and it will sharpen your bullet points, fix wording, and tailor content to a job — you supply the facts, it improves the delivery." },
      { question: "What is a good ChatGPT prompt for a resume?", answer: "A strong prompt gives context and a goal, e.g.: 'Rewrite these three bullet points for a marketing coordinator role. Start each with a strong action verb, add measurable impact where I've given numbers, and keep each under two lines.' Then paste your bullets." },
      { question: "Will using ChatGPT for my resume get flagged by ATS?", answer: "No. Applicant Tracking Systems scan for relevant keywords and clean formatting, not for whether AI helped write the text. In fact, ChatGPT is useful for identifying the exact keywords from a job description to include naturally." },
      { question: "Should I tell employers I used ChatGPT for my resume?", answer: "There's no need to. Using tools to write a strong, accurate resume is normal — like using spell-check or a template. What matters is that every claim on the resume is true and reflects your real experience." },
    ],
  },
];
