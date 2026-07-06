export default function Sidebar({ onToggle }) {
  return (
    <div className="w-[4vw] h-full bg-primary-blue flex flex-col items-center justify-between px-4 py-4">
      {/* Top Section: Profile + Navigation items */}
      <div className="flex flex-col items-center justify-start gap-8 w-full">
        <div className="material-symbols-outlined text-natural-white text-2xl">
          account_circle
        </div>

        <div className="flex flex-col items-center justify-start gap-3 w-full">
          {/* quick start menu */}
          <div className="bg-dark-purple-blue px-5 py-2 rounded-xl flex flex-col items-center justify-center w-[90%] aspect-square">
            <button
              onClick={onToggle.addNewArticle}
              className="material-symbols-outlined text-natural-grey-blue cursor-pointer"
            >
              add_circle
            </button>
          </div>

          {/* My articles menu */}
          <div className="bg-dark-purple-blue px-5 py-2 rounded-xl flex flex-col items-center justify-center gap-4 w-[90%]">
            <button
              onClick={onToggle.myArticles}
              className="material-symbols-outlined text-natural-grey-blue cursor-pointer"
            >
              folder
            </button>
            <button
              onClick={onToggle.recycleBin}
              className="material-symbols-outlined text-natural-grey-blue cursor-pointer"
            >
              delete
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Settings */}
      <div className="bg-dark-purple-blue px-5 py-2 rounded-xl flex flex-col items-center justify-center gap-4 w-[90%]">
        <button
          onClick={onToggle.settings}
          className="material-symbols-outlined text-natural-grey-blue cursor-pointer"
        >
          settings
        </button>
        <div className="material-symbols-outlined text-natural-grey-blue cursor-pointer">
          logout
        </div>
      </div>
    </div>
  );
}
