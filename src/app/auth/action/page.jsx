"use client";

import { useEffect, useState } from "react";
import {
  getAuth,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from "firebase/auth";

import { app } from "@/lib/firebase/client"; // adjust this import to your Firebase config

export default function AuthActionPage() {
  const auth = getAuth(app);

  const [mode, setMode] = useState(null);
  const [oobCode, setOobCode] = useState(null);
  const [continueUrl, setContinueUrl] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const modeParam = params.get("mode");
    const codeParam = params.get("oobCode");
    const continueParam = params.get("continueUrl");

    setMode(modeParam);
    setOobCode(codeParam);
    setContinueUrl(continueParam);

    if (!modeParam || !codeParam) {
      setError("Invalid or incomplete Firebase action link.");
      setStatus("error");
      return;
    }

    if (modeParam === "resetPassword") {
      validateResetCode(codeParam);
    } else if (modeParam === "verifyEmail") {
      verifyEmailCode(codeParam);
    } else {
      setError(`Unsupported action: ${modeParam}`);
      setStatus("error");
    }
  }, []);

  async function validateResetCode(code) {
    try {
      setStatus("validating");

      const accountEmail = await verifyPasswordResetCode(auth, code);

      setEmail(accountEmail);
      setStatus("ready");
    } catch (error) {
      console.error("Invalid reset code:", error);

      if (error.code === "auth/expired-action-code") {
        setError("This password reset link has expired.");
      } else if (error.code === "auth/invalid-action-code") {
        setError(
          "This password reset link is invalid or has already been used.",
        );
      } else if (error.code === "auth/user-disabled") {
        setError("This account has been disabled.");
      } else {
        setError("Unable to validate this password reset link.");
      }

      setStatus("error");
    }
  }

  async function verifyEmailCode(code) {
    try {
      setStatus("verifying");

      const { applyActionCode } = await import("firebase/auth");

      await applyActionCode(auth, code);

      setStatus("verified");
    } catch (error) {
      console.error("Email verification failed:", error);

      if (error.code === "auth/expired-action-code") {
        setError("This verification link has expired.");
      } else if (error.code === "auth/invalid-action-code") {
        setError("This verification link is invalid or has already been used.");
      } else {
        setError("Unable to verify your email.");
      }

      setStatus("error");
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();

    if (!oobCode) {
      setError("Missing password reset code.");
      return;
    }

    if (!password) {
      setError("Please enter a new password.");
      return;
    }

    try {
      setStatus("submitting");
      setError("");

      await confirmPasswordReset(auth, oobCode, password);

      setStatus("success");
    } catch (error) {
      console.error("Password reset failed:", error);

      if (error.code === "auth/expired-action-code") {
        setError("This password reset link has expired.");
      } else if (error.code === "auth/invalid-action-code") {
        setError(
          "This password reset link is invalid or has already been used.",
        );
      } else if (error.code === "auth/weak-password") {
        setError("The password is too weak.");
      } else {
        setError("Unable to reset your password.");
      }

      setStatus("error");
    }
  }

  function goBack() {
    if (continueUrl) {
      window.location.href = continueUrl;
    } else {
      window.location.href = "/views/login";
    }
  }

  if (status === "loading" || status === "validating") {
    return <p>Validating your request...</p>;
  }

  if (status === "verifying") {
    return <p>Verifying your email...</p>;
  }

  if (status === "verified") {
    return (
      <div>
        <h1>Email verified</h1>
        <p>Your email has been successfully verified.</p>

        <button onClick={goBack}>Continue</button>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div>
        <h1>Password reset successful</h1>

        <p>Your password has been changed successfully.</p>

        <button onClick={goBack}>Continue to login</button>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div>
        <h1>Something went wrong</h1>

        <p>{error}</p>

        <button onClick={goBack}>Continue</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Reset your password</h1>

      <p>
        Resetting password for:
        <br />
        <strong>{email}</strong>
      </p>

      <form onSubmit={handleResetPassword}>
        <label>New password</label>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your new password"
        />

        {error && <p>{error}</p>}

        <button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
