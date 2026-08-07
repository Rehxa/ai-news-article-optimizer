"use client";

import AuthLayout from "@/screens/components/auth_layout";
import { useRouter, useSearchParams } from "next/navigation";
import {
  register,
  loginWithGoogle,
  linkGoogleAccountWithPassword,
  resendVerificationEmail,
} from "@/lib/services/auth/auth_service.js";
import Loading from "@/screens/components/loading";
import { useState, useEffect } from "react";
import { CustomDialog } from "@/screens/components/custom_dialog.jsx";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [showSentMessage, setShowSentMessage] = useState(false);
  const [showSentSnackBar, setShowSentSnackBar] = useState(false);

  const [showLinkPrompt, setShowLinkPrompt] = useState(false);
  const [showResendPrompt, setShowResendPrompt] = useState(false);

  useEffect(() => {
    const verify = searchParams.get("verify");

    if (verify === "resend") {
      setShowResendPrompt(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!showSentMessage) return;

    setShowSentSnackBar(true);

    const timer = setTimeout(() => {
      setShowSentSnackBar(false);
      setShowSentMessage(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showSentMessage]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitting(true);
    try {
      await register(email, password);
      setShowSentMessage(true);
      setShowResendPrompt(true);
      // router.push("/views/login?justRegistered=true");
    } catch (error) {
      // console.error("send link google error:", {
      //   code: err.code,
      //   message: err.message,
      //   error: err,
      // });
      if (error.message === "account-exists-google") {
        setShowLinkPrompt(true);
        // setError(
        //   "This email is already registered with Google. Please sign in with Google instead.",
        // );
        return;
      }

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

  const handleResend = async () => {
    setSubmitting(true);
    try {
      await resendVerificationEmail(email, password);
      setShowSentMessage(true);
      // router.push("/views/login?justRegistered=true");
    } catch (err) {
      // console.error("Resend verification error:", {
      //   code: err.code,
      //   message: err.message,
      //   error: err,
      // });
      if (err.message === "already-verified") {
        setError("This account is already verified. Please log in.");
      } else if (err.code === "auth/invalid-credential") {
        setError("Incorrect password for this email.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else {
        setError("Unable to resend verification email.");
      }
      setShowResendPrompt(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLinkGoogle = async () => {
    setSubmitting(true);
    try {
      await linkGoogleAccountWithPassword(email, password);
      await register(email, password);

      // router.push("/views/login?linked=true");
      setShowSentMessage(true);
      setShowResendPrompt(true);
    } catch (err) {
      if (err.message === "google-email-mismatch") {
        setError("Please choose the Google account matching this email.");
      } else if (err.message === "password-already-linked") {
        setError(
          "This email is already linked to a Google account. Please log in with Google.",
        );
      } else {
        setError("Unable to link account. Please try again.");
      }
    } finally {
      setShowLinkPrompt(false);
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
          )}{" "}
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
                <div className="rounded-lg text-accent-red text-xs mb-4">
                  {error}
                </div>
              )}

              {/* Sign up Button */}
              <button
                onClick={showResendPrompt ? handleResend : handleSignUp}
                className="mb-5 h-11 w-full rounded-full bg-primary-blue font-semibold text-white shadow transition hover:brightness-110 cursor-pointer"
              >
                {submitting ? (
                  <Loading size={5} />
                ) : showResendPrompt ? (
                  "Resend verification email"
                ) : (
                  "Sign up"
                )}
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
          <CustomDialog
            title="Link Google Account"
            message="This email is already registered with Google. Would you like to link your Google account to this email?"
            isDelete={false}
            icon={
              <img
                src={"/assets/Google-logo.svg"}
                alt="Google"
                className="h-20 w-20"
              />
            }
            isOpen={showLinkPrompt}
            onConfirm={handleLinkGoogle}
            onCancel={() => setShowLinkPrompt(false)}
          />
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
