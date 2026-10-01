"use client";

import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#151316] text-[#E8E1DA] overflow-hidden">

      {/* Decorative stars */}
      <div className="fixed top-20 left-10 text-[#C56A3D]/40 text-xl">
        ✦
      </div>

      <div className="fixed top-32 right-16 text-[#9A4F55]/40 text-sm">
        ✦
      </div>

      <div className="fixed bottom-32 left-20 text-[#9A4F55]/30 text-lg">
        ✦
      </div>

      {/* Butterfly */}
      <div className="fixed top-1/2 right-10 text-[#9A4F55]/20 text-3xl">
        🦋
      </div>

      {/* Navigation */}
      <nav className="max-w-6xl mx-auto px-6 py-7 flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="text-xl tracking-[0.3em] font-semibold"
        >
          ECHOES
        </button>

        <button
          onClick={() => router.push("/login")}
          className="border border-white/10 hover:border-[#9A4F55]/60 px-5 py-2 rounded-full text-sm transition"
        >
          Enter Studio
        </button>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">

        <p className="text-[#C56A3D] text-xs tracking-[0.35em] uppercase">
          The story behind ECHOES
        </p>

        <h1 className="text-5xl md:text-7xl font-semibold mt-5 tracking-tight">
          Every song
          <br />
          starts somewhere.
        </h1>

        <p className="max-w-2xl mx-auto mt-7 text-[#AAA1A0] text-lg leading-relaxed">
          ECHOES was created as a space where ideas can become lyrics,
          melodies can become songs, and moments can be turned into music.
        </p>
      </section>

      {/* Main story */}
      <section className="max-w-4xl mx-auto px-6 pb-20">

        <div className="bg-[#211D20] border border-white/10 rounded-[2rem] p-8 md:p-12">

          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full border border-[#C56A3D]/30 flex items-center justify-center">
              ♫
            </div>

            <div>
              <p className="text-xs tracking-[0.25em] text-[#AAA1A0] uppercase">
                About ECHOES
              </p>

              <h2 className="text-2xl font-semibold mt-1">
                A home for your sound
              </h2>
            </div>
          </div>

          <div className="space-y-6 text-[#AAA1A0] leading-8">
            <p>
              ECHOES is a songwriting studio built for people who have
              something they want to say, even when they don't know how
              to say it yet.
            </p>

            <p>
              Write lyrics. Experiment with beats. Record ideas.
              Build melodies. Layer sounds. Save your creations.
              And eventually, turn those little ideas into complete songs.
            </p>

            <p>
              The goal is simple: give creativity somewhere to live.
            </p>
          </div>

        </div>

        {/* Creator */}
        <div className="mt-8 bg-[#211D20] border border-[#9A4F55]/20 rounded-[2rem] p-8 md:p-12 relative overflow-hidden">

          <div className="absolute -right-16 -bottom-16 w-48 h-48 rounded-full border border-[#C56A3D]/10" />
          <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full border border-[#9A4F55]/10" />

          <p className="text-[#C56A3D] text-xs tracking-[0.3em] uppercase">
            The creator
          </p>

          <h2 className="text-4xl font-semibold mt-3">
            Created by Nadya.
          </h2>

          <p className="text-[#AAA1A0] leading-8 mt-6 max-w-2xl">
            ECHOES was designed and built by Nadya as a creative space
            for songwriting, experimentation and self-expression.
            What started as an idea became a place where music,
            technology and creativity could meet.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <span className="px-4 py-2 rounded-full bg-[#151316] border border-white/10 text-sm">
              Music
            </span>

            <span className="px-4 py-2 rounded-full bg-[#151316] border border-white/10 text-sm">
              Creativity
            </span>

            <span className="px-4 py-2 rounded-full bg-[#151316] border border-white/10 text-sm">
              Technology
            </span>

            <span className="px-4 py-2 rounded-full bg-[#151316] border border-white/10 text-sm">
              Storytelling
            </span>
          </div>

        </div>

      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center">

        <div className="text-lg tracking-[0.3em] font-semibold">
          ECHOES
        </div>

        <p className="text-[#555] text-xs mt-3">
          Created by Nadya · © 2026 ECHOES
        </p>

      </footer>

    </main>
  );
}