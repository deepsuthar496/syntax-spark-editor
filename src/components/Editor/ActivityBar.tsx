import React from 'react';
import { FileText, Search, GitBranch, Settings, PanelLeft, Bot, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Tooltip, 
  TooltipContent,
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

type ActivityBarItem = {
  icon: React.ReactNode;
  name: string;
  shortcut?: string;
};

const ActivityBar = ({ activeItem, setActiveItem }: { 
  activeItem: string; 
  setActiveItem: (item: string) => void;
}) => {
  const activityItems: ActivityBarItem[] = [
    { icon: <FileText size={24} />, name: 'Explorer', shortcut: 'Ctrl+E' },
    { icon: <Search size={24} />, name: 'Search', shortcut: 'Ctrl+Shift+F' },
    { icon: <Bot size={24} />, name: 'AI Chat' },
    { icon: <GitBranch size={24} />, name: 'Source Control', shortcut: 'Ctrl+Shift+G' },
    { icon: <Terminal size={24} />, name: 'Terminal', shortcut: 'Ctrl+`' },
    { icon: <Settings size={24} />, name: 'Settings', shortcut: 'Ctrl+,' },
  ];

  return (
    <div className="h-full bg-sidebar w-12 flex flex-col items-center py-2 border-r border-border">
      <TooltipProvider delayDuration={300}>
        <div className="flex flex-col space-y-2">
          {activityItems.map((item) => (
            <Tooltip key={item.name}>
              <TooltipTrigger asChild>
                <button
                  className={cn(
                    "w-12 h-12 flex items-center justify-center rounded-none relative",
                    activeItem === item.name
                      ? "bg-transparent text-white after:absolute after:left-0 after:top-0 after:h-full after:w-[2px] after:bg-primary"
                      : "bg-transparent text-muted-foreground hover:text-white"
                  )}
                  onClick={() => setActiveItem(item.name)}
                >
                  {item.icon}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex flex-col">
                <span>{item.name}</span>
                {item.shortcut && (
                  <span className="text-xs text-muted-foreground">{item.shortcut}</span>
                )}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
      
      <div className="mt-auto">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="w-12 h-12 flex items-center justify-center text-muted-foreground hover:text-white"
              >
                <PanelLeft size={24} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <span>Toggle Sidebar</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ActivityBar;
