export default function ActionButton({ icon, color, label, onClick, fill }) {
  const colorClass =
    color === "red"
      ? fill
        ? "bg-accent-red text-natural-white"
        : "border-accent-red text-accent-red"
      : fill
        ? "bg-primary-blue text-natural-white"
        : "border-primary-blue text-primary-blue";

  return (
    <button
      className={`border-1 ${colorClass} flex flex-row gap-2 items-center rounded-full px-4 py-2 cursor-pointer hover:opacity-50`}
      onClick={onClick}
    >
      <span className="material-symbols-rounded">{icon}</span>
      <h1 className="font-bold text-nowrap">{label}</h1>
    </button>
  );
}
