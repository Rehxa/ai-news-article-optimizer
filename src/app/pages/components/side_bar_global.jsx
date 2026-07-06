"use client";
import AddNewCard from "@/app/pages/components/add_new_card";
export default function SideBarGlobal({
  mode,
  onAddnewArticle,
  onMyArticles,
  onRecycleBin,
  onSettings,
  onLogout,
}) {
  return (
    <div className="w-[17vw] h-screen bg-primary-blue flex flex-col items-center p-4 gap-4">
      {/* Profile Section */}
      <div className="flex flex-col items-center gap-4">
        <img
          src="/assets/profile.svg"
          alt="profile"
          className="w-15 h-15 rounded-full"
        />
        <h3 className="text-lg font-bold text-white">Name</h3>
      </div>

      {/* Main Content - grows to fill space */}
      <div className="flex-1 flex flex-col justify-between w-full max-w-sm">
        {/* Quick Station and My Work Section */}
        <div className="flex flex-col gap-4">
          {/* Quick Start Section */}
          <div className="bg-dark-purple-blue  rounded-xl p-3 flex flex-col gap-2">
            <h2 className="text-lg font-bold text-white">Quick start</h2>
            <button
              onClick={onAddnewArticle}
              className="bg-white rounded-xl px-1 py-1 flex items-center gap-4 hover:bg-gray-100 transition cursor-pointer"
            >
              <AddNewCard variant="small" />
              <span className="text-xs font-bold text-primary-blue">
                New article
              </span>
            </button>
          </div>
          {/* My Work Section */}
          <div className="bg-dark-purple-blue  rounded-xl p-3 flex flex-col gap-2">
            <h2 className="text-lg font-bold text-white">My work</h2>
            <div className="flex flex-col gap-1">
              {/* My Articles */}
              <SidebarTile
                onClick={onMyArticles}
                icon="folder"
                label="My Articles"
                isActive={mode === "my_article"}
              />
              {/* Recycle Bin */}
              <SidebarTile
                onClick={onRecycleBin}
                icon="delete"
                label="Recycle Bin"
                isActive={mode === "recycle_bin"}
              />
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="bg-dark-purple-blue  rounded-xl p-3 flex flex-col gap-2">
          <h2 className="text-lg font-bold text-white">Setting</h2>
          <div className="flex flex-col gap-1">
            {/* Settings Option */}
            <SidebarTile
              onClick={onSettings}
              icon="settings"
              label="Setting"
              isActive={mode === "settings"}
            />
            {/* Log Out Button */}
            <button
              onClick={onLogout}
              className="bg-dark-purple-blue  hover:bg-[#4A7BC4] border border-white rounded-lg px-1 py-1 flex items-center gap-3 transition justify-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-white text-lg">
                logout
              </span>
              <span className="text-xs font-bold text-white">Log out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
function SidebarTile({ onClick, icon, label, isActive = false }) {
  return (
    <button
      onClick={onClick}
      className={` border  rounded-lg px-1 py-1 flex items-center gap-3 transition cursor-pointer ${isActive ? "border-natural-grey-blue bg-natural-grey-blue" : "bg-dark-purple-blue  hover:bg-[#4A7BC4] border-dark-purple-blue"}`}
    >
      <span
        className={`material-symbols-outlined text-lg ${isActive ? "text-dark-purple-blue icon-fill " : "text-natural-grey-blue"}`}
      >
        {icon}
      </span>
      <span
        className={`text-xs font-bold text-dark-purple-blue ${isActive ? "text-dark-purple-blue" : "text-natural-grey-blue"}`}
      >
        {label}
      </span>
    </button>
  );
}
