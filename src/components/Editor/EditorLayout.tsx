
import React, { useState, useEffect, useCallback } from 'react';
import ActivityBar from './ActivityBar';
import Sidebar from './Sidebar';
import Tabs from './Tabs';
import Monaco from './Monaco';
import StatusBar from './StatusBar';
import MenuBar from './MenuBar';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { FolderPlus, FilePlus, Upload } from 'lucide-react';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  language?: string;
  children?: FileNode[];
  isOpen?: boolean;
}

interface FileTab {
  id: string;
  name: string;
  language?: string;
  content: string;
  isDirty?: boolean;
}

const EditorLayout: React.FC = () => {
  const { toast } = useToast();
  const [activeItem, setActiveItem] = useState<string>('Explorer');
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [openTabs, setOpenTabs] = useState<FileTab[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [files, setFiles] = useState<FileNode[]>([]);
  const [findReplaceVisible, setFindReplaceVisible] = useState<boolean>(false);
  const [theme, setTheme] = useState<string>("dark");
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [connected, setConnected] = useState<boolean>(true);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState<boolean>(true);
  
  // File system operations
  const handleFileSelect = (file: FileNode) => {
    if (file.type === 'file') {
      setSelectedFile(file);
      
      // Check if file is already open in a tab
      const existingTab = openTabs.find(tab => tab.id === file.id);
      if (!existingTab) {
        // Create new tab with empty content
        const newTab: FileTab = {
          id: file.id,
          name: file.name,
          language: file.language || getLanguageFromFileName(file.name),
          content: '',
          isDirty: false
        };
        
        setOpenTabs([...openTabs, newTab]);
      }
      
      // Set the tab as active
      setActiveTab(file.id);
      setShowWelcomeScreen(false);
    } else if (file.type === 'folder') {
      // Toggle folder expanded state
      setFiles(prevFiles => toggleFolderOpen(prevFiles, file.id));
    }
  };
  
  // Helper to get language from file name
  const getLanguageFromFileName = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    
    switch (extension) {
      case 'js':
        return 'javascript';
      case 'jsx':
        return 'javascript';
      case 'ts':
        return 'typescript';
      case 'tsx':
        return 'typescript';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'json':
        return 'json';
      case 'md':
        return 'markdown';
      default:
        return 'text';
    }
  };
  
  // Helper function to toggle folder open/closed
  const toggleFolderOpen = (fileNodes: FileNode[], folderId: string): FileNode[] => {
    return fileNodes.map(node => {
      if (node.id === folderId) {
        return { ...node, isOpen: !node.isOpen };
      }
      if (node.children) {
        return { ...node, children: toggleFolderOpen(node.children, folderId) };
      }
      return node;
    });
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
      setShowWelcomeScreen(false);
    }
  };
  
  const handleTabClose = (tabId: string) => {
    // Check if tab has unsaved changes
    const tab = openTabs.find(t => t.id === tabId);
    if (tab?.isDirty) {
      // Show confirmation dialog with toast
      toast({
        title: 'Unsaved changes',
        description: `Do you want to save the changes made to ${tab.name}?`,
        action: (
          <div className="flex space-x-2">
            <button 
              onClick={() => {
                // Save the file and close the tab
                handleSaveFile(tabId);
                closeTab(tabId);
              }}
              className="px-3 py-1 bg-primary text-primary-foreground rounded"
            >
              Save
            </button>
            <button 
              onClick={() => closeTab(tabId)}
              className="px-3 py-1 bg-destructive text-destructive-foreground rounded"
            >
              Don't Save
            </button>
          </div>
        ),
      });
    } else {
      closeTab(tabId);
    }
  };
  
  const closeTab = (tabId: string) => {
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
        setShowWelcomeScreen(true);
      }
    }
  };
  
  const handleFileChange = (content: string) => {
    if (!activeTab) return;
    
    // Update the content of the active tab
    setOpenTabs(prevTabs => 
      prevTabs.map(tab => 
        tab.id === activeTab 
          ? { ...tab, content, isDirty: true } 
          : tab
      )
    );
    
    // Update cursor position (simplified)
    const lines = content.split('\n');
    setCursorPosition({
      line: lines.length,
      column: lines[lines.length - 1].length + 1
    });
  };
  
  const handleSaveFile = useCallback((tabId: string = activeTab || '') => {
    if (!tabId) return;
    
    // Simulate saving the file
    setOpenTabs(prevTabs => 
      prevTabs.map(tab => 
        tab.id === tabId 
          ? { ...tab, isDirty: false } 
          : tab
      )
    );
    
    toast({
      title: 'File saved',
      description: `Changes saved successfully.`,
    });
  }, [activeTab, toast]);
  
  const handleUndo = () => {
    toast({
      title: 'Undo',
      description: 'Undo operation performed',
    });
  };
  
  const handleRedo = () => {
    toast({
      title: 'Redo',
      description: 'Redo operation performed',
    });
  };
  
  const handleSelectAll = () => {
    toast({
      title: 'Select All',
      description: 'All text selected',
    });
  };
  
  const handleFind = () => {
    setFindReplaceVisible(true);
    toast({
      title: 'Find',
      description: 'Find panel opened',
    });
  };
  
  const handleReplace = () => {
    setFindReplaceVisible(true);
    toast({
      title: 'Replace',
      description: 'Replace panel opened',
    });
  };
  
  const handleFormat = () => {
    toast({
      title: 'Format Document',
      description: 'Document formatted',
    });
  };
  
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    toast({
      title: 'Theme Changed',
      description: `Theme changed to ${newTheme}`,
    });
  };
  
  // Create a new file
  const handleNewFile = () => {
    // Generate a unique ID
    const newId = `file-${Date.now()}`;
    
    // Create new file modal to get name
    const fileName = prompt('Enter file name', 'untitled.txt');
    if (!fileName) return;
    
    // Create new file node
    const newFile: FileNode = {
      id: newId,
      name: fileName,
      type: 'file',
      language: getLanguageFromFileName(fileName)
    };
    
    // Add to root or selected folder
    if (selectedFile && selectedFile.type === 'folder') {
      // Add to selected folder
      setFiles(addFileToFolder(files, selectedFile.id, newFile));
    } else {
      // Add to root
      setFiles(prev => [...prev, newFile]);
    }
    
    // Create new tab
    const newTab: FileTab = {
      id: newId,
      name: fileName,
      language: getLanguageFromFileName(fileName),
      content: '',
      isDirty: true
    };
    
    setOpenTabs(prev => [...prev, newTab]);
    setActiveTab(newId);
    setSelectedFile(newFile);
    setShowWelcomeScreen(false);
    
    toast({
      title: 'New File Created',
      description: `${fileName} has been created`,
    });
  };
  
  // Create a new folder
  const handleNewFolder = () => {
    // Generate a unique ID
    const newId = `folder-${Date.now()}`;
    
    // Create new folder modal to get name
    const folderName = prompt('Enter folder name', 'New Folder');
    if (!folderName) return;
    
    // Create new folder node
    const newFolder: FileNode = {
      id: newId,
      name: folderName,
      type: 'folder',
      isOpen: true,
      children: []
    };
    
    // Add to root or selected folder
    if (selectedFile && selectedFile.type === 'folder') {
      // Add to selected folder
      setFiles(addFileToFolder(files, selectedFile.id, newFolder));
    } else {
      // Add to root
      setFiles(prev => [...prev, newFolder]);
    }
    
    toast({
      title: 'New Folder Created',
      description: `${folderName} has been created`,
    });
  };
  
  // Helper to add file/folder to a specific folder
  const addFileToFolder = (fileNodes: FileNode[], folderId: string, newNode: FileNode): FileNode[] => {
    return fileNodes.map(node => {
      if (node.id === folderId) {
        return { 
          ...node, 
          children: [...(node.children || []), newNode],
          isOpen: true
        };
      }
      if (node.children) {
        return { ...node, children: addFileToFolder(node.children, folderId, newNode) };
      }
      return node;
    });
  };
  
  // Open folder (simulate file picker)
  const handleOpenFolder = () => {
    // This would normally use a file picker API
    // For now, we'll just create a sample workspace
    
    const sampleWorkspace: FileNode[] = [
      {
        id: 'workspace-root',
        name: 'My Project',
        type: 'folder',
        isOpen: true,
        children: [
          {
            id: 'src-folder',
            name: 'src',
            type: 'folder',
            isOpen: true,
            children: [
              {
                id: 'app-file',
                name: 'App.tsx',
                type: 'file',
                language: 'typescript'
              },
              {
                id: 'index-file',
                name: 'index.ts',
                type: 'file',
                language: 'typescript'
              },
              {
                id: 'styles-file',
                name: 'styles.css',
                type: 'file',
                language: 'css'
              }
            ]
          },
          {
            id: 'package-json',
            name: 'package.json',
            type: 'file',
            language: 'json'
          },
          {
            id: 'readme-md',
            name: 'README.md',
            type: 'file',
            language: 'markdown'
          }
        ]
      }
    ];
    
    setFiles(sampleWorkspace);
    
    toast({
      title: 'Folder Opened',
      description: 'My Project workspace has been opened',
    });
  };
  
  // For keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Save file: Ctrl+S or Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (activeTab) {
          handleSaveFile();
        }
      }
      
      // Find: Ctrl+F or Cmd+F
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        handleFind();
      }
      
      // New File: Ctrl+N or Cmd+N
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        handleNewFile();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, handleSaveFile]);
  
  // Simulate connection status for a more realistic experience
  useEffect(() => {
    // Random connection drops for demo purposes
    const connectionTimer = setInterval(() => {
      const shouldDropConnection = Math.random() < 0.05; // 5% chance of connection drop
      
      if (shouldDropConnection && connected) {
        setConnected(false);
        
        toast({
          title: 'Connection Lost',
          description: 'Connection to server lost. Attempting to reconnect...',
          variant: 'destructive'
        });
        
        // Simulate reconnection after 2-5 seconds
        setTimeout(() => {
          setConnected(true);
          toast({
            title: 'Connected',
            description: 'Connection to server restored.',
          });
        }, 2000 + Math.random() * 3000);
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(connectionTimer);
  }, [connected, toast]);
  
  // Get the content for the active tab
  const activeContent = activeTab 
    ? openTabs.find(tab => tab.id === activeTab)?.content || ''
    : '';
    
  // Get the language for the active tab
  const activeLanguage = activeTab 
    ? openTabs.find(tab => tab.id === activeTab)?.language || 'text'
    : 'text';
  
  // Calculate editor stats
  const lineCount = activeContent ? activeContent.split('\n').length : 0;
  
  return (
    <div className={`h-screen flex flex-col bg-background text-foreground ${theme}`}>
      <MenuBar 
        onSave={handleSaveFile}
        onFormat={handleFormat}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSelectAll={handleSelectAll}
        onFind={handleFind}
        onReplace={handleReplace}
        setTheme={handleThemeChange}
        currentTheme={theme}
      />
      
      <div className="flex-1 flex">
        <ActivityBar activeItem={activeItem} setActiveItem={setActiveItem} />
        
        <Sidebar 
          activeItem={activeItem}
          onFileSelect={handleFileSelect}
          selectedFile={selectedFile || undefined}
          files={files}
        />
        
        <div className="flex-1 flex flex-col">
          <Tabs 
            tabs={openTabs} 
            activeTab={activeTab} 
            onTabSelect={handleTabSelect}
            onTabClose={handleTabClose}
          />
          
          <div className="flex-1 overflow-hidden relative">
            {activeTab ? (
              <Monaco 
                content={activeContent} 
                language={activeLanguage}
                onChange={handleFileChange}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="max-w-md text-center p-8">
                  {showWelcomeScreen && (
                    <>
                      <h2 className="text-2xl font-bold mb-4">Welcome to VS Code Clone</h2>
                      <p className="mb-6">Start by creating a new file or opening a folder.</p>
                      
                      <div className="flex flex-col gap-4 mb-6">
                        <Button 
                          onClick={handleNewFile}
                          className="flex items-center gap-2 w-full"
                          variant="outline"
                        >
                          <FilePlus size={18} />
                          <span>New File</span>
                          <span className="ml-auto text-xs bg-secondary px-2 py-0.5 rounded">Ctrl+N</span>
                        </Button>
                        
                        <Button 
                          onClick={handleNewFolder}
                          className="flex items-center gap-2 w-full"
                          variant="outline"
                        >
                          <FolderPlus size={18} />
                          <span>New Folder</span>
                        </Button>
                        
                        <Button 
                          onClick={handleOpenFolder}
                          className="flex items-center gap-2 w-full"
                          variant="outline"
                        >
                          <Upload size={18} />
                          <span>Open Folder</span>
                          <span className="ml-auto text-xs bg-secondary px-2 py-0.5 rounded">Ctrl+O</span>
                        </Button>
                      </div>
                      
                      <div className="text-left text-sm bg-muted p-4 rounded-md">
                        <h3 className="font-medium mb-2">Keyboard Shortcuts</h3>
                        <div className="grid grid-cols-2 gap-2">
                          <span>New File</span>
                          <span className="text-xs bg-secondary px-2 py-0.5 rounded justify-self-end">Ctrl+N</span>
                          <span>Save File</span>
                          <span className="text-xs bg-secondary px-2 py-0.5 rounded justify-self-end">Ctrl+S</span>
                          <span>Find in File</span>
                          <span className="text-xs bg-secondary px-2 py-0.5 rounded justify-self-end">Ctrl+F</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
            
            {findReplaceVisible && (
              <div className="find-panel">
                <input 
                  type="text" 
                  placeholder="Find" 
                  className="find-input"
                  autoFocus
                />
                <button 
                  className="find-button"
                  onClick={() => setFindReplaceVisible(false)}
                >
                  <span className="text-muted-foreground">×</span>
                </button>
                <button className="find-button">
                  <span>↑</span>
                </button>
                <button className="find-button">
                  <span>↓</span>
                </button>
                <label className="flex items-center gap-1 text-xs">
                  <input type="checkbox" className="h-3 w-3" />
                  Match Case
                </label>
                <label className="flex items-center gap-1 text-xs">
                  <input type="checkbox" className="h-3 w-3" />
                  Whole Word
                </label>
                <label className="flex items-center gap-1 text-xs">
                  <input type="checkbox" className="h-3 w-3" />
                  Regex
                </label>
              </div>
            )}
          </div>
          
          <StatusBar 
            language={activeLanguage}
            lineCount={lineCount}
            currentLine={cursorPosition.line}
            currentColumn={cursorPosition.column}
            encoding="UTF-8"
            indentation="Spaces: 2"
            eol="LF"
            connected={connected}
          />
        </div>
      </div>
    </div>
  );
};

export default EditorLayout;
