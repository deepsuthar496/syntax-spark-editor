import { v4 as uuidv4 } from 'uuid';
import { FileNode, FileOperationResult } from '../EditorTypes';

// File utilities for handling file operations and detecting file types

// Helper function to get file extension
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

/**
 * Determine the programming language from a file name/extension
 * for syntax highlighting and other language-specific features
 */
export function getLanguageFromFileName(filename: string): string {
  const extension = getFileExtension(filename);
  
  return getLanguageFromExtension(extension);
}

/**
 * Get a language ID from a file extension
 */
export const getLanguageFromExtension = (extension: string): string => {
  const extensionMap: Record<string, string> = {
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'html': 'html',
    'css': 'css',
    'scss': 'scss',
    'json': 'json',
    'md': 'markdown',
    'py': 'python',
    'java': 'java',
    'c': 'c',
    'cpp': 'cpp',
    'cs': 'csharp',
    'go': 'go',
    'rs': 'rust',
    'rb': 'ruby',
    'php': 'php',
    'swift': 'swift',
    'kt': 'kotlin',
    'sh': 'shell',
    'yaml': 'yaml',
    'yml': 'yaml',
    'toml': 'toml',
    'xml': 'xml',
    'sql': 'sql',
    'graphql': 'graphql',
    'lua': 'lua',
    'dart': 'dart',
    'r': 'r',
    'dockerfile': 'dockerfile',
  };
  
  return extensionMap[extension.toLowerCase()] || 'plaintext';
};

/**
 * Get a file icon based on file extension or name
 */
export const getFileIcon = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  // Special cases for certain file names
  if (fileName === 'package.json') return '📦';
  if (fileName === 'tsconfig.json') return '⚙️';
  if (fileName === 'README.md') return '📄';
  if (fileName === '.gitignore') return '👁️';
  
  // Extension-based icons
  const extensionIcons: Record<string, string> = {
    'js': '🟨',
    'jsx': '⚛️',
    'ts': '🔷',
    'tsx': '🔶',
    'html': '🌐',
    'css': '🎨',
    'scss': '💅',
    'json': '📋',
    'md': '📝',
    'py': '🐍',
    'java': '☕',
    'c': '🔠',
    'cpp': '🔣',
    'cs': '#️⃣',
    'go': '🐹',
    'rs': '🦀',
    'rb': '💎',
    'php': '🐘',
    'swift': '🦅',
    'kt': 'K',
    'sh': '📜',
    'yaml': '⚙️',
    'yml': '⚙️',
    'toml': '⚙️',
    'xml': '📑',
    'sql': '🗄️',
    'graphql': '◯',
    'lua': '🌙',
    'dart': '🎯',
    'r': 'R',
    'dockerfile': '🐳',
  };
  
  return extensionIcons[extension] || '📄';
};

/**
 * Get a folder icon based on folder name
 */
export const getFolderIcon = (folderName: string, isOpen: boolean = false): string => {
  // Special cases for certain folder names
  if (folderName.toLowerCase() === 'node_modules') return '📦';
  if (folderName.toLowerCase() === 'src') return '🔄';
  if (folderName.toLowerCase() === 'components') return '🧩';
  if (folderName.toLowerCase() === 'assets') return '🖼️';
  if (folderName.toLowerCase() === 'public') return '🌐';
  if (folderName.toLowerCase() === 'dist') return '📦';
  if (folderName.toLowerCase() === 'build') return '🏗️';
  if (folderName.toLowerCase() === 'config') return '⚙️';
  if (folderName.toLowerCase() === 'test' || folderName.toLowerCase() === 'tests') return '🧪';
  if (folderName.toLowerCase() === 'docs') return '📚';
  if (folderName.toLowerCase() === '.git') return '🔄';
  
  // Default folder icon
  return isOpen ? '📂' : '📁';
};

/**
 * Check if a file is binary (non-text) based on its extension
 */
export function isBinaryFile(fileName: string): boolean {
  const extension = getFileExtension(fileName);
  const binaryExtensions = [
    'png', 'jpg', 'jpeg', 'gif', 'bmp', 'ico', 'webp', 'tiff',
    'mp3', 'mp4', 'wav', 'ogg', 'webm', 'avi', 'mov',
    'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
    'zip', 'rar', 'tar', 'gz', '7z',
    'exe', 'dll', 'so', 'class'
  ];
  
  return binaryExtensions.includes(extension);
}

