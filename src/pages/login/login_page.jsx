"use client";
import AuthLayout from "@/pages/components/auth_layout";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth_context";

import { login, loginWithGoogle } from "@/lib/services/auth/auth_service.js";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    //? after sign up need user to login, but it seem this check if user login or not.
    if (!authLoading && user) {
      router.replace("/my_article");
    }
  }, [authLoading, user, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      router.replace("/my_article");
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setSubmitting(true);
    try {
      await loginWithGoogle();
      router.replace("/my_article");
    } catch (error) {
      console.log(error);
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
              <div className="mb-6 flex h-14 items-center gap-3 rounded-lg bg-white px-5 shadow">
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

              {/* Login Button */}
              <button
                onClick={handleLogin}
                className="mb-5 h-11 w-full rounded-full bg-primary-blue font-semibold text-white shadow transition hover:brightness-110 cursor-pointer"
              >
                {submitting ? "Login in ..." : "Login"}
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

              <span className="font-semibold">Login with Google</span>
            </button>
          </div>
        </>
      }
    />
  );
}
