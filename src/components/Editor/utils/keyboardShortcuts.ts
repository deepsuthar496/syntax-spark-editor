import { KeyboardEvent } from 'react';
import { ToastAction } from "@/components/ui/toast";
import { useToast } from '@/hooks/use-toast';

// Keyboard shortcuts manager for the editor

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  preventDefault?: boolean;
  action: () => void;
  description: string;
}

/**
 * Check if a keyboard event matches a shortcut definition
 */
export const isShortcutMatch = (event: KeyboardEvent, shortcut: KeyboardShortcut): boolean => {
  const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
  const ctrlMatch = event.ctrlKey === (shortcut.ctrlKey || false);
  const shiftMatch = event.shiftKey === (shortcut.shiftKey || false);
  const altMatch = event.altKey === (shortcut.altKey || false);
  const metaMatch = event.metaKey === (shortcut.metaKey || false);
  
  return keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch;
};

/**
 * Format a keyboard shortcut for display
 */
export const formatShortcut = (shortcut: KeyboardShortcut): string => {
  const parts: string[] = [];
  
  if (shortcut.ctrlKey) parts.push('Ctrl');
  if (shortcut.altKey) parts.push('Alt');
  if (shortcut.shiftKey) parts.push('Shift');
  if (shortcut.metaKey) parts.push('Cmd');
  
  // Format the key nicely
  let key = shortcut.key;
  if (key === ' ') key = 'Space';
  if (key.length === 1) key = key.toUpperCase();
  
  parts.push(key);
  
  return parts.join('+');
};

/**
 * Create a keyboard shortcut handler for a component
 */
export const createShortcutHandler = (shortcuts: KeyboardShortcut[]) => {
  return (event: KeyboardEvent) => {
    for (const shortcut of shortcuts) {
      if (isShortcutMatch(event, shortcut)) {
        if (shortcut.preventDefault !== false) {
          event.preventDefault();
        }
        shortcut.action();
        return;
      }
    }
  };
};

/**
 * Common editor keyboard shortcuts
 */
export const getCommonEditorShortcuts = (actions: {
  saveFile: () => void;
  newFile: () => void;
  openFile: () => void;
  find: () => void;
  replace: () => void;
  formatCode: () => void;
  closeTab: () => void;
  nextTab: () => void;
  prevTab: () => void;
  undo: () => void;
  redo: () => void;
}): KeyboardShortcut[] => [
  { 
    key: 's', 
    ctrlKey: true, 
    action: actions.saveFile,
    description: 'Save file'
  },
  { 
    key: 'n', 
    ctrlKey: true, 
    action: actions.newFile,
    description: 'New file'
  },
  { 
    key: 'o', 
    ctrlKey: true, 
    action: actions.openFile,
    description: 'Open file'
  },
  { 
    key: 'f', 
    ctrlKey: true, 
    action: actions.find,
    description: 'Find'
  },
  { 
    key: 'h', 
    ctrlKey: true, 
    action: actions.replace,
    description: 'Replace'
  },
  { 
    key: 'f', 
    ctrlKey: true,
    altKey: true,
    action: actions.formatCode,
    description: 'Format code'
  },
  { 
    key: 'w', 
    ctrlKey: true, 
    action: actions.closeTab,
    description: 'Close tab'
  },
  { 
    key: 'Tab', 
    ctrlKey: true, 
    action: actions.nextTab,
    description: 'Next tab'
  },
  { 
    key: 'Tab', 
    ctrlKey: true, 
    shiftKey: true,
    action: actions.prevTab,
    description: 'Previous tab'
  },
  { 
    key: 'z', 
    ctrlKey: true, 
    action: actions.undo,
    description: 'Undo'
  },
  { 
    key: 'y', 
    ctrlKey: true, 
    action: actions.redo,
    description: 'Redo'
  },
];