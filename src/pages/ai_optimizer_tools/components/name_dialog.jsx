import { useState } from "react";
import Loading from "@/pages/components/loading";

export function NameDialog({
  title = "Name and Description Document",
  docTitle = "",
  docDescription = "",
  onConfirm,
  onCancel,
  isOpen = true,
  onAIDescription,
  loading,
}) {
  if (!isOpen) return null;
  const [draftTitle, setDraftTitle] = useState(docTitle);
  const [draftDescription, setDraftDescription] = useState(docDescription);

  const handleAI = async () => {
    const generated = await onAIDescription(draftDescription);
    setDraftDescription(generated);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-natural-white rounded-2xl shadow-lg p-4 w-[40vw] min-w-94 max-w-200 border-2 border-primary-blue">
        {/* Header */}
        <div className="flex justify-center items-center pb-4">
          <h2 className="text-2xl font-bold text-dark-brown">{title}</h2>
        </div>

        {/* Divider */}
        <div className="border-b-2 border-primary-blue rounded-full"></div>

        {/* Content */}
        <div className="flex flex-col gap-0 text-center items-start justify-start mt-6 mb-6 space-y-4">
          <p
            className="text-dark-brown font-bold
           text-sm flex-3"
          >
            Name
          </p>
          <input
            type="text"
            placeholder="Enter name"
            className="border-1 border-primary-blue rounded-lg p-2 w-full focus:border-2 focus:border-primary-blue focus:outline-none"
            onChange={(e) => setDraftTitle(e.target.value)}
            value={draftTitle}
          />
          <div className="flex flex-row w-full items-center">
            <p
              className="block text-dark-brown font-bold
             text-sm mr-auto"
            >
              Description
            </p>
            <button
              onClick={handleAI}
              disabled={loading}
              className="px-3 py-2 bg-primary-blue  text-natural-white font-bold rounded-full hover:opacity-50 transition mt-2 text-sm"
            >
              {loading ? <Loading size={5} /> : "AI"}
            </button>
          </div>
          <div className="relative w-full flex flex-col gap-0">
            <textarea
              rows={3}
              type="text"
              placeholder="Enter description"
              className="border-1 border-primary-blue rounded-lg p-2 w-full focus:border-2 focus:border-primary-blue focus:outline-none flex-1 resize-none"
              onChange={(e) => setDraftDescription(e.target.value)}
              value={draftDescription}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-b-2 border-primary-blue mt-0 mb-6 rounded-full"></div>

        {/* Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-6 py-2 border-1 border-primary-blue font-bold rounded-full hover:bg-blue-50 transition text-primary-blue"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(draftTitle, draftDescription)}
            className="px-6 py-2 bg-primary-blue  text-natural-white font-bold rounded-full hover:opacity-50 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
