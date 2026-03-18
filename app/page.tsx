"use client";

import { topics } from "@/lib/topics";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#f8f7f4]">
      {/* Header */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            ✈️ B-Pilot
          </h1>
          <p className="text-xl text-gray-600">
            הטייס האישי שלך בבירוקרטיה הישראלית
          </p>
          <p className="text-gray-400 mt-2">
            שואל אותך שאלות, מבין את המצב שלך, ועושה את העבודה
          </p>
        </div>

        {/* Topic Cards */}
        <div className="space-y-3">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => router.push(`/chat/${topic.id}`)}
              className="w-full bg-white rounded-2xl p-5 text-right shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">{topic.emoji}</div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700">
                    {topic.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">{topic.subtitle}</p>
                </div>
                <div className="text-gray-300 group-hover:text-blue-400 text-xl">←</div>
              </div>
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          המידע ניתן לצורך הכוונה כללית בלבד ואינו מהווה ייעוץ משפטי או פיננסי מקצועי
        </p>
      </div>
    </main>
  );
}
