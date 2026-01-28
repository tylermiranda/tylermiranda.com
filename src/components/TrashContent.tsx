import { useState } from 'react';
import { trashItems, type TrashItem } from '../content/trashItems';

function TrashItemRow({ item }: { item: TrashItem }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 transition-colors text-left"
      >
        <span className="text-2xl">{item.icon}</span>
        <span className="font-mono text-sm text-gray-700 flex-1">{item.filename}</span>
        <span className="text-gray-400 text-sm">{isExpanded ? '▼' : '▶'}</span>
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 bg-gray-50 border-t border-gray-100">
          <pre className="font-mono text-xs text-gray-600 whitespace-pre-wrap leading-relaxed">
            {item.content}
          </pre>
        </div>
      )}
    </div>
  );
}

export function TrashContent() {
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <p className="text-sm text-gray-500 font-mono">
          {trashItems.length} items · Emptying trash is disabled
        </p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {trashItems.map((item) => (
          <TrashItemRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
