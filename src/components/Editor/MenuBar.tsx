
import React from 'react';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarCheckboxItem,
} from "@/components/ui/menubar";
import { useToast } from '@/hooks/use-toast';

interface MenuBarProps {
  onSave: () => void;
  onFormat: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onSelectAll: () => void;
  onFind: () => void;
  onReplace: () => void;
  setTheme: (theme: string) => void;
  currentTheme: string;
}

const MenuBar: React.FC<MenuBarProps> = ({
  onSave,
  onFormat,
  onUndo,
  onRedo,
  onSelectAll,
  onFind,
  onReplace,
  setTheme,
  currentTheme
}) => {
  const { toast } = useToast();

  const showFeatureNotification = (feature: string) => {
    toast({
      title: "Feature not implemented",
      description: `${feature} is not implemented in this version.`,
    });
  };

  return (
    <Menubar className="border-b border-border h-8 rounded-none px-1.5 bg-sidebar">
      <MenubarMenu>
        <MenubarTrigger className="text-xs">File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => showFeatureNotification("New File")}>
            New File
            <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={() => showFeatureNotification("New Folder")}>
            New Folder
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={onSave}>
            Save
            <MenubarShortcut>⌘S</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={() => showFeatureNotification("Save As")}>
            Save As...
            <MenubarShortcut>⇧⌘S</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={() => showFeatureNotification("Exit")}>
            Exit
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger className="text-xs">Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={onUndo}>
            Undo
            <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={onRedo}>
            Redo
            <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={() => showFeatureNotification("Cut")}>
            Cut
            <MenubarShortcut>⌘X</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={() => showFeatureNotification("Copy")}>
            Copy
            <MenubarShortcut>⌘C</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={() => showFeatureNotification("Paste")}>
            Paste
            <MenubarShortcut>⌘V</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={onFind}>
            Find
            <MenubarShortcut>⌘F</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={onReplace}>
            Replace
            <MenubarShortcut>⌘H</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={onSelectAll}>
            Select All
            <MenubarShortcut>⌘A</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger className="text-xs">View</MenubarTrigger>
        <MenubarContent>
          <MenubarSub>
            <MenubarSubTrigger>Appearance</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarCheckboxItem 
                checked={currentTheme === "dark"}
                onClick={() => setTheme("dark")}
              >
                Dark Theme
              </MenubarCheckboxItem>
              <MenubarCheckboxItem 
                checked={currentTheme === "light"}
                onClick={() => setTheme("light")}
              >
                Light Theme
              </MenubarCheckboxItem>
              <MenubarCheckboxItem 
                checked={currentTheme === "system"}
                onClick={() => setTheme("system")}
              >
                System Theme
              </MenubarCheckboxItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarItem onClick={() => showFeatureNotification("Toggle Terminal")}>
            Toggle Terminal
            <MenubarShortcut>⌘J</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={() => showFeatureNotification("Toggle Sidebar")}>
            Toggle Sidebar
            <MenubarShortcut>⌘B</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={() => showFeatureNotification("Toggle Status Bar")}>
            Toggle Status Bar
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger className="text-xs">Run</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => showFeatureNotification("Run")}>
            Run
            <MenubarShortcut>F5</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={() => showFeatureNotification("Debug")}>
            Debug
            <MenubarShortcut>⇧F5</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={() => showFeatureNotification("Toggle Breakpoint")}>
            Toggle Breakpoint
            <MenubarShortcut>F9</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger className="text-xs">Help</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => showFeatureNotification("Documentation")}>
            Documentation
          </MenubarItem>
          <MenubarItem onClick={() => showFeatureNotification("About")}>
            About
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default MenuBar;
