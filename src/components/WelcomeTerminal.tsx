import { useState, useEffect } from 'react';

const lines = [
  { prompt: '> whoami', response: 'Tyler Miranda - Software Engineer' },
  { prompt: '> cat welcome.txt', response: "Hey! Welcome to my corner of the internet.\nClick around to explore my work, skills, and how to reach me." },
];

export function WelcomeTerminal() {
  const [displayedLines, setDisplayedLines] = useState<Array<{ prompt: string; response: string; showResponse: boolean }>>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isTypingPrompt, setIsTypingPrompt] = useState(true);

  useEffect(() => {
    if (currentLineIndex >= lines.length) return;

    const currentLine = lines[currentLineIndex];
    const targetText = isTypingPrompt ? currentLine.prompt : currentLine.response;

    if (currentCharIndex < targetText.length) {
      const timeout = setTimeout(() => {
        setCurrentCharIndex((prev) => prev + 1);
      }, isTypingPrompt ? 50 : 20);
      return () => clearTimeout(timeout);
    }

    // Finished typing current segment
    if (isTypingPrompt) {
      // Show response after prompt
      const timeout = setTimeout(() => {
        setDisplayedLines((prev) => [
          ...prev.slice(0, -1),
          { ...prev[prev.length - 1], showResponse: true },
        ]);
        setIsTypingPrompt(false);
        setCurrentCharIndex(0);
      }, 300);
      return () => clearTimeout(timeout);
    } else {
      // Move to next line
      const timeout = setTimeout(() => {
        setCurrentLineIndex((prev) => prev + 1);
        setIsTypingPrompt(true);
        setCurrentCharIndex(0);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [currentCharIndex, currentLineIndex, isTypingPrompt]);

  useEffect(() => {
    if (currentLineIndex < lines.length && isTypingPrompt && currentCharIndex === 0) {
      setDisplayedLines((prev) => [
        ...prev,
        { prompt: '', response: lines[currentLineIndex].response, showResponse: false },
      ]);
    }
  }, [currentLineIndex, isTypingPrompt, currentCharIndex]);

  return (
    <div className="bg-gray-900 text-green-400 font-mono text-sm p-4 rounded h-full overflow-auto">
      {displayedLines.map((line, i) => (
        <div key={i} className="mb-2">
          <div className="text-gray-400">
            {i === displayedLines.length - 1 && isTypingPrompt
              ? lines[currentLineIndex].prompt.slice(0, currentCharIndex)
              : line.prompt || lines[i]?.prompt}
            {i === displayedLines.length - 1 && isTypingPrompt && (
              <span className="animate-pulse">▋</span>
            )}
          </div>
          {line.showResponse && (
            <div className="text-green-400 whitespace-pre-wrap pl-2">
              {i === displayedLines.length - 1 && !isTypingPrompt
                ? line.response.slice(0, currentCharIndex)
                : line.response}
              {i === displayedLines.length - 1 && !isTypingPrompt && currentCharIndex < line.response.length && (
                <span className="animate-pulse">▋</span>
              )}
            </div>
          )}
        </div>
      ))}
      {currentLineIndex >= lines.length && (
        <div className="text-gray-400">
          {'> '}<span className="animate-pulse">▋</span>
        </div>
      )}
    </div>
  );
}
