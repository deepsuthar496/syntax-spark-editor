import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FilePlus, FolderPlus } from 'lucide-react';

interface FileCreateModalProps {
  type: 'file' | 'folder';
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
  title?: string;
  defaultValue?: string;
}

const FileCreateModal: React.FC<FileCreateModalProps> = ({
  type,
  isOpen,
  onClose,
  onConfirm,
  title,
  defaultValue = type === 'file' ? 'untitled.txt' : 'New Folder',
}) => {
  const [name, setName] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset the name when the modal is opened
  useEffect(() => {
    if (isOpen) {
      setName(defaultValue);
      // Focus the input after a short delay (to ensure the modal is rendered)
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 50);
    }
  }, [isOpen, defaultValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onConfirm(name.trim());
      onClose();
    }
  };

  const modalTitle = title || (type === 'file' ? 'Create New File' : 'Create New Folder');
  const icon = type === 'file' ? <FilePlus className="mr-2 h-4 w-4" /> : <FolderPlus className="mr-2 h-4 w-4" />;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {icon}
            {modalTitle}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                ref={inputRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck="false"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FileCreateModal;