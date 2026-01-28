import { useState, useEffect } from 'react';

const terminalLines = [
  { prompt: '> whoami', response: 'Tyler Miranda - Senior VDI Platform Engineer' },
  { prompt: '> cat welcome.txt', response: "Hey! Welcome to my corner of the internet.\nClick around to explore my work, skills, and how to reach me." },
];

interface DisplayLine {
  prompt: string;
  response: string;
  promptComplete: boolean;
  responseComplete: boolean;
}

export function WelcomeTerminal() {
  const [displayedLines, setDisplayedLines] = useState<DisplayLine[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function typeText() {
      for (let lineIdx = 0; lineIdx < terminalLines.length; lineIdx++) {
        if (cancelled) return;

        const line = terminalLines[lineIdx];

        // Add new line entry
        setDisplayedLines(prev => [...prev, {
          prompt: '',
          response: line.response,
          promptComplete: false,
          responseComplete: false
        }]);

        // Type prompt character by character
        for (let charIdx = 0; charIdx <= line.prompt.length; charIdx++) {
          if (cancelled) return;
          await new Promise(resolve => setTimeout(resolve, 50));
          setDisplayedLines(prev => {
            const updated = [...prev];
            updated[lineIdx] = {
              ...updated[lineIdx],
              prompt: line.prompt.slice(0, charIdx)
            };
            return updated;
          });
        }

        // Mark prompt complete, pause before response
        setDisplayedLines(prev => {
          const updated = [...prev];
          updated[lineIdx] = { ...updated[lineIdx], promptComplete: true };
          return updated;
        });
        await new Promise(resolve => setTimeout(resolve, 300));

        // Type response character by character
        for (let charIdx = 0; charIdx <= line.response.length; charIdx++) {
          if (cancelled) return;
          await new Promise(resolve => setTimeout(resolve, 20));
          setDisplayedLines(prev => {
            const updated = [...prev];
            updated[lineIdx] = {
              ...updated[lineIdx],
              response: line.response.slice(0, charIdx)
            };
            return updated;
          });
        }

        // Mark response complete
        setDisplayedLines(prev => {
          const updated = [...prev];
          updated[lineIdx] = { ...updated[lineIdx], responseComplete: true };
          return updated;
        });

        await new Promise(resolve => setTimeout(resolve, 500));
      }

      if (!cancelled) {
        setIsComplete(true);
      }
    }

    typeText();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="bg-gray-900 text-green-400 font-mono text-sm p-4 rounded h-full overflow-auto">
      {displayedLines.map((line, i) => (
        <div key={i} className="mb-2">
          <div className="text-gray-400">
            {line.prompt}
            {!line.promptComplete && (
              <span className="animate-pulse">▋</span>
            )}
          </div>
          {line.promptComplete && (
            <div className="text-green-400 whitespace-pre-wrap pl-2">
              {line.response}
              {!line.responseComplete && (
                <span className="animate-pulse">▋</span>
              )}
            </div>
          )}
        </div>
      ))}
      {isComplete && (
        <div className="text-gray-400">
          {'> '}<span className="animate-pulse">▋</span>
        </div>
      )}
    </div>
  );
}
