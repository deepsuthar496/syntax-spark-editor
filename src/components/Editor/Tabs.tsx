
import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileTab {
  id: string;
  name: string;
  language?: string;
}

interface TabsProps {
  tabs: FileTab[];
  activeTab: string | null;
  onTabSelect: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabSelect, onTabClose }) => {
  if (tabs.length === 0) {
    return (
      <div className="h-10 bg-sidebar flex items-center border-b border-border px-4 text-sm text-muted-foreground">
        No files open
      </div>
    );
  }

  return (
    <div className="h-10 bg-sidebar flex items-center border-b border-border overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={cn(
            "h-10 flex items-center px-4 border-r border-border cursor-pointer select-none group relative",
            activeTab === tab.id ? "bg-background text-foreground" : "bg-sidebar text-muted-foreground hover:bg-background/10"
          )}
          onClick={() => onTabSelect(tab.id)}
        >
          <span className="mr-2 text-sm">{tab.name}</span>
          <button
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onTabClose(tab.id);
            }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Tabs;