/**
 * Generate sample content for a new file based on its type
 */
export function generateSampleContent(fileName: string): string {
  const extension = getFileExtension(fileName);
  
  switch (extension) {
    case 'html':
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  
</body>
</html>`;
    case 'css':
      return `/* Styles for ${fileName} */
body {
  font-family: sans-serif;
  margin: 0;
  padding: 20px;
}
`;
    case 'js':
    case 'jsx':
      return `// JavaScript code for ${fileName}
function main() {
  console.log('Hello, world!');
}

main();
`;
    case 'ts':
    case 'tsx':
      return `// TypeScript code for ${fileName}
function main(): void {
  console.log('Hello, world!');
}

main();
`;
    case 'md':
      return `# ${fileName.replace('.md', '')}

## Introduction

Write your content here.
`;
    case 'json':
      return `{
  "name": "${fileName.replace('.json', '')}",
  "version": "1.0.0",
  "description": ""
}`;
    default:
      return `// File content for ${fileName}`;
  }
}

// Create a new file node
export function createFileNode(name: string, type: 'file' | 'folder', content: string = ''): FileNode {
  return {
    id: uuidv4(),
    name,
    type,
    content,
    language: type === 'file' ? getLanguageFromFileName(name) : undefined,
    children: type === 'folder' ? [] : undefined,
    isOpen: type === 'folder' ? false : undefined
  };
}

// Find a node in the file tree by id
export function findNodeById(nodes: FileNode[], id: string): FileNode | null {
  for (const node of nodes) {
    if (node.id === id) {
      return node;
    }
    
    if (node.type === 'folder' && node.children) {
      const foundInChild = findNodeById(node.children, id);
      if (foundInChild) {
        return foundInChild;
      }
    }
  }
  
  return null;
}

// Find a node's parent in the file tree
export function findParentNodeById(nodes: FileNode[], id: string, parent: FileNode | null = null): FileNode | null {
  for (const node of nodes) {
    if (node.id === id) {
      return parent;
    }
    
    if (node.type === 'folder' && node.children) {
      const foundParent = findParentNodeById(node.children, id, node);
      if (foundParent) {
        return foundParent;
      }
    }
  }
  
  return null;
}

// Add a new child to a folder node
export function addChildToFolder(nodes: FileNode[], folderId: string, newChild: FileNode): FileOperationResult {
  const folderNode = findNodeById(nodes, folderId);
  
  if (!folderNode) {
    return { success: false, message: 'Folder not found' };
  }
  
  if (folderNode.type !== 'folder') {
    return { success: false, message: 'Target is not a folder' };
  }
  
  // Check if a file/folder with the same name already exists
  if (folderNode.children?.some(child => child.name === newChild.name)) {
    return { success: false, message: `A ${newChild.type} with the name "${newChild.name}" already exists` };
  }
  
  // Add the new child to the folder
  folderNode.children = [...(folderNode.children || []), newChild];
  
  return { success: true, message: `${newChild.type} created successfully`, data: newChild };
}

// Search for files/folders by name or content
export function searchInFiles(
  nodes: FileNode[], 
  searchTerm: string, 
  matchContent: boolean = true,
  caseSensitive: boolean = false
): FileNode[] {
  const results: FileNode[] = [];
  
  const searchTermProcessed = caseSensitive ? searchTerm : searchTerm.toLowerCase();
  
  const searchNode = (node: FileNode) => {
    const nameProcessed = caseSensitive ? node.name : node.name.toLowerCase();
    
    // Match by name
    if (nameProcessed.includes(searchTermProcessed)) {
      results.push(node);
    }
    // Match by content (for files only)
    else if (matchContent && node.type === 'file' && node.content) {
      const contentProcessed = caseSensitive ? node.content : node.content.toLowerCase();
      if (contentProcessed.includes(searchTermProcessed)) {
        results.push(node);
      }
    }
    
    // Search in children for folders
    if (node.type === 'folder' && node.children) {
      node.children.forEach(searchNode);
    }
  };
  
  nodes.forEach(searchNode);
  
  return results;
}