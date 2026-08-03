"use client";

import AuthLayout from "@/screens/components/auth_layout";
import { useRouter, useSearchParams } from "next/navigation";
import {
  linkPasswordToAccount,
  loginWithGoogle,
} from "@/lib/services/auth/auth_service.js";
import Loading from "@/screens/components/loading";
import { useState, useEffect } from "react";

export default function CompleteResgistrationPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/complete-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await res.json();

      if (data.needsLinking) {
        try {
          await loginWithGoogle();
          await linkPasswordToAccount(password);

          router.push("/views/login");
          return;
        } catch (error) {
          console.error(error);

          setError(
            error instanceof Error
              ? error.message
              : "Unable to link your Google account.",
          );

          return;
        }
      }

      router.push("/views/login");
    } catch (error) {
      switch (error.code) {
        case "auth/popup-closed-by-user":
          setError("Google sign-in was cancelled.");
          break;

        case "auth/popup-blocked":
          setError("Your browser blocked the Google sign-in popup.");
          break;

        case "auth/credential-already-in-use":
          setError("This password is already linked to another account.");
          break;

        default:
          setError(error.message || "Unable to complete registration.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setError("Invalid registration link.");
      return;
    }

    setToken(token);

    async function verifyRegistration() {
      try {
        const res = await fetch(`/api/auth/verify-token?token=${token}`);

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error);
        }

        setEmail(data.email);
      } catch (err) {
        setError(err.message);
      }
    }

    verifyRegistration();
  }, []);

  return (
    <AuthLayout
      image={"/assets/Tablet-login-amico.svg"}
      children={
        <>
          {" "}
          {/* Form */}
          <div className="w-full max-w-md z-10 px-6">
            <h1 className="mb-8 text-5xl font-bold">Sign Up</h1>

            {/* Sign Card */}
            <div className="rounded-xl bg-tinted-white-blue p-10 shadow-lg">
              {/* Email */}
              <div className="mb-3 flex h-14 items-center gap-3 px-5">
                <span className="material-symbols-outlined text-2xl font-bold text-primary-blue">
                  mail
                </span>

                <p className="text-lg font-bold text-gray-700">
                  {email || "Loading email..."}
                </p>
              </div>

              {/* Password */}
              <div className="mb-3 flex h-14 items-center gap-3 rounded-lg bg-white px-5 shadow">
                <span className="material-symbols-outlined text-xl text-primary-blue">
                  key
                </span>

                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Password"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                />
              </div>
              {/* Re-Enter Password */}
              <div className="mb-6 flex h-14 items-center gap-3 rounded-lg bg-white px-5 shadow">
                <span className="material-symbols-outlined text-xl text-primary-blue">
                  key
                </span>

                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  placeholder="Re-enter password"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                />
              </div>

              {error && (
                <div className="rounded-lg text-accent-red p-1 mb-4">
                  {error}
                </div>
              )}

              {/* Sign up Button */}
              <button
                onClick={handleSignUp}
                className="mb-5 h-11 w-full rounded-full bg-primary-blue font-semibold text-white shadow transition hover:brightness-110 cursor-pointer"
              >
                {submitting ? <Loading size={5} /> : "Sign up"}
              </button>

              {/* Links */}
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
