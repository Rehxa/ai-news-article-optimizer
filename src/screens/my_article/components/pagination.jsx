"use client";

export default function Pagination({
  currentPage = 1,
  totalPages = 10,
  onPageChange = () => {},
}) {
  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Show pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Always show last page
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  const PaginationButton = ({
    children,
    onClick,
    isActive = false,
    disabled = false,
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-8 h-8 rounded-lg font-semibold text-sm
        flex items-center justify-center
        transition-colors duration-200
        ${
          isActive
            ? "bg-[#5281C7] text-white"
            : "bg-white border border-[#F1F1F1] text-[#404756] hover:bg-gray-50"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      {children}
    </button>
  );

  const IconButton = ({ icon, onClick, disabled = false, ariaLabel }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        w-8 h-8 rounded-lg
        flex items-center justify-center
        bg-white border border-[#F1F1F1]
        transition-colors duration-200
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-gray-50"}
      `}
    >
      <span className="material-symbols-rounded text-base text-[#404756]">
        {icon}
      </span>
    </button>
  );

  return (
    <div className="flex flex-row items-center justify-center gap-1.5 h-0">
      {/* First Page */}
      <IconButton
        icon="keyboard_double_arrow_left"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        ariaLabel="First page"
      />

      {/* Previous Page */}
      <IconButton
        icon="keyboard_arrow_left"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        ariaLabel="Previous page"
      />

      {/* Page Numbers */}
      {pages.map((page, idx) =>
        page === "..." ? (
          <div
            key={`ellipsis-${idx}`}
            className="text-[#404756] font-semibold text-sm"
          >
            ...
          </div>
        ) : (
          <PaginationButton
            key={page}
            isActive={page === currentPage}
            onClick={() => onPageChange(page)}
          >
            {page}
          </PaginationButton>
        ),
      )}

      {/* Next Page */}
      <IconButton
        icon="keyboard_arrow_right"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        ariaLabel="Next page"
      />

      {/* Last Page */}
      <IconButton
        icon="keyboard_double_arrow_right"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        ariaLabel="Last page"
      />
    </div>
  );
}
