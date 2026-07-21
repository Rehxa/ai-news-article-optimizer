"use client";
import AddNewCard from "@/pages/components/add_new_card";
import { CustomDialog } from "@/pages/components/custom_dialog.jsx";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth_context";
import { fetchWithAuth } from "@/app/api/auth/fetch_with_auth";
import { logout } from "@/lib/services/auth/auth_service.js";
import UserAvatar from "@/pages/components/avatar";

export default function SideBarGlobal({ mode }) {
  const router = useRouter();
  const { user } = useAuth();
  const [creating, setCreating] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const handleCreateArticle = async () => {
    if (creating) return;
    setCreating(true);
    try {
      const userId = user.uid;

      // Fetch the user's default tone first
      const userRes = await fetchWithAuth(`/api/users/${userId}`);
      if (!userRes.ok) throw new Error("Failed to fetch user");
      const userData = await userRes.json();
      // console.log("User", userData);

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
      console.log("Article created:", data);
      router.push(`/article/${data.id}`);
    } catch (error) {
      console.error("Error creating article:", error);
    } finally {
      setCreating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (mode === "article") {
    return (
      <div className="w-[4vw] h-full bg-primary-blue flex flex-col items-center justify-between px-4 py-4">
        {/* Top Section: Profile + Navigation items */}
        <div className="flex flex-col items-center justify-start gap-8 w-full">
          {/* <div className="material-symbols-outlined text-natural-white text-2xl">
            account_circle
          </div> */}
          <div
            onClick={() => router.push("/setting")}
            className="cursor-pointer"
          >
            <UserAvatar user={user} size={36} />
          </div>

          <div className="flex flex-col items-center justify-start gap-3 w-full">
            {/* quick start menu */}
            <div className="bg-dark-purple-blue px-5 py-2 rounded-xl flex flex-col items-center justify-center w-[90%] aspect-square">
              <button
                onClick={handleCreateArticle}
                className="material-symbols-outlined text-natural-grey-blue cursor-pointer"
              >
                add_circle
              </button>
            </div>

            {/* My articles menu */}
            <div className="bg-dark-purple-blue px-5 py-2 rounded-xl flex flex-col items-center justify-center gap-4 w-[90%]">
              <button
                onClick={() => router.push("/my_article")}
                className="material-symbols-outlined text-natural-grey-blue cursor-pointer"
              >
                folder
              </button>
              <button
                onClick={() => router.push("/recycle_bin")}
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
            onClick={() => router.push("/setting")}
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
  } else {
    return (
      <div className="w-[17vw] h-screen bg-primary-blue flex flex-col items-center p-4 gap-4">
        {/* Profile Section */}
        <div className="flex flex-col items-center gap-4">
          <div
            onClick={() => router.push("/setting")}
            className="cursor-pointer"
          >
            <UserAvatar user={user} size={50} />
          </div>

          <h3 className="text-xs font-bold text-white">{user.email}</h3>
        </div>

        {/* Main Content - grows to fill space */}
        <div className="flex-1 flex flex-col justify-between w-full max-w-sm">
          {/* Quick Station and My Work Section */}
          <div className="flex flex-col gap-4">
            {/* Quick Start Section */}
            <div className="bg-dark-purple-blue  rounded-xl p-3 flex flex-col gap-2">
              <h2 className="text-lg font-bold text-white">Quick start</h2>
              <button
                onClick={handleCreateArticle}
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
                  onClick={() => router.push("/my_article")}
                  icon="folder"
                  label="My Articles"
                  isActive={mode === "my_article"}
                />
                {/* Recycle Bin */}
                <SidebarTile
                  onClick={() => router.push("/recycle_bin")}
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
                onClick={() => router.push("/setting")}
                icon="settings"
                label="Setting"
                isActive={mode === "settings"}
              />
              {/* Log Out Button */}
              <button
                onClick={() => setShowLogoutPopup(true)}
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

        <CustomDialog
          title="Log Out"
          message="Are you sure you want to log out of this account?"
          isDelete={false}
          icon={
            <img
              src="/assets/Curious-amico.svg"
              alt="Inbox-cleanup"
              className="w-[85%]"
            />
          }
          isOpen={showLogoutPopup}
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutPopup(false)}
          isLogOut={true}
        />
      </div>
    );
  }
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
