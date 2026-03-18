"use client";

import { useChat } from "ai/react";
import { topics } from "@/lib/topics";
import { PaperPlane } from "@/components/PaperPlane";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.topicId as string;
  const topic = topics.find((t) => t.id === topicId);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  const { messages, input, handleInputChange, handleSubmit, isLoading, append, error } =
    useChat({
      api: "/api/chat",
      body: { topicId },
      onError: (e) => console.error("Chat error:", e),
    });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!topic) return null;

  const handleQuickReply = (value: string) => {
    setStarted(true);
    append({ role: "user", content: value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    setStarted(true);
    handleSubmit(e);
  };

  const visibleMessages = messages;
  const showQuickReplies = !started && messages.length === 0;

  return (
    <main className="min-h-screen flex flex-col" style={{
      background: `linear-gradient(160deg, ${topic.color}18, #f5f3ff 40%, #ffffff)`
    }}>

      {/* Header */}
      <div className="sticky top-0 z-20 backdrop-blur-md bg-white/85 border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="text-gray-400 hover:text-gray-600 transition-colors text-sm font-medium flex items-center gap-1"
          >
            <span>→</span>
            <span>חזרה</span>
          </button>

          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${topic.color}, ${topic.colorTo})` }}
          >
            {topic.emoji}
          </div>

          <div className="flex-1">
            <p className="font-semibold text-gray-800 text-sm leading-none">{topic.title}</p>
            <p className="text-xs text-gray-400 mt-0.5">{topic.subtitle}</p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-full">
            <PaperPlane size={12} color="#a5b4fc" />
            <span>B-Pilot</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-4">

        {/* Opening question + quick replies */}
        {showQuickReplies && (
          <div className="space-y-4">
            {/* Bot bubble with opening question */}
            <div className="flex justify-end gap-2">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 self-start"
                style={{ background: `linear-gradient(135deg, ${topic.color}, ${topic.colorTo})` }}
              >
                <PaperPlane size={16} color="#fff" />
              </div>
              <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100 text-gray-800 text-sm font-medium max-w-[80%]">
                {topic.openingQuestion}
              </div>
            </div>

            {/* Quick reply chips */}
            <div className="flex flex-wrap gap-2 justify-end">
              {topic.quickReplies.map((qr) => (
                <button
                  key={qr.value}
                  onClick={() => handleQuickReply(qr.value)}
                  className="text-sm px-4 py-2.5 rounded-2xl border-2 font-medium transition-all hover:scale-[1.03] active:scale-[0.97] text-right"
                  style={{
                    borderColor: topic.color,
                    color: topic.color,
                    background: `${topic.color}10`,
                  }}
                  onMouseEnter={e => {
                    (e.target as HTMLElement).style.background = topic.color;
                    (e.target as HTMLElement).style.color = "#fff";
                  }}
                  onMouseLeave={e => {
                    (e.target as HTMLElement).style.background = `${topic.color}10`;
                    (e.target as HTMLElement).style.color = topic.color;
                  }}
                >
                  {qr.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat messages */}
        {visibleMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-start" : "justify-end"}`}
          >
            {message.role === "assistant" && (
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ml-2 mt-1 self-start"
                style={{ background: `linear-gradient(135deg, ${topic.color}, ${topic.colorTo})` }}
              >
                <PaperPlane size={16} color="#fff" />
              </div>
            )}
            <div
              className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                message.role === "user"
                  ? "text-white rounded-tr-sm"
                  : "bg-white text-gray-800 border border-gray-100 rounded-tl-sm"
              }`}
              style={message.role === "user" ? {
                background: `linear-gradient(135deg, ${topic.color}, ${topic.colorTo})`,
              } : {}}
            >
              {message.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-end">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ml-2"
              style={{ background: `linear-gradient(135deg, ${topic.color}, ${topic.colorTo})` }}
            >
              <PaperPlane size={16} color="#fff" />
            </div>
            <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100">
              <div className="flex gap-1.5 items-center h-4">
                <span className="dot-1 w-2 h-2 rounded-full" style={{ background: topic.color }} />
                <span className="dot-2 w-2 h-2 rounded-full" style={{ background: topic.color }} />
                <span className="dot-3 w-2 h-2 rounded-full" style={{ background: topic.color }} />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-4 py-2 max-w-sm text-center">
              ⚠️ {error.message || "שגיאה בחיבור. נסי שוב."}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-white/90 backdrop-blur-md border-t border-gray-100 px-4 py-4 shadow-lg">
        <form onSubmit={handleFormSubmit} className="max-w-2xl mx-auto flex gap-3">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder={started ? "הקלד תשובה..." : "או כתוב בחופשיות..."}
            className="flex-1 bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-gray-200 focus:border-blue-300 focus:bg-white transition-all"
            disabled={isLoading}
            dir="rtl"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="text-white rounded-xl px-5 py-3 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:opacity-90 hover:scale-[1.02] flex items-center gap-2"
            style={{ background: `linear-gradient(135deg, ${topic.color}, ${topic.colorTo})` }}
          >
            <span>שלח</span>
            <PaperPlane size={14} color="#fff" />
          </button>
        </form>
      </div>
    </main>
  );
}
