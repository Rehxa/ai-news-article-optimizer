"use client";
import AuthLayout from "@/pages/components/auth_layout";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
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

              {/* Login Button */}
              <button className="mb-5 h-11 w-full rounded-full bg-primary-blue font-semibold text-white shadow transition hover:brightness-110 cursor-pointer">
                Login
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
            <button className="flex h-12 w-full items-center justify-center gap-3 rounded-full bg-natural-grey-blue shadow transition hover:bg-[#d6e8fb] cursor-pointer z-10">
              <img
                src={"/assets/Google-logo.svg"}
                alt="Google"
                className="h-5 w-5"
              />

              <span className="font-semibold">Login with Google</span>
            </button>
          </div>
        </>
      }
    />
  );
}
