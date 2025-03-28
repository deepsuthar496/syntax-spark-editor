
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface MonacoProps {
  content: string;
  language: string;
  onChange?: (value: string) => void;
}

// Enhanced syntax highlighting function with more token types
const highlightSyntax = (code: string, language: string): React.ReactNode[] => {
  if (!code) return [];
  
  // Split code into lines
  const lines = code.split('\n');
  
  return lines.map((line, lineIndex) => {
    // Different tokenizing strategy based on language
    let tokens: React.ReactNode[] = [];
    const keywords = {
      typescript: ['import', 'export', 'const', 'let', 'var', 'function', 'return', 'if', 'else', 'from', 'as', 'interface', 'type', 'extends', 'implements', 'class', 'for', 'while', 'do', 'switch', 'case', 'default', 'break', 'continue', 'try', 'catch', 'finally', 'throw', 'new', 'this', 'super', 'typeof', 'instanceof', 'void', 'delete', 'null', 'undefined', 'true', 'false', 'async', 'await', 'of', 'in'],
      javascript: ['import', 'export', 'const', 'let', 'var', 'function', 'return', 'if', 'else', 'from', 'class', 'for', 'while', 'do', 'switch', 'case', 'default', 'break', 'continue', 'try', 'catch', 'finally', 'throw', 'new', 'this', 'typeof', 'instanceof', 'void', 'delete', 'null', 'undefined', 'true', 'false', 'async', 'await', 'of', 'in'],
      html: ['html', 'head', 'body', 'div', 'span', 'a', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th', 'input', 'form', 'button', 'img', 'script', 'style', 'link', 'meta'],
      css: ['color', 'background', 'margin', 'padding', 'border', 'font', 'text', 'display', 'position', 'width', 'height', 'top', 'left', 'right', 'bottom', 'flex', 'grid', 'animation'],
      json: ['true', 'false', 'null']
    };
    
    // Very simplistic approach to tokenization - not suitable for production
    // In real-world, we'd use a proper tokenizer or a library like Prism.js
    let currentToken = '';
    let inString = false;
    let inComment = false;
    let stringChar = '';
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1] || '';
      
      // Handle comments
      if (char === '/' && nextChar === '/' && !inString) {
        if (currentToken) {
          tokens.push(<span key={`token-${lineIndex}-${tokens.length}`}>{currentToken}</span>);
          currentToken = '';
        }
        tokens.push(<span key={`comment-${lineIndex}`} className="syntax-comment">{line.slice(i)}</span>);
        break;
      }
      
      // Handle strings
      if ((char === '"' || char === "'" || char === '`') && (!inString || stringChar === char)) {
        if (inString) {
          currentToken += char;
          tokens.push(<span key={`string-${lineIndex}-${tokens.length}`} className="syntax-string">{currentToken}</span>);
          currentToken = '';
          inString = false;
        } else {
          if (currentToken) {
            // If it's a keyword, highlight it
            if (keywords[language as keyof typeof keywords]?.includes(currentToken)) {
              tokens.push(<span key={`keyword-${lineIndex}-${tokens.length}`} className="syntax-keyword">{currentToken}</span>);
            } 
            // Check if it might be a function
            else if (nextChar === '(') {
              tokens.push(<span key={`function-${lineIndex}-${tokens.length}`} className="syntax-function">{currentToken}</span>);
            }
            // Check if it's a number
            else if (/^\d+$/.test(currentToken)) {
              tokens.push(<span key={`number-${lineIndex}-${tokens.length}`} className="syntax-number">{currentToken}</span>);
            }
            else {
              tokens.push(<span key={`token-${lineIndex}-${tokens.length}`}>{currentToken}</span>);
            }
            currentToken = '';
          }
          currentToken = char;
          inString = true;
          stringChar = char;
        }
        continue;
      }
      
      if (inString) {
        currentToken += char;
        continue;
      }
      
      // Handle JSX tags in TypeScript/JavaScript
      if (language === 'typescript' || language === 'javascript') {
        if (char === '<' && /[A-Za-z]/.test(nextChar)) {
          if (currentToken) {
            if (keywords[language as keyof typeof keywords]?.includes(currentToken)) {
              tokens.push(<span key={`keyword-${lineIndex}-${tokens.length}`} className="syntax-keyword">{currentToken}</span>);
            } else {
              tokens.push(<span key={`token-${lineIndex}-${tokens.length}`}>{currentToken}</span>);
            }
            currentToken = '';
          }
          tokens.push(<span key={`jsx-tag-start-${lineIndex}-${tokens.length}`} className="syntax-keyword">&lt;</span>);
          continue;
        }
        
        if (char === '/' && nextChar === '>' && line[i-1] === '<') {
          tokens.push(<span key={`jsx-tag-close-${lineIndex}-${tokens.length}`} className="syntax-keyword">/&gt;</span>);
          i++;
          continue;
        }
        
        if (char === '>') {
          if (currentToken) {
            tokens.push(<span key={`jsx-tag-name-${lineIndex}-${tokens.length}`} className="syntax-type">{currentToken}</span>);
            currentToken = '';
          }
          tokens.push(<span key={`jsx-tag-end-${lineIndex}-${tokens.length}`} className="syntax-keyword">&gt;</span>);
          continue;
        }
      }
      
      // Handle spaces and special characters
      if (/\s/.test(char) || /[(){}\[\],;:.]/.test(char)) {
        if (currentToken) {
          // Check if current token is a keyword
          if (keywords[language as keyof typeof keywords]?.includes(currentToken)) {
            tokens.push(<span key={`keyword-${lineIndex}-${tokens.length}`} className="syntax-keyword">{currentToken}</span>);
          } 
          // Check if it might be a function
          else if (currentToken && line[i] === '(') {
            tokens.push(<span key={`function-${lineIndex}-${tokens.length}`} className="syntax-function">{currentToken}</span>);
          }
          // Check if it's a number
          else if (/^\d+$/.test(currentToken)) {
            tokens.push(<span key={`number-${lineIndex}-${tokens.length}`} className="syntax-number">{currentToken}</span>);
          }
          else {
            tokens.push(<span key={`token-${lineIndex}-${tokens.length}`}>{currentToken}</span>);
          }
          currentToken = '';
        }
        tokens.push(<span key={`char-${lineIndex}-${tokens.length}`}>{char}</span>);
        continue;
      }
      
      currentToken += char;
    }
    
    // Add any remaining token
    if (currentToken) {
      if (keywords[language as keyof typeof keywords]?.includes(currentToken)) {
        tokens.push(<span key={`keyword-${lineIndex}-${tokens.length}`} className="syntax-keyword">{currentToken}</span>);
      } else if (/^\d+$/.test(currentToken)) {
        tokens.push(<span key={`number-${lineIndex}-${tokens.length}`} className="syntax-number">{currentToken}</span>);
      } else {
        tokens.push(<span key={`token-${lineIndex}-${tokens.length}`}>{currentToken}</span>);
      }
    }
    
    return (
      <div key={`line-${lineIndex}`} className="code-line hover:bg-[#1e1e1e]/40" data-line-number={lineIndex + 1}>
        <div className="line-number">{lineIndex + 1}</div>
        <div className="flex-1 pl-4 whitespace-pre">{tokens.length > 0 ? tokens : ' '}</div>
      </div>
    );
  });
};

