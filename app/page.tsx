 import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#151316",
        color: "#E8E1DA",
        overflow: "hidden",
      }}
    >
      {/* Decorative music notes */}
      <div
        style={{
          position: "absolute",
          top: "120px",
          left: "7%",
          fontSize: "42px",
          color: "#9A4F55",
          opacity: 0.6,
        }}
      >
        ♪
      </div>

      <div
        style={{
          position: "absolute",
          top: "220px",
          right: "8%",
          fontSize: "55px",
          color: "#C56A3D",
          opacity: 0.35,
        }}
      >
        ♫
      </div>

      {/* Navigation */}
      <nav
        style={{
          maxWidth: "1150px",
          margin: "0 auto",
          padding: "28px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link
          href="/"
          style={{
            color: "#E8E1DA",
            textDecoration: "none",
            fontFamily: "Georgia, serif",
            fontSize: "30px",
            fontWeight: "bold",
            letterSpacing: "2px",
          }}
        >
          ECHOES
        </Link>

        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
          }}
        >
          <Link
            href="/login"
            style={{
              color: "#AAA1A0",
              textDecoration: "none",
              padding: "10px 18px",
              fontSize: "14px",
            }}
          >
            Log in
          </Link>

          <Link
            href="/signup"
            style={{
              color: "#E8E1DA",
              background: "#9A4F55",
              textDecoration: "none",
              padding: "11px 20px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            Create account
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          maxWidth: "1150px",
          margin: "0 auto",
          padding: "90px 30px 80px",
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* Vinyl decoration */}
        <div
          style={{
            position: "absolute",
            right: "3%",
            top: "50px",
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            background: "#211D20",
            border: "2px solid #3a3032",
            opacity: 0.8,
          }}
        >
          <div
            style={{
              width: "45px",
              height: "45px",
              borderRadius: "50%",
              background: "#9A4F55",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>

        <p
          style={{
            color: "#C56A3D",
            letterSpacing: "4px",
            fontSize: "13px",
            textTransform: "uppercase",
            marginBottom: "20px",
          }}
        >
          Your private songwriting studio
        </p>

        <h1
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(58px, 10vw, 105px)",
            lineHeight: 0.95,
            margin: "0",
            letterSpacing: "-4px",
          }}
        >
          ECHOES
        </h1>

        <p
          style={{
            maxWidth: "650px",
            margin: "30px auto 0",
            color: "#AAA1A0",
            fontSize: "19px",
            lineHeight: 1.7,
          }}
        >
          A place for the songs in your head, the lyrics in your heart,
          and the ideas you don't want to lose.
        </p>

        {/* Access box */}
        <div
          style={{
            maxWidth: "520px",
            margin: "45px auto 0",
            padding: "28px",
            background: "#211D20",
            border: "1px solid #3a3032",
            borderRadius: "16px",
          }}
        >
          <div
            style={{
              fontSize: "25px",
              marginBottom: "10px",
            }}
          >
            ♫
          </div>

          <h2
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "25px",
              margin: "0 0 10px",
            }}
          >
            Enter your studio
          </h2>

          <p
            style={{
              color: "#AAA1A0",
              fontSize: "14px",
              lineHeight: 1.6,
              marginBottom: "22px",
            }}
          >
            Create an account to access your private songwriting space,
            save your songs, and keep your ideas with you.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/signup"
              style={{
                background: "#9A4F55",
                color: "#E8E1DA",
                textDecoration: "none",
                padding: "13px 25px",
                borderRadius: "9px",
                fontWeight: "bold",
                fontSize: "15px",
              }}
            >
              Create your account
            </Link>

            <Link
              href="/login"
              style={{
                background: "transparent",
                color: "#E8E1DA",
                textDecoration: "none",
                padding: "13px 25px",
                borderRadius: "9px",
                border: "1px solid #514548",
                fontSize: "15px",
              }}
            >
              I already have an account
            </Link>
          </div>
        </div>

        {/* Waveform */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "5px",
            marginTop: "70px",
            height: "45px",
          }}
        >
          {[18, 30, 42, 25, 38, 50, 28, 43, 32, 20, 36, 48, 26, 40, 18].map(
            (height, index) => (
              <div
                key={index}
                style={{
                  width: "4px",
                  height: `${height}px`,
                  borderRadius: "4px",
                  background:
                    index % 3 === 0 ? "#9A4F55" : "#C56A3D",
                  opacity: 0.7,
                }}
              />
            )
          )}
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        style={{
          maxWidth: "1050px",
          margin: "0 auto",
          padding: "40px 30px 100px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "18px",
          }}
        >
          <Feature
            icon="✍"
            title="Write"
            text="Build verses, choruses, bridges and hooks in one private workspace."
          />

          <Feature
            icon="♫"
            title="Create"
            text="Experiment with lyrics, rhymes, melodies and ideas as your song takes shape."
          />

          <Feature
            icon="◉"
            title="Keep"
            text="Save your work and come back whenever inspiration finds you."
          />
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid #2d282a",
          padding: "35px 25px",
          textAlign: "center",
          color: "#665f60",
          fontSize: "12px",
        }}
      >
        <p style={{ margin: "0 0 8px" }}>
          ECHOES — for the songs that stay with you.
        </p>

        <p
          style={{
            margin: 0,
            color: "#514b4c",
            fontStyle: "italic",
          }}
        >
          “we didn't vibe on the first night…”
          <br />
          — bunny ♡
        </p>
      </footer>
    </main>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div
      style={{
        background: "#211D20",
        border: "1px solid #332d2f",
        borderRadius: "14px",
        padding: "25px",
      }}
    >
      <div
        style={{
          fontSize: "27px",
          color: "#C56A3D",
          marginBottom: "15px",
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          fontFamily: "Georgia, serif",
          fontSize: "22px",
          margin: "0 0 10px",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          color: "#AAA1A0",
          lineHeight: 1.6,
          fontSize: "14px",
          margin: 0,
        }}
      >
        {text}
      </p>
    </div>
  );
}