"use client";

import { useChat } from "ai/react";
import { topics } from "@/lib/topics";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.topicId as string;
  const topic = topics.find((t) => t.id === topicId);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, append } =
    useChat({
      api: "/api/chat",
      body: { topicId },
    });

  // Send opening message automatically
  useEffect(() => {
    if (topic && messages.length === 0) {
      append({
        role: "user",
        content: `התחל — הנושא: ${topic.title}`,
      });
    }
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!topic) {
    return <div className="p-8 text-center">נושא לא נמצא</div>;
  }

  const assistantMessages = messages.filter((m) => m.role === "assistant");
  const lastMessage = assistantMessages[assistantMessages.length - 1];
  const isActionMessage =
    lastMessage?.content.includes("צעד") ||
    lastMessage?.content.includes("מכתב") ||
    lastMessage?.content.includes("טופס") ||
    lastMessage?.content.includes("חשב");

  return (
    <main className="min-h-screen bg-[#f8f7f4] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            → חזרה
          </button>
          <div className="flex items-center gap-2 flex-1">
            <span className="text-xl">{topic.emoji}</span>
            <span className="font-semibold text-gray-800">{topic.title}</span>
          </div>
          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
            ✈️ B-Pilot
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-4">
        {messages
          .filter((m) => !(m.role === "user" && m.content.startsWith("התחל —")))
          .map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  message.role === "user"
                    ? "bg-blue-600 text-white rounded-tr-sm"
                    : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-sm"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}

        {isLoading && (
          <div className="flex justify-end">
            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-100 px-4 py-4 sticky bottom-0">
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto flex gap-3"
        >
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="הקלד את תשובתך..."
            className="flex-1 bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-gray-200 focus:border-blue-300 focus:bg-white transition-colors"
            disabled={isLoading}
            dir="rtl"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 text-white rounded-xl px-5 py-3 text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            שלח
          </button>
        </form>
      </div>
    </main>
  );
}
