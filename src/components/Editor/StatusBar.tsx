
import React from 'react';
import { cn } from '@/lib/utils';

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
    <div className="h-6 bg-muted flex items-center px-4 text-xs text-muted-foreground border-t border-border">
      <div className="flex-1 flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <span>Ready</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="px-2 py-0.5 bg-secondary rounded">{language}</span>
          <span>
            {currentLine}:{currentColumn}
          </span>
          <span>
            {lineCount} lines
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <span>{encoding}</span>
        <span>{indentation}</span>
        <span>{eol}</span>
      </div>
    </div>
  );
};

export default StatusBar;
