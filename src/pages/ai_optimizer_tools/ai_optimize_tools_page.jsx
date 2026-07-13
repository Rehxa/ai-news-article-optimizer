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
import { NameDialog } from "./components/name_dialog";
import { CustomDialog } from "../components/custom_dialog.jsx";
import { getMockArticleById } from "../../lib/data/mocks";
import { Article } from "../../lib/models/article";
import {
  getOptimizedStats,
  getOriginalStats,
} from "@/lib/utils/article_analysis_utils";

import { AIRequest } from "@/lib/utils/ai_utils.js";

import { useRouter, useParams } from "next/navigation";

import { useDebouncedSave } from "@/lib/hooks/useDebouncedSave.js";

import { useAuth } from "@/context/auth_context";
import { fetchWithAuth } from "@/app/api/auth/fetch_with_auth";
import SideBarGlobal from "@/pages/components/side_bar_global";

export default function ArticleOptimizerPage() {
  //params
  const { id } = useParams();
  const router = useRouter();
  // All state
  //UI
  const [showInput, setShowInput] = useState(true);
  const [showOptimize, setShowOptimize] = useState(true);
  const [showSuggestion, setShowSuggestion] = useState(true);
  const [showStat, setShowStat] = useState(true);
  const [showConfig, setShowConfig] = useState(false);
  const [showHighlight, setShowHighlight] = useState(false);
  const [showNameDialogPopup, setShowNameDialogPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  // Determine if sidebar renders at all
  const showSidebar = showSuggestion || showStat || showConfig || showHighlight;

  // DATA
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [docTitle, setDocTitle] = useState("");
  const [docDescription, setDocDescription] = useState("");
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

  const [article, setArticle] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading && !user) {
      console.log(authLoading, "and", user);
      router.replace("/views/login");
    }
    // const userId = "user_001";
    // const userId = user.uid;
  }, [authLoading, user, router]);

  // const article = useMemo(
  //   () => new Article(getMockArticleById("article_001")),
  //   [],
  // );

  // //init data
  // useEffect(() => {
  //   setInputText(article.content);
  //   setScore(article.aiScore);
  //   // setOutputText(article.content);
  // }, [article]);

  // const userId = "user_001";
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const userId = user.uid;

        setPageLoading(true);
        const res = await fetchWithAuth(
          `/api/articles?userId=${userId}&articleId=${id}`,
        );
        const data = await res.json();
        setArticle(new Article(data));
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setPageLoading(false);
      }
    };
    if (id) fetchArticle();
  }, [id]);

  // Debounced save for input text changes
  useDebouncedSave(inputText, 4000, (val) => {
    if (!id) return;
    fetchWithAuth(`/api/articles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "updateContent",
        content: val,
      }),
    });
  });
  // Debounced save for output text changes
  useDebouncedSave(outputText, 4000, (val) => {
    if (!id) return;
    fetchWithAuth(`/api/articles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "updateContent",
        optimizedContent: val,
      }),
    });
  });

  //initalize data when article is fetched
  useEffect(() => {
    if (!article) return;
    setInputText(article.content);
    setOutputText(article.optimizedContent || "");
    setScore(article.aiScore);
    setTone(article.overrideToneOfVoice || "professional");
    setDocTitle(article.title || "Untitled");
    setDocDescription(article.description);
  }, [article]);

  //Stats
  const optimizedStats = useMemo(
    () => getOptimizedStats(outputText),
    [outputText],
  );

  const originalStats = useMemo(() => getOriginalStats(inputText), [inputText]);

  const handleClearInput = () => setInputText("");

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

    await fetchWithAuth(`/api/articles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "updateContent",
        content: inputText,
        optimizedContent: rewrite,
      }),
    });
    await fetchWithAuth(`/api/articles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "updateScore", aiScore: score }),
    });

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

  const handleOptimizedScore = async () => {
    setLoading(true);
    const score = await AIRequest.score({ content: outputText });
    console.log(score);
    setScore(score);

    await fetchWithAuth(`/api/articles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "updateScore", aiScore: score }),
    });

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

  const handleAIDescription = async () => {
    setLoading(true);
    try {
      const description = await AIRequest.description({
        content: outputText || inputText,
      });
      // setDocDescription(description);
      console.log("AI generated description:", description);
      console.log("docDescription:", docDescription);
      return description;
    } catch (error) {
      console.error("Error generating AI description:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAs = async (title, description) => {
    try {
      setLoading(true);
      await fetchWithAuth(`/api/articles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateSaveAs",
          title: title,
          description: description,
        }),
      });
      setDocTitle(title);
      setDocDescription(description);
    } catch (error) {
      console.error("Error saving article:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = async () => {
    try {
      setLoading(true);
      await fetchWithAuth(`/api/articles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "softDelete" }),
      });
      router.push("/my_article");
    } catch (error) {
      console.error("Error deleting article:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToneOfVoice = async (e) => {
    const newTone = e.target.value;
    setTone(newTone);

    try {
      setLoading(true);
      await fetchWithAuth(`/api/articles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateTone",
          overrideToneOfVoice: newTone,
        }),
      });
    } catch (error) {
      console.error("Error tone of voice article:", error);
    } finally {
      setLoading(false);
    }
  };

  const [copied, setCopied] = useState(false);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div className="w-screen h-screen bg-natural-white flex items-start justify-start flex-row gap-2 overflow-hidden">
      {/* sidebar */}
      <SideBarGlobal mode={"article"} />
      {/* main content */}
      <div className="w-full h-full flex flex-col p-2 gap-2">
        {/* toolbar - Fixed text margins for alignment */}
        <Toolbar
          title={docTitle || "Untitled"}
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
            saveAs: () => {
              setShowNameDialogPopup(true);
            },
            delete: () => {
              setShowDeletePopup(true);
            },
            back: () => router.back(),
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
              onReOpimized={handleOptimizeAll}
              onSelectionChange={setSelection}
              selection={selection}
              setEditorActions={setEditorActions}
              onSelectiveReOpimized={handleOptimizedSuggestion}
              onCopy={handleCopy}
              copied={copied}
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
                <ConfigurePanel tone={tone} onToneOfVoice={handleToneOfVoice} />
              )}
            </div>
          )}
        </div>
      </div>
      {/* Name/Description Dialog  */}
      <NameDialog
        title="Name and Description"
        docTitle={docTitle}
        docDescription={docDescription}
        onConfirm={(title, description) => {
          handleSaveAs(title, description);
          setShowNameDialogPopup(false);
        }}
        onCancel={() => setShowNameDialogPopup(false)}
        isOpen={showNameDialogPopup}
        onAIDescription={handleAIDescription}
      />
      {/* Delete article dialog */}
      <CustomDialog
        title="Delete articles"
        message={`Are you sure you want to delete this articles?`}
        isDelete={true}
        icon={
          <img
            src="/assets/Inbox-cleanup-rafiki.svg"
            alt="Inbox-cleanup"
            className="w-[85%]"
          />
        }
        isOpen={showDeletePopup}
        onConfirm={handleDeleteArticle}
        onCancel={() => setShowDeletePopup(false)}
      />{" "}
    </div>
  );
}
