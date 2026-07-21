"use client";
import { useState } from "react";
import Loading from "@/pages/components/loading";

export function CustomDialog({
  title = "Delete articles",
  message = "Are you sure you still want to delete 3 selected items?",
  icon, // optional SVG/image
  onConfirm,
  onCancel,
  isOpen = true,
  isDelete = false,
  isLogOut = false,
  loading,
}) {
  const [disabled, setDisabled] = useState(false);

  const handleClick = () => {
    setDisabled(true);
    onConfirm();
    setTimeout(() => {
      setDisabled(false);
    }, 2000);
  };

  //   const handleClick = async () => {
  //   if (disabled) return;

  //   setDisabled(true);

  //   try {
  //     await onConfirm();
  //   } finally {
  //     setDisabled(false);
  //   }
  // };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-natural-white rounded-2xl shadow-lg p-4 w-[28vw] min-w-94 max-w-135 border-2 border-primary-blue">
        {/* Header */}
        <div className="flex justify-center items-center pb-4">
          <h2 className="text-2xl font-bold text-dark-brown">{title}</h2>
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
        <div
          className={`flex ${isLogOut ? "flex-col" : "flex-row"} gap-4 text-center items-center mt-6 mb-6 space-y-4`}
        >
          {icon && (
            <div className="flex justify-center flex-2 mb-0">{icon}</div>
          )}
          <p className="text-dark-brown text-sm flex-3">{message}</p>
        </div>

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
            onClick={handleClick}
            disabled={disabled}
            className={`px-6 py-2 ${isDelete ? "bg-accent-red" : "bg-primary-blue"}  text-natural-white font-bold rounded-full hover:opacity-50 transition disabled:opacity-30`}
          >
            {loading ? <Loading size={5} /> : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
