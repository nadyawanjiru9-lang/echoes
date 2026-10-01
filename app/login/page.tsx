 "use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#151316] text-[#E8E1DA] flex items-center justify-center px-6 relative overflow-hidden">

      {/* Very subtle ECHOES decorations */}
      <div className="absolute top-16 left-16 text-[#C56A3D]/40 text-xl">
        ✦
      </div>

      <div className="absolute bottom-20 right-20 text-[#9A4F55]/40 text-2xl">
        ✦
      </div>

      <div className="absolute top-24 right-24 text-[#9A4F55]/25">
        🦋
      </div>

      {/* Small vinyl detail */}
      <div className="absolute -left-24 -bottom-24 w-64 h-64 rounded-full border border-[#9A4F55]/10">
        <div className="absolute inset-8 rounded-full border border-[#C56A3D]/10" />
        <div className="absolute inset-16 rounded-full border border-[#9A4F55]/10" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-[#C56A3D]/20" />
      </div>

      {/* Login card */}
      <div className="w-full max-w-md relative z-10">

        {/* ECHOES heading */}
        <div className="text-center mb-8">
          <div className="text-3xl tracking-[0.35em] font-semibold">
            ECHOES
          </div>

          <div className="text-xs tracking-[0.25em] text-[#AAA1A0] mt-2">
            YOUR PRIVATE SONGWRITING STUDIO
          </div>
        </div>

        <div className="bg-[#211D20] border border-white/10 rounded-3xl p-8 shadow-2xl">

          <h1 className="text-2xl font-semibold text-center">
            Welcome back
          </h1>

          <p className="text-center text-[#AAA1A0] text-sm mt-2">
            Enter your studio
          </p>

          <form
            onSubmit={handleLogin}
            className="mt-7 space-y-5"
          >
            <div>
              <label className="block text-sm text-[#AAA1A0] mb-2">
                Email
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full bg-[#151316] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#9A4F55] transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm text-[#AAA1A0] mb-2">
                Password
              </label>

              <input
                type="password"
                required
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full bg-[#151316] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#9A4F55] transition"
                placeholder="Your password"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-400/20 text-red-300 rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#9A4F55] hover:bg-[#B45E65] rounded-xl py-3 font-medium transition disabled:opacity-50"
            >
              {loading
                ? "Logging in..."
                : "Log in"}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-[#777]">
              Don't have an account?
            </p>

            <button
              onClick={() =>
                router.push("/signup")
              }
              className="text-[#C56A3D] hover:text-[#E8E1DA] text-sm mt-1 transition"
            >
              Create an account
            </button>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-[#555]">
          Write · Create · Remember
        </div>
      </div>
    </main>
  );
}