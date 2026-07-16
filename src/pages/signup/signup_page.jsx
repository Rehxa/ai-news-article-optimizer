"use client";

import AuthLayout from "@/pages/components/auth_layout";
import { useRouter } from "next/navigation";
import { register, loginWithGoogle } from "@/lib/services/auth/auth_service.js";
import { useState } from "react";

export default function SignPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
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
      await register(email, password);
      router.push("/views/login");
    } catch (error) {
      switch (error.code) {
        case "auth/email-already-in-use":
          setError("An account with this email already exists.");
          break;

        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;

        case "auth/weak-password":
          setError("Password must be at least 6 characters long.");
          break;

        case "auth/network-request-failed":
          setError("Network error. Check your internet connection.");
          break;

        case "auth/too-many-requests":
          setError("Too many attempts. Please try again later.");
          break;

        case "auth/operation-not-allowed":
          setError("Email/password sign up is currently unavailable.");
          break;

        default:
          setError("Unable to create your account. Please try again.");
          console.error(error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // const handleGoogleSignIn = async () => {
  //   setError("");
  //   setSubmitting(true);
  //   try {
  //     await loginWithGoogle();
  //     router.replace("/my_article");
  //   } catch (error) {
  //     switch (error.code) {
  //       case "auth/popup-closed-by-user":
  //         setError("Google sign-in was cancelled.");
  //         break;

  //       case "auth/popup-blocked":
  //         setError("Your browser blocked the sign-in popup.");
  //         break;

  //       case "auth/cancelled-popup-request":
  //         // Usually ignore this one because it happens when multiple popups are requested.
  //         break;

  //       case "auth/network-request-failed":
  //         setError("Network error. Check your internet connection.");
  //         break;

  //       case "auth/account-exists-with-different-credential":
  //         setError(
  //           "An account with this email already exists using a different sign-in method.",
  //         );
  //         break;

  //       default:
  //         setError("Unable to sign in with Google. Please try again.");
  //         console.error(error);
  //     }
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

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
              <div className="mb-3 flex h-14 items-center gap-3 rounded-lg bg-white px-5 shadow">
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
                Sign up
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

            {/* Divider */}
            {/* <p className="mt-3.5 mb-3.5 text-center text-gray-600">Or</p> */}

            {/* Google Login */}
            {/* <button
              onClick={handleGoogleSignIn}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-full bg-natural-grey-blue shadow transition hover:bg-[#d6e8fb] cursor-pointer z-10"
            >
              <img
                src={"/assets/Google-logo.svg"}
                alt="Google"
                className="h-5 w-5"
              />

              <span className="font-semibold">Sign in with Google</span>
            </button> */}
          </div>
        </>
      }
    />
  );
}
