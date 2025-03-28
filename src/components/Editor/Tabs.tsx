
import React from 'react';
import { X, CircleDot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileTab {
  id: string;
  name: string;
  language?: string;
  isDirty?: boolean;
}

interface TabsProps {
  tabs: FileTab[];
  activeTab: string | null;
  onTabSelect: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
}

// Get icon for file based on extension
const getTabIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  let iconColor = '';
  
  switch (extension) {
    case 'js':
    case 'jsx':
      iconColor = 'text-yellow-400';
      break;
    case 'ts':
    case 'tsx':
      iconColor = 'text-blue-400';
      break;
    case 'html':
      iconColor = 'text-orange-400';
      break;
    case 'css':
      iconColor = 'text-purple-400';
      break;
    case 'json':
      iconColor = 'text-yellow-400';
      break;
    case 'md':
      iconColor = 'text-white';
      break;
    default:
      iconColor = 'text-muted-foreground';
  }
  
  return <span className={`text-xs ${iconColor} w-3 h-3 flex items-center justify-center`}>●</span>;
};

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
            "h-10 flex items-center px-3 border-r border-border cursor-pointer select-none group relative min-w-[120px] max-w-[180px]",
            activeTab === tab.id ? "bg-background text-foreground border-t-2 border-t-primary border-b-0" : "bg-sidebar text-muted-foreground hover:bg-background/10"
          )}
          onClick={() => onTabSelect(tab.id)}
        >
          <div className="mr-1.5">
            {getTabIcon(tab.name)}
          </div>
          <span className="mr-1 text-sm truncate flex-1">
            {tab.name}
            {tab.isDirty && <span className="ml-1 text-muted-foreground">•</span>}
          </span>
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
