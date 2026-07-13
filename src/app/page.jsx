"use client";

import ArticleOptimizerPage from "@/app/(protected)/article/[id]/page";
import MyArticlePage from "@/app/(protected)/my_article/page";
import SettingPage from "@/app/(protected)/setting/page";
import LoginPage from "@/app/views/login/page";
import SignUpPage from "@/app/views/signup/page";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  return (
    <main>
      {/* <ArticleOptimizerPage /> */}
      {/* <MyArticlePage /> */}
      {/* <SettingPage /> */}
      <LoginPage />
      {/* <SignUpPage /> */}
      {/* <button onClick={() => router.push("/views/my_article")}>
        Go to My Article
      </button> */}
    </main>
  );
}
