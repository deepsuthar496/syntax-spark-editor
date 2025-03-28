import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FileNode, FileTab, CursorPosition } from '../EditorTypes';
import { getLanguageFromExtension } from '../utils/fileUtils';

interface UseFileManagerProps {
  toast: any;
  activeTab: string | null;
  setActiveTab: (tabId: string | null) => void;
  openTabs: FileTab[];
  setOpenTabs: (tabs: FileTab[]) => void;
  selectedFile: FileNode | null;
  setSelectedFile: (file: FileNode | null) => void;
  setCursorPosition: (position: CursorPosition) => void;
  setShowWelcomeScreen: (show: boolean) => void;
}

export const useFileManager = ({
  toast,
  activeTab,
  setActiveTab,
  openTabs,
  setOpenTabs,
  selectedFile,
  setSelectedFile,
  setCursorPosition,
  setShowWelcomeScreen
}: UseFileManagerProps) => {
  // File system state
  const [files, setFiles] = useState<FileNode[]>([]);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<FileNode[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  
  // Helper: Get language from filename
  const getLanguageFromFileName = (fileName: string): string => {
    return getLanguageFromExtension(fileName.split('.').pop() || '');
  };
  
  // Handle file selection in explorer
  const handleFileSelect = useCallback((file: FileNode) => {
    if (file.type === 'folder') {
      toggleFolderOpen(file.id);
      return;
    }
    
    setSelectedFile(file);
    setShowWelcomeScreen(false);
    
    // Check if file is already open in a tab
    const existingTab = openTabs.find(tab => tab.id === file.id);
    
    if (existingTab) {
      setActiveTab(existingTab.id);
    } else {
      // Create new tab
      const newTab: FileTab = {
        id: file.id,
        name: file.name,
        path: getPathForFile(file, files),
        content: file.content || '',
        language: getLanguageFromFileName(file.name),
        isDirty: false
      };
      
      setOpenTabs([...openTabs, newTab]);
      setActiveTab(newTab.id);
    }
  }, [openTabs, files, setActiveTab, setOpenTabs, setSelectedFile, setShowWelcomeScreen]);
  
  // Toggle folder open/closed state
  const toggleFolderOpen = useCallback((folderId: string) => {
    setFiles(prevFiles => {
      const updateFolderOpen = (nodes: FileNode[]): FileNode[] => {
        return nodes.map(node => {
          if (node.id === folderId) {
            return { ...node, isOpen: !node.isOpen };
          }
          if (node.children) {
            return { ...node, children: updateFolderOpen(node.children) };
          }
          return node;
        });
      };
      
      return updateFolderOpen(prevFiles);
    });
  }, []);
  
  // Get the full path for a file
  const getPathForFile = (file: FileNode, allFiles: FileNode[], currentPath: string = ''): string => {
    // Simple implementation - in a real app, you'd need to traverse the file tree
    return `/${file.name}`;
  };
  
  // Handle tab selection
  const handleTabSelect = useCallback((tabId: string) => {
    setActiveTab(tabId);
    // Find and select the corresponding file in the explorer
    const tab = openTabs.find(t => t.id === tabId);
    if (tab) {
      const findFileById = (nodes: FileNode[]): FileNode | null => {
        for (const node of nodes) {
          if (node.id === tabId) return node;
          if (node.children) {
            const found = findFileById(node.children);
            if (found) return found;
          }
        }
        return null;
      };
      
      const file = findFileById(files);
      if (file) setSelectedFile(file);
    }
  }, [openTabs, files, setActiveTab, setSelectedFile]);
  
  // Handle tab close
  const handleTabClose = useCallback((tabId: string) => {
    closeTab(tabId);
  }, []);
  
  // Close a tab
  const closeTab = useCallback((tabId: string) => {
    const tabIndex = openTabs.findIndex(tab => tab.id === tabId);
    
    if (tabIndex === -1) return;
    
    const newTabs = openTabs.filter(tab => tab.id !== tabId);
    setOpenTabs(newTabs);
    
    // If we closed the active tab, select another tab
    if (activeTab === tabId) {
      if (newTabs.length > 0) {
        // Select the tab to the left, or the first tab
        const newActiveIndex = Math.min(tabIndex, newTabs.length - 1);
        setActiveTab(newTabs[newActiveIndex].id);
      } else {
        setActiveTab(null);
        setShowWelcomeScreen(true);
      }
    }
  }, [activeTab, openTabs, setActiveTab, setOpenTabs, setShowWelcomeScreen]);
  
  // Handle file content change
  const handleFileChange = useCallback((newContent: string) => {
    if (!activeTab) return;
    
    // Update the tab content
    setOpenTabs(prevTabs => 
      prevTabs.map(tab => 
        tab.id === activeTab 
          ? { ...tab, content: newContent, isDirty: true } 
          : tab
      )
    );
    
    // Update the file content in the file system
    setFiles(prevFiles => {
      const updateFileContent = (nodes: FileNode[]): FileNode[] => {
        return nodes.map(node => {
          if (node.id === activeTab) {
            return { ...node, content: newContent };
          }
          if (node.children) {
            return { ...node, children: updateFileContent(node.children) };
          }
          return node;
        });
      };
      
      return updateFileContent(prevFiles);
    });
  }, [activeTab, setOpenTabs, setFiles]);
  
  // Save file
  const handleSaveFile = useCallback(() => {
    if (!activeTab) return;
    
    setOpenTabs(prevTabs => 
      prevTabs.map(tab => 
        tab.id === activeTab 
          ? { ...tab, isDirty: false } 
          : tab
      )
    );
    
    toast({
      title: 'File Saved',
      description: 'Your changes have been saved.',
    });
  }, [activeTab, setOpenTabs, toast]);
  
  // Create a new file
  const createNewFile = useCallback((fileName: string) => {
    if (!fileName) return;
    
    const newFile: FileNode = {
      id: uuidv4(),
      name: fileName,
      type: 'file',
      content: '',
      language: getLanguageFromFileName(fileName)
    };
    
    setFiles(prevFiles => [...prevFiles, newFile]);
    
    handleFileSelect(newFile);
    
    toast({
      title: 'File Created',
      description: `Created new file: ${fileName}`,
    });
  }, [handleFileSelect, toast]);
  
  // Create a new folder
  const createNewFolder = useCallback((folderName: string) => {
    if (!folderName) return;
    
    const newFolder: FileNode = {
      id: uuidv4(),
      name: folderName,
      type: 'folder',
      children: [],
      isOpen: true
    };
    
    setFiles(prevFiles => [...prevFiles, newFolder]);
    
    toast({
      title: 'Folder Created',
      description: `Created new folder: ${folderName}`,
    });
  }, [toast]);
  
  // Add a file to a folder
  const addFileToFolder = useCallback((folderId: string, fileName: string) => {
    if (!fileName) return;
    
    const newFile: FileNode = {
      id: uuidv4(),
      name: fileName,
      type: 'file',
      content: '',
      language: getLanguageFromFileName(fileName)
    };
    
    setFiles(prevFiles => {
      const addFileToFolderHelper = (nodes: FileNode[]): FileNode[] => {
        return nodes.map(node => {
          if (node.id === folderId) {
            return { 
              ...node, 
              children: [...(node.children || []), newFile],
              isOpen: true
            };
          }
          if (node.children) {
            return { ...node, children: addFileToFolderHelper(node.children) };
          }
          return node;
        });
      };
      
      return addFileToFolderHelper(prevFiles);
    });
    
    handleFileSelect(newFile);
    
    toast({
      title: 'File Created',
      description: `Created new file: ${fileName}`,
    });
  }, [handleFileSelect, toast]);
  
  // Handle opening a folder (simulated)
  const handleOpenFolder = useCallback(() => {
    // In a real app, this would open a file picker
    // Here we'll just create some sample files
    
    const sampleFiles: FileNode[] = [
      {
        id: uuidv4(),
        name: 'src',
        type: 'folder',
        isOpen: true,
        children: [
          {
            id: uuidv4(),
            name: 'components',
            type: 'folder',
            isOpen: false,
            children: [
              {
                id: uuidv4(),
                name: 'Button.tsx',
                type: 'file',
                content: 'import React from "react";\n\nexport const Button = () => {\n  return <button>Click me</button>;\n};',
                language: 'typescript'
              },
              {
                id: uuidv4(),
                name: 'Input.tsx',
                type: 'file',
                content: 'import React from "react";\n\nexport const Input = () => {\n  return <input placeholder="Type here..." />;\n};',
                language: 'typescript'
              }
            ]
          },
          {
            id: uuidv4(),
            name: 'App.tsx',
            type: 'file',
            content: 'import React from "react";\nimport { Button } from "./components/Button";\nimport { Input } from "./components/Input";\n\nexport const App = () => {\n  return (\n    <div>\n      <h1>Hello World</h1>\n      <Input />\n      <Button />\n    </div>\n  );\n};',
            language: 'typescript'
          },
          {
            id: uuidv4(),
            name: 'index.tsx',
            type: 'file',
            content: 'import React from "react";\nimport ReactDOM from "react-dom/client";\nimport { App } from "./App";\n\nReactDOM.createRoot(document.getElementById("root")!).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);',
            language: 'typescript'
          }
        ]
      },
      {
        id: uuidv4(),
        name: 'package.json',
        type: 'file',
        content: '{\n  "name": "my-app",\n  "version": "0.1.0",\n  "private": true,\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0"\n  }\n}',
        language: 'json'
      },
      {
        id: uuidv4(),
        name: 'README.md',
        type: 'file',
        content: '# My Application\n\nThis is a sample application created in our VS Code clone.\n\n## Getting Started\n\n1. Install dependencies: `npm install`\n2. Start the app: `npm start`',
        language: 'markdown'
      }
    ];
    
    setFiles(sampleFiles);
    setShowWelcomeScreen(false);
    
    toast({
      title: 'Folder Opened',
      description: 'Opened sample project folder.',
    });
  }, [toast, setShowWelcomeScreen]);
  
  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    
    if (!query) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      const results = searchInFiles(files, query);
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  }, [files]);
  
  // Search in files helper
  const searchInFiles = (nodes: FileNode[], query: string): FileNode[] => {
    const results: FileNode[] = [];
    
    const searchNode = (node: FileNode) => {
      if (node.name.toLowerCase().includes(query.toLowerCase())) {
        results.push(node);
      } else if (node.type === 'file' && node.content && 
                node.content.toLowerCase().includes(query.toLowerCase())) {
        results.push(node);
      }
      
      if (node.children) {
        node.children.forEach(searchNode);
      }
    };
    
    nodes.forEach(searchNode);
    return results;
  };

  return {
    files,
    setFiles,
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    isSearching,
    setIsSearching,
    handleFileSelect,
    getLanguageFromFileName,
    toggleFolderOpen,
    handleTabSelect,
    handleTabClose,
    closeTab,
    handleFileChange,
    handleSaveFile,
    createNewFile,
    createNewFolder,
    addFileToFolder,
    handleOpenFolder,
    handleSearch,
    searchInFiles
  };
};