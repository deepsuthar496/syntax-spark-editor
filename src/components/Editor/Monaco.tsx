
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface MonacoProps {
  content: string;
  language: string;
}

// Basic syntax highlighting function
const highlightSyntax = (code: string, language: string): React.ReactNode[] => {
  // Simple tokenization based on language
  if (language === 'typescript' || language === 'javascript') {
    // Very basic example - a real implementation would use proper tokenization
    const lines = code.split('\n');
    
    return lines.map((line, lineIndex) => {
      // Simple pattern matching for keywords
      const keywords = ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'import', 'export', 'from', 'class', 'interface', 'type', 'extends', 'implements'];
      const tokens: React.ReactNode[] = [];
      
      // Very simplistic tokenization - in reality would use proper lexing
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
              tokens.push(<span key={`token-${lineIndex}-${tokens.length}`}>{currentToken}</span>);
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
        
        // Handle spaces and special characters
        if (/\s/.test(char) || /[(){}\[\],;:.]/.test(char)) {
          if (currentToken) {
            // Check if current token is a keyword
            if (keywords.includes(currentToken)) {
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
        if (keywords.includes(currentToken)) {
          tokens.push(<span key={`keyword-${lineIndex}-${tokens.length}`} className="syntax-keyword">{currentToken}</span>);
        } else if (/^\d+$/.test(currentToken)) {
          tokens.push(<span key={`number-${lineIndex}-${tokens.length}`} className="syntax-number">{currentToken}</span>);
        } else {
          tokens.push(<span key={`token-${lineIndex}-${tokens.length}`}>{currentToken}</span>);
        }
      }
      
      return (
        <div key={`line-${lineIndex}`} className="code-line">
          <div className="line-number">{lineIndex + 1}</div>
          <div className="flex-1">{tokens}</div>
        </div>
      );
    });
  } 
  else if (language === 'html') {
    // Very simple HTML highlighting
    const lines = code.split('\n');
    
    return lines.map((line, lineIndex) => {
      // Simple HTML tag highlighting
      const tagPattern = /<\/?([a-zA-Z0-9\-]+)(?:\s+([^>]*))?>/g;
      const attributePattern = /(\w+)=["']([^"']*)["']/g;
      
      let lastIndex = 0;
      const tokens: React.ReactNode[] = [];
      let match;
      
      while ((match = tagPattern.exec(line)) !== null) {
        const [fullMatch, tagName, attributes] = match;
        const matchStart = match.index;
        
        // Add text before the tag
        if (matchStart > lastIndex) {
          tokens.push(<span key={`text-${lineIndex}-${lastIndex}`}>{line.substring(lastIndex, matchStart)}</span>);
        }
        
        // Highlight the tag
        tokens.push(
          <span key={`tag-${lineIndex}-${matchStart}`} className="syntax-keyword">
            {fullMatch}
          </span>
        );
        
        lastIndex = matchStart + fullMatch.length;
      }
      
      // Add any remaining text
      if (lastIndex < line.length) {
        tokens.push(<span key={`text-${lineIndex}-${lastIndex}`}>{line.substring(lastIndex)}</span>);
      }
      
      return (
        <div key={`line-${lineIndex}`} className="code-line">
          <div className="line-number">{lineIndex + 1}</div>
          <div className="flex-1">{tokens.length > 0 ? tokens : line}</div>
        </div>
      );
    });
  }
  else if (language === 'css') {
    // Simple CSS highlighting
    const lines = code.split('\n');
    
    return lines.map((line, lineIndex) => {
      // Basic CSS selectors and properties
      const selectorPattern = /([.#]?[\w\-]+)(?:\s*{)/;
      const propertyPattern = /([\w\-]+):\s*([^;]+);/g;
      
      let tokens: React.ReactNode[] = [];
      
      // Check if this line contains a selector
      const selectorMatch = line.match(selectorPattern);
      if (selectorMatch) {
        const [full, selector] = selectorMatch;
        const selectorIndex = selectorMatch.index || 0;
        
        tokens.push(
          <span key={`before-selector-${lineIndex}`}>{line.substring(0, selectorIndex)}</span>,
          <span key={`selector-${lineIndex}`} className="syntax-function">{selector}</span>,
          <span key={`after-selector-${lineIndex}`}>{line.substring(selectorIndex + selector.length)}</span>
        );
      }
      // Check if this line contains properties
      else if (propertyPattern.test(line)) {
        let lastIndex = 0;
        let propertyMatch;
        
        while ((propertyMatch = propertyPattern.exec(line)) !== null) {
          const [full, property, value] = propertyMatch;
          const matchStart = propertyMatch.index;
          
          if (matchStart > lastIndex) {
            tokens.push(<span key={`before-prop-${lineIndex}-${lastIndex}`}>{line.substring(lastIndex, matchStart)}</span>);
          }
          
          tokens.push(
            <span key={`prop-${lineIndex}-${matchStart}`}>
              <span className="syntax-keyword">{property}</span>:
              <span className="syntax-string"> {value}</span>;
            </span>
          );
          
          lastIndex = matchStart + full.length;
        }
        
        if (lastIndex < line.length) {
          tokens.push(<span key={`after-prop-${lineIndex}`}>{line.substring(lastIndex)}</span>);
        }
      } else {
        tokens.push(<span key={`line-content-${lineIndex}`}>{line}</span>);
      }
      
      return (
        <div key={`line-${lineIndex}`} className="code-line">
          <div className="line-number">{lineIndex + 1}</div>
          <div className="flex-1">{tokens}</div>
        </div>
      );
    });
  }
  else if (language === 'json') {
    // Simple JSON highlighting
    const lines = code.split('\n');
    
    return lines.map((line, lineIndex) => {
      // Check for keys, values, etc.
      const keyPattern = /"([^"]+)":/g;
      const valuePattern = /: (".*?"|true|false|null|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;
      
      let tokens: React.ReactNode[] = [];
      let lastIndex = 0;
      
      // First highlight keys
      let keyMatch;
      while ((keyMatch = keyPattern.exec(line)) !== null) {
        const [full, key] = keyMatch;
        const matchStart = keyMatch.index;
        
        if (matchStart > lastIndex) {
          tokens.push(<span key={`text-${lineIndex}-${lastIndex}`}>{line.substring(lastIndex, matchStart)}</span>);
        }
        
        tokens.push(
          <span key={`key-${lineIndex}-${matchStart}`}>
            <span className="syntax-string">"{key}"</span>:
          </span>
        );
        
        lastIndex = matchStart + full.length;
      }
      
      // Then highlight values after colons
      if (tokens.length === 0) {
        let valueMatch;
        while ((valueMatch = valuePattern.exec(line)) !== null) {
          const [full, value] = valueMatch;
          const matchStart = valueMatch.index;
          
          if (matchStart > lastIndex) {
            tokens.push(<span key={`text-${lineIndex}-${lastIndex}`}>{line.substring(lastIndex, matchStart)}</span>);
          }
          
          if (value.startsWith('"')) {
            tokens.push(<span key={`value-${lineIndex}-${matchStart}`} className="syntax-string">{value}</span>);
          } else if (['true', 'false', 'null'].includes(value)) {
            tokens.push(<span key={`value-${lineIndex}-${matchStart}`} className="syntax-keyword">{value}</span>);
          } else {
            tokens.push(<span key={`value-${lineIndex}-${matchStart}`} className="syntax-number">{value}</span>);
          }
          
          lastIndex = matchStart + full.length;
        }
      }
      
      // Add any remaining text
      if (lastIndex < line.length) {
        tokens.push(<span key={`text-${lineIndex}-${lastIndex}`}>{line.substring(lastIndex)}</span>);
      }
      
      // If no tokens were created, just show the line as-is
      if (tokens.length === 0) {
        tokens.push(<span key={`line-content-${lineIndex}`}>{line}</span>);
      }
      
      return (
        <div key={`line-${lineIndex}`} className="code-line">
          <div className="line-number">{lineIndex + 1}</div>
          <div className="flex-1">{tokens}</div>
        </div>
      );
    });
  }
  else {
    // Fallback for unsupported languages - just show line numbers
    return code.split('\n').map((line, index) => (
      <div key={`line-${index}`} className="code-line">
        <div className="line-number">{index + 1}</div>
        <div className="flex-1">{line}</div>
      </div>
    ));
  }
};

const Monaco: React.FC<MonacoProps> = ({ content, language }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEditable, setIsEditable] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  
  // Handle keyboard focus and cursor
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editorRef.current && e.key === 'Tab') {
        e.preventDefault();
        // In a real editor, this would insert a tab or spaces
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Highlighted code
  const highlightedCode = highlightSyntax(content, language);
  
  return (
    <div 
      ref={editorRef}
      className="h-full w-full font-mono text-sm bg-editor-background text-editor-foreground overflow-auto p-2 focus:outline-none"
      tabIndex={0}
      onClick={() => setIsEditable(true)}
      onBlur={() => setIsEditable(false)}
    >
      {highlightedCode}
    </div>
  );
};

export default Monaco;
