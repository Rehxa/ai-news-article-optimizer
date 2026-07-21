import ProgressCircle from "@/pages/ai_optimizer_tools/components/progress_circle";
export default function StatPanel({
  optimizedWordCount,
  originalWordCount,
  readingTime,
  readability,
  aiScore,
  onOptimizedScore,
}) {
  console.log("word count opimize", optimizedWordCount);
  return (
    <div className="bg-tinted-white-blue rounded-xl shadow-md p-4 h-[42vh] grow flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-row items-center gap-4">
          <div className="material-symbols-outlined text-primary-blue">
            pie_chart
          </div>
          <h1 className="text-xl font-bold text-dark-brown">Stat</h1>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 flex-1">
        <div className="bg-natural-grey-blue flex flex-col justify-between items-center flex-1 rounded-lg text-primary-blue ">
          <h1 className="font-bold">optimize score</h1>
          <div className="grow flex justify-center items-center">
            <ProgressCircle
              score={aiScore}
              onOptimizedScore={onOptimizedScore}
            />
          </div>
        </div>
        <div className="bg-natural-grey-blue flex flex-col justify-between items-center flex-1 rounded-lg text-primary-blue ">
          <h1 className="font-bold">Word count</h1>
          <h1 className="font-bold">{optimizedWordCount} words</h1>
          <p className="text-xs">({originalWordCount} words in original)</p>
        </div>
        <div className="bg-natural-grey-blue flex flex-col justify-between items-center flex-1 rounded-lg text-primary-blue ">
          <h1 className="font-bold">Reading time</h1>
          <div className="flex flex-row gap-2 items-center flex-1">
            <div className="material-symbols-outlined text-primary-blue !text-3xl">
              alarm
            </div>
            <h1 className="font-bold text-xl">{readingTime} min</h1>
          </div>
        </div>
        <div className="bg-natural-grey-blue flex flex-col justify-between items-center flex-1 rounded-lg text-primary-blue ">
          <h1 className="font-bold ">Readability</h1>
          <div className="material-symbols-outlined text-primary-blue !text-3xl">
            book_ribbon
          </div>
          <h1 className="font-bold text-xs">{readability}</h1>
        </div>
      </div>
    </div>
  );
}
