import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { topics } from "@/lib/topics";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_AI_API_KEY,
});

export async function POST(req: Request) {
  const { messages, topicId } = await req.json();

  const topic = topics.find((t) => t.id === topicId);
  if (!topic) {
    return new Response("Topic not found", { status: 404 });
  }

  const result = streamText({
    model: google("gemini-2.0-flash"),
    system: topic.systemPrompt,
    messages,
  });

  return result.toDataStreamResponse();
}
