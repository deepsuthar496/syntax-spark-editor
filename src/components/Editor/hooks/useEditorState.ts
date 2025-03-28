import { useState } from 'react';
import { FileNode, FileTab, CursorPosition } from '../EditorTypes';

export const useEditorState = () => {
  // Navigation
  const [activeItem, setActiveItem] = useState<string>('explorer');
  
  // File system
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [files, setFiles] = useState<FileNode[]>([]);
  
  // Editor state
  const [openTabs, setOpenTabs] = useState<FileTab[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [theme, setTheme] = useState<string>('vs-dark');
  const [showWelcomeScreen, setShowWelcomeScreen] = useState<boolean>(true);
  
  // UI state
  const [findReplaceVisible, setFindReplaceVisible] = useState<boolean>(false);
  const [sidebarWidth, setSidebarWidth] = useState<number>(240);
  const [fileModalOpen, setFileModalOpen] = useState<boolean>(false);
  const [folderModalOpen, setFolderModalOpen] = useState<boolean>(false);
  
  // Editor internals
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({ line: 1, column: 1 });
  const [connected, setConnected] = useState<boolean>(true);
  
  return {
    activeItem,
    setActiveItem,
    selectedFile,
    setSelectedFile,
    files,
    setFiles,
    openTabs,
    setOpenTabs,
    activeTab,
    setActiveTab,
    findReplaceVisible,
    setFindReplaceVisible,
    theme,
    setTheme,
    cursorPosition,
    setCursorPosition,
    connected,
    setConnected,
    showWelcomeScreen,
    setShowWelcomeScreen,
    sidebarWidth,
    setSidebarWidth,
    fileModalOpen,
    setFileModalOpen,
    folderModalOpen,
    setFolderModalOpen
  };
};