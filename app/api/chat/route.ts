import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { topics } from "@/lib/topics";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_AI_API_KEY,
});

// Simple in-memory rate limiter (per IP, resets on cold start)
// Enough for a demo/case study — not production-grade
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT = {
  maxRequestsPerHour: 20,    // מקסימום 20 הודעות לשעה לכל IP
  maxMessagesPerConvo: 15,   // מקסימום 15 הודעות בשיחה
  maxOutputTokens: 600,      // מקסימום אורך תשובה
};

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
  // Get IP
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  // Rate limit check
  if (!checkRateLimit(ip)) {
    return new Response(
      JSON.stringify({ error: "הגעת למגבלת השימוש השעתי (20 הודעות). נסה שוב בעוד שעה." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  const { messages, topicId } = await req.json();

  // Conversation length check
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

  try {
    const result = streamText({
      model: google("gemini-1.5-flash-latest"),
      system: topic.systemPrompt,
      messages,
      maxTokens: RATE_LIMIT.maxOutputTokens,
    });

    return result.toDataStreamResponse();
  } catch (err: any) {
    console.error("streamText error:", err?.message || err);
    return new Response(
      JSON.stringify({ error: err?.message || "שגיאה לא ידועה" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
