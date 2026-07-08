"use client";

import AuthLayout from "@/pages/components/auth_layout";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  return (
    <AuthLayout
      image={"/assets/OTP-amico.svg"}
      children={
        <>
          {" "}
          {/* Form */}
          <div className="w-full max-w-md z-10 px-6">
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
                  type="email"
                  placeholder="Email"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                />
              </div>

              {/* Send Button */}
              <button className="mb-5 h-11 w-full rounded-full bg-primary-blue font-semibold text-white shadow transition hover:brightness-110 cursor-pointer">
                Send
              </button>

              {/* Links */}
              <div className="space-y-1 text-center">
                <p className="text-sm">
                  <span className="material-symbols-outlined text-xl text-primary-blue">
                    arrow_back
                  </span>
                  <button
                    onClick={() => router.push("/views/login")}
                    className="font-semibold text-primary-blue hover:underline cursor-pointer"
                  >
                    Back to login
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
