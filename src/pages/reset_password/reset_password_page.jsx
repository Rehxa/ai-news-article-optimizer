"use client";

import AuthLayout from "@/pages/components/auth_layout";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  resetPassword,
  verifyResetCode,
  confirmResetPassword,
} from "@/lib/services/auth/auth_service";

import { auth } from "@/lib/firebase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode");

  const [status, setStatus] = useState("verifying");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const [showEmail, setShowEmail] = useState(true);
  const [showPassField, setShowPassField] = useState(false);

  useEffect(() => {
    if (!oobCode) {
      setStatus("invalid");
      return;
    }
    verifyResetCode(auth, oobCode)
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
      await confirmResetPassword(auth, oobCode, password);
      setStatus("success");
      setTimeout(() => router.push("/login"), 2000);
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
    try {
      await resetPassword(email);
      console.log("email sent");
      console.log(email);
      console.log("resetPassword resolved");
    } catch (err) {
      console.error("resetPassword failed:", err.code, err.message);
    }
    setStatus("sent");
  };

  return (
    <AuthLayout
      image={"/assets/OTP-amico.svg"}
      children={
        <>
          {" "}
          {/* Form */}
          <div className="w-full max-w-md z-10 px-6">
            {showEmail && (
              <EnterEmail
                onSubmit={handleSubmitEmail}
                setEmail={setEmail}
                email={email}
              />
            )}
            {/* 
            {showPassField && (
              <ResetPassword
                password={password}
                setPassword={setPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                handleNewPassword={handlePasswordChange}
              />
            )} */}

            {/* Links */}
            <div className="space-y-1 text-center flex flex-row items-center justify-center mt-6">
              {" "}
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

function EnterEmail({ onSubmit, setEmail, email }) {
  return (
    <>
      <h1 className="mb-8 text-5xl font-bold">Forgot password?</h1>
      <p>Enter your email address below, and we'll help you reset it.</p>
      {/* Sign Card */}
      <div className="rounded-xl bg-tinted-white-blue p-10 shadow-lg mt-10">
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

        {/* Send Button */}
        <button
          onClick={onSubmit}
          className="mb-5 h-11 w-full rounded-full bg-primary-blue font-semibold text-white shadow transition hover:brightness-110 cursor-pointer"
        >
          Send
        </button>
      </div>{" "}
    </>
  );
}

// function ResetPassword({
//   password,
//   setPassword,
//   confirmPassword,
//   setConfirmPassword,
//   handleNewPassword,
// }) {
//   return (
//     <div className="rounded-xl bg-tinted-white-blue p-10 shadow-lg">
//       {/* Email */}
//       {/* <div className="mb-3 flex h-14 items-center gap-3 rounded-lg bg-white px-5 shadow">
//         <span className="material-symbols-outlined text-xl text-primary-blue">
//           mail
//         </span>

//         <input
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           type="email"
//           placeholder="Email"
//           className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
//         />
//       </div> */}

//       {/* Password */}
//       <div className="mb-3 flex h-14 items-center gap-3 rounded-lg bg-white px-5 shadow">
//         <span className="material-symbols-outlined text-xl text-primary-blue">
//           key
//         </span>

//         <input
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           type="password"
//           placeholder="Password"
//           className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
//         />
//       </div>
//       {/* Re-Enter Password */}
//       <div className="mb-6 flex h-14 items-center gap-3 rounded-lg bg-white px-5 shadow">
//         <span className="material-symbols-outlined text-xl text-primary-blue">
//           key
//         </span>

//         <input
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           type="password"
//           placeholder="Re-enter password"
//           className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
//         />
//       </div>

//       {/* Sign up Button */}
//       <button
//         onClick={handleNewPassword}
//         className="mb-5 h-11 w-full rounded-full bg-primary-blue font-semibold text-white shadow transition hover:brightness-110 cursor-pointer"
//       >
//         Change password
//       </button>
//     </div>
//   );
// }
