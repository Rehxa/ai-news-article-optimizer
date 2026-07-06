"use client";

import ArticleOptimizerPage from "./pages/ai_optimizer_tools/ai_optimize_tools_page";
import MyArticlePage from "./pages/my_article/my_article_page";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  return (
    <main>
      {/* <ArticleOptimizerPage /> */}
      {/* <MyArticlePage /> */}
      <button onClick={() => router.push("/views/my_article")}>
        Go to My Article
      </button>
    </main>
  );
}
