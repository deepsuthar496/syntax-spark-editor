
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
      <div key={`line-${lineIndex}`} className="code-line hover:bg-[#1e1e1e]/40">
        <div className="line-number">{lineIndex + 1}</div>
        <div className="flex-1 pl-4 whitespace-pre">{tokens.length > 0 ? tokens : ' '}</div>
      </div>
    );
  });
};

const Monaco: React.FC<MonacoProps> = ({ content, language, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEditable, setIsEditable] = useState(false);
  const [localContent, setLocalContent] = useState(content);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  
  // Update local content when prop changes
  useEffect(() => {
    setLocalContent(content);
  }, [content]);
  
  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!editorRef.current || !isEditable) return;
      
      if (e.key === 'Tab') {
        e.preventDefault();
        
        // Insert 2 spaces when Tab is pressed
        const newContent = localContent + '  ';
        setLocalContent(newContent);
        onChange?.(newContent);
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
  };
  
  // Highlighted code
  const highlightedCode = highlightSyntax(localContent, language);
  
  return (
    <div className="relative h-full w-full font-mono text-sm bg-editor-background text-editor-foreground overflow-auto focus:outline-none">
      <div 
        ref={editorRef}
        className="min-h-full w-full"
        onClick={() => setIsEditable(true)}
        onBlur={() => setIsEditable(false)}
        tabIndex={0}
      >
        {highlightedCode}
        
        {/* Hidden textarea for capturing keyboard input */}
        {isEditable && (
          <textarea
            value={localContent}
            onChange={handleContentChange}
            className="absolute inset-0 opacity-0 w-full h-full resize-none"
            autoFocus
          />
        )}
      </div>
    </div>
  );
};

export default Monaco;
