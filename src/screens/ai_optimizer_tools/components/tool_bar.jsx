"use client";
import Loading from "@/screens/components/loading";

export default function ToolBar({ panels, onToggle, title, loading }) {
  return (
    <div className="bg-tinted-white-blue px-6  p-3 rounded-2xl shadow-md h-15 flex flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-4">
        <div className="flex flex-row gap-4">
          <button
            aria-label="Go back"
            title="Go back"
            onClick={onToggle.back}
            className="material-symbols-outlined text-3xl cursor-pointer text-primary-blue"
          >
            arrow_back
          </button>
          {loading ? (
            <Loading size={6} />
          ) : (
            <div className="material-symbols-outlined text-3xl cursor-pointer text-primary-blue">
              cloud_done
            </div>
          )}
        </div>

        <div className="material-symbols-outlined text-3xl text-primary-blue">
          library_books
        </div>

        <button
          onClick={onToggle.saveAs}
          className="relative h-7 overflow-hidden group w-[40vw] cursor-pointer"
        >
          <h2 className="text-2xl font-bold text-dark-brown text-start whitespace-nowrap transition-transform duration-1000 ease-linear group-hover:translate-x-[calc(-50%)] z-10">
            {title}
          </h2>
        </button>
      </div>

      <div className="flex flex-row items-center gap-3">
        <button
          onClick={onToggle.sideBar}
          aria-label="Side bar"
          title="Side bar"
          className={`material-symbols-outlined cursor-pointer ${panels.sideBar ? "text-primary-blue" : "text-accent-grey"}`}
        >
          cancel
        </button>
        <div className="h-6 w-[2px] bg-accent-grey rounded-lg"></div>
        <button
          onClick={onToggle.suggestion}
          aria-label="Suggestions"
          title="Suggestions"
          className={`material-symbols-outlined cursor-pointer ${panels.suggestion ? "text-primary-blue" : "text-accent-grey"}`}
        >
          tooltip
        </button>
        <button
          onClick={onToggle.highlight}
          aria-label="Highlight Suggestions"
          title="Highlight Suggestions"
          className={`material-symbols-outlined cursor-pointer ${panels.highlight ? "text-primary-blue" : "text-accent-grey"}`}
        >
          highlight_mouse_cursor
        </button>
        <div className="h-6 w-[2px] bg-accent-grey rounded-lg"></div>
        <button
          onClick={onToggle.stat}
          aria-label="Statistics"
          title="Statistics"
          className={`material-symbols-outlined cursor-pointer ${panels.stat ? "text-primary-blue" : "text-accent-grey"}`}
        >
          pie_chart
        </button>
        <button
          onClick={onToggle.config}
          aria-label="Configuration"
          title="Configuration"
          className={`material-symbols-outlined cursor-pointer ${panels.config ? "text-primary-blue" : "text-accent-grey"}`}
        >
          build
        </button>
        <div className="h-6 w-[2px] bg-accent-grey rounded-lg"></div>
        <button
          onClick={onToggle.input}
          aria-label="Input"
          title="Input"
          className={`material-symbols-outlined cursor-pointer ${panels.input ? "text-primary-blue" : "text-accent-grey"}`}
        >
          exit_to_app
        </button>
        <button
          onClick={onToggle.optimize}
          aria-label="Output"
          title="Output"
          className={`material-symbols-outlined cursor-pointer ${panels.optimize ? "text-primary-blue" : "text-accent-grey"}`}
        >
          output
        </button>
        <div className="h-6 w-[2px] bg-accent-grey rounded-lg"></div>
        <button
          onClick={onToggle.saveAs}
          aria-label="Save as"
          title="Save as"
          className="material-symbols-outlined text-primary-blue cursor-pointer"
        >
          save_as
        </button>
        <div className="h-6 w-[2px] bg-accent-grey rounded-lg"></div>
        <button
          onClick={onToggle.delete}
          aria-label="Delete"
          title="Delete"
          className="material-symbols-outlined text-accent-red cursor-pointer"
        >
          delete
        </button>
      </div>
    </div>
  );
}
