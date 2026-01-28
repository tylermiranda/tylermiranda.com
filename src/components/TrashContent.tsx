import { useState } from 'react';
import { trashItems, type TrashItem } from '../content/trashItems';

// Split items into two categories
const recentlyDeleted = trashItems.slice(0, 5);
const archived = trashItems.slice(5);

function TrashIcon({ item, onClick }: { item: TrashItem; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 transition-colors w-24 group"
    >
      <span className="text-4xl group-hover:scale-110 transition-transform">{item.icon}</span>
      <span className="text-xs text-gray-600 text-center font-mono leading-tight line-clamp-3 w-full">
        {item.filename}
      </span>
    </button>
  );
}

function CollapsibleSection({
  title,
  count,
  children,
  defaultOpen = true
}: {
  title: string;
  count: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3 hover:text-gray-900"
      >
        <span className="text-gray-400">{isOpen ? '▼' : '▶'}</span>
        <span>{title} ({count})</span>
      </button>
      {isOpen && (
        <div className="flex flex-wrap gap-2">
          {children}
        </div>
      )}
    </div>
  );
}

function ContentModal({ item, onClose }: { item: TrashItem; onClose: () => void }) {
  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80%] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-gray-50">
          <span className="text-3xl">{item.icon}</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-mono text-sm font-medium text-gray-900 truncate">{item.filename}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ×
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-64">
          <pre className="font-mono text-xs text-gray-600 whitespace-pre-wrap leading-relaxed">
            {item.content}
          </pre>
        </div>
      </div>
    </div>
  );
}

export function TrashContent() {
  const [selectedItem, setSelectedItem] = useState<TrashItem | null>(null);

  return (
    <div className="h-full flex relative">
      {/* Sidebar */}
      <div className="w-44 border-r border-gray-200 p-4 bg-gray-50 flex-shrink-0">
        <h3 className="font-medium text-gray-900 mb-2">Trash</h3>
        <p className="text-xs text-gray-500 leading-relaxed">
          Files will never actually be deleted permanently because Internet Archive.
        </p>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <CollapsibleSection title="Recently deleted" count={recentlyDeleted.length}>
          {recentlyDeleted.map((item) => (
            <TrashIcon key={item.id} item={item} onClick={() => setSelectedItem(item)} />
          ))}
        </CollapsibleSection>

        <CollapsibleSection title="Archive (cannot be recovered)" count={archived.length}>
          {archived.map((item) => (
            <TrashIcon key={item.id} item={item} onClick={() => setSelectedItem(item)} />
          ))}
        </CollapsibleSection>
      </div>

      {/* Modal */}
      {selectedItem && (
        <ContentModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}
