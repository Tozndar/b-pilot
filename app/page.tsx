"use client";

import { topics } from "@/lib/topics";
import { PaperPlane } from "@/components/PaperPlane";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 overflow-hidden">

      {/* Floating paper planes decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="float-plane absolute top-16 left-12 opacity-20">
          <PaperPlane size={48} color="#a5b4fc" />
        </div>
        <div className="float-plane-2 absolute top-32 right-20 opacity-15">
          <PaperPlane size={32} color="#fbbf24" />
        </div>
        <div className="float-plane absolute bottom-40 left-1/4 opacity-10">
          <PaperPlane size={64} color="#34d399" />
        </div>
        <div className="float-plane-2 absolute top-1/2 right-8 opacity-10">
          <PaperPlane size={28} color="#f9a8d4" />
        </div>
        <div className="float-plane absolute bottom-20 right-1/3 opacity-15">
          <PaperPlane size={40} color="#67e8f9" />
        </div>
      </div>

      <div className="relative max-w-lg mx-auto px-4 py-12">

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur rounded-3xl mb-5 shadow-lg">
            <PaperPlane size={44} color="#fff" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
            B-Pilot
          </h1>
          <p className="text-blue-200 text-lg font-medium">
            הטייס האישי שלך בבירוקרטיה 🇮🇱
          </p>
          <p className="text-blue-300/70 text-sm mt-2 max-w-xs mx-auto">
            שואל, מבין את המצב שלך, ועושה את העבודה
          </p>
        </div>

        {/* Topic Cards */}
        <div className="space-y-3">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => router.push(`/chat/${topic.id}`)}
              className="w-full group relative overflow-hidden rounded-2xl p-0.5 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
              style={{
                background: `linear-gradient(135deg, ${topic.color}, ${topic.colorTo})`,
              }}
            >
              <div className="relative bg-white/10 backdrop-blur-sm rounded-[14px] px-5 py-4 flex items-center gap-4">
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.15)" }}
                >
                  {topic.emoji}
                </div>

                {/* Text */}
                <div className="flex-1 text-right">
                  <h2 className="text-white font-semibold text-base leading-tight">
                    {topic.title}
                  </h2>
                  <p className="text-white/70 text-xs mt-0.5">{topic.subtitle}</p>
                </div>

                {/* Arrow */}
                <div className="text-white/50 group-hover:text-white group-hover:-translate-x-1 transition-all text-lg">
                  ←
                </div>

                {/* Mini plane on hover */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-30 transition-opacity">
                  <PaperPlane size={20} color="#fff" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-blue-400/50 text-xs">
            המידע ניתן לצורך הכוונה כללית ואינו מהווה ייעוץ מקצועי
          </p>
        </div>
      </div>
    </main>
  );
}
