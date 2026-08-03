"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import SideBarGlobal from "@/screens/components/side_bar_global";
import ActionButton from "@/screens/components/action_button.jsx";
import { CustomDialog } from "@/screens/components/custom_dialog.jsx";
import { PasswordDialog } from "@/screens/setting/components/change_password_dialog";
import { User } from "@/lib/models";
import { useAuth } from "@/context/auth_context";
import { fetchWithAuth } from "@/app/api/auth/fetch_with_auth";
import InputField from "@/screens/components/input_field";
import UserAvatar from "@/screens/components/avatar";
import Loading from "@/screens/components/loading";

import {
  logout,
  changePassword,
  deleteAccount,
  canChangePassword,
} from "@/lib/services/auth/auth_service.js";

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

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const { user, loading: authLoading } = useAuth();

  const showChangePassword = canChangePassword();

  useEffect(() => {
    if (authLoading && !user) {
      router.replace("/views/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        setPageLoading(true);
        const res = await fetchWithAuth(`/api/users/${user.uid}`);
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setSetting(new User(data));
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setPageLoading(false);
      }
    };
    if (user.uid) fetchSetting();
  }, [user.uid]);

  useEffect(() => {
    if (!setting) return;
    setTone(setting.toneOfVoice);
    setEmail(setting.email);
  }, [setting]);

  const handleToneOfVoice = async (e) => {
    const newTone = e.target.value;
    setTone(newTone);
    const userId = user.uid;
    try {
      setLoading(true);
      await fetchWithAuth(`/api/users/${userId}`, {
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

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleConfirmDeleteAccount = async () => {
    setError(null);
    setLoading(true);

    try {
      await deleteAccount(password);
      await logout();
      router.push("/login");
    } catch (error) {
      switch (error.code) {
        case "auth/wrong-password":
        case "auth/invalid-credential":
          setError("Your password is incorrect.");
          break;
        case "auth/requires-recent-login":
          setError("Please log in again before deleting your account.");
          break;
        case "auth/popup-closed-by-user":
          setError("Google confirmation was cancelled.");
          break;
        case "auth/too-many-requests":
          setError("Too many attempts. Please try again later.");
          break;
        default:
          setError(
            error.message || "Failed to delete account. Please try again.",
          );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDeleteHistory = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetchWithAuth(`/api/users/${user.uid}/articles`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to clear history.");
      }

      setShowDeleteHistoryPopup(false);
    } catch (error) {
      console.error("Error clearing history:", error);
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (oldPass, newPass, confirmPass) => {
    setError(null);

    if (!oldPass || !newPass || !confirmPass) {
      setError("Please fill in all fields.");
      return;
    }
    if (newPass !== confirmPass) {
      setError("Passwords don't match.");
      return;
    }
    try {
      await changePassword(oldPass, newPass);
      setShowPasswordPopup(false);
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
          setError("Current old password is incorrect.");
          break;

        case "auth/weak-password":
          setError("New password is too weak.");
          break;

        case "auth/requires-recent-login":
          setError("Please sign in again and try changing your password.");
          break;

        default:
          setError(
            error.message || "Failed to change password. Please try again.",
          );
      }
    }
  };

  return (
    <div className="bg-natural-white w-screen h-screen flex justify-between items-center">
      <SideBarGlobal mode="settings" />

      <div className="w-full h-screen flex flex-col justify-start p-5 gap-5 bg-natural-white">
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
                <UserAvatar user={user} size={70} />

                {pageLoading ? (
                  <div className="flex flex-row justify-start">
                    <Loading size={8} />
                  </div>
                ) : (
                  <h3 className="font-bold text-base">{email}</h3>
                )}
              </div>

              <div className="flex flex-row justify-between items-center mt-auto gap-4">
                {showChangePassword && (
                  <ActionButton
                    color={"blue"}
                    label={"Edit Password"}
                    icon={"edit_square"}
                    onClick={() => setShowPasswordPopup(true)}
                    fill={true}
                  />
                )}
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
                  <option value="conversational">Conversational</option>
                  <option value="academic">Academic</option>
                  <option value="technical">Technical</option>
                  <option value="journalistic">Journalistic</option>
                  <option value="marketing">Marketing</option>
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
          <div className="w-full flex flex-row justify-between items-center gap-4">
            <div className="material-symbols-rounded text-accent-red !text-7xl !font-bold">
              delete
            </div>
            {showChangePassword && (
              <div className="flex flex-col mt-6">
                <InputField
                  id={"Confirm password"}
                  type={"password"}
                  label={"Required password"}
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  isDelete={true}
                />
                <div className="rounded text-accent-red text-xs p-1 mb-4">
                  {error ? error : ""}
                </div>
              </div>
            )}
          </div>
        }
        isOpen={showDeleteAccountPopup}
        onConfirm={handleConfirmDeleteAccount}
        onCancel={() => {
          setShowDeleteAccountPopup(false);
          setPassword("");
          setError("");
        }}
        isLogOut={true}
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
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutPopup(false)}
        isLogOut={true}
      />

      <PasswordDialog
        isOpen={showPasswordPopup}
        onConfirm={(oldPwd, newPwd, confirmPwd) =>
          handleResetPassword(oldPwd, newPwd, confirmPwd)
        }
        onCancel={() => {
          setShowPasswordPopup(false);
          setError("");
        }}
        error={error}
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
