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

      <div className="flex flex-col justify-start items-start gap-4">
        <h3 className="font-bold text-dark-brown">Tone of voice</h3>
        <select
          value={tone}
          onChange={onToneOfVoice}
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

      <div className="w-full h-fit text-base bg-natural-grey-blue rounded-2xl flex flex-row justify-between items-stretch mb-2 px-5 py-3 gap-4">
        <span className="text-sm text-dark-brown text-left">
          After configuration, you can re-optimize the content again to see the
          new tone result
        </span>
      </div>
    </div>
  );
}
