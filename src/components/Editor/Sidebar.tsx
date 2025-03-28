
import React from 'react';
import { ChevronDown, ChevronRight, FileText, Folder } from 'lucide-react';
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
}

const initialFiles: FileNode[] = [
  {
    id: '1',
    name: 'Project Files',
    type: 'folder',
    isOpen: true,
    children: [
      {
        id: '2',
        name: 'src',
        type: 'folder',
        isOpen: true,
        children: [
          { id: '3', name: 'App.tsx', type: 'file', language: 'typescript' },
          { id: '4', name: 'index.css', type: 'file', language: 'css' },
          { id: '5', name: 'main.tsx', type: 'file', language: 'typescript' },
        ],
      },
      {
        id: '6',
        name: 'public',
        type: 'folder',
        children: [
          { id: '7', name: 'index.html', type: 'file', language: 'html' },
          { id: '8', name: 'favicon.ico', type: 'file' },
        ],
      },
      { id: '9', name: 'package.json', type: 'file', language: 'json' },
      { id: '10', name: 'tsconfig.json', type: 'file', language: 'json' },
      { id: '11', name: 'README.md', type: 'file', language: 'markdown' },
    ],
  },
];

const FileTree: React.FC<{
  files: FileNode[];
  onFileSelect: (file: FileNode) => void;
  selectedFile?: FileNode;
  level?: number;
}> = ({ files, onFileSelect, selectedFile, level = 0 }) => {
  const [expandedFolders, setExpandedFolders] = React.useState<Record<string, boolean>>({});

  // Initialize expandedFolders based on isOpen property
  React.useEffect(() => {
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
            <div className="mr-1">
              {file.type === 'folder' ? (
                expandedFolders[file.id] ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )
              ) : (
                <FileText size={16} />
              )}
            </div>
            <span>{file.name}</span>
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

const Sidebar: React.FC<SidebarProps> = ({ activeItem, onFileSelect, selectedFile }) => {
  const [files, setFiles] = React.useState<FileNode[]>(initialFiles);

  if (activeItem !== 'Explorer') {
    return (
      <div className="w-64 bg-sidebar border-r border-border p-4">
        <div className="text-lg font-medium mb-4">{activeItem}</div>
        <div className="text-sm text-muted-foreground">
          {activeItem === 'Search' && "Search across files"}
          {activeItem === 'Source Control' && "No source control providers registered"}
          {activeItem === 'Settings' && "Editor preferences and configurations"}
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-sidebar border-r border-border h-full flex flex-col">
      <div className="p-2 flex justify-between items-center border-b border-border">
        <span className="font-medium">EXPLORER</span>
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
    </div>
  );
};

export default Sidebar;
