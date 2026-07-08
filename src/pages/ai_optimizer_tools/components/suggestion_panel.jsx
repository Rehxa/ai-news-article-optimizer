import { useState } from "react";
export default function SuggestionPanel({
  suggestions,
  setSuggestions,
  onHandleSuggestions,
}) {
  // const [suggestions, setSuggestions] = useState([
  //   { id: 1, text: "Add reference link for the current topic", checked: false },
  //   { id: 2, text: "Needed additional question and context", checked: false },
  //   {
  //     id: 3,
  //     text: "Simplify some complex sentences and topics to be at least below 4 or 5 sentences.",
  //     checked: false,
  //   },
  //   { id: 4, text: "Need more sources and references", checked: true },
  //   { id: 5, text: "Improve H2 for more clarificaiton", checked: true }, // Keep spelling matching screenshot typo
  // ]);

  const handleToggle = (id) => {
    setSuggestions(
      suggestions.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    );
  };
  return (
    <div className="bg-tinted-white-blue rounded-xl shadow-md p-4 h-[42vh] grow flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-row items-center gap-4">
          <div className="material-symbols-outlined text-primary-blue">
            tooltip
          </div>
          <h1 className="text-xl font-bold text-dark-brown">Suggestion</h1>
        </div>
        {suggestions.length > 0 && (
          <button
            onClick={onHandleSuggestions}
            className="flex items-center justify-center bg-natural-white rounded-xl w-8 aspect-square border-2 border-primary-blue box-border cursor-pointer hover:opacity-90"
          >
            <div className="material-symbols-outlined text-primary-blue">
              cached
            </div>
          </button>
        )}
      </div>
      <div className="w-full rounded-lg gap-2 overflow-y-auto grow">
        {suggestions.map((sug) => suggestionTile(sug))}
      </div>
    </div>
  );

  function suggestionTile(suggested) {
    return (
      <button
        key={suggested.id}
        onClick={() => handleToggle(suggested.id)}
        className="w-full text-base bg-natural-grey-blue rounded-lg flex flex-row justify-between items-center mb-2 px-4 py-2 gap-4 cursor-pointer"
      >
        <div className="material-symbols-outlined text-primary-blue cursor-pointer">
          {suggested.checked ? "check_box" : "check_box_outline_blank"}
        </div>
        <span className="text-sm text-dark-brown text-left">
          {suggested.text}
        </span>
      </button>
    );
  }
}
