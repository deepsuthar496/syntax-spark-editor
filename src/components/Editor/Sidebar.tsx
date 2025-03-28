import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  FileText, 
  Folder, 
  FolderOpen, 
  Code, 
  File, 
  FilePlus, 
  FolderPlus, 
  RefreshCw, 
  Search, 
  Loader2, 
  Bot,
  FileJson,
  Coffee,
  FileImage,
  Database,
  FileSpreadsheet,
  FileAudio,
  FileVideo,
  PencilRuler,
  Package,
  FileCode,
  FileCog,
  FileTerminal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import AIChat from './AIChat';

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
  width?: number;
  className?: string;
  onNewFile?: () => void;
  onNewFolder?: () => void;
  onRefresh?: () => void;
  searchQuery?: string;
  onSearch?: (query: string) => void;
  searchResults?: FileNode[];
  isSearching?: boolean;
}

// Enhanced file icon function based on extension
const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  // Programming languages
  switch (extension) {
    // JavaScript
    case 'js':
      return <Code size={16} className="text-yellow-400" />;
    case 'jsx':
      return <Code size={16} className="text-yellow-400" />;
    case 'mjs':
      return <Code size={16} className="text-yellow-400" />;
      
    // TypeScript
    case 'ts':
      return <Code size={16} className="text-blue-400" />;
    case 'tsx':
      return <Code size={16} className="text-blue-400" />;
    case 'dts':
      return <Code size={16} className="text-blue-400" />;
      
    // Web
    case 'html':
      return <Code size={16} className="text-orange-400" />;
    case 'css':
      return <Code size={16} className="text-purple-400" />;
    case 'scss':
      return <Code size={16} className="text-pink-400" />;
    case 'sass':
      return <Code size={16} className="text-pink-400" />;
    case 'less':
      return <Code size={16} className="text-indigo-400" />;
    
    // Python
    case 'py':
    case 'pyw':
    case 'ipynb':
      return <FileCode size={16} className="text-green-400" />;
    
    // Ruby
    case 'rb':
    case 'erb':
      return <FileCode size={16} className="text-red-500" />;
    
    // PHP
    case 'php':
      return <FileCode size={16} className="text-purple-500" />;
    
    // Java
    case 'java':
      return <Coffee size={16} className="text-red-400" />;
    
    // C-family
    case 'c':
      return <FileCode size={16} className="text-blue-500" />;
    case 'cpp':
    case 'cc':
    case 'cxx':
      return <FileCode size={16} className="text-blue-600" />;
    case 'h':
    case 'hpp':
      return <FileCode size={16} className="text-blue-300" />;
    case 'cs':
      return <FileCode size={16} className="text-green-500" />;
    
    // Go
    case 'go':
      return <FileCode size={16} className="text-cyan-400" />;
    
    // Rust
    case 'rs':
      return <FileCode size={16} className="text-orange-600" />;
    
    // Swift
    case 'swift':
      return <FileCode size={16} className="text-orange-500" />;
    
    // Kotlin
    case 'kt':
    case 'kts':
      return <FileCode size={16} className="text-purple-400" />;
    
    // Data formats
    case 'json':
      return <FileJson size={16} className="text-yellow-400" />;
    case 'xml':
      return <FileText size={16} className="text-orange-300" />;
    case 'yaml':
    case 'yml':
      return <FileText size={16} className="text-cyan-300" />;
    case 'toml':
      return <FileText size={16} className="text-gray-400" />;
    case 'csv':
    case 'tsv':
      return <FileSpreadsheet size={16} className="text-green-300" />;
    
    // SQL
    case 'sql':
    case 'sqlite':
      return <Database size={16} className="text-blue-300" />;
    
    // Markdown & Documentation
    case 'md':
      return <FileText size={16} className="text-white" />;
    case 'txt':
      return <FileText size={16} className="text-gray-300" />;
    case 'pdf':
      return <FileText size={16} className="text-red-400" />;
    case 'doc':
    case 'docx':
      return <FileText size={16} className="text-blue-500" />;
    
    // Config files
    case 'env':
    case 'gitignore':
    case 'npmrc':
    case 'editorconfig':
      return <FileCog size={16} className="text-gray-400" />;
    case 'eslintrc':
    case 'prettierrc':
      return <FileCog size={16} className="text-purple-300" />;
    
    // Shell scripts
    case 'sh':
    case 'bash':
    case 'zsh':
    case 'fish':
    case 'bat':
    case 'cmd':
    case 'ps1':
      return <FileTerminal size={16} className="text-gray-300" />;
    
    // Package related
    case 'json5':
    case 'lock':
      return <Package size={16} className="text-yellow-300" />;
    
    // Images
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'webp':
    case 'svg':
    case 'ico':
    case 'bmp':
      return <FileImage size={16} className="text-blue-400" />;
    
    // Audio
    case 'mp3':
    case 'wav':
    case 'ogg':
    case 'flac':
    case 'm4a':
      return <FileAudio size={16} className="text-green-400" />;
    
    // Video
    case 'mp4':
    case 'webm':
    case 'avi':
    case 'mov':
    case 'mkv':
      return <FileVideo size={16} className="text-red-400" />;
    
    // Design
    case 'ai':
    case 'psd':
    case 'xd':
    case 'sketch':
    case 'fig':
      return <PencilRuler size={16} className="text-purple-400" />;
    
    // Default
    default:
      return <FileText size={16} className="text-gray-400" />;
  }
};

