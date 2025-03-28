import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Loader2, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatProps {
  className?: string;
}

// Persist chat messages in localStorage to prevent losing them when switching tabs
const STORAGE_KEY = 'vsclone-chat-messages';

const AIChat: React.FC<AIChatProps> = ({ className }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    // Load messages from localStorage on initial render
    const savedMessages = localStorage.getItem(STORAGE_KEY);
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom of messages whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    const userMessage = { role: 'user' as const, content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Using Pollinations API for text generation
      const url = `https://text.pollinations.ai/${encodeURIComponent(inputValue)}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const responseText = await response.text();
      
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', content: responseText }
      ]);
    } catch (error) {
      console.error('Error calling AI API:', error);
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      setMessages([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="text-sm font-medium mb-2 flex items-center justify-between">
        <div className="flex items-center">
          <Bot size={16} className="mr-2" />
          <span>AI Chat</span>
        </div>
        {messages.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearChat}
            className="text-xs h-6 px-2"
          >
            Clear
          </Button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto mb-3 bg-sidebar-accent/10 rounded p-2">
        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Bot size={24} className="mx-auto mb-2" />
              <p className="text-sm">Ask me anything about your code or tasks</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div 
                key={index} 
                className={cn(
                  "p-2 rounded-lg max-w-[80%]",
                  message.role === 'user' 
                    ? "bg-primary/20 ml-auto" 
                    : "bg-muted mr-auto"
                )}
              >
                <div className="flex items-start">
                  <div className="mr-2 mt-0.5">
                    {message.role === 'user' ? (
                      <User size={14} className="text-primary" />
                    ) : (
                      <Bot size={14} className="text-primary" />
                    )}
                  </div>
                  <div className="text-sm whitespace-pre-wrap text-foreground">
                    {message.content}
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="p-2 rounded-lg bg-muted mr-auto flex items-center">
              <Bot size={14} className="mr-2 text-primary" />
              <Loader2 size={14} className="animate-spin" />
              <span className="ml-2 text-sm">Thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <form onSubmit={sendMessage} className="mt-auto">
        <div className="relative">
          <Input 
            type="text" 
            placeholder="Ask anything..." 
            className="w-full px-3 py-1.5 bg-sidebar-accent/30 text-sm pr-10"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="sm"
            variant="ghost"
            disabled={isLoading || !inputValue.trim()}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
          >
            <Send size={14} className={isLoading ? "text-muted-foreground" : "text-primary"} />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AIChat;