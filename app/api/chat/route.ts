import { streamText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { topics } from "@/lib/topics";

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  const { messages, topicId } = await req.json();

  const topic = topics.find((t) => t.id === topicId);
  if (!topic) {
    return new Response("Topic not found", { status: 404 });
  }

  const result = streamText({
    model: anthropic("claude-sonnet-4-5"),
    system: topic.systemPrompt,
    messages,
  });

  return result.toDataStreamResponse();
}
