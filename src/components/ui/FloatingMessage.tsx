
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, X, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const FloatingMessage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I help you find your dream property in Cebu today?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Simulate AI response (this would be replaced with actual AI integration)
    setTimeout(() => {
      const responses = [
        "I can help you find properties that match your preferences. Would you like to see beachfront villas or city condos?",
        "That's a great question! Let me find some information about properties in that area for you.",
        "Cebu has some amazing investment opportunities right now. Would you like me to explain the current market trends?",
        "I can show you some of our premium listings that match those requirements. Shall I send you some details?",
      ];
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const ChatContent = () => (
    <>
      <div className="bg-bahayCebu-green p-4 flex justify-between items-center">
        <h3 className="text-white font-medium">Bahay Cebu Assistant</h3>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-bahayCebu-green/90 h-8 w-8 p-0"
          onClick={toggleChat}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <ScrollArea className="p-4 h-80">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.isUser 
                    ? 'bg-bahayCebu-green text-white rounded-br-none shadow-sm' 
                    : 'bg-gray-100 text-gray-800 rounded-bl-none shadow-sm'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <form onSubmit={handleSubmit} className="border-t p-3 flex gap-2">
        <Input
          className="flex-grow"
          placeholder="Type your message..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          autoFocus={isOpen}
        />
        <Button 
          type="submit" 
          size="icon" 
          className="bg-bahayCebu-green hover:bg-bahayCebu-green/90 transition-colors"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </>
  );

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isMobile ? (
        // Mobile view - use bottom drawer
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          {!isOpen && (
            <DrawerTrigger asChild>
              <Button 
                className="rounded-lg h-auto px-4 py-2 bg-bahayCebu-green hover:bg-bahayCebu-green/90 shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
                onClick={() => !isOpen && setIsOpen(true)}
              >
                <MessageSquare className="h-5 w-5" />
                <span>Need Help?</span>
              </Button>
            </DrawerTrigger>
          )}
          <DrawerContent className="max-h-[85vh] p-0">
            <ChatContent />
          </DrawerContent>
        </Drawer>
      ) : (
        // Desktop view - use floating window
        <>
          {isOpen ? (
            <div className="bg-white rounded-lg shadow-lg mb-4 w-80 md:w-96 overflow-hidden animate-fade-in">
              <ChatContent />
            </div>
          ) : (
            <Button 
              className="rounded-lg h-auto px-4 py-2 bg-bahayCebu-green hover:bg-bahayCebu-green/90 shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
              onClick={toggleChat}
            >
              <MessageSquare className="h-5 w-5" />
              <span>Need Help?</span>
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default FloatingMessage;
