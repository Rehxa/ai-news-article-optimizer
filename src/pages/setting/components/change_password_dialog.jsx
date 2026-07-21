"use client";
import { useState } from "react";
import InputField from "@/pages/components/input_field";

export function PasswordDialog({ onConfirm, onCancel, isOpen = true, error }) {
  if (!isOpen) return null;
  const [draftOldPassword, setDraftOldPassword] = useState("");
  const [draftNewPassword, setDraftNewPassword] = useState("");
  const [draftReEnterPassword, setDraftReEnterPassword] = useState("");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-natural-white rounded-2xl shadow-lg p-4 w-[70vw] min-w-94 max-w-135 border-2 border-primary-blue">
        {/* Header */}
        <div className="flex justify-center items-center pb-4">
          <h2 className="text-2xl font-bold text-dark-brown">Edit Password</h2>
          {/* <button
            onClick={onCancel}
            className="material-symbols-outlined text-primary-blue hover:opacity-50"
          >
            cancel
          </button> */}
        </div>

        {/* Divider */}
        <div className="border-b-2 border-primary-blue rounded-full"></div>

        {/* Content */}
        <div className="flex flex-row gap-4 text-center items-center mt-6 mb-6 space-y-4">
          {" "}
          <img
            src="/assets/OTP-amico.svg"
            alt="Reset password"
            className="w-[40%]"
          />
          <div className="bg-natural-grey-blue grow h-[30%] rounded-xl flex flex-col items-start justify-between gap-4 p-6">
            <h3 className="font-bold">Password</h3>
            {/* <input
              title="Older password"
              type="password"
              placeholder="Enter old password"
              className="border-1 border-primary-blue bg-natural-white rounded-lg p-2 w-full focus:border-2 focus:border-primary-blue focus:outline-none"
              onChange={(e) => setDraftOldPassword(e.target.value)}
              value={draftOldPassword}
            />
            <input
              type="password"
              placeholder="Enter new password"
              className="border-1 border-primary-blue bg-natural-white rounded-lg p-2 w-full focus:border-2 focus:border-primary-blue focus:outline-none"
              onChange={(e) => setDraftNewPassword(e.target.value)}
              value={draftNewPassword}
            />
            <input
              type="password"
              placeholder="Re-enter new password"
              className="border-1 border-primary-blue bg-natural-white rounded-lg p-2 w-full focus:border-2 focus:border-primary-blue focus:outline-none"
              onChange={(e) => setDraftReEnterPassword(e.target.value)}
              value={draftReEnterPassword}
            /> */}
            <form action="" className="flex  flex-col gap-4">
              <InputField
                id={"old password"}
                type={"password"}
                label={"Old password"}
                onChange={(e) => setDraftOldPassword(e.target.value)}
                value={draftOldPassword}
              />
              <InputField
                id={"new password"}
                type={"password"}
                label={"New password"}
                onChange={(e) => setDraftNewPassword(e.target.value)}
                value={draftNewPassword}
              />
              <InputField
                id={"confirm password"}
                type={"password"}
                label={"Confirm password"}
                onChange={(e) => setDraftReEnterPassword(e.target.value)}
                value={draftReEnterPassword}
              />
            </form>
          </div>
        </div>
        {error && (
          <div className="rounded-lg bg-red-100 text-accent-red p-3 mb-4">
            {error}
          </div>
        )}
        {/* Divider */}
        <div className="border-b-2 border-primary-blue mt-0 mb-6 rounded-full"></div>

        {/* Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-6 py-2 border-1  border-primary-blue font-bold rounded-full hover:bg-blue-50 transition text-primary-blue"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onConfirm(
                draftOldPassword,
                draftNewPassword,
                draftReEnterPassword,
              )
            }
            className="px-6 py-2: bg-primary-blue text-natural-white font-bold rounded-full hover:opacity-50 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
