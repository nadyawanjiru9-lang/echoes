"use client";

import { useRouter } from "next/navigation";

export default function LibraryPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#151316] text-[#E8E1DA] px-6 py-8">

      <div className="max-w-6xl mx-auto">

        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-xl tracking-[0.3em] font-semibold"
          >
            ECHOES
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm text-[#AAA1A0] hover:text-[#E8E1DA] transition"
          >
            ← Back to Studio
          </button>
        </div>

        <div className="mb-10">
          <p className="text-[#C56A3D] text-xs tracking-[0.3em] uppercase">
            Your collection
          </p>

          <h1 className="text-4xl md:text-5xl font-semibold mt-3">
            Library
          </h1>

          <p className="text-[#AAA1A0] mt-3">
            Your music, recordings and creative ideas in one place.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">

          <div className="bg-[#211D20] border border-white/10 rounded-2xl p-6">
            <div className="text-3xl mb-5">♫</div>
            <h2 className="text-xl font-semibold">Songs</h2>
            <p className="text-[#777] text-sm mt-2">
              Browse the songs you've created.
            </p>

            <button
              onClick={() => router.push("/dashboard")}
              className="mt-6 text-sm text-[#C56A3D] hover:text-[#E8E1DA] transition"
            >
              View songs →
            </button>
          </div>

          <div className="bg-[#211D20] border border-white/10 rounded-2xl p-6">
            <div className="text-3xl mb-5">◉</div>
            <h2 className="text-xl font-semibold">Recordings</h2>
            <p className="text-[#777] text-sm mt-2">
              Your saved vocal and audio takes.
            </p>
          </div>

          <div className="bg-[#211D20] border border-white/10 rounded-2xl p-6">
            <div className="text-3xl mb-5">◌</div>
            <h2 className="text-xl font-semibold">Beats</h2>
            <p className="text-[#777] text-sm mt-2">
              Beats and sound ideas from your studio.
            </p>
          </div>

        </div>

        <footer className="text-center mt-20 pt-8 border-t border-white/10">
          <p className="text-xs text-[#555]">
            Created by Nadya · © 2026 ECHOES
          </p>
        </footer>

      </div>
    </main>
  );
}