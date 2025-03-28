
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, FileText, Folder, FolderOpen, Code, File } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  language?: string;
  children?: FileNode[];
  isOpen?: boolean;
}

interface SidebarProps {
  activeItem: string;
  onFileSelect: (file: FileNode) => void;
  selectedFile?: FileNode;
  files: FileNode[];
}

// Get icon for file based on extension
const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'js':
      return <Code size={16} className="text-yellow-400" />;
    case 'jsx':
      return <Code size={16} className="text-yellow-400" />;
    case 'ts':
      return <Code size={16} className="text-blue-400" />;
    case 'tsx':
      return <Code size={16} className="text-blue-400" />;
    case 'html':
      return <Code size={16} className="text-orange-400" />;
    case 'css':
      return <Code size={16} className="text-purple-400" />;
    case 'json':
      return <Code size={16} className="text-yellow-400" />;
    case 'md':
      return <FileText size={16} className="text-white" />;
    case 'ico':
      return <File size={16} className="text-blue-400" />;
    default:
      return <FileText size={16} />;
  }
};

const FileTree: React.FC<{
  files: FileNode[];
  onFileSelect: (file: FileNode) => void;
  selectedFile?: FileNode;
  level?: number;
}> = ({ files, onFileSelect, selectedFile, level = 0 }) => {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

  // Initialize expandedFolders based on isOpen property
  useEffect(() => {
    const initialExpandedState: Record<string, boolean> = {};
    const processNodes = (nodes: FileNode[]) => {
      nodes.forEach(node => {
        if (node.type === 'folder') {
          initialExpandedState[node.id] = node.isOpen || false;
          if (node.children) {
            processNodes(node.children);
          }
        }
      });
    };
    
    processNodes(files);
    setExpandedFolders(initialExpandedState);
  }, [files]);

  const toggleFolder = (id: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="pl-4">
      {files.map((file) => (
        <div key={file.id}>
          <div 
            className={cn(
              "flex items-center py-1 px-2 hover:bg-sidebar-accent/50 rounded cursor-pointer",
              selectedFile?.id === file.id && "bg-sidebar-accent text-sidebar-foreground"
            )}
            onClick={() => file.type === 'folder' ? toggleFolder(file.id) : onFileSelect(file)}
          >
            <div className="mr-1.5">
              {file.type === 'folder' ? (
                expandedFolders[file.id] ? (
                  <FolderOpen size={16} className="text-yellow-400" />
                ) : (
                  <Folder size={16} className="text-yellow-400" />
                )
              ) : (
                getFileIcon(file.name)
              )}
            </div>
            <span className="truncate">{file.name}</span>
          </div>
          {file.type === 'folder' && expandedFolders[file.id] && file.children && (
            <FileTree
              files={file.children}
              onFileSelect={onFileSelect}
              selectedFile={selectedFile}
              level={level + 1}
            />
          )}
        </div>
      ))}
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ activeItem, onFileSelect, selectedFile, files }) => {
  // Return appropriate content based on active item
  const renderSidebarContent = () => {
    switch (activeItem) {
      case 'Explorer':
        return (
          <>
            <div className="p-2 flex justify-between items-center">
              <span className="font-medium text-xs uppercase">EXPLORER</span>
              <Button variant="ghost" size="icon" className="h-5 w-5">
                <ChevronDown size={16} />
              </Button>
            </div>
            <div className="overflow-y-auto flex-grow">
              <FileTree 
                files={files} 
                onFileSelect={onFileSelect} 
                selectedFile={selectedFile} 
              />
            </div>
          </>
        );
      
      case 'Search':
        return (
          <div className="p-4">
            <div className="text-sm font-medium mb-2">Search</div>
            <input 
              type="text" 
              placeholder="Search in files..." 
              className="w-full px-3 py-1.5 bg-sidebar-accent rounded text-sm"
            />
            <div className="mt-4 text-xs text-muted-foreground">No results yet. Type to search.</div>
          </div>
        );
      
      case 'Source Control':
        return (
          <div className="p-4">
            <div className="text-sm font-medium mb-2">Source Control</div>
            <div className="mt-2 text-xs text-muted-foreground">No source control providers registered</div>
          </div>
        );
      
      case 'Settings':
        return (
          <div className="p-4">
            <div className="text-sm font-medium mb-2">Settings</div>
            <div className="flex flex-col gap-2 mt-2">
              <div className="text-xs hover:bg-sidebar-accent p-1 rounded cursor-pointer">User Settings</div>
              <div className="text-xs hover:bg-sidebar-accent p-1 rounded cursor-pointer">Workspace Settings</div>
              <div className="text-xs hover:bg-sidebar-accent p-1 rounded cursor-pointer">Keyboard Shortcuts</div>
              <div className="text-xs hover:bg-sidebar-accent p-1 rounded cursor-pointer">Color Theme</div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="p-4 text-sm text-muted-foreground">Select an activity from the sidebar</div>
        );
    }
  };

  return (
    <div className="w-64 bg-sidebar border-r border-border h-full flex flex-col">
      {renderSidebarContent()}
    </div>
  );
};

export default Sidebar;
