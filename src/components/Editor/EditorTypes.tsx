import React from 'react';

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  language?: string;
  children?: FileNode[];
  isOpen?: boolean;
  content?: string;
}

export interface FileTab {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  isDirty: boolean;
}

export interface CursorPosition {
  line: number;
  column: number;
}

export interface EditorContextProps {
  activeItem: string;
  setActiveItem: (item: string) => void;
  selectedFile: FileNode | null;
  setSelectedFile: (file: FileNode | null) => void;
  openTabs: FileTab[];
  setOpenTabs: (tabs: FileTab[]) => void;
  activeTab: string | null;
  setActiveTab: (tabId: string | null) => void;
  files: FileNode[];
  setFiles: (files: FileNode[]) => void;
  theme: string;
  setTheme: (theme: string) => void;
  findReplaceVisible: boolean;
  setFindReplaceVisible: (visible: boolean) => void;
  cursorPosition: CursorPosition;
  setCursorPosition: (position: CursorPosition) => void;
  connected: boolean;
  setConnected: (connected: boolean) => void;
  sidebarWidth: number;
  setSidebarWidth: (width: number) => void;
  showWelcomeScreen: boolean;
  setShowWelcomeScreen: (show: boolean) => void;
  fileModalOpen: boolean;
  setFileModalOpen: (open: boolean) => void;
  folderModalOpen: boolean;
  setFolderModalOpen: (open: boolean) => void;
}