
import React from 'react';
import { FileText, Search, Settings, Folder } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
    { icon: <Folder size={24} />, name: 'Source Control', shortcut: 'Ctrl+Shift+G' },
    { icon: <Settings size={24} />, name: 'Settings', shortcut: 'Ctrl+,' },
  ];

  return (
    <div className="h-full bg-sidebar w-12 flex flex-col items-center py-2 border-r border-border">
      <TooltipProvider delayDuration={300}>
        <div className="flex flex-col space-y-4">
          {activityItems.map((item) => (
            <Tooltip key={item.name}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-10 w-10 flex items-center justify-center hover:bg-sidebar-accent rounded-md",
                    activeItem === item.name && "bg-sidebar-accent text-primary border-l-2 border-primary"
                  )}
                  onClick={() => setActiveItem(item.name)}
                >
                  {item.icon}
                </Button>
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
    </div>
  );
};

export default ActivityBar;
