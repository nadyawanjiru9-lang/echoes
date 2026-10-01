 "use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const supabase = createClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (name.trim().length < 2) {
      setError("Please enter your name.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name.trim(),
        },
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage(
      "Account created! Check your email to confirm your account."
    );

    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#151316",
        color: "#E8E1DA",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
        }}
      >
        <Link
          href="/"
          style={{
            color: "#C56A3D",
            textDecoration: "none",
            fontSize: "14px",
          }}
        >
          ← Back to ECHOES
        </Link>

        <div
          style={{
            marginTop: "25px",
            background: "#211D20",
            border: "1px solid #3a3032",
            borderRadius: "18px",
            padding: "35px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <div
              style={{
                fontSize: "42px",
                marginBottom: "10px",
              }}
            >
              ♫
            </div>

            <h1
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "34px",
                margin: "0 0 10px",
              }}
            >
              Create your ECHOES account
            </h1>

            <p
              style={{
                color: "#AAA1A0",
                margin: 0,
              }}
            >
              Your songs deserve a place to live.
            </p>
          </div>

          <form onSubmit={handleSignup}>
            <label>Name</label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              style={inputStyle}
            />

            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={inputStyle}
            />

            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              style={inputStyle}
            />

            <label>Confirm password</label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Enter your password again"
              style={inputStyle}
            />

            {error && (
              <p
                style={{
                  color: "#E07A7A",
                  fontSize: "14px",
                  marginTop: "15px",
                }}
              >
                {error}
              </p>
            )}

            {message && (
              <p
                style={{
                  color: "#9CCB9C",
                  fontSize: "14px",
                  marginTop: "15px",
                }}
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                marginTop: "20px",
                padding: "14px",
                borderRadius: "10px",
                border: "none",
                background: "#9A4F55",
                color: "#E8E1DA",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              marginTop: "25px",
              color: "#AAA1A0",
              fontSize: "14px",
            }}
          >
            Already have an account?{" "}
            <Link
              href="/login"
              style={{
                color: "#C56A3D",
                textDecoration: "none",
              }}
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  marginTop: "8px",
  marginBottom: "18px",
  padding: "13px",
  borderRadius: "9px",
  border: "1px solid #4a3e40",
  background: "#151316",
  color: "#E8E1DA",
  fontSize: "15px",
};