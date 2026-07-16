import Loading from "@/pages/components/loading";
export default function SuggestionPanel({
  suggestions,
  setSuggestions,
  onHandleSuggestions,
  loading,
  isOutputText,
}) {
  const handleToggle = (id) => {
    setSuggestions(
      suggestions.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    );
  };

  const showReloadButton = () => suggestions.length > 0 || !isOutputText;

  return (
    <div className="bg-tinted-white-blue rounded-xl shadow-md p-4 h-[42vh] grow flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-row items-center gap-4">
          <div className="material-symbols-outlined text-primary-blue">
            tooltip
          </div>
          <h1 className="text-xl font-bold text-dark-brown">
            Content Suggestion
          </h1>
        </div>
        {showReloadButton && (
          <button
            onClick={onHandleSuggestions}
            disabled={loading}
            className="flex items-center justify-center bg-natural-white rounded-xl w-8 aspect-square border-2 border-primary-blue box-border cursor-pointer hover:opacity-90 disabled:border-accent-grey"
          >
            <div
              className={`material-symbols-outlined ${loading ? "text-accent-grey" : "text-primary-blue"}`}
            >
              cached
            </div>
          </button>
        )}
      </div>

      {suggestions?.length == 0 && !loading && (
        <div className=" rounded-lg bg-natural-grey-blue mb-2 p-2 place-self-center">
          <p className="text-xs font-bold text-dark-brown">
            Optimize content in the output text field needed in order to
            generate suggestion
          </p>
        </div>
      )}

      <div className="w-full rounded-lg gap-2 overflow-y-auto grow">
        {loading ? (
          <Loading />
        ) : (
          suggestions.map((sug) => !loading && suggestionTile(sug))
        )}
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
