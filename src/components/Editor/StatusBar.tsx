
import React from 'react';
import { cn } from '@/lib/utils';
import { Bell, Check, GitBranch, XCircle } from 'lucide-react';

interface StatusBarProps {
  language: string;
  lineCount: number;
  currentLine: number;
  currentColumn: number;
  encoding: string;
  indentation: string;
  eol: string;
}

const StatusBar: React.FC<StatusBarProps> = ({
  language,
  lineCount,
  currentLine,
  currentColumn,
  encoding,
  indentation,
  eol,
}) => {
  return (
    <div className="h-6 bg-sidebar flex items-center px-2 text-xs text-muted-foreground border-t border-border select-none">
      <div className="flex-1 flex items-center space-x-3">
        <div className="flex items-center space-x-1.5">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span>Ready</span>
        </div>
        
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
      </div>
      
      <div className="flex items-center space-x-3">
        <span>
          Ln {currentLine}, Col {currentColumn}
        </span>
        <span>
          {lineCount} lines
        </span>
        <div className="px-1.5 py-0.5 hover:bg-secondary rounded cursor-pointer">
          {language.toUpperCase()}
        </div>
        <div className="px-1.5 py-0.5 hover:bg-secondary rounded cursor-pointer">
          {indentation}
        </div>
        <div className="px-1.5 py-0.5 hover:bg-secondary rounded cursor-pointer">
          {encoding}
        </div>
        <div className="px-1.5 py-0.5 hover:bg-secondary rounded cursor-pointer">
          {eol}
        </div>
        <div className="px-1.5 py-0.5 hover:bg-secondary rounded cursor-pointer">
          <Bell size={14} />
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
