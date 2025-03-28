
import React from 'react';
import { cn } from '@/lib/utils';
import { Bell, GitBranch, XCircle, Wifi, WifiOff, Check, CircleDot } from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface StatusBarProps {
  language: string;
  lineCount: number;
  currentLine: number;
  currentColumn: number;
  encoding: string;
  indentation: string;
  eol: string;
  connected?: boolean;
}

const StatusBar: React.FC<StatusBarProps> = ({
  language,
  lineCount,
  currentLine,
  currentColumn,
  encoding,
  indentation,
  eol,
  connected = true,
}) => {
  return (
    <div className="h-5 bg-sidebar flex items-center px-2 text-xs text-muted-foreground border-t border-border select-none">
      <div className="flex-1 flex items-center space-x-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-1.5 cursor-help">
                <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>{connected ? 'Ready' : 'Disconnected'}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" align="start">
              <span>{connected ? 'Editor ready' : 'Connection lost'}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="flex items-center space-x-1">
          <GitBranch size={14} />
          <span>main</span>
        </div>

        <div className="flex items-center space-x-0.5">
          <Check size={14} className="text-green-500" />
          <span>0</span>
          <XCircle size={14} className="text-red-500 ml-1" />
          <span>0</span>
        </div>
        
        <div className="flex items-center space-x-1">
          {connected ? (
            <Wifi size={14} className="text-green-500" />
          ) : (
            <WifiOff size={14} className="text-red-500" />
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-help">
                Ln {currentLine}, Col {currentColumn}
              </span>
            </TooltipTrigger>
            <TooltipContent side="top">
              <span>Line {currentLine}, Column {currentColumn}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <span>
          {lineCount} lines
        </span>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="px-1.5 py-0.5 hover:bg-secondary rounded cursor-pointer">
                {language.toUpperCase()}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <span>Select Language Mode</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="px-1.5 py-0.5 hover:bg-secondary rounded cursor-pointer">
                {indentation}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <span>Select Indentation</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="px-1.5 py-0.5 hover:bg-secondary rounded cursor-pointer">
                {encoding}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <span>Select Encoding</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="px-1.5 py-0.5 hover:bg-secondary rounded cursor-pointer">
                {eol}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <span>Select End of Line Sequence</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default StatusBar;
