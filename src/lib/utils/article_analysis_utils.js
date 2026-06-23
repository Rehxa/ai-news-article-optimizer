export const getOriginalStats = (content) => {
  return {
    originalWordCount: getWordCount(content),
  };
};

export const getOptimizedStats = (content) => {
  return {
    optimizedWordCount: getWordCount(content),
    readability: getReadabilityDifficulty(content),
    estimateReadTime: estimateReadTime(content),
  };
};

//Estimate Reading Time
const estimateReadTime = (text = "") => {
  const wordsPerMinute = 200; // Average reading speed
  const words = getWordCount(text);
  if (words == 0) return 0;

  return Math.max(1, Math.ceil(words / wordsPerMinute));
};

// Readbility
export function getReadabilityDifficulty(text = "") {
  const score = getFleschReadingEase(text);
  // Grade 5th
  if (score >= 90) return "Very Easy";
  //Grade 6th
  if (score >= 80) return "Easy";
  //Grade 7th
  if (score >= 70) return "Fairly Easy";
  //Grade 8th & 9th
  if (score >= 60) return "Standard";
  //Grade 10th - 12th
  if (score >= 50) return "Fairly Difficult";
  //College
  if (score >= 30) return "Difficult";
  //College
  if (score >= 10) return "Very Difficult";
  //No input
  if (score == 0) return "Required Text Input";
  //Professional
  return "Extremely Difficult";
}

// Readbility  (Flesch Reading Ease formula)
export function getFleschReadingEase(text = "") {
  const words = getWordCount(text);
  const sentences = getSentenceCount(text);
  const syllables = getTotalSyllables(text);

  if (words === 0 || sentences === 0) return 0;

  const score =
    206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);

  return Math.round(score * 10) / 10;
}

// word count
export function getWordCount(text = "") {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function getSentenceCount(text = "") {
  return text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
}

export function countSyllables(word = "") {
  word = word.toLowerCase().replace(/[^a-z]/g, "");

  if (word.length <= 3) return 1;

  const vowels = word.match(/[aeiouy]+/g);
  let count = vowels ? vowels.length : 1;

  // silent "e"
  if (word.endsWith("e")) count--;

  return count > 0 ? count : 1;
}

export function getTotalSyllables(text = "") {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .reduce((sum, word) => sum + countSyllables(word), 0);
}
