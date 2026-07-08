"use client";

import AuthLayout from "@/pages/components/auth_layout";
import { useRouter } from "next/navigation";

export default function SignPage() {
  const router = useRouter();
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
                  type="password"
                  placeholder="Password"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                />
              </div>

              {/* Sign up Button */}
              <button className="mb-5 h-11 w-full rounded-full bg-primary-blue font-semibold text-white shadow transition hover:brightness-110 cursor-pointer">
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
            <p className="mt-3.5 mb-3.5 text-center text-gray-600">Or</p>

            {/* Google Login */}
            <button className="flex h-12 w-full items-center justify-center gap-3 rounded-full bg-natural-grey-blue shadow transition hover:bg-[#d6e8fb] cursor-pointer z-10">
              <img
                src={"/assets/Google-logo.svg"}
                alt="Google"
                className="h-5 w-5"
              />

              <span className="font-semibold">Sign up with Google</span>
            </button>
          </div>
        </>
      }
    />
  );
}
