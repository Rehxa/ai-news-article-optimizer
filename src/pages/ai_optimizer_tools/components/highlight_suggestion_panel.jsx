import { useState } from "react";
export default function HighlightSuggestionPanel({
  selectiveSuggestions,
  onSelect,
  onOptimizedSuggestion,
}) {
  const [suggestions, setSuggestions] = useState([
    {
      id: 1,
      text: "Lorem ipsum dolor sit amet consectetur. Dictum neque sed faucibus mi eget varius. Nulla ullamcorper sapien lectus amet netus sit neque. Auctor viverra facilisis pulvinar urna in. ",
    },
    {
      id: 2,
      text: "Lorem ipsum dolor sit amet consectetur. Dictum neque sed faucibus mi eget varius. Nulla ullamcorper sapien lectus amet netus sit neque. Auctor viverra facilisis pulvinar urna in. ",
    },
    {
      id: 3,
      text: "Lorem ipsum dolor sit amet consectetur. Dictum neque sed faucibus mi eget varius. Nulla ullamcorper sapien lectus amet netus sit neque. Auctor viverra facilisis pulvinar urna in. ",
    },
    {
      id: 4,
      text: "Lorem ipsum dolor sit amet consectetur. Dictum neque sed faucibus mi eget varius. Nulla ullamcorper sapien lectus amet netus sit neque. Auctor viverra facilisis pulvinar urna in. ",
    },
    {
      id: 5,
      text: "Lorem ipsum dolor sit amet consectetur. Dictum neque sed faucibus mi eget varius. Nulla ullamcorper sapien lectus amet netus sit neque. Auctor viverra facilisis pulvinar urna in. ",
    }, // Keep spelling matching screenshot typo
  ]);

  return (
    <div className="bg-tinted-white-blue rounded-xl shadow-md p-4 flex h-[42vh] grow flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-row items-center gap-4">
          <div className="material-symbols-outlined text-primary-blue">
            highlight_mouse_cursor
          </div>

          <h1 className="text-xl font-bold text-dark-brown">Suggestion</h1>
        </div>

        <button
          onClick={onOptimizedSuggestion}
          className="flex items-center justify-center bg-natural-white rounded-xl w-8 aspect-square border-2 border-primary-blue box-border  cursor-pointer hover:opacity-90"
        >
          <div className="material-symbols-outlined text-primary-blue">
            cached
          </div>
        </button>
      </div>

      <div className=" rounded-lg bg-natural-white mb-2 p-2">
        <p className="text-xs font-bold text-dark-brown">
          select one suggestion to replace your selected text in the article
        </p>
      </div>

      <div className="w-full rounded-lg natural-white gap-2 overflow-y-auto grow flex flex-col">
        {selectiveSuggestions.map((sug, index) => (
          <HighlightSuggestionTile
            key={index}
            suggested={sug}
            onSelect={() => onSelect(sug)}
          />
        ))}
      </div>
    </div>
  );
}

function HighlightSuggestionTile({ suggested, onSelect }) {
  return (
    <button
      key={suggested.id}
      onClick={onSelect}
      className="w-full h-fit text-base bg-natural-grey-blue rounded-lg flex flex-row justify-between items-stretch mb-2 px-5 py-3 gap-4 cursor-pointer"
    >
      <div className="w-[8%] bg-primary-blue rounded-lg"></div>
      <span className="text-sm text-dark-brown text-left">
        {suggested.text}
      </span>
    </button>
  );
}
