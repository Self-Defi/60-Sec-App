import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { createChatSession } from '../services/geminiService';
import { getProTips } from '../services/proTips';
import { Chat, GenerateContentResponse } from '@google/genai';

export type SelfDefiContext = "SECURE_CRYPTO" | "BACKUP_ACCOUNTS" | "AI_TRUST" | null;

interface ChatBotProps {
  context: SelfDefiContext;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const QUICK_PROMPTS = [
  "How do I safely store my crypto?",
  "How do I avoid phishing scams?",
  "What data is safe to paste into AI tools?"
];

export const ChatBot: React.FC<ChatBotProps> = ({ context }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Resizable state (defaults for desktop)
  const [size, setSize] = useState({ width: 384, height: 500 }); 
  
  const chatSession = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Re-initialize chat session when context changes
  useEffect(() => {
    chatSession.current = createChatSession(context);
    setMessages([{ 
      id: 'init', 
      role: 'model', 
      text: "Hi, I’m the Self-Defi Security Guide. I can help with crypto safety, password backups, or AI privacy — whichever path you’re taking today." 
    }]);
  }, [context]);

  // Listen for custom open events from Action Cards
  useEffect(() => {
    const handleOpenChat = (event: CustomEvent<{ prefill: string; context?: string }>) => {
      setIsOpen(true);
      if (event.detail.prefill) {
        setInputValue(event.detail.prefill);
      }
    };

    window.addEventListener('open-selfdefi-chat' as any, handleOpenChat as EventListener);
    
    return () => {
      window.removeEventListener('open-selfdefi-chat' as any, handleOpenChat as EventListener);
    };
  }, []);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || inputValue;
    if (!textToSend.trim() || !chatSession.current || isLoading) return;

    setInputValue('');
    setIsLoading(true);

    // Add user message immediately
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend.trim()
    }]);

    try {
      // Create a placeholder for the bot response
      const botMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: botMsgId,
        role: 'model',
        text: ''
      }]);

      const result = await chatSession.current.sendMessageStream({ message: textToSend.trim() });
      
      let fullText = '';
      for await (const chunk of result) {
        const chunkText = (chunk as GenerateContentResponse).text || '';
        fullText += chunkText;
        
        setMessages(prev => prev.map(msg => 
          msg.id === botMsgId 
            ? { ...msg, text: fullText }
            : msg
        ));
      }

      // Check for Pro Tips after response
      const tips = getProTips(textToSend, context);
      if (tips.length > 0) {
        const tipText = `\n\n💡 Pro tip: ${tips.join(" ")}`;
        setMessages(prev => prev.map(msg => 
          msg.id === botMsgId 
            ? { ...msg, text: fullText + tipText }
            : msg
        ));
      }

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "Sorry, I encountered an error connecting to the AI. Please try again."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Resizing Logic
  const startResizing = (mouseDownEvent: React.MouseEvent) => {
    mouseDownEvent.preventDefault();
    const startWidth = size.width;
    const startHeight = size.height;
    const startX = mouseDownEvent.clientX;
    const startY = mouseDownEvent.clientY;

    const onMouseMove = (mouseMoveEvent: MouseEvent) => {
      const newWidth = startWidth + (startX - mouseMoveEvent.clientX);
      const newHeight = startHeight + (startY - mouseMoveEvent.clientY);

      setSize({
        width: Math.max(300, Math.min(newWidth, 800)),
        height: Math.max(400, Math.min(newHeight, 800))
      });
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center group ${
          isOpen 
            ? 'bg-gray-800 text-white rotate-90' 
            : 'bg-brandOrange text-white hover:ring-4 hover:ring-brandOrange/30 hover:shadow-[0_0_20px_rgba(255,152,0,0.4)]'
        }`}
        aria-label="Open AI Assistant"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-7 h-7" />}
      </button>

      {/* Chat Window */}
      <div 
        ref={chatWindowRef}
        style={{ 
          width: isOpen ? (window.innerWidth < 640 ? 'calc(100% - 2rem)' : `${size.width}px`) : undefined,
          height: isOpen ? (window.innerWidth < 640 ? '60vh' : `${size.height}px`) : undefined
        }}
        className={`fixed z-40 flex flex-col bg-background border border-gray-800 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 ease-in-out
          ${isOpen 
            ? 'opacity-100 translate-y-0 pointer-events-auto bottom-24 right-4 sm:right-6' 
            : 'opacity-0 translate-y-12 pointer-events-none bottom-24 right-6 h-[500px] w-96'
          }
        `}
      >
        {/* Resize Handle (Desktop Only) */}
        <div 
          className="hidden sm:flex absolute top-0 left-0 w-6 h-6 cursor-nw-resize z-50 items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
          onMouseDown={startResizing}
        >
           <div className="w-2 h-2 bg-gray-500/50 rounded-full" />
        </div>

        {/* Header */}
        <div className="relative bg-gray-900/95 backdrop-blur-md p-4 border-b border-gray-800 flex items-center gap-3 flex-shrink-0">
          {/* Glowing Accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brandOrange to-brandBlue shadow-[0_0_10px_rgba(255,152,0,0.5)]" />
          
          <div className="p-2 bg-gradient-to-br from-gray-800 to-black rounded-lg border border-gray-700 shadow-inner">
            <Bot className="w-5 h-5 text-brandOrange" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm tracking-wide">Self Defi Assistant</h3>
            <p className="text-[10px] text-brandBlue/80 font-medium uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brandBlue animate-pulse shadow-[0_0_5px_#00BCD4]"></span>
              Security Guide
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-[#050608] custom-scrollbar">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border ${
                msg.role === 'user' 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-gray-900 border-brandOrange/30 text-brandOrange shadow-[0_0_10px_rgba(255,152,0,0.1)]'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              
              <div className={`max-w-[85%] p-4 text-sm leading-relaxed shadow-lg ${
                msg.role === 'user' 
                  ? 'bg-gray-800 text-white rounded-2xl rounded-tr-sm border border-gray-700' 
                  : 'bg-slate-900/80 text-gray-100 rounded-2xl rounded-tl-sm border border-slate-700 backdrop-blur-sm'
              }`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
             <div className="flex gap-3 animate-fade-in">
               <div className="w-8 h-8 rounded-full bg-gray-900 border border-brandOrange/30 text-brandOrange flex-shrink-0 flex items-center justify-center shadow-[0_0_10px_rgba(255,152,0,0.1)]">
                 <Bot className="w-4 h-4" />
               </div>
               <div className="bg-slate-900/80 border border-slate-700 p-4 rounded-2xl rounded-tl-sm flex flex-col gap-2 shadow-lg backdrop-blur-sm">
                 <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-brandOrange rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-brandOrange rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-brandOrange rounded-full animate-bounce"></div>
                 </div>
                 <span className="text-xs text-brandBlue/80 font-medium">
                   Self-Defi Assistant is preparing your answer...
                 </span>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-gray-900/95 backdrop-blur-md border-t border-gray-800 flex-shrink-0 z-10">
          {/* Quick Prompts */}
          <div className="px-4 pt-3 pb-1 flex gap-2 overflow-x-auto no-scrollbar">
             {QUICK_PROMPTS.map((prompt, idx) => (
               <button
                 key={idx}
                 onClick={() => handleSend(prompt)}
                 disabled={isLoading}
                 className="flex-shrink-0 px-3 py-1.5 rounded-full bg-gray-800/50 hover:bg-brandOrange/10 border border-gray-700 hover:border-brandOrange/50 text-xs text-textSecondary hover:text-brandOrange transition-all whitespace-nowrap"
               >
                 {prompt}
               </button>
             ))}
          </div>

          <div className="p-3 relative flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a security question..."
              className="w-full bg-black/40 border border-gray-700 text-white text-sm rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:border-brandOrange focus:ring-1 focus:ring-brandOrange/50 transition-all placeholder-gray-600"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isLoading}
              className="absolute right-5 p-1.5 bg-brandOrange text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:bg-transparent disabled:text-gray-600 transition-colors shadow-lg shadow-orange-900/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};