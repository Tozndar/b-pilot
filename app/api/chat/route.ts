import { topics } from "@/lib/topics";

const RATE_LIMIT = {
  maxRequestsPerHour: 20,
  maxMessagesPerConvo: 15,
  maxOutputTokens: 1200,
};

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return true;
  }
  if (entry.count >= RATE_LIMIT.maxRequestsPerHour) return false;
  entry.count++;
  return true;
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (!checkRateLimit(ip)) {
    return new Response(
      JSON.stringify({ error: "הגעת למגבלת השימוש (20 הודעות לשעה). נסה שוב בעוד שעה." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  const { messages, topicId } = await req.json();

  if (messages.length > RATE_LIMIT.maxMessagesPerConvo) {
    return new Response(
      JSON.stringify({ error: "השיחה ארוכה מדי. התחל שיחה חדשה." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const topic = topics.find((t) => t.id === topicId);
  if (!topic) {
    return new Response("Topic not found", { status: 404 });
  }

  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API key לא מוגדר" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Build Gemini contents
  const contents = messages.map((m: { role: string; content: string }) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const body = {
    system_instruction: { parts: [{ text: topic.systemPrompt }] },
    contents,
    generationConfig: {
      maxOutputTokens: RATE_LIMIT.maxOutputTokens,
      temperature: 0.7,
    },
  };

  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:streamGenerateContent?key=${apiKey}&alt=sse`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!geminiRes.ok) {
    const err = await geminiRes.text();
    console.error("Gemini error:", err);
    return new Response(JSON.stringify({ error: "שגיאה ב-Gemini API: " + err.slice(0, 200) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Stream Gemini SSE → convert to AI SDK data stream format
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const reader = geminiRes.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                // AI SDK text stream format
                controller.enqueue(encoder.encode(`0:${JSON.stringify(text)}\n`));
              }
            } catch {}
          }
        }
      } finally {
        controller.enqueue(encoder.encode(`d:{"finishReason":"stop"}\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Vercel-AI-Data-Stream": "v1",
    },
  });
}
