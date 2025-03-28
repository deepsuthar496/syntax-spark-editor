import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronDown, Plus, Trash, Settings, Maximize2, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TerminalProps {
  className?: string;
  onClose?: () => void;
}

const Terminal: React.FC<TerminalProps> = ({ className, onClose }) => {
  const [input, setInput] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [terminalTab, setTerminalTab] = useState<string>('powershell');
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Initial terminal welcome message
  useEffect(() => {
    const initialMessages = [
      `Windows PowerShell`,
      `Copyright (C) Microsoft Corporation. All rights reserved.`,
      ``,
      `Try the new cross-platform PowerShell https://aka.ms/pscore6`,
      ``,
      `PS C:\\Users\\Deep\\3D Objects\\vsclone>`
    ];
    setHistory(initialMessages);
  }, []);

  // Auto-scroll to the bottom when history changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Focus the input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle up arrow to navigate command history
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    }
    
    // Handle down arrow to navigate command history
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
    
    // Handle enter to execute command
    else if (e.key === 'Enter') {
      executeCommand();
    }
  };

  const executeCommand = () => {
    if (!input.trim()) return;
    
    // Add command to history
    const newHistory = [...history, `PS C:\\Users\\Deep\\3D Objects\\vsclone> ${input}`];
    
    // Simulate command response
    let response: string[] = [];
    const cmd = input.trim().toLowerCase();
    
    if (cmd === 'cls' || cmd === 'clear') {
      // Clear screen
      setHistory([`PS C:\\Users\\Deep\\3D Objects\\vsclone>`]);
    } else if (cmd === 'exit') {
      // Close terminal
      onClose?.();
    } else if (cmd.startsWith('cd ')) {
      // Change directory
      const dir = cmd.substring(3);
      newHistory.push(`Changed to directory: ${dir}`);
      newHistory.push(`PS C:\\Users\\Deep\\3D Objects\\vsclone\\${dir}>`);
      setHistory(newHistory);
    } else if (cmd === 'ls' || cmd === 'dir') {
      // List directory
      response = [
        ` Directory: C:\\Users\\Deep\\3D Objects\\vsclone`,
        ``,
        `Mode                 LastWriteTime         Length Name`,
        `----                 -------------         ------ ----`,
        `d----           3/15/2023  10:04 AM                node_modules`,
        `d----           3/15/2023  10:04 AM                public`,
        `d----           3/15/2023  10:04 AM                src`,
        `-a---           3/15/2023  10:04 AM           2123 index.html`,
        `-a---           3/15/2023  10:04 AM          15273 package.json`,
        `-a---           3/15/2023  10:04 AM            541 README.md`,
        `-a---           3/15/2023  10:04 AM            430 tsconfig.json`,
        `-a---           3/15/2023  10:04 AM            293 vite.config.ts`,
        ``,
        `PS C:\\Users\\Deep\\3D Objects\\vsclone>`
      ];
      setHistory([...newHistory, ...response]);
    } else if (cmd === 'help') {
      // Help
      response = [
        `Available commands:`,
        `  cls, clear - Clear the terminal screen`,
        `  cd <dir>  - Change directory`,
        `  ls, dir   - List directory contents`,
        `  echo      - Display message`,
        `  help      - Show this help message`,
        `  exit      - Close the terminal`,
        ``,
        `This is a simulated terminal and not all commands are functional.`,
        ``,
        `PS C:\\Users\\Deep\\3D Objects\\vsclone>`
      ];
      setHistory([...newHistory, ...response]);
    } else if (cmd.startsWith('echo ')) {
      // Echo
      const message = input.substring(5);
      newHistory.push(message);
      newHistory.push(`PS C:\\Users\\Deep\\3D Objects\\vsclone>`);
      setHistory(newHistory);
    } else {
      // Unknown command
      newHistory.push(`'${input}' is not recognized as an internal or external command,`);
      newHistory.push(`operable program or batch file.`);
      newHistory.push(`PS C:\\Users\\Deep\\3D Objects\\vsclone>`);
      setHistory(newHistory);
    }
    
    // Add to command history
    setCommandHistory(prev => [...prev, input]);
    
    // Reset input and history index
    setInput('');
    setHistoryIndex(-1);
  };

  const focusTerminal = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div 
      className={cn(
        "flex flex-col h-full bg-black text-white font-mono text-sm",
        className
      )}
      onClick={focusTerminal}
    >
      {/* Terminal Tabs */}
      <div className="flex items-center border-b border-gray-800 bg-gray-900 px-2">
        <div 
          className={cn(
            "px-3 py-1.5 flex items-center cursor-pointer",
            terminalTab === 'powershell' ? "bg-black text-white" : "text-gray-400 hover:text-white"
          )}
          onClick={() => setTerminalTab('powershell')}
        >
          <span>PowerShell</span>
          <X size={14} className="ml-2 opacity-60 hover:opacity-100" onClick={(e) => {
            e.stopPropagation();
            onClose?.();
          }} />
        </div>
        <div className="px-2 py-1.5 flex items-center cursor-pointer text-gray-400 hover:text-white">
          <Plus size={14} />
        </div>
        <div className="ml-auto flex items-center space-x-1 text-gray-400">
          <button className="p-1 hover:bg-gray-800 rounded">
            <Trash size={14} />
          </button>
          <button className="p-1 hover:bg-gray-800 rounded">
            <Maximize2 size={14} />
          </button>
          <button className="p-1 hover:bg-gray-800 rounded">
            <ChevronDown size={14} />
          </button>
        </div>
      </div>
      
      {/* Terminal Output */}
      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-2 whitespace-pre-wrap"
      >
        {history.map((line, index) => (
          <div key={index} className="terminal-line">
            {line}
          </div>
        ))}
      </div>
      
      {/* Terminal Input */}
      <div className="flex items-center px-2 py-1">
        <div className="mr-1 text-green-500">
          <ChevronRight size={14} />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          className="flex-1 bg-transparent outline-none border-none"
          spellCheck="false"
          autoComplete="off"
          autoCapitalize="off"
        />
      </div>
    </div>
  );
};

export default Terminal;