"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setEmail(user.email ?? "");
      }
    }

    getUser();
  }, []);

  return (
    <main className="min-h-screen bg-[#151316] text-[#E8E1DA] px-6 py-8">

      <div className="max-w-4xl mx-auto">

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

        <p className="text-[#C56A3D] text-xs tracking-[0.3em] uppercase">
          Your space
        </p>

        <h1 className="text-4xl md:text-5xl font-semibold mt-3">
          Profile
        </h1>

        <div className="mt-10 bg-[#211D20] border border-white/10 rounded-3xl p-8">

          <div className="w-20 h-20 rounded-full bg-[#9A4F55]/20 border border-[#9A4F55]/30 flex items-center justify-center text-2xl">
            ♫
          </div>

          <h2 className="text-2xl font-semibold mt-6">
            ECHOES Creator
          </h2>

          <p className="text-[#AAA1A0] mt-2">
            {email || "Your account"}
          </p>

          <div className="mt-8 border-t border-white/10 pt-6">

            <p className="text-xs uppercase tracking-[0.25em] text-[#777]">
              Account
            </p>

            <p className="mt-3 text-[#AAA1A0] text-sm">
              Your songs, recordings and creative work belong to your
              personal ECHOES studio.
            </p>

          </div>

        </div>

        <footer className="text-center mt-16 pt-8 border-t border-white/10">
          <p className="text-xs text-[#555]">
            Created by Nadya · © 2026 ECHOES
          </p>
        </footer>

      </div>
    </main>
  );
}