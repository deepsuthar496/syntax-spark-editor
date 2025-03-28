import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { X, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';

interface FindReplacePanelProps {
  onClose: () => void;
}

export const FindReplacePanel: React.FC<FindReplacePanelProps> = ({ onClose }) => {
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [showReplace, setShowReplace] = useState(false);
  const [matchCase, setMatchCase] = useState(false);
  const [matchWholeWord, setMatchWholeWord] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  
  const handleFind = () => {
    console.log('Finding:', findText, { matchCase, matchWholeWord, useRegex });
  };
  
  const handleReplace = () => {
    console.log('Replacing with:', replaceText);
  };
  
  const handleReplaceAll = () => {
    console.log('Replacing all with:', replaceText);
  };
  
  return (
    <div className="absolute top-0 right-0 bg-background border-l border-b border-border p-4 z-10 w-80 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className={!showReplace ? 'bg-muted' : ''}
            onClick={() => setShowReplace(false)}
          >
            Find
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className={showReplace ? 'bg-muted' : ''}
            onClick={() => setShowReplace(true)}
          >
            Replace
          </Button>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-3">
        <div className="space-y-1">
          <Input
            placeholder="Find"
            value={findText}
            onChange={(e) => setFindText(e.target.value)}
          />
          <div className="flex justify-end space-x-1 mt-1">
            <Button variant="ghost" size="icon" title="Previous match">
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Next match">
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {showReplace && (
          <div className="space-y-1">
            <Input
              placeholder="Replace"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
            />
            <div className="flex justify-end space-x-1 mt-1">
              <Button variant="outline" size="sm" onClick={handleReplace}>
                Replace
              </Button>
              <Button variant="outline" size="sm" onClick={handleReplaceAll}>
                Replace All
              </Button>
            </div>
          </div>
        )}
        
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="matchCase" 
              checked={matchCase} 
              onCheckedChange={(checked) => setMatchCase(checked as boolean)}
            />
            <Label htmlFor="matchCase">Match case</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="matchWholeWord" 
              checked={matchWholeWord} 
              onCheckedChange={(checked) => setMatchWholeWord(checked as boolean)}
            />
            <Label htmlFor="matchWholeWord">Match whole word</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="useRegex" 
              checked={useRegex} 
              onCheckedChange={(checked) => setUseRegex(checked as boolean)}
            />
            <Label htmlFor="useRegex">Use regular expression</Label>
          </div>
        </div>
      </div>
    </div>
  );
};