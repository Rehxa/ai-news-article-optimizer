"use client";

import AuthLayout from "@/screens/components/auth_layout";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  resetPassword,
  resetPasswordFirebase,
  verifyResetCode,
  confirmResetPassword,
} from "@/lib/services/auth/auth_service";
import Loading from "@/screens/components/loading";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode");

  // "idle" -> initial email-entry step (no oobCode yet)
  // "sent" -> reset email successfully sent
  // "verifying" -> checking oobCode from the email link
  // "ready" -> oobCode valid, show new-password form
  // "submitting" -> confirming new password
  // "success" -> password changed
  // "invalid" -> oobCode missing/expired/invalid
  const [status, setStatus] = useState(oobCode ? "verifying" : "idle");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSentSnackBar, setShowSentSnackBar] = useState(false);
  const [showInvalidSnackbar, setShowInvalidSnackbar] = useState(false);

  useEffect(() => {
    if (!oobCode) return; // stay on "idle" (email entry step)

    verifyResetCode(oobCode)
      .then((verifiedEmail) => {
        setEmail(verifiedEmail);
        setStatus("ready");
      })
      .catch(() => setStatus("invalid"));
  }, [oobCode]);

  const handlePasswordChange = async () => {
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setStatus("submitting");
    try {
      await confirmResetPassword(oobCode, password);
      setStatus("success");
      setTimeout(() => router.push("/views/login"), 2000);
    } catch (err) {
      setStatus("ready");
      if (err.code === "auth/weak-password") {
        setError("Password is too weak.");
      } else if (err.code === "auth/expired-action-code") {
        setStatus("invalid");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  const handleSubmitEmail = async () => {
    if (!email) {
      setError("Enter your email address.");
      return;
    }
    setError("");
    setStatus("submitting");
    setLoading(true);
    try {
      await resetPasswordFirebase(email);
      setStatus("sent");
    } catch (err) {
      console.error("resetPasswordFirebase failed:", err.code, err.message);

      setStatus("idle");

      if (err.message === "account-exists-google") {
        setError("This account has only been registered with Google");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const showEmailForm = !oobCode && status !== "success";
  const showSentMessage = !oobCode && status === "sent";
  const showPassField =
    !!oobCode && (status === "ready" || status === "submitting");
  const showInvalidMessage = !!oobCode && status === "invalid";

  useEffect(() => {
    if (!showSentMessage) return;

    setShowSentSnackBar(true);

    const timer = setTimeout(() => {
      setShowSentSnackBar(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showSentMessage]);

  useEffect(() => {
    if (!showInvalidMessage) return;

    setShowInvalidSnackbar(true);

    const timer = setTimeout(() => {
      setShowInvalidSnackbar(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showInvalidMessage]);

  return (
    <AuthLayout
      image={"/assets/OTP-amico.svg"}
      children={
        <>
          <div className="w-full max-w-md z-10 px-6">
            {showEmailForm && (
              <EnterEmail
                onSubmit={handleSubmitEmail}
                setEmail={setEmail}
                email={email}
                error={error}
                loading={loading}
              />
            )}

            {showSentMessage && (
              <ShowSentEmail
                email={email}
                showSentSnackBar={showSentSnackBar}
              />
            )}

            {showInvalidMessage && (
              <ShowInvalid showInvalidSnackbar={showInvalidSnackbar} />
            )}

            {showPassField && (
              <ResetPassword
                password={password}
                setPassword={setPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                handleNewPassword={handlePasswordChange}
                error={error}
              />
            )}
            <div className="space-y-1 text-center flex flex-row items-center justify-center mt-6">
              <span className="material-symbols-outlined text-xl text-primary-blue !text-xl mt-1">
                arrow_back
              </span>
              <p className="text-sm">
                <button
                  onClick={() => router.push("/views/login")}
                  className="font-semibold text-primary-blue hover:underline cursor-pointer"
                >
                  Back to login
                </button>
              </p>
            </div>
          </div>
        </>
      }
    />
  );
}

function ShowInvalid({ showInvalidSnackbar }) {
  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 rounded-sm bg-[#E67E22] shadow-lg text-center text-white text-sm flex flex-row items-center gap-2 transition-all duration-300 ease-out ${
        showInvalidSnackbar
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-8 pointer-events-none"
      }`}
    >
      <div className="bg-natural-white rounded-sm flex flex-col justify-center items-center">
        {" "}
        <span className="material-symbols-outlined text-xl text-[#E67E22] m-1">
          acute
        </span>
      </div>

      <p className="px-4">
        This reset link is invalid or has expired. Please request a new one.
      </p>
    </div>
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
      <div className="bg-natural-white rounded-sm flex flex-col justify-center items-center">
        {" "}
        <span className="material-symbols-outlined text-xl text-[#4DCE33] m-1">
          mail
        </span>
      </div>

      <p className="px-4">
        We sent a password reset link to
        <span className="font-bold"> {email}</span> email.
      </p>
    </div>
  );
}

function EnterEmail({ onSubmit, setEmail, email, error, loading }) {
  return (
    <>
      <h1 className="mb-8 text-5xl font-bold">Forgot password?</h1>
      <p>Enter your email address below, and we'll help you reset it.</p>
      <div className="rounded-xl bg-tinted-white-blue p-10 shadow-lg mt-10">
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

        {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

        <button
          onClick={onSubmit}
          disabled={loading}
          className="mb-5 h-11 w-full rounded-full bg-primary-blue font-semibold text-white shadow transition hover:brightness-110 cursor-pointer disabled:opacity-70"
        >
          {loading ? <Loading size={6} /> : "Send"}
        </button>
      </div>
    </>
  );
}

function ResetPassword({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  handleNewPassword,
  error,
}) {
  return (
    <>
      <h1 className="mb-8 text-5xl font-bold">Reset Password</h1>
      <p>Enter your new password below.</p>
      <div className="rounded-xl bg-tinted-white-blue p-10 shadow-lg">
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
        {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
        <button
          onClick={handleNewPassword}
          className="mb-5 h-11 w-full rounded-full bg-primary-blue font-semibold text-white shadow transition hover:brightness-110 cursor-pointer"
        >
          Change password
        </button>
      </div>
    </>
  );
}
