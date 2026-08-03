"use client";

import AuthLayout from "@/pages/components/auth_layout";
import { useRouter } from "next/navigation";
import Loading from "@/pages/components/loading";
import { useState, useEffect } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [showSentSnackBar, setShowSentSnackBar] = useState(false);
  const [showSentMessage, setShowSentMessage] = useState(false);

  useEffect(() => {
    if (!showSentMessage) return;

    setShowSentSnackBar(true);

    const timer = setTimeout(() => {
      setShowSentSnackBar(false);
      setShowSentMessage(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showSentMessage]);

  const handleSendEmail = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email and name.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      //   const data = await res.json();

      let data = {};

      try {
        data = await res.json();
      } catch {
        data = { error: "Server returned an invalid response." };
      }

      if (!res.ok) {
        setError(
          data.error || "Unable to send verification email. Please try again.",
        );
        return;
      }

      setShowSentMessage(true);
    } catch (err) {
      setError("Network error. Check your internet connection.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      image={"/assets/Tablet-login-amico.svg"}
      children={
        <>
          {showSentMessage && (
            <ShowSentEmail email={email} showSentSnackBar={showSentSnackBar} />
          )}
          <div className="w-full max-w-md z-10 px-6">
            <h1 className="mb-8 text-5xl font-bold">Sign Up</h1>

            <div className="rounded-xl bg-tinted-white-blue p-10 shadow-lg">
              {/* Email */}
              <div className="mb-6 flex h-14 items-center gap-3 rounded-lg bg-white px-5 shadow">
                <span className="material-symbols-outlined text-xl text-primary-blue">
                  mail
                </span>

                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Email"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                />
              </div>

              {error && (
                <div className="rounded-lg text-accent-red p-1 mb-4">
                  {error}
                </div>
              )}

              <button
                onClick={handleSendEmail}
                className="mb-5 h-11 w-full rounded-full bg-primary-blue font-semibold text-white shadow transition hover:brightness-110 cursor-pointer"
              >
                {submitting ? <Loading size={5} /> : "Verify email"}
              </button>

              <div className="space-y-1 text-center">
                <p className="text-sm">
                  Have an account?{" "}
                  <button
                    onClick={() => router.push("/views/login")}
                    className="font-semibold text-primary-blue hover:underline cursor-pointer"
                  >
                    Login
                  </button>
                </p>
              </div>
            </div>
          </div>
        </>
      }
    />
  );
}

function ShowSentEmail({ email, showSentSnackBar }) {
  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 rounded-sm bg-[#4DCE33] shadow-lg text-center text-white text-sm flex flex-row items-center gap-2 transition-all duration-300 ease-out ${
        showSentSnackBar
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-8 pointer-events-none"
      }`}
    >
      <div className="bg-natural-white rounded-sm flex flex-col justify-center items-center p-1">
        {" "}
        <span className="material-symbols-outlined text-xl text-[#4DCE33] m-1">
          mail
        </span>
      </div>

      <p className="text-sm text-textDarkBrown  px-4">
        We sent a verification link to <strong>{email}</strong> inbox. Click it
        to finish setting up your account.
      </p>
    </div>
  );
}
