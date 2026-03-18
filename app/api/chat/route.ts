import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { topics } from "@/lib/topics";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { messages, topicId } = await req.json();

  const topic = topics.find((t) => t.id === topicId);
  if (!topic) {
    return new Response("Topic not found", { status: 404 });
  }

  const result = streamText({
    model: openai("gpt-4o"),
    system: topic.systemPrompt,
    messages,
  });

  return result.toDataStreamResponse();
}
