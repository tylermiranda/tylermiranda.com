import { useState } from 'react';

export function ContactContent() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="font-mono text-sm bg-gray-900 text-green-400 p-4 rounded h-full">
      <div className="text-gray-500 mb-4">#!/bin/bash</div>
      <div className="text-gray-500 mb-4"># contact.sh - Get in touch</div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">$</span>
          <span>echo $EMAIL</span>
        </div>
        <div className="pl-4 flex items-center gap-2">
          <span className="text-amber-400">tyler@example.com</span>
          <button
            onClick={() => copyToClipboard('tyler@example.com', 'email')}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            {copied === 'email' ? '✓ copied!' : '[copy]'}
          </button>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <span className="text-gray-400">$</span>
          <span>open $GITHUB</span>
        </div>
        <div className="pl-4">
          <a
            href="https://github.com/tylermiranda"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            github.com/tylermiranda →
          </a>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <span className="text-gray-400">$</span>
          <span>open $LINKEDIN</span>
        </div>
        <div className="pl-4">
          <a
            href="https://linkedin.com/in/tylermiranda"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            linkedin.com/in/tylermiranda →
          </a>
        </div>

        <div className="mt-6 text-gray-500">
          <span className="text-gray-400">$</span> # DMs always open 👋
        </div>
      </div>
    </div>
  );
}
