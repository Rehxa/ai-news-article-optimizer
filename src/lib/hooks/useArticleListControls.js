// lib/hooks/useArticleListControls.js
"use client";
import { useState, useEffect, useMemo } from "react";

const PAGE_SIZE = 15;

export function useArticleListControls(articles) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // "desc" = newest first
  const [currentPage, setCurrentPage] = useState(1);

  const filteredArticles = useMemo(() => {
    let result = articles;

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((a) => a.title?.toLowerCase().includes(q));
    }

    result = [...result].sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [articles, searchQuery, sortOrder]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredArticles.length / PAGE_SIZE),
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortOrder]);

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredArticles.slice(start, start + PAGE_SIZE);
  }, [filteredArticles, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  return {
    paginatedArticles,
    searchQuery,
    setSearchQuery,
    sortOrder,
    handleSortToggle,
    currentPage,
    totalPages,
    handlePageChange,
  };
}