const Monaco: React.FC<MonacoProps> = ({ content, language, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isEditable, setIsEditable] = useState(false);
  const [localContent, setLocalContent] = useState(content);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  
  // Update local content when prop changes
  useEffect(() => {
    setLocalContent(content);
  }, [content]);
  
  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!editorRef.current || !isEditable) return;
      
      // Tab key handling
      if (e.key === 'Tab') {
        e.preventDefault();
        
        const textArea = textareaRef.current;
        if (!textArea) return;
        
        const start = textArea.selectionStart;
        const end = textArea.selectionEnd;
        
        // Insert 2 spaces when Tab is pressed
        const newContent = 
          localContent.substring(0, start) + 
          '  ' + 
          localContent.substring(end);
        
        setLocalContent(newContent);
        onChange?.(newContent);
        
        // Set selection after update
        setTimeout(() => {
          if (textArea) {
            textArea.selectionStart = start + 2;
            textArea.selectionEnd = start + 2;
          }
        }, 0);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditable, localContent, onChange]);
  
  // Handle content edit
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalContent(newValue);
    onChange?.(newValue);
    
    // Update cursor position
    updateCursorPosition(e.target);
  };
  
  const updateCursorPosition = (textarea: HTMLTextAreaElement) => {
    const cursorPos = textarea.selectionStart;
    const contentUpToCursor = localContent.substring(0, cursorPos);
    const lines = contentUpToCursor.split('\n');
    const currentLine = lines.length;
    const currentColumn = lines[lines.length - 1].length + 1;
    
    setCursorPosition({
      line: currentLine,
      column: currentColumn
    });
    
    setSelection({
      start: textarea.selectionStart,
      end: textarea.selectionEnd
    });
  };
  
  // Focus handling
  const handleEditorClick = (e: React.MouseEvent) => {
    setIsEditable(true);
    
    if (textareaRef.current) {
      textareaRef.current.focus();
      
      // Calculate cursor position based on click
      const editorRect = editorRef.current?.getBoundingClientRect();
      if (!editorRect) return;
      
      const lineHeight = 24; // Approximate line height
      const lineNumberWidth = 48; // Width of line number area
      const charWidth = 9.6; // Approximate character width for monospace font
      
      // Calculate which line was clicked
      const relativeY = e.clientY - editorRect.top;
      const clickedLineIndex = Math.floor(relativeY / lineHeight);
      
      // Calculate which column was clicked
      const relativeX = e.clientX - editorRect.left - lineNumberWidth;
      const clickedColumn = Math.max(1, Math.floor(relativeX / charWidth));
      
      // Find the actual position in the text
      const lines = localContent.split('\n');
      if (clickedLineIndex >= lines.length) return; // Out of bounds
      
      let position = 0;
      // Add lengths of all previous lines plus newline characters
      for (let i = 0; i < clickedLineIndex; i++) {
        position += lines[i].length + 1; // +1 for newline
      }
      
      // Add columns in current line
      const maxColumn = lines[clickedLineIndex].length;
      position += Math.min(clickedColumn, maxColumn);
      
      // Set cursor position
      textareaRef.current.selectionStart = position;
      textareaRef.current.selectionEnd = position;
      
      // Update cursor visualization
      updateCursorPosition(textareaRef.current);
    }
  };
  
  // Highlighted code
  const highlightedCode = highlightSyntax(localContent, language);
  
  return (
    <div 
      className="relative h-full w-full font-mono text-sm bg-editor-background text-editor-foreground overflow-auto focus:outline-none"
      onClick={handleEditorClick}
    >
      <div 
        ref={editorRef}
        className="min-h-full w-full"
        tabIndex={0}
      >
        {highlightedCode}
        
        {/* Cursor visualization */}
        {isEditable && selection.start === selection.end && (
          <div 
            className="absolute w-0.5 h-5 bg-editor-cursor opacity-80 animate-cursor-blink"
            style={{
              left: `calc(${cursorPosition.column}ch + ${cursorPosition.line > 1 ? 4 : 3}rem)`,
              top: `calc(${cursorPosition.line - 1} * 1.5rem + 0.25rem)`
            }}
          />
        )}
        
        {/* Hidden textarea for capturing keyboard input */}
        <textarea
          ref={textareaRef}
          value={localContent}
          onChange={handleContentChange}
          className="absolute inset-0 opacity-0 w-full h-full resize-none outline-none"
          autoFocus={isEditable}
          onBlur={() => setIsEditable(false)}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          data-gramm="false"
        />
      </div>
    </div>
  );
};

export default Monaco;
