"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import SideBarGlobal from "@/pages/components/side_bar_global";
import ActionButton from "@/pages/components/action_button.jsx";
import { CustomDialog } from "@/pages/components/custom_dialog.jsx";
import { PasswordDialog } from "@/pages/setting/components/reset_password_dialog";
import { User } from "@/lib/models";

export default function SettingPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [showDeleteAccountPopup, setShowDeleteAccountPopup] = useState(false);
  const [showDeleteHistoryPopup, setShowDeleteHistoryPopup] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);

  const [setting, setSetting] = useState(null);
  const [tone, setTone] = useState("");
  const [email, setEmail] = useState("");
  const userId = "user_001";

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        setPageLoading(true);
        const res = await fetch(`/api/users/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setSetting(new User(data));
        console.log("setting:" + setting);
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setPageLoading(false);
      }
    };
    if (userId) fetchSetting();
  }, [userId]);

  useEffect(() => {
    if (!setting) return;
    setTone(setting.toneOfVoice);
    setEmail(setting.email);
  }, [setting]);

  const handleCreateArticle = async () => {
    try {
      const userId = "user_001";

      // Fetch the user's default tone first
      const userRes = await fetch(`/api/users/${userId}`);
      if (!userRes.ok) throw new Error("Failed to fetch user");
      const user = await userRes.json();
      console.log("User", user);

      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          title: "Untitled Article",
          description: "",
          content: "",
          overrideToneOfVoice: user.toneOfVoice,
        }),
      });
      if (!res.ok) throw new Error("Failed to create article");

      const data = await res.json(); // { id, message }
      console.log("Article created:", data);
      router.push(`/views/article/${data.id}`);
    } catch (error) {
      console.error("Error creating article:", error);
    }
  };

  const handleToneOfVoice = async (e) => {
    const newTone = e.target.value;
    setTone(newTone);
    try {
      setLoading(true);
      await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toneOfVoice: newTone,
        }),
      });
    } catch (error) {
      console.error("Error tone of voice article:", error);
    } finally {
      setLoading(false);
    }
  };

  // todo need auth
  const handleConfirmDeleteAccount = () => {};
  const handleConfirmDeleteHistory = () => {};
  const handleConfirmLogout = () => {};
  const handleResetPassword = () => {};

  return (
    <div className="bg-natural-white w-screen h-screen flex justify-between items-center">
      <SideBarGlobal
        onMyArticles={() => router.push("/views/my_article")}
        onRecycleBin={() => router.push("/views/recycle_bin")}
        mode="settings"
        onAddnewArticle={handleCreateArticle}
      />

      <div className="w-full h-screen flex flex-col justify-start p-5 gap-5 bg-natural-grey-blue">
        {/* Title */}
        <h1 className="font-bold text-5xl">Settings</h1>
        {/* Divider */}
        <div className="h-0.5 w-full bg-primary-blue rounded-full" />
        <div className="flex flex-col gap-4">
          {/* User Account */}
          <div className="w-full bg-tinted-white-blue shadow-lg flex-1 rounded-2xl p-6 gap-6">
            <h2 className="font-semibold text-xl">User Account</h2>
            <div className="h-0.5 w-full bg-primary-blue rounded-full mt-2" />
            <div className="flex flex-row justify-between items-center mt-6">
              <div className="flex flex-row flex-1 gap-4 items-center">
                <img
                  src="/assets/profile.svg"
                  alt="User Icon"
                  className="block"
                />
                <h3 className="font-bold text-base">{email}</h3>
              </div>

              <div className="flex flex-row justify-between items-center mt-auto gap-4">
                <ActionButton
                  color={"blue"}
                  label={"Edit"}
                  icon={"edit_square"}
                  onClick={() => setShowPasswordPopup(true)}
                  fill={true}
                />
                <ActionButton
                  color={"blue"}
                  label={"Log out"}
                  icon={"logout"}
                  onClick={() => setShowLogoutPopup(true)}
                />
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-row gap-6">
            <div className="h-full bg-tinted-white-blue shadow-lg flex-2 rounded-2xl p-6">
              {/* Danger zone */}
              <h2 className="font-semibold text-xl">Danger zone</h2>
              <div className="h-0.5 w-full bg-accent-red rounded-full mt-2" />
              <div className="flex flex-row justify-between items-center pt-6">
                <div className="flex flex-col w- full flex-1 justify-between items-start gap-12">
                  {" "}
                  <ActionButton
                    color={"red"}
                    label={"Delete account"}
                    icon={"delete"}
                    onClick={() => setShowDeleteAccountPopup(true)}
                  />
                  <ActionButton
                    color={"red"}
                    label={"Delete history"}
                    icon={"delete_history"}
                    onClick={() => setShowDeleteHistoryPopup(true)}
                  />
                </div>
                <div className="flex flex-col w- full flex-2 justify-between items-center gap-4">
                  {" "}
                  <WarningTile isDeleteAccount={true} />
                  <WarningTile isDeleteAccount={false} />
                </div>
              </div>
            </div>
            {/* AI configuration */}
            <div className="h-full bg-tinted-white-blue shadow-lg flex-1 rounded-2xl p-6">
              <h2 className="font-bold text-xl">AI Configuration</h2>
              <div className="h-0.5 w-full bg-primary-blue rounded-full mt-2" />
              <div className="flex flex-col justify-between items-start gap-4 mt-4">
                <h3 className="font-semibold text-lg">Default tone of voice</h3>
                <select
                  value={tone}
                  onChange={handleToneOfVoice}
                  className="border-1 border-primary-blue rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-primary-blue"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="journalistic">Journalistic</option>
                  <option value="formal">Formal</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CustomDialog
        title="Delete account"
        message="This action will lead to account deleted with no recovery. Are you sure you still want to delete it?"
        isDelete={true}
        icon={
          <div className="material-symbols-rounded text-accent-red !text-7xl !font-bold">
            delete
          </div>
        }
        isOpen={showDeleteAccountPopup}
        onConfirm={handleConfirmDeleteAccount}
        onCancel={() => setShowDeleteAccountPopup(false)}
      />

      <CustomDialog
        title="Delete history"
        message="This action will lead to articles, drafts and recycle bin to be deleted with no recovery. Are you sure you still want to delete it?"
        isDelete={true}
        icon={
          <div className="material-symbols-rounded text-accent-red !text-7xl !font-bold">
            delete_history
          </div>
        }
        isOpen={showDeleteHistoryPopup}
        onConfirm={handleConfirmDeleteHistory}
        onCancel={() => setShowDeleteHistoryPopup(false)}
      />

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
        onConfirm={handleConfirmLogout}
        onCancel={() => setShowLogoutPopup(false)}
        isLogOut={true}
      />

      <PasswordDialog
        isOpen={showPasswordPopup}
        onConfirm={handleResetPassword}
        onCancel={() => setShowPasswordPopup(false)}
      />
    </div>
  );
}

function WarningTile({ isDeleteAccount }) {
  return (
    <div className="w-full h-fit text-base bg-[#FFC2C2] rounded-2xl flex flex-row justify-between items-stretch mb-2 px-5 py-3 gap-4">
      <div className="w-[2%] bg-natural-white rounded-lg"></div>
      <span className="text-sm text-dark-brown text-left">
        {isDeleteAccount
          ? "Warning: this action would lead  to account deletion and all the the data within"
          : "Warning: this action would clear all historical data with in this account"}
      </span>
    </div>
  );
}
