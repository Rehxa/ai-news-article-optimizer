import { useState } from "react";
export default function ConfigPanel({ onToneOfVoice, tone }) {
  const handleToggle = (id) => {
    setSuggestions(
      suggestions.map((item) => (item.id === id ? { ...item } : item)),
    );
  };
  return (
    <div className="bg-tinted-white-blue rounded-xl shadow-md p-4 h-[42vh] grow shrink-0 flex flex-col justify-start gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-row items-center gap-4">
          <div className="material-symbols-outlined text-primary-blue">
            build
          </div>

          <h1 className="text-xl font-bold text-dark-brown">Configuration</h1>
        </div>
      </div>

      {/* <h3 className="font-bold">Instruction</h3>
      <div className="w-full rounded-lg bg-natural-white p-2 no-scrollbar border-1 border-primary-blue">
        <textarea
          name="content"
          id=""
          placeholder="Customize your own instruction"
          className="w-full h-full resize-none outline-none text-xs"
        ></textarea>
      </div> */}

      <div className="flex flex-col justify-start items-start gap-4">
        <h3 className="font-bold text-dark-brown">Tone of voice</h3>
        <select
          value={tone}
          onChange={onToneOfVoice}
          className="border-1 border-primary-blue rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-primary-blue"
        >
          <option value="professional">Professional</option>
          <option value="casual">Casual</option>
          <option value="journalistic">Journalistic</option>
          <option value="formal">Formal</option>
        </select>
      </div>

      {/* <div className="flex flex-row justify-end">
        <button className="w-1/3 bg-primary-blue text-white py-1 px-2 rounded-full hover:bg-blue-600">
          Confirm
        </button>
      </div> */}
    </div>
  );
}