const SearchResult: React.FC<{
  file: FileNode;
  onFileSelect: (file: FileNode) => void;
  selectedFile?: FileNode;
}> = ({ file, onFileSelect, selectedFile }) => {
  return (
    <div 
      className={cn(
        "flex items-center py-1 px-2 hover:bg-sidebar-accent/30 rounded cursor-pointer",
        selectedFile?.id === file.id && "bg-sidebar-accent/20 text-sidebar-foreground"
      )}
      onClick={() => onFileSelect(file)}
    >
      <div className="mr-1.5">
        {file.type === 'folder' ? (
          <Folder size={16} className="text-yellow-400" />
        ) : (
          getFileIcon(file.name)
        )}
      </div>
      <span className="truncate text-sm">{file.name}</span>
    </div>
  );
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
              "flex items-center py-1 px-2 hover:bg-sidebar-accent/30 rounded cursor-pointer",
              selectedFile?.id === file.id && "bg-sidebar-accent/20 text-sidebar-foreground"
            )}
            onClick={() => file.type === 'folder' ? toggleFolder(file.id) : onFileSelect(file)}
          >
            <div className="mr-1">
              {file.type === 'folder' ? (
                expandedFolders[file.id] ? (
                  <ChevronDown size={16} className="text-muted-foreground" />
                ) : (
                  <ChevronRight size={16} className="text-muted-foreground" />
                )
              ) : (
                <div className="w-4"></div>
              )}
            </div>
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
            <span className="truncate text-sm">{file.name}</span>
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

const Sidebar: React.FC<SidebarProps> = ({ 
  activeItem, 
  onFileSelect, 
  selectedFile, 
  files, 
  width = 240,
  className,
  onNewFile,
  onNewFolder,
  onRefresh,
  searchQuery = '',
  onSearch,
  searchResults = [],
  isSearching = false
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Update local search query when prop changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setLocalSearchQuery(newQuery);
    
    // Debounce search to avoid too many searches while typing
    const timeoutId = setTimeout(() => {
      onSearch?.(newQuery);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  };

  // Handle form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(localSearchQuery);
  };

  // Return appropriate content based on active item
  const renderSidebarContent = () => {
    switch (activeItem) {
      case 'Explorer':
        return (
          <>
            <div className="px-4 py-2 flex justify-between items-center text-xs uppercase tracking-wide">
              <div className="flex items-center space-x-1">
                <span className="font-medium opacity-80">Explorer</span>
                <button 
                  className="opacity-70 hover:opacity-100" 
                  onClick={() => onRefresh?.()}
                  title="Refresh Explorer"
                >
                  <RefreshCw size={12} />
                </button>
              </div>
              <div className="flex items-center space-x-1">
                <button 
                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-sidebar-accent/20" 
                  onClick={() => onNewFile?.()}
                  title="New File"
                >
                  <FilePlus size={14} />
                </button>
                <button 
                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-sidebar-accent/20" 
                  onClick={() => onNewFolder?.()}
                  title="New Folder"
                >
                  <FolderPlus size={14} />
                </button>
                <button className="opacity-70 hover:opacity-100">
                  <ChevronDown size={14} />
                </button>
              </div>
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
          <div className="p-4 flex flex-col h-full">
            <div className="text-sm font-medium mb-2 flex items-center">
              <Search size={16} className="mr-2" />
              <span>Search</span>
            </div>
            
            <form onSubmit={handleSearchSubmit} className="mb-3">
              <div className="relative">
                <Input 
                  type="text" 
                  placeholder="Search in files..." 
                  className="w-full px-3 py-1.5 bg-sidebar-accent/30 text-sm pr-8"
                  value={localSearchQuery}
                  onChange={handleSearchChange}
                />
                {isSearching && (
                  <Loader2 size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 animate-spin text-muted-foreground" />
                )}
              </div>
            </form>
            
            <div className="flex-1 overflow-y-auto">
              {searchResults.length > 0 ? (
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground mb-1 px-2 flex justify-between">
                    <span>{searchResults.length} results</span>
                  </div>
                  {searchResults.map(file => (
                    <SearchResult 
                      key={file.id} 
                      file={file} 
                      onFileSelect={onFileSelect}
                      selectedFile={selectedFile}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-xs text-muted-foreground mt-2">
                  {isSearching ? 
                    'Searching...' : 
                    localSearchQuery ? 
                      'No results found.' : 
                      'Type to search in workspace.'
                  }
                </div>
              )}
            </div>
          </div>
        );

      case 'AI Chat':
        return <AIChat />;
      
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
              <div className="text-xs hover:bg-sidebar-accent/30 p-1 rounded cursor-pointer">User Settings</div>
              <div className="text-xs hover:bg-sidebar-accent/30 p-1 rounded cursor-pointer">Workspace Settings</div>
              <div className="text-xs hover:bg-sidebar-accent/30 p-1 rounded cursor-pointer">Keyboard Shortcuts</div>
              <div className="text-xs hover:bg-sidebar-accent/30 p-1 rounded cursor-pointer">Color Theme</div>
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
    <div 
      className={cn(
        "bg-sidebar border-r border-border h-full flex flex-col",
        className
      )}
      style={{ width, minWidth: 120 }}
    >
      {renderSidebarContent()}
    </div>
  );
};

export default Sidebar;
