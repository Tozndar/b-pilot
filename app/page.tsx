"use client";

import { topics } from "@/lib/topics";
import { PaperPlane } from "@/components/PaperPlane";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen overflow-hidden" style={{
      background: "linear-gradient(145deg, #3b5bdb 0%, #6741d9 45%, #ae3ec9 100%)"
    }}>

      {/* Floating paper planes decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="float-plane absolute top-10 left-8 opacity-30">
          <PaperPlane size={64} color="#e0c3fc" />
        </div>
        <div className="float-plane-2 absolute top-28 right-12 opacity-25">
          <PaperPlane size={44} color="#ffd43b" />
        </div>
        <div className="float-plane absolute bottom-48 left-1/3 opacity-20">
          <PaperPlane size={80} color="#74c0fc" />
        </div>
        <div className="float-plane-2 absolute top-1/2 right-6 opacity-20">
          <PaperPlane size={36} color="#ffa8d4" />
        </div>
        <div className="float-plane absolute bottom-24 right-1/4 opacity-25">
          <PaperPlane size={52} color="#96f2d7" />
        </div>
        <div className="float-plane-2 absolute top-3/4 left-10 opacity-15">
          <PaperPlane size={30} color="#ffe066" />
        </div>
      </div>

      <div className="relative max-w-lg mx-auto px-5 py-14">

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-6 shadow-2xl"
            style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.2)" }}>
            <PaperPlane size={52} color="#fff" />
          </div>

          <h1 className="text-5xl font-black text-white mb-3 tracking-tight drop-shadow-lg">
            B-Pilot
          </h1>
          <p className="text-white/90 text-xl font-semibold mb-2">
            הטייס האישי שלך בבירוקרטיה 🇮🇱
          </p>
          <p className="text-white/65 text-sm max-w-xs mx-auto leading-relaxed">
            מבין את המצב שלך, שואל את השאלות הנכונות —<br />
            ועושה את הבירוקרטיה במקומך
          </p>
        </div>

        {/* Topic Cards */}
        <div className="space-y-3">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => router.push(`/chat/${topic.id}`)}
              className="w-full group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.025] hover:shadow-2xl active:scale-[0.99]"
              style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                style={{ background: `linear-gradient(135deg, ${topic.color}40, ${topic.colorTo}20)` }} />

              <div className="relative flex items-center gap-4 px-5 py-4">
                {/* Colored icon */}
                <div className="w-13 h-13 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"
                  style={{ background: `linear-gradient(135deg, ${topic.color}, ${topic.colorTo})`, width: 52, height: 52 }}>
                  {topic.emoji}
                </div>

                {/* Text */}
                <div className="flex-1 text-right">
                  <h2 className="text-white font-bold text-base leading-tight">
                    {topic.title}
                  </h2>
                  <p className="text-white/60 text-xs mt-1">{topic.subtitle}</p>
                </div>

                {/* Arrow + mini plane on hover */}
                <div className="flex items-center gap-2">
                  <div className="opacity-0 group-hover:opacity-40 transition-all -translate-x-1 group-hover:translate-x-0">
                    <PaperPlane size={18} color="#fff" />
                  </div>
                  <span className="text-white/40 group-hover:text-white/80 transition-colors text-lg">←</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-white/30 text-xs mt-8 leading-relaxed">
          המידע ניתן לצורך הכוונה כללית בלבד<br />
          ואינו מהווה ייעוץ משפטי, פיננסי או מקצועי
        </p>
      </div>
    </main>
  );
}
