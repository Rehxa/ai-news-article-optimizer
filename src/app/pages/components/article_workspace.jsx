// lib/components/ArticleWorkspace.jsx
import SideBarGlobal from "@/app/pages/components/side_bar_global";
import ArticleCard from "@/app/pages/components/article_card";
import AddNewCard from "@/app/pages/components/add_new_card";
import Pagination from "@/app/pages/my_article/components/pagination";
export function ArticleWorkspace({
  articles,
  loading,
  mode,
  selectedIds,
  isSelectionState,
  onCardSelection,
  onCancelLongPress,
  toggleSelectionMode,
  handleSelectAll,
  handleDeletePopup,
  handleDeleteAllPopup,
  handleRestoreAllPopup,
  handleRestorePopup,
  onOpenArticle,
  onCreateArticle,
  searchQuery,
  onSearchChange,
  sortOrder,
  onSortToggle,
  currentPage,
  totalPages,
  onPageChange,
  totalCount,
}) {
  // console.log(
  //   "[STEP 4 - WORKSPACE CHECK]",
  //   articles.map((a) => ({
  //     id: a.id,
  //     title: a.title,
  //     selected: selectedIds.has(a.id),
  //   })),
  // );

  return (
    <>
      {/* Side Bar */}
      {/* <SideBarGlobal /> */}
      <div className="w-full h-screen flex flex-col justify-start p-5 gap-5 bg-natural-grey-blue">
        {/* Title */}
        <h1 className="font-bold text-5xl">
          {mode == "my_article" ? " My Article" : "Recycle Bin"}
        </h1>
        {/* Divider */}
        <div className="h-0.5 w-full bg-primary-blue rounded-full" />
        {totalCount === 0 && !loading && mode === "recycle_bin" && (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <img
              src="/assets/Inbox-cleanup-rafiki.svg"
              alt="Inbox-cleanup"
              className="w-[20%]"
            />
            <p className="text-lg font-medium text-gray-500 mt-4">
              No articles in the recycle bin.
            </p>
          </div>
        )}{" "}
        {totalCount === 0 && !loading && mode === "my_article" && (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <img
              src="/assets/Folder-rafiki.svg"
              alt="Inbox-cleanup"
              className="w-[20%]"
            />
            <p className="text-lg font-medium text-gray-500 mt-4">
              No articles in my article.
            </p>
          </div>
        )}{" "}
        {totalCount > 0 && (
          <>
            {/* Search */}
            <div className="flex flex-row justify-between items-center">
              <form
                // action="/search"
                // method="GET"
                className="relative flex flex-row justify-between items-center h-10 w-100 bg-natural-white rounded-2xl px-4 py-4  shadow-md"
              >
                <div className="flex flex-row items-center grow">
                  <div className="material-symbols-outlined text-primary-blue">
                    search
                  </div>
                  <input
                    type="search"
                    name="search-input"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-4 pr-4 py-2 bg-white rounded-lg outline-none text-sm grow"
                  />
                </div>
                <button
                  type="button"
                  onClick={onSortToggle}
                  title={sortOrder === "desc" ? "Newest first" : "Oldest first"}
                  className="material-symbols-outlined text-primary-blue"
                >
                  swap_vert
                </button>{" "}
                {/* <button className="material-symbols-outlined text-primary-blue">
                  filter_list
                </button> */}
              </form>
              {/* Selection */}
              <ButtonGroup
                isSelectionState={isSelectionState}
                mode={mode}
                selectedIds={selectedIds}
                selectionToggle={toggleSelectionMode}
                onDelete={handleDeletePopup}
                onDeleteAll={handleDeleteAllPopup}
                onRestoreAll={handleRestoreAllPopup}
                onRestore={handleRestorePopup}
                onSelectAll={() => handleSelectAll(articles.map((a) => a.id))}
              />
            </div>
            {/* Article Cards */}
            {/* <div className="grid grid-cols-5 grid-rows-3 gap-2"> */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(196px,1fr))] justify-center place-items-center gap-4 overflow-auto no-scrollbar">
              {/* tobe add */}
              {mode == "my_article" && <AddNewCard onClick={onCreateArticle} />}
              {/* <div className="flex flex-wrap gap-4 w-fit "> */}
              {articles.map((a) => (
                <ArticleCard
                  key={a.id}
                  title={a.title}
                  description={a.description}
                  updatedAt={a.updatedAt}
                  onLongPressed={() => onCardSelection(a.id)}
                  cancelLongPressed={onCancelLongPress}
                  isSelected={selectedIds.has(a.id)}
                  isSelectionState={isSelectionState}
                  mode={mode}
                  deletedAt={a.deletedAt}
                  onClick={() => {
                    if (!isSelectionState) {
                      onOpenArticle(a.id);
                    }
                  }}
                  isDeleted={a.deletedAt !== null || a.isInBin}
                />
              ))}
            </div>
            <div className="w-full bg-natural-grey-blue mt-auto">
              {/* <p>pagination</p> */}
              {/* <Pagination /> */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
function ButtonGroup({
  isSelectionState,
  mode,
  selectedIds,
  selectionToggle,
  onSelectAll,
  onDelete,
  onDeleteAll,
  onRestore,
  onRestoreAll,
}) {
  return (
    <div className="flex flex-row gap-4">
      <button
        onClick={selectionToggle}
        className="border-1 border-primary-blue flex flex-row gap-2 items-center rounded-full h-full px-4 py-2 cursor-pointer hover:opacity-50"
      >
        {/* My Article */}{" "}
        <h1 className="font-bold text-primary-blue">
          {isSelectionState ? selectedIds.size : ""} selected
        </h1>
        {isSelectionState && (
          <span className="material-symbols-rounded text-primary-blue">
            cancel
          </span>
        )}
      </button>
      {mode == "my_article" && isSelectionState && (
        <>
          <ActionButton
            color={"blue"}
            icon={"select_all"}
            label={"select all"}
            onClick={onSelectAll}
          />
          <ActionButton
            color={"red"}
            icon={"delete"}
            label={"delete"}
            onClick={onDelete}
          />
        </>
      )}

      {/* Recycle bin */}
      {mode == "recycle_bin" && (
        <>
          <ActionButton
            color={"blue"}
            icon={"restore_from_trash"}
            label={isSelectionState ? "restore" : "restore all"}
            onClick={isSelectionState ? onRestore : onRestoreAll}
          />
          <ActionButton
            color={"red"}
            icon={"delete"}
            label={isSelectionState ? "delete" : "delete all"}
            onClick={isSelectionState ? onDelete : onDeleteAll}
          />
        </>
      )}
    </div>
  );
}

function ActionButton({ icon, color, label, onClick }) {
  const colorClass =
    color === "red"
      ? "border-accent-red text-accent-red"
      : "border-primary-blue text-primary-blue";
  return (
    <button
      className={`border-1 ${colorClass} flex flex-row gap-2 items-center rounded-full px-4 py-2 cursor-pointer hover:opacity-50`}
      onClick={onClick}
    >
      <span className="material-symbols-rounded">{icon}</span>
      <h1 className="font-bold">{label}</h1>
    </button>
  );
}
