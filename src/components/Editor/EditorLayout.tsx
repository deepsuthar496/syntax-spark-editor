
import React, { useState } from 'react';
import ActivityBar from './ActivityBar';
import Sidebar from './Sidebar';
import Tabs from './Tabs';
import Monaco from './Monaco';
import StatusBar from './StatusBar';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  language?: string;
  children?: FileNode[];
}

interface FileTab {
  id: string;
  name: string;
  language?: string;
  content: string;
}

const sampleContents: Record<string, { content: string; language: string }> = {
  '3': { 
    content: 
`import React from 'react';
import './App.css';

// Main App component
function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello World</h1>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <button onClick={() => setCount(count + 1)}>
          Count is {count}
        </button>
      </header>
    </div>
  );
}

export default App;`, 
    language: 'typescript' 
  },
  '4': { 
    content: 
`.App {
  text-align: center;
}

.App-logo {
  height: 40vmin;
  pointer-events: none;
}

.App-header {
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
}

.App-link {
  color: #61dafb;
}`, 
    language: 'css' 
  },
  '5': { 
    content: 
`import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`, 
    language: 'typescript' 
  },
  '7': { 
    content: 
`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>VS Code Editor</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`, 
    language: 'html' 
  },
  '9': { 
    content: 
`{
  "name": "vscode-clone",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.2",
    "vite": "^4.3.9"
  }
}`, 
    language: 'json' 
  },
  '10': { 
    content: 
`{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`, 
    language: 'json' 
  },
  '11': { 
    content: 
`# VS Code Clone

A modern VS Code clone built with React and Tailwind CSS.

## Features

- Syntax highlighting
- File explorer
- Tabs
- Status bar
- Activity bar

## Getting Started

1. Clone the repository
2. Run \`npm install\` to install dependencies
3. Run \`npm run dev\` to start the development server`, 
    language: 'markdown' 
  }
};

const EditorLayout: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>('Explorer');
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [openTabs, setOpenTabs] = useState<FileTab[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  
  const handleFileSelect = (file: FileNode) => {
    if (file.type === 'file') {
      setSelectedFile(file);
      
      // Check if file is already open in a tab
      const existingTab = openTabs.find(tab => tab.id === file.id);
      if (!existingTab) {
        // Get file content from our sample contents
        const fileContent = sampleContents[file.id] || { 
          content: `// No content available for ${file.name}`, 
          language: file.language || 'text' 
        };
        
        // Create a new tab
        const newTab: FileTab = {
          id: file.id,
          name: file.name,
          language: file.language,
          content: fileContent.content
        };
        
        setOpenTabs([...openTabs, newTab]);
      }
      
      // Set the tab as active
      setActiveTab(file.id);
    }
  };
  
  const handleTabSelect = (tabId: string) => {
    setActiveTab(tabId);
    // Find corresponding file to set as selected
    const tab = openTabs.find(t => t.id === tabId);
    if (tab) {
      setSelectedFile({
        id: tab.id,
        name: tab.name,
        type: 'file',
        language: tab.language
      });
    }
  };
  
  const handleTabClose = (tabId: string) => {
    const newTabs = openTabs.filter(tab => tab.id !== tabId);
    setOpenTabs(newTabs);
    
    // If we're closing the active tab
    if (activeTab === tabId) {
      // Set the next tab as active, or null if no tabs left
      if (newTabs.length > 0) {
        setActiveTab(newTabs[newTabs.length - 1].id);
        
        // Also update selected file
        const nextTab = newTabs[newTabs.length - 1];
        setSelectedFile({
          id: nextTab.id,
          name: nextTab.name,
          type: 'file',
          language: nextTab.language
        });
      } else {
        setActiveTab(null);
        setSelectedFile(null);
      }
    }
  };
  
  // Get the content for the active tab
  const activeContent = activeTab 
    ? openTabs.find(tab => tab.id === activeTab)?.content || ''
    : '';
    
  // Get the language for the active tab
  const activeLanguage = activeTab 
    ? openTabs.find(tab => tab.id === activeTab)?.language || 'text'
    : 'text';
  
  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <div className="flex-1 flex">
        <ActivityBar activeItem={activeItem} setActiveItem={setActiveItem} />
        
        <Sidebar 
          activeItem={activeItem}
          onFileSelect={handleFileSelect}
          selectedFile={selectedFile || undefined}
        />
        
        <div className="flex-1 flex flex-col">
          <Tabs 
            tabs={openTabs} 
            activeTab={activeTab} 
            onTabSelect={handleTabSelect}
            onTabClose={handleTabClose}
          />
          
          <div className="flex-1 overflow-hidden">
            {activeTab ? (
              <Monaco 
                content={activeContent} 
                language={activeLanguage}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="max-w-md text-center p-8">
                  <h2 className="text-2xl font-bold mb-4">Welcome to VS Code Clone</h2>
                  <p className="mb-6">Open a file from the explorer to get started.</p>
                  <div className="flex flex-col gap-2 text-left text-sm bg-muted p-4 rounded-md">
                    <div className="flex justify-between">
                      <span>Open a file</span>
                      <span className="text-xs bg-secondary px-2 py-0.5 rounded">Click on file</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Move between tabs</span>
                      <span className="text-xs bg-secondary px-2 py-0.5 rounded">Click on tab</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Close a tab</span>
                      <span className="text-xs bg-secondary px-2 py-0.5 rounded">Click the x</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <StatusBar 
            language={activeLanguage || "text"}
            lineCount={activeContent.split('\n').length}
            currentLine={1}
            currentColumn={1}
            encoding="UTF-8"
            indentation="Spaces: 2"
            eol="LF"
          />
        </div>
      </div>
    </div>
  );
};

export default EditorLayout;
