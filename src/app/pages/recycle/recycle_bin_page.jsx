"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CustomDialog } from "@/app/pages/components/custom_dialog.jsx";
import SideBarGlobal from "@/app/pages/components/side_bar_global.jsx";
import { ArticleWorkspace } from "@/app/pages/components/article_workspace";
import { useMultiSelect } from "@/lib/hooks/useMultiSelect";
import { useArticleListControls } from "@/lib/hooks/useArticleListControls";

export default function RecycleBinPage() {
  const router = useRouter();

  const [allArticles, setAllArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showDeleteAllPopup, setShowDeleteAllPopup] = useState(false);
  const [showRestorePopup, setShowRestorePopup] = useState(false);
  const [showRestoreAllPopup, setShowRestoreAllPopup] = useState(false);
  const [showAlertPopup, setShowAlertPopup] = useState(false);

  const {
    isSelectionState,
    selectedIds,
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

  const userId = "user_001";

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/articles?userId=${userId}&bin=true`);
        const data = await res.json();
        setAllArticles(data);
        console.log(
          "[STEP 5 - fectching CHECK]",
          allArticles.map((a) => ({
            id: a.id,
            title: a.title,
            selected: selectedIds.has(a.id),
            isInBin: a.isInBin,
          })),
        );
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [userId]);

  const handleRestore = () => {
    if (selectedIds.size === 0) {
      setShowAlertPopup(true);
    } else {
      setShowRestorePopup(true);
    }
  };

  const handleRestoreAll = () => {
    setShowRestoreAllPopup(true);
  };

  const handleDelete = () => {
    if (selectedIds.size === 0) {
      setShowAlertPopup(true);
    } else {
      setShowDeletePopup(true);
    }
  };

  const handleDeleteAll = () => {
    setShowDeleteAllPopup(true);
  };

  const handleConfirmDelete = async () => {
    const ids = [...selectedIds];
    try {
      await Promise.all(
        ids.map((id) =>
          fetch(`/api/articles/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "delete" }),
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

  const handleConfirmDeleteAll = async () => {
    const ids = allArticles.map((a) => a.id);
    try {
      await Promise.all(
        ids.map((id) =>
          fetch(`/api/articles/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "delete" }),
          }),
        ),
      );
      setAllArticles([]);
      clear();
    } catch (error) {
      console.error("Error deleting all articles:", error);
    } finally {
      setShowDeleteAllPopup(false);
    }
  };

  const handleConfirmRestore = async () => {
    const ids = [...selectedIds];
    try {
      await Promise.all(
        ids.map((id) =>
          fetch(`/api/articles/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "restore" }),
          }),
        ),
      );
      setAllArticles((prev) => prev.filter((a) => !selectedIds.has(a.id)));
      clear();
    } catch (error) {
      console.error("Error restoring articles:", error);
    } finally {
      setShowRestorePopup(false);
    }
  };

  const handleConfirmRestoreAll = async () => {
    const ids = allArticles.map((a) => a.id);
    try {
      await Promise.all(
        ids.map((id) =>
          fetch(`/api/articles/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "restore" }),
          }),
        ),
      );
      setAllArticles([]);
      clear();
    } catch (error) {
      console.error("Error restoring all articles:", error);
    } finally {
      setShowRestoreAllPopup(false);
    }
  };

  const handleCreateArticle = async () => {
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "user_001",
          title: "Untitled Article",
          description: "",
          content: "",
        }),
      });
      const data = await res.json(); // { id, message }
      console.log("Article created:", data);
      router.push(`/views/article/${data.id}`);
    } catch (error) {
      console.error("Error creating article:", error);
    }
  };

  return (
    <div className="bg-natural-white w-screen h-screen flex justify-between items-center">
      <SideBarGlobal
        onMyArticles={() => router.push("/views/my_article")}
        mode="recycle_bin"
        onAddnewArticle={handleCreateArticle}
      />

      <ArticleWorkspace
        articles={paginatedArticles}
        loading={loading}
        mode="recycle_bin"
        selectedIds={selectedIds}
        isSelectionState={isSelectionState}
        onCardSelection={handleSelection}
        onCancelLongPress={cancelLongPress}
        toggleSelectionMode={toggleSelection}
        handleDeletePopup={handleDelete}
        handleDeleteAllPopup={handleDeleteAll}
        handleRestoreAllPopup={handleRestoreAll}
        handleRestorePopup={handleRestore}
        handleSelectAll={handleSelectAll}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortOrder={sortOrder}
        onSortToggle={handleSortToggle}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalCount={allArticles.length}
        onOpenArticle={() => {}}
        onCreateArticle={() => {}}
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
        title="Delete all articles"
        message="Are you sure you still want to delete all items in the recycle bin?"
        isDelete={true}
        icon={
          <img
            src="/assets/Inbox-cleanup-rafiki.svg"
            alt="Inbox-cleanup"
            className="w-[85%]"
          />
        }
        isOpen={showDeleteAllPopup}
        onConfirm={handleConfirmDeleteAll}
        onCancel={() => setShowDeleteAllPopup(false)}
      />

      <CustomDialog
        title="Recover articles"
        message={`Are you sure you want to recover ${selectedIds.size} selected items?`}
        isDelete={false}
        icon={
          <img
            src="/assets/Folder-rafiki.svg"
            alt="folder"
            className="w-[85%]"
          />
        }
        isOpen={showRestorePopup}
        onConfirm={handleConfirmRestore}
        onCancel={() => setShowRestorePopup(false)}
      />

      <CustomDialog
        title="Recover all articles"
        message="Are you sure you want to recover all items from the recycle bin?"
        isDelete={false}
        icon={
          <img
            src="/assets/Folder-rafiki.svg"
            alt="folder"
            className="w-[85%]"
          />
        }
        isOpen={showRestoreAllPopup}
        onConfirm={handleConfirmRestoreAll}
        onCancel={() => setShowRestoreAllPopup(false)}
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
