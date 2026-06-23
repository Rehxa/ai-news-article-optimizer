"use client";
import { useState, useEffect, useMemo } from "react";
import Sidebar from "./components/side_bar";
import Toolbar from "./components/tool_bar";
import InputPanel from "./components/input_panel";
import OutputPanel from "./components/output_panel";
import SuggestionPanel from "./components/suggestion_panel";
import StatPanel from "./components/stat_panel";
import HighlightSuggestionPanel from "./components/highlight_suggestion_panel";
import ConfigurePanel from "./components/configure_panel";
import { getMockArticleById } from "../../../lib/data/mocks";
import { Article } from "../../../lib/models/article";
import {
  getOptimizedStats,
  getOriginalStats,
} from "@/lib/utils/article_analysis_utils";

import { AIRequest } from "@/lib/utils/ai_utils.js";
import { content } from "../../../../tailwind.config";

export default function ArticleOptimizerPage() {
  // All state
  //UI
  const [showInput, setShowInput] = useState(true);
  const [showOptimize, setShowOptimize] = useState(true);
  const [showSuggestion, setShowSuggestion] = useState(true);
  const [showStat, setShowStat] = useState(true);
  const [showConfig, setShowConfig] = useState(false);
  const [showHighlight, setShowHighlight] = useState(false);
  // Determine if sidebar renders at all
  const showSidebar = showSuggestion || showStat || showConfig || showHighlight;

  // DATA
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tone, setTone] = useState("professional");
  // const [customInstructions, setCustomInstructions] = useState("");
  // const [articleContent, setArticleContent] = useState("");
  const [outputText, setOutputText] = useState("");
  const [inputText, setInputText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selection, setSelection] = useState(null);
  // const [lastReplacement, setLastReplacement] = useState(null);
  const [selectiveSuggestions, setSelectiveSuggestions] = useState([]);
  const [editorActions, setEditorActions] = useState(null);
  //Stat
  const [score, setScore] = useState(0);

  const article = useMemo(
    () => new Article(getMockArticleById("article_001")),
    [],
  );

  //init data
  useEffect(() => {
    setInputText(article.content);
    setScore(article.aiScore);
    // setOutputText(article.content);
  }, [article]);

  //! need changes
  const displayArticle = useMemo(() => {
    return new Article({
      ...article,
      content: inputText,
      optimizedContent: outputText,
      aiScore: score,
    });
  }, [inputText, outputText, article, score]);

  //Stats
  const optimizedStats = useMemo(
    () => getOptimizedStats(outputText),
    [outputText],
  );

  const originalStats = useMemo(() => getOriginalStats(inputText), [inputText]);

  // const displayArticle = useMemo(() => {
  //   return new Article({
  //     ...article.toJSON(),
  //     content: inputText,
  //     optimizedContent: outputText,
  //   });
  // }, [inputText, outputText, article]);

  // const handleInputTextChange = (e) => {
  //   setInputText(e.target.value);
  // };

  const handleClearInput = () => setInputText("");

  // const handleOutputTextChange = (e) => {
  //   setOutputText(e.target.value);
  // };

  const handleOptimizeAll = async () => {
    setLoading(true);

    const rewrite = await AIRequest.rewrite({ content: inputText, tone: tone });

    const [suggest, score] = await Promise.all([
      AIRequest.suggest({ content: rewrite }),
      AIRequest.score({ content: rewrite }),
    ]);

    const cleaned = suggest
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    console.log(score);
    setOutputText(rewrite);
    setScore(score);
    setSuggestions(
      parsed.map((item, index) => ({
        id: index + 1,
        checked: false,
        text: item.text,
      })),
    );

    setShowHighlight(false);
    setShowConfig(false);
    setShowOptimize(true);
    setShowSuggestion(true);
    setShowStat(true);

    setLoading(false);
  };

  const handleSuggestions = async () => {
    setLoading(true);
    const suggest = await AIRequest.suggest({ content: outputText });

    console.log(suggest);

    const cleaned = suggest
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    setSuggestions(
      parsed.map((item, index) => ({
        id: index + 1,
        checked: false,
        text: item.text,
      })),
    );

    setShowHighlight(false);
    setShowSuggestion(true);

    setLoading(false);
  };

  const handleOptimizedSuggestion = async () => {
    setLoading(true);
    console.log("send selective suggestion");
    console.log("selection:", selection);
    console.log("type:", typeof selection);
    const suggestion = await AIRequest.selectiveSuggestion({
      content: selection.text,
    });

    console.log(suggestion);

    const cleaned = suggestion
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);
    setSelectiveSuggestions(
      parsed.map((item, index) => ({
        id: index + 1,
        text: item.text,
      })),
    );

    console.log(selectiveSuggestions);
    setShowSuggestion(false);
    setShowHighlight(true);

    setLoading(false);
  };

  const handleOptimized = async () => {
    setLoading(true);
    const rewrite = await AIRequest.rewrite({ content: inputText, tone: tone });
    setOutputText(rewrite);
    setShowOptimize(true);
    setLoading(false);
  };
  const handleOptimizedScore = async () => {
    setLoading(true);
    const score = await AIRequest.score({ content: outputText });
    console.log(score);
    setScore(score);
    setShowConfig(false);
    setShowStat(true);
    setLoading(false);
  };

  const handleSelectSuggestion = (suggestion) => {
    editorActions?.replaceSelection(
      selection.from,
      selection.to,
      suggestion.text,
    );
  };

  return (
    <div className="w-screen h-screen bg-natural-white flex items-start justify-start flex-row gap-2 overflow-hidden">
      {/* sidebar */}
      <Sidebar />

      {/* main content */}
      <div className="w-full h-full flex flex-col p-2 gap-2">
        {/* toolbar - Fixed text margins for alignment */}
        <Toolbar
          panels={{
            input: showInput,
            optimize: showOptimize,
            suggestion: showSuggestion,
            stat: showStat,
            config: showConfig,
            highlight: showHighlight,
            sideBar: showSidebar,
          }}
          onToggle={{
            input: () => setShowInput(!showInput),
            optimize: () => setShowOptimize(!showOptimize),
            suggestion: () => {
              if (!showHighlight && !showSuggestion) {
                setShowHighlight(false);
                setShowSuggestion(true);
                setShowStat(true);
              } else {
                setShowSuggestion(!showSuggestion);
                setShowHighlight(!showHighlight);
              }
            },
            stat: () => {
              if (!showStat && !showConfig) {
                setShowConfig(false);
                setShowStat(true);
                setShowSuggestion(true);
              } else {
                setShowStat(!showStat);
                setShowConfig(!showConfig);
              }
            },
            config: () => {
              if (!showStat && !showConfig) {
                setShowStat(false);
                setShowConfig(true);
                setShowSuggestion(true);
              } else {
                setShowConfig(!showConfig);
                setShowStat(!showStat);
              }
            },
            highlight: () => {
              if (!showHighlight && !showSuggestion) {
                setShowSuggestion(false);
                setShowHighlight(true);
                setShowStat(true);
              } else {
                setShowHighlight(!showHighlight);
                setShowSuggestion(!showSuggestion);
              }
            },
            sideBar: () => {
              setShowSuggestion(false);
              setShowConfig(false);
              setShowStat(false);
              setShowHighlight(false);
            },
          }}
        />

        {/* editor component */}
        <div className="w-full h-full flex items-center justify-center gap-4">
          {showInput && (
            <InputPanel
              value={inputText}
              onChange={setInputText}
              loading={loading}
              onHandleOptimize={handleOptimizeAll}
              onClear={handleClearInput}
            />
          )}
          {showOptimize && (
            <OutputPanel
              value={outputText}
              onChange={setOutputText}
              onReOpimized={handleOptimized}
              onSelectionChange={setSelection}
              selection={selection}
              setEditorActions={setEditorActions}
              onSelectiveReOpimized={handleOptimizedSuggestion}
            />
          )}
          {showSidebar && (
            <div className="max-h-full min-h-full w-[24vw] shrink-0 gap-4 flex flex-col justify-between">
              {showSuggestion && (
                <SuggestionPanel
                  suggestions={suggestions}
                  setSuggestions={setSuggestions}
                  onHandleSuggestions={handleSuggestions}
                />
              )}

              {showHighlight && (
                <HighlightSuggestionPanel
                  selectiveSuggestions={selectiveSuggestions}
                  onSelect={handleSelectSuggestion}
                  onOptimizedSuggestion={handleOptimizedSuggestion}
                />
              )}
              {/* stat needs to be state to be responded instead */}
              {showStat && (
                <StatPanel
                  aiScore={score}
                  readability={optimizedStats.readability}
                  optimizedWordCount={optimizedStats.optimizedWordCount}
                  originalWordCount={originalStats.originalWordCount}
                  readingTime={optimizedStats.estimateReadTime}
                  onOptimizedScore={handleOptimizedScore}
                />
              )}
              {showConfig && (
                <ConfigurePanel
                  tone={tone}
                  onToneOfVoice={(e) => setTone(e.target.value)}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
