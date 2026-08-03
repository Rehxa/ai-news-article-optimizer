"use client";
import { useState, useEffect } from "react";
import { CustomDialog } from "@/pages/components/custom_dialog.jsx";
import { ArticleWorkspace } from "@/pages/components/article_workspace";
import { useMultiSelect } from "@/lib/hooks/useMultiSelect";
import { useArticleListControls } from "@/lib/hooks/useArticleListControls";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "@/app/api/auth/fetch_with_auth";
import { useAuth } from "@/context/auth_context";

export default function MyArticlePage() {
  const router = useRouter();
  const [allArticles, setAllArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showAlertPopup, setShowAlertPopup] = useState(false);

  const {
    selectedIds,
    isSelectionState,
    handleSelection,
    cancelLongPress,
    toggleSelection,
    handleSelectAll,
    clear,
  } = useMultiSelect();

  const {
    paginatedArticles,
    searchQuery,
    setSearchQuery,
    sortOrder,
    handleSortToggle,
    currentPage,
    totalPages,
    handlePageChange,
  } = useArticleListControls(allArticles);

  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading && !user) {
      router.replace("/views/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const res = await fetchWithAuth(`/api/articles?userId=${user.uid}`);
        const data = await res.json();
        setAllArticles(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [user.uid]);

  const handleDelete = async () => {
    if (selectedIds.size === 0) {
      setShowAlertPopup(true);
    } else {
      setShowDeletePopup(true);
    }
  };

  const handleConfirmDelete = async () => {
    const ids = [...selectedIds];
    try {
      await Promise.all(
        ids.map((id) =>
          fetchWithAuth(`/api/articles/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "softDelete" }),
          }),
        ),
      );
      setAllArticles((prev) => prev.filter((a) => !selectedIds.has(a.id)));
      clear();
    } catch (error) {
      console.error("Error deleting articles:", error);
    } finally {
      setShowDeletePopup(false);
    }
  };

  const handleOpenArticle = (articleId) => {
    router.push(`/article/${articleId}`);
  };

  const handleCreateArticle = async () => {
    try {
      setLoading(true);
      const userId = user.uid;

      // Fetch the user's default tone first
      const userRes = await fetchWithAuth(`/api/users/${userId}`);
      if (!userRes.ok) throw new Error("Failed to fetch user");
      const userData = await userRes.json();

      const res = await fetchWithAuth("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          title: "Untitled Article",
          description: "",
          content: "",
          overrideToneOfVoice: userData.toneOfVoice,
        }),
      });
      if (!res.ok) throw new Error("Failed to create article");

      const data = await res.json(); // { id, message }
      router.push(`/article/${data.id}`);
    } catch (error) {
      console.error("Error creating article:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-natural-white w-screen h-screen flex justify-between items-center">
      <ArticleWorkspace
        articles={paginatedArticles}
        loading={loading}
        mode="my_article"
        selectedIds={selectedIds}
        isSelectionState={isSelectionState}
        onCardSelection={handleSelection}
        onCancelLongPress={cancelLongPress}
        toggleSelectionMode={toggleSelection}
        handleDeletePopup={handleDelete}
        handleSelectAll={handleSelectAll}
        onOpenArticle={handleOpenArticle}
        onCreateArticle={handleCreateArticle}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortOrder={sortOrder}
        onSortToggle={handleSortToggle}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalCount={allArticles.length}
      />

      <CustomDialog
        title="Delete articles"
        message={`Are you sure you want to delete ${selectedIds.size} selected items?`}
        isDelete={true}
        icon={
          <img
            src="/assets/Inbox-cleanup-rafiki.svg"
            alt="Inbox-cleanup"
            className="w-[85%]"
          />
        }
        isOpen={showDeletePopup}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeletePopup(false)}
      />

      <CustomDialog
        title="Reminder"
        message="Please select one of the articles!"
        isDelete={false}
        icon={
          <img
            src="/assets/Publish-article-amico.svg"
            alt="Reminder"
            className="w-[85%]"
          />
        }
        isOpen={showAlertPopup}
        onConfirm={() => setShowAlertPopup(false)}
        onCancel={() => setShowAlertPopup(false)}
      />
    </div>
  );
}
