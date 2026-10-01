 import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SharedSongPage({ params }: PageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: song, error } = await supabase
    .from("songs")
    .select(
      `
      id,
      title,
      artist_name,
      genre,
      song_mood,
      song_key,
      bpm,
      description,
      verse_1,
      pre_chorus,
      chorus,
      verse_2,
      bridge,
      outro,
      is_public
    `
    )
    .eq("id", id)
    .eq("is_public", true)
    .single();

  if (error || !song) {
    notFound();
  }

  const sections = [
    { label: "Verse 1", content: song.verse_1 },
    { label: "Pre-Chorus", content: song.pre_chorus },
    { label: "Chorus", content: song.chorus },
    { label: "Verse 2", content: song.verse_2 },
    { label: "Bridge", content: song.bridge },
    { label: "Outro", content: song.outro },
  ].filter((section) => section.content?.trim());

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#151316",
        color: "#E8E1DA",
        padding: "40px 20px 80px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "850px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "70px",
          }}
        >
          <div
            style={{
              fontSize: "24px",
              fontWeight: "800",
              letterSpacing: "5px",
            }}
          >
            ECHOES
          </div>

          <div
            style={{
              color: "#AAA1A0",
              fontSize: "13px",
            }}
          >
            Shared song
          </div>
        </div>

        {/* Song Header */}
        <section style={{ marginBottom: "55px" }}>
          <div
            style={{
              color: "#C56A3D",
              fontSize: "12px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              marginBottom: "15px",
            }}
          >
            {song.genre || "Song"}
          </div>

          <h1
            style={{
              fontSize: "clamp(42px, 8vw, 76px)",
              lineHeight: "0.95",
              margin: "0 0 18px",
              fontWeight: "800",
              letterSpacing: "-3px",
            }}
          >
            {song.title}
          </h1>

          {song.artist_name && (
            <p
              style={{
                margin: "0 0 25px",
                color: "#AAA1A0",
                fontSize: "18px",
              }}
            >
              by {song.artist_name}
            </p>
          )}

          {song.description && (
            <p
              style={{
                maxWidth: "650px",
                color: "#C8C0BB",
                fontSize: "16px",
                lineHeight: "1.7",
              }}
            >
              {song.description}
            </p>
          )}
        </section>

        {/* Song Information */}
        <section
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "60px",
          }}
        >
          {[
            ["Mood", song.song_mood],
            ["Key", song.song_key],
            ["BPM", song.bpm],
          ].map(([label, value]) => (
            <div
              key={label}
              style={{
                background: "#211D20",
                border: "1px solid #352F32",
                borderRadius: "14px",
                padding: "14px 18px",
                minWidth: "100px",
              }}
            >
              <div
                style={{
                  color: "#777071",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  marginBottom: "5px",
                }}
              >
                {label}
              </div>

              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                {value || "—"}
              </div>
            </div>
          ))}
        </section>

        {/* Lyrics */}
        <section>
          <div
            style={{
              color: "#C56A3D",
              fontSize: "11px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              marginBottom: "25px",
            }}
          >
            Lyrics
          </div>

          {sections.length === 0 ? (
            <div
              style={{
                background: "#211D20",
                border: "1px solid #352F32",
                borderRadius: "18px",
                padding: "30px",
                color: "#AAA1A0",
              }}
            >
              This song doesn't have any lyrics yet.
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {sections.map((section) => (
                <article
                  key={section.label}
                  style={{
                    background: "#211D20",
                    border: "1px solid #352F32",
                    borderRadius: "20px",
                    padding: "28px",
                  }}
                >
                  <h2
                    style={{
                      margin: "0 0 18px",
                      fontSize: "13px",
                      color: "#9A4F55",
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                    }}
                  >
                    {section.label}
                  </h2>

                  <div
                    style={{
                      whiteSpace: "pre-wrap",
                      fontSize: "17px",
                      lineHeight: "1.9",
                      color: "#E8E1DA",
                    }}
                  >
                    {section.content}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer
          style={{
            marginTop: "80px",
            paddingTop: "25px",
            borderTop: "1px solid #352F32",
            textAlign: "center",
            color: "#777071",
            fontSize: "12px",
            letterSpacing: "1px",
          }}
        >
          <div>Shared with ECHOES</div>

          <div
            style={{
              marginTop: "8px",
              color: "#9A4F55",
            }}
          >
            write it. feel it. echo it. ♡
          </div>
        </footer>
      </div>
    </main>
  );
}