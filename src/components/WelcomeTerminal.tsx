import { useState, useEffect, useRef } from 'react';

const initialLines = [
  { prompt: '> whoami', response: 'Tyler Miranda - Senior VDI Platform Engineer' },
  { prompt: '> cat welcome.txt', response: "Hey! Welcome to my corner of the internet.\nType 'help' for available commands." },
];

const commands: Record<string, string> = {
  help: `Available commands:
  help      - Show this help message
  whoami    - Display my name and title
  skills    - List my technical skills
  projects  - Show my projects
  contact   - Get my contact info
  resume    - Link to my resume
  clear     - Clear the terminal`,
  whoami: 'Tyler Miranda - Senior VDI Platform Engineer',
  skills: `Virtualization: Citrix DaaS, XenDesktop, Azure VDI, VMware
Networking: NetScaler Gateway, Citrix ADC, GSLB
Automation: PowerShell, REST APIs, Python, Jenkins
Cloud: Azure, Azure OpenAI, Citrix Cloud, M365
Tools: ControlUp, FsLogix, Splunk, ServiceNow`,
  projects: `📦 OptiStack - Self-hosted supplement manager with AI
   → github.com/tylermiranda/OptiStack

📦 SplitRowr - iOS rowing app with retro LCD aesthetic
   → splitrowr.app

📦 Hooli Phone - Silicon Valley parody landing page
   → github.com/tylermiranda/Hooli`,
  contact: `Email: tyler.miranda@gmail.com
LinkedIn: linkedin.com/in/tyler-miranda-pro`,
  resume: `View my resume:
→ https://docs.google.com/document/d/18HLUyYZaaRRvGUiA7XVZnfgjbHsR5C62/edit?usp=sharing`,
};

interface TerminalLine {
  prompt: string;
  response: string;
}

export function WelcomeTerminal() {
  const [history, setHistory] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);
  const [displayedLines, setDisplayedLines] = useState<Array<{ prompt: string; response: string; promptComplete: boolean; responseComplete: boolean }>>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initial typing animation
  useEffect(() => {
    let cancelled = false;

    async function typeText() {
      for (let lineIdx = 0; lineIdx < initialLines.length; lineIdx++) {
        if (cancelled) return;

        const line = initialLines[lineIdx];

        setDisplayedLines(prev => [...prev, {
          prompt: '',
          response: line.response,
          promptComplete: false,
          responseComplete: false
        }]);

        for (let charIdx = 0; charIdx <= line.prompt.length; charIdx++) {
          if (cancelled) return;
          await new Promise(resolve => setTimeout(resolve, 50));
          setDisplayedLines(prev => {
            const updated = [...prev];
            updated[lineIdx] = { ...updated[lineIdx], prompt: line.prompt.slice(0, charIdx) };
            return updated;
          });
        }

        setDisplayedLines(prev => {
          const updated = [...prev];
          updated[lineIdx] = { ...updated[lineIdx], promptComplete: true };
          return updated;
        });
        await new Promise(resolve => setTimeout(resolve, 300));

        for (let charIdx = 0; charIdx <= line.response.length; charIdx++) {
          if (cancelled) return;
          await new Promise(resolve => setTimeout(resolve, 20));
          setDisplayedLines(prev => {
            const updated = [...prev];
            updated[lineIdx] = { ...updated[lineIdx], response: line.response.slice(0, charIdx) };
            return updated;
          });
        }

        setDisplayedLines(prev => {
          const updated = [...prev];
          updated[lineIdx] = { ...updated[lineIdx], responseComplete: true };
          return updated;
        });

        await new Promise(resolve => setTimeout(resolve, 500));
      }

      if (!cancelled) {
        setHistory(initialLines.map(l => ({ prompt: l.prompt, response: l.response })));
        setIsInitializing(false);
      }
    }

    typeText();
    return () => { cancelled = true; };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history, displayedLines]);

  // Focus input when initialization completes
  useEffect(() => {
    if (!isInitializing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInitializing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();

    if (!cmd) return;

    if (cmd === 'clear') {
      setHistory([]);
      setInput('');
      return;
    }

    const response = commands[cmd] || `Command not found: ${cmd}\nType 'help' for available commands.`;
    setHistory(prev => [...prev, { prompt: `> ${input}`, response }]);
    setInput('');
  };

  const handleContainerClick = () => {
    if (!isInitializing && inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className="bg-gray-900 text-green-400 font-mono text-sm p-4 rounded h-full overflow-auto cursor-text"
    >
      {isInitializing ? (
        // Show typing animation during initialization
        <>
          {displayedLines.map((line, i) => (
            <div key={i} className="mb-2">
              <div className="text-gray-400">
                {line.prompt}
                {!line.promptComplete && <span className="animate-pulse">▋</span>}
              </div>
              {line.promptComplete && (
                <div className="text-green-400 whitespace-pre-wrap pl-2">
                  {line.response}
                  {!line.responseComplete && <span className="animate-pulse">▋</span>}
                </div>
              )}
            </div>
          ))}
        </>
      ) : (
        // Show interactive terminal after initialization
        <>
          {history.map((line, i) => (
            <div key={i} className="mb-2">
              <div className="text-gray-400">{line.prompt}</div>
              <div className="text-green-400 whitespace-pre-wrap pl-2">{line.response}</div>
            </div>
          ))}
          <form onSubmit={handleSubmit} className="flex items-center">
            <span className="text-gray-400">{'> '}</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent text-green-400 outline-none caret-green-400"
              autoComplete="off"
              spellCheck={false}
            />
            <span className="animate-pulse">▋</span>
          </form>
        </>
      )}
    </div>
  );
}
