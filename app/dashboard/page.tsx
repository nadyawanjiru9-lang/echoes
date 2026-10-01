 "use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Song = {
  id: string;
  title: string;
  artist_name: string | null;
  genre: string | null;
  song_mood: string | null;
  is_public: boolean;
  updated_at: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [songs, setSongs] = useState<Song[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    setEmail(user.email ?? "");

    const { data } = await supabase
      .from("songs")
      .select(
        "id, title, artist_name, genre, song_mood, is_public, updated_at"
      )
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    setSongs(data ?? []);
    setLoading(false);
  }

  async function createSong() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data, error } = await supabase
      .from("songs")
      .insert({
        user_id: user.id,
        title: "Untitled Song",
        content: "",
      })
      .select("id")
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    router.push(`/dashboard/songs/${data.id}`);
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const publicSongs = songs.filter((song) => song.is_public).length;

  return (
    <main className="min-h-screen bg-[#151316] text-[#E8E1DA] relative overflow-hidden">

      {/* =====================================================
          DECORATIVE BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute top-24 left-[7%] text-[#C56A3D]/30 text-xl">
          ✦
        </div>

        <div className="absolute top-[42%] left-[30%] text-[#9A4F55]/25">
          ✦
        </div>

        <div className="absolute bottom-[15%] right-[28%] text-[#C56A3D]/20 text-sm">
          ✦
        </div>

        <div className="absolute top-32 right-[8%] text-[#9A4F55]/20 text-3xl">
          🦋
        </div>

        <div className="absolute bottom-24 left-[12%] text-[#9A4F55]/15 text-xl">
          🦋
        </div>

        {/* Large vinyl */}
        <div className="absolute -right-52 -top-52 w-[620px] h-[620px] rounded-full border border-[#9A4F55]/8">
          <div className="absolute inset-12 rounded-full border border-[#C56A3D]/7" />
          <div className="absolute inset-24 rounded-full border border-[#9A4F55]/7" />
          <div className="absolute inset-40 rounded-full border border-[#C56A3D]/6" />
        </div>

        {/* Bottom vinyl */}
        <div className="absolute -left-40 -bottom-44 w-[480px] h-[480px] rounded-full border border-[#C56A3D]/7">
          <div className="absolute inset-14 rounded-full border border-[#9A4F55]/7" />
          <div className="absolute inset-28 rounded-full border border-[#C56A3D]/6" />
        </div>

      </div>

      {/* =====================================================
          PAGE
      ===================================================== */}

      <div className="relative z-10 max-w-[1500px] mx-auto px-5 md:px-8 xl:px-10">

        {/* ===================================================
            TOP NAVIGATION
        =================================================== */}

        <header className="h-24 flex items-center justify-between border-b border-white/10">

          <Link
            href="/dashboard"
            className="text-2xl tracking-[0.32em] font-semibold"
          >
            ECHOES
          </Link>

          <div className="hidden md:flex items-center gap-8">

            <Link
              href="/dashboard"
              className="text-sm text-[#E8E1DA]"
            >
              Studio
            </Link>

            <Link
              href="/dashboard/library"
              className="text-sm text-[#777] hover:text-[#E8E1DA] transition"
            >
              Library
            </Link>

            <Link
              href="/dashboard/profile"
              className="text-sm text-[#777] hover:text-[#E8E1DA] transition"
            >
              Profile
            </Link>

          </div>

          <div className="flex items-center gap-3">

            <div className="hidden sm:block text-xs text-[#555] max-w-[180px] truncate">
              {email}
            </div>

            <Link
              href="/dashboard/profile"
              className="w-10 h-10 rounded-full border border-[#9A4F55]/30 bg-[#211D20] flex items-center justify-center hover:border-[#C56A3D]/50 transition"
            >
              ♫
            </Link>

          </div>

        </header>

        {/* ===================================================
            WELCOME
        =================================================== */}

        <section className="py-10 md:py-14">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">

            <div>

              <p className="text-[#C56A3D] text-[10px] uppercase tracking-[0.35em]">
                Your creative space
              </p>

              <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mt-4">
                Welcome to
                <br />
                your studio.
              </h1>

              <p className="text-[#888] mt-5 max-w-xl leading-7">
                The lyrics, sounds and ideas that only exist in your head
                deserve somewhere to become real.
              </p>

            </div>

            <button
              onClick={createSong}
              className="self-start md:self-end bg-[#9A4F55] hover:bg-[#B45E65] px-7 py-4 rounded-2xl text-sm font-medium transition"
            >
              + Create New Song
            </button>

          </div>

        </section>

        {/* ===================================================
            MAIN GRID
        =================================================== */}

        <section className="grid lg:grid-cols-[1fr_310px] gap-6">

          {/* LEFT LARGE AREA */}

          <div className="space-y-6">

            {/* CREATIVE PANEL */}

            <div className="relative min-h-[280px] rounded-[2rem] overflow-hidden border border-white/10 bg-[#211D20]">

              <div className="absolute right-[-70px] top-[-90px] w-80 h-80 rounded-full border border-[#9A4F55]/15" />

              <div className="absolute right-[-15px] top-[-35px] w-60 h-60 rounded-full border border-[#C56A3D]/10" />

              <div className="absolute right-16 bottom-10 text-[100px] text-[#9A4F55]/8">
                ♫
              </div>

              <div className="relative p-8 md:p-10 max-w-2xl">

                <p className="text-[10px] uppercase tracking-[0.3em] text-[#777]">
                  Start with an idea
                </p>

                <h2 className="text-3xl md:text-4xl font-semibold mt-4 leading-tight">
                  Write it.
                  <br />
                  Hear it.
                  <br />
                  Make it yours.
                </h2>

                <p className="text-sm text-[#888] mt-5 max-w-md leading-6">
                  Build lyrics, experiment with beats, record takes,
                  layer sounds and shape your song from the first idea
                  to the final echo.
                </p>

                <button
                  onClick={createSong}
                  className="mt-7 border border-[#C56A3D]/30 hover:bg-[#C56A3D]/10 px-5 py-3 rounded-xl text-sm transition"
                >
                  Open a blank canvas →
                </button>

              </div>

            </div>

            {/* RECENT SONGS */}

            <div className="rounded-[2rem] border border-white/10 bg-[#1C191B] p-6 md:p-7">

              <div className="flex items-center justify-between mb-6">

                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-[#555]">
                    Your creations
                  </p>

                  <h2 className="text-2xl font-semibold mt-2">
                    Recently Created
                  </h2>
                </div>

                <Link
                  href="/dashboard/library"
                  className="text-xs text-[#C56A3D] hover:text-[#E8E1DA] transition"
                >
                  View library →
                </Link>

              </div>

              {loading ? (

                <div className="py-12 text-center text-[#666] text-sm">
                  Loading your songs...
                </div>

              ) : songs.length === 0 ? (

                <div className="py-12 text-center border border-dashed border-white/10 rounded-2xl">

                  <div className="text-4xl text-[#9A4F55]/50">
                    ♫
                  </div>

                  <p className="text-sm text-[#888] mt-4">
                    Your first song is waiting.
                  </p>

                  <button
                    onClick={createSong}
                    className="mt-5 text-xs text-[#C56A3D]"
                  >
                    Create one →
                  </button>

                </div>

              ) : (

                <div className="space-y-3">

                  {songs.slice(0, 5).map((song, index) => (

                    <Link
                      key={song.id}
                      href={`/dashboard/songs/${song.id}`}
                      className="group flex items-center gap-4 p-4 rounded-2xl bg-[#211D20] border border-white/5 hover:border-[#9A4F55]/40 transition"
                    >

                      <div className="w-14 h-14 shrink-0 rounded-xl bg-[#291D22] border border-[#9A4F55]/15 flex items-center justify-center relative overflow-hidden">

                        <div className="absolute w-20 h-20 rounded-full border border-[#C56A3D]/10" />

                        <span className="relative text-[#C56A3D]/60">
                          ♫
                        </span>

                      </div>

                      <div className="flex-1 min-w-0">

                        <h3 className="font-medium truncate group-hover:text-[#C56A3D] transition">
                          {song.title || "Untitled Song"}
                        </h3>

                        <p className="text-xs text-[#666] mt-1 truncate">
                          {song.artist_name || "Unknown artist"}
                        </p>

                      </div>

                      <div className="hidden sm:block">

                        <span className="text-[9px] px-3 py-1.5 rounded-full bg-white/5 text-[#777]">
                          {song.song_mood || "Original"}
                        </span>

                      </div>

                      <span className="text-[#555] group-hover:text-[#C56A3D] transition">
                        →
                      </span>

                    </Link>

                  ))}

                </div>

              )}

            </div>

          </div>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <aside className="space-y-6">

            {/* STATS */}

            <div className="rounded-[2rem] border border-white/10 bg-[#211D20] p-6">

              <div className="flex justify-between items-center">

                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-[#555]">
                    Your sound
                  </p>

                  <h2 className="text-xl font-semibold mt-2">
                    Studio Stats
                  </h2>
                </div>

                <span className="text-[#C56A3D]">
                  ✦
                </span>

              </div>

              <div className="grid grid-cols-2 gap-3 mt-7">

                <div className="rounded-xl bg-[#181619] p-4">
                  <p className="text-2xl font-semibold">
                    {songs.length}
                  </p>
                  <p className="text-[9px] uppercase tracking-wider text-[#555] mt-1">
                    Songs
                  </p>
                </div>

                <div className="rounded-xl bg-[#181619] p-4">
                  <p className="text-2xl font-semibold">
                    {publicSongs}
                  </p>
                  <p className="text-[9px] uppercase tracking-wider text-[#555] mt-1">
                    Public
                  </p>
                </div>

              </div>

              <div className="mt-3 rounded-xl bg-[#181619] p-4">

                <p className="text-xs text-[#777]">
                  Your studio has
                </p>

                <p className="text-lg font-semibold mt-1">
                  {songs.length === 0
                    ? "an empty canvas"
                    : "music in progress"}
                </p>

              </div>

            </div>

            {/* INSPIRATION */}

            <div className="rounded-[2rem] border border-[#9A4F55]/15 bg-[#211D20] p-6 relative overflow-hidden">

              <div className="absolute -right-10 -bottom-10 text-8xl text-[#9A4F55]/5">
                “
              </div>

              <p className="text-[9px] uppercase tracking-[0.3em] text-[#C56A3D]">
                A little reminder
              </p>

              <p className="text-lg leading-7 mt-5 text-[#AAA1A0]">
                You don't have to know what the song becomes
                before you write the first line.
              </p>

              <div className="mt-5 text-[#555] text-xs">
                — ECHOES
              </div>

            </div>

            {/* QUICK LINKS */}

            <div className="rounded-[2rem] border border-white/10 bg-[#1C191B] p-6">

              <p className="text-[9px] uppercase tracking-[0.3em] text-[#555]">
                Your space
              </p>

              <div className="mt-5 space-y-2">

                <Link
                  href="/dashboard/library"
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition"
                >
                  <span className="text-sm text-[#AAA1A0]">
                    Library
                  </span>
                  <span className="text-[#555]">
                    →
                  </span>
                </Link>

                <Link
                  href="/dashboard/profile"
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition"
                >
                  <span className="text-sm text-[#AAA1A0]">
                    Profile
                  </span>
                  <span className="text-[#555]">
                    →
                  </span>
                </Link>

                <button
                  onClick={logout}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition text-left"
                >
                  <span className="text-sm text-[#777]">
                    Log out
                  </span>
                  <span className="text-[#555]">
                    →
                  </span>
                </button>

              </div>

            </div>

          </aside>

        </section>

        {/* ===================================================
            SOUND COLLECTION
        =================================================== */}

        <section className="mt-6 rounded-[2rem] border border-white/10 bg-[#211D20] p-7 md:p-8">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">

            <div>

              <p className="text-[9px] uppercase tracking-[0.3em] text-[#555]">
                Explore your sound
              </p>

              <h2 className="text-2xl font-semibold mt-2">
                Different voices. Same sky.
              </h2>

            </div>

            <div className="flex flex-wrap gap-2">

              {[
                "R&B",
                "Soul",
                "Pop",
                "Afrobeat",
                "Hip-Hop",
                "Acoustic",
                "Alternative",
              ].map((genre) => (

                <span
                  key={genre}
                  className="px-4 py-2 rounded-full border border-white/10 bg-[#181619] text-xs text-[#777]"
                >
                  {genre}
                </span>

              ))}

            </div>

          </div>

        </section>

        {/* ===================================================
            FOOTER
        =================================================== */}

        <footer className="py-10 text-center">

          <div className="text-[#9A4F55]/30 mb-3">
            ✦
          </div>

          <p className="text-[9px] tracking-[0.25em] text-[#4F4A4B]">
            CREATED BY NADYA · © 2026 ECHOES
          </p>

        </footer>

      </div>

    </main>
  );
}