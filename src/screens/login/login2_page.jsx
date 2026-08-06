"use client";
import AuthLayout from "@/screens/components/auth_layout";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth_context";

import { login, loginWithGoogle } from "@/lib/services/auth/auth_service.js";
import { sendEmailVerification, signOut } from "firebase/auth";
import { useState, useEffect } from "react";
import Loading from "@/screens/components/loading";
import { CustomDialog } from "@/screens/components/custom_dialog.jsx";
import { auth } from "@/lib/firebase/client";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("justRegistered") === "true";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const [error, setError] = useState("");
  const [unverifiedUser, setUnverifiedUser] = useState(null);
  const [resendStatus, setResendStatus] = useState("");

  useEffect(() => {
    if (!authLoading && user && user.emailVerified) {
      router.replace("/my_article");
    }
  }, [authLoading, user, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setUnverifiedUser(null);
    setSubmitting(true);
    try {
      const loggedInUser = await login(email, password);

      if (!loggedInUser.emailVerified) {
        await signOut(auth);
        setUnverifiedUser(loggedInUser);
        setError("Please verify your email before logging in.");
        return;
      }

      router.replace("/my_article");
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-credential":
          setError("Incorrect email or password.");
          break;

        case "auth/too-many-requests":
          setError("Too many login attempts. Please try again later.");
          break;

        case "auth/network-request-failed":
          setError("Network error. Check your internet connection.");
          break;

        default:
          setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    if (!unverifiedUser) return;
    setResendStatus("sending");
    try {
      await sendEmailVerification(unverifiedUser, {
        url: `${window.location.origin}/views/login?justRegistered=true`,
      });

      setResendStatus("sent");
    } catch (err) {
      setResendStatus("error");
      switch (error.code) {
        case "auth/too-many-requests":
          setError("Too many verification requests. Please try again later.");
          break;
      }
      console.error(err);
    }
  };

  const handleGoogleSignIn = async () => {
    setSubmitting(true);
    try {
      const loggedInUser = await loginWithGoogle();
      if (!loggedInUser.emailVerified) {
        await signOut(auth);
        setUnverifiedUser(loggedInUser);
        setError("Please verify your email before logging in.");
        return;
      }
      router.replace("/my_article");
    } catch (error) {
      switch (error.code) {
        case "auth/popup-closed-by-user":
          setError("Google sign-in was cancelled.");
          break;

        case "auth/popup-blocked":
          setError("Your browser blocked the sign-in popup.");
          break;

        case "auth/cancelled-popup-request":
          break;

        case "auth/network-request-failed":
          setError("Network error. Check your internet connection.");
          break;

        case "auth/account-exists-with-different-credential":
          setError(
            "An account with this email already exists using a different sign-in method.",
          );
          break;

        default:
          setError("Unable to sign in with Google. Please try again.");
          console.error(error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      image={"/assets/Computer-login-amico.svg"}
      children={
        <>
          {" "}
          {/* Form */}
          <div className="w-full max-w-md z-10 px-6">
            <h1 className="mb-8 text-5xl font-bold">Login</h1>

            {/* Login Card */}
            <div className="rounded-xl bg-tinted-white-blue p-10 shadow-lg">
              {/* {justRegistered && (
                <div className="rounded-lg bg-green-100 text-green-800 p-3 mb-4 text-sm">
                  Account created! Check your email to verify your address, then
                  log in.
                </div>
              )} */}

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
              <div className="mb-2 flex h-14 items-center gap-3 rounded-lg bg-white px-5 shadow">
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

              {error && (
                <div className="rounded-lg text-accent-red text-xs mb-2">
                  {error}
                </div>
              )}

              {unverifiedUser && (
                <div className="mb-2 text-sm">
                  {resendStatus === "sent" ? (
                    <span className="text-green-700">
                      Verification email resent — check your inbox.
                    </span>
                  ) : (
                    <button
                      onClick={handleResendVerification}
                      disabled={resendStatus === "sending"}
                      className="font-semibold text-primary-blue hover:underline cursor-pointer"
                    >
                      {resendStatus === "sending"
                        ? "Sending..."
                        : "Resend verification email"}
                    </button>
                  )}
                </div>
              )}

              {/* Login Button */}
              <button
                onClick={handleLogin}
                className="mb-5 h-11 w-full rounded-full bg-primary-blue font-semibold text-white shadow transition hover:brightness-110 cursor-pointer"
              >
                {submitting ? <Loading size={5} /> : "Login"}
              </button>

              {/* Links */}
              <div className="space-y-1 text-center">
                <p className="text-sm">
                  Don't have an account?{" "}
                  <button
                    onClick={() => router.push("/views/signup")}
                    className="font-semibold text-primary-blue hover:underline cursor-pointer"
                  >
                    Register
                  </button>
                </p>

                <button
                  onClick={() => router.push("/views/reset_password")}
                  className="text-sm font-semibold text-primary-blue hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            {/* Divider */}
            <p className="mt-6 mb-3.5 text-center text-gray-600">Or</p>

            {/* Google Login */}
            <button
              onClick={handleGoogleSignIn}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-full bg-natural-grey-blue shadow transition hover:bg-[#d6e8fb] cursor-pointer z-10"
            >
              <img
                src={"/assets/Google-logo.svg"}
                alt="Google"
                className="h-5 w-5"
              />

              <span className="font-semibold">Sign in with Google</span>
            </button>
          </div>
          <CustomDialog
            title="Go Verify Your Email"
            message={
              <>
                Please check your inbox and click the link to verify your
                account before logging in.
                <br />
                <br />
                Click confirm to go to resend verification email page.
              </>
            }
            isDelete={false}
            icon={
              <img
                src={"/assets/Google-logo.svg"}
                alt="Google"
                className="h-20 w-20"
              />
            }
            isOpen={false}
            onConfirm={() => router.push("/views/signupPage?verify=resend")}
            onCancel={() => setUnverifiedUser(null)}
          />
        </>
      }
    />
  );
}
