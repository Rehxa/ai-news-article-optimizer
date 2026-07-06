// src/app/page.js
export default function Home() {
  return (
    <div className="w-full h-screen bg-primary-blue flex items-center justify-start flex-col gap-6 p-10">
      <h1 className="text-4xl text-natural-white font-playwrite-gb-s-guides">
        TAILWIND V4 WORKS! 🎉
      </h1>
      <button className="flex items-center gap-2">button</button>
      <span className="material-symbols-outlined">check_circle</span>
      <span className="material-symbols-outlined">check</span>
      {/* shrink-0 stops parents from crushing your box dimensions */}
      <div className="h-32 w-32 shrink-0 bg-natural-sky-blue p-2">
        <div className="bg-accent-red h-10 w-10"></div>
      </div>
    </div>
  );
}
