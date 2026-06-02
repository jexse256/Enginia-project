import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { Send, Bot, User, ShieldCheck, Sparkles, Mic, MicOff } from 'lucide-react';

interface ChatbotViewProps {
  orderHistory: { id: string; total: number; status: string }[];
  onAddMessageTrigger?: (msg: string) => void;
  darkMode?: boolean;
}

export default function ChatbotView({ 
  orderHistory, 
  onAddMessageTrigger,
  darkMode = false 
}: ChatbotViewProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      sender: 'bot',
      text: "⚡ Hello! I am Enginia Assistant, your 24/7 personal smart technician and electronics assistant. Ask me questions about circuit breaker sizing, cable thickness, green solar panels, CCTV layouts, or trace your order status directly.\n\nType below or tap on a common topic to start!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsTyping(true);

    try {
      const chatHistory = [...messages, userMessage].map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory })
      });

      if (!res.ok) {
        throw new Error('Server connection failed');
      }

      const responseData = await res.json();
      
      const botMessage: Message = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: responseData.text || "I apologize, I've had some trouble routing that request. Please try again shortly.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      const errorMessage: Message = {
        id: 'bot-err-' + Date.now(),
        sender: 'bot',
        text: "🔌 Connection offline. I am currently running on localized troubleshooting rules. Enginia Products standard compliance is guaranteed. Check that your GEMINI_API_KEY environment variable is configured in AI Studio Secrets to unlock dynamic AI responses.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const presetTopics = [
    { title: "⚡ MCBs Rating Advice", prompt: "How do I choose the correct MCB rating for kitchen appliances like microwave and kettle?" },
    { title: "🔌 Cable Size Guide", prompt: "What wire size do you recommend for high current solar arrays?" },
    { title: "📦 Order Tracking", prompt: `Track order Status of ID: ${orderHistory[0]?.id || 'ORD-8452-ENG'}` },
    { title: "🛡️ CCTV Tech Layout", prompt: "How do I wire outdoor PTZ cameras for best security overlap?" }
  ];

  return (
    <div className={`flex flex-col h-full select-none transition-all duration-305 ${
      darkMode ? 'bg-[#0E1524] text-slate-100' : 'bg-[#FAFCFF] text-slate-800'
    }`}>
      {/* Bot Info Header */}
      <div className={`border-b p-3.5 flex items-center justify-between transition-all duration-300 ${
        darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-205'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center relative border transition-colors ${
            darkMode ? 'bg-blue-600/20 border-blue-500/30' : 'bg-blue-50 border-blue-200 shadow-3xs'
          }`}>
            <Bot className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className={`font-bold text-xs ${darkMode ? 'text-slate-100' : 'text-blue-955 font-display'}`}>Enginia Assistant</h4>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
                darkMode ? 'bg-blue-900/30 text-blue-300 border-blue-800/40' : 'bg-blue-105 text-blue-600 border-blue-200 shadow-3xs'
              }`}>Expert Agent</span>
            </div>
            <p className={`text-[10px] ${darkMode ? 'text-slate-400' : 'text-slate-500 font-semibold'}`}>Electrical Solutions 24/7 Support</p>
          </div>
        </div>

        {/* Status indicator */}
        <ShieldCheck className="w-5 h-5 text-green-505 opacity-90" />
      </div>

      {/* Messages bubble body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] rounded-2xl p-3.5 space-y-1.5 border transition ${
              message.sender === 'user' 
                ? 'bg-blue-600 border-blue-500 text-white rounded-tr-none' 
                : (darkMode 
                    ? 'bg-slate-900 text-slate-100 border-slate-800/80 rounded-tl-none' 
                    : 'bg-white text-slate-800 border-slate-200/60 rounded-tl-none shadow-3xs')
            }`}>
              {/* Sender Tag */}
              <div className={`flex justify-between items-center text-[10px] pb-0.5 border-b mb-1 ${
                message.sender === 'user' ? 'text-blue-100 border-blue-500/20' : 'text-slate-450 border-slate-100/10'
              }`}>
                <span className="font-extrabold font-mono uppercase flex items-center gap-1">
                  {message.sender === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3 text-orange-500" />}
                  {message.sender === 'user' ? 'You' : 'Enginia Bot'}
                </span>
                <span>{message.timestamp}</span>
              </div>
              
              {/* Message Content */}
              <p className="text-xs leading-relaxed whitespace-pre-line font-sans font-medium break-words">
                {message.text}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className={`rounded-2xl p-3.5 rounded-tl-none border space-y-2 ${
              darkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200/60 text-slate-700 shadow-3xs'
            }`}>
              <span className="text-[10px] text-slate-400 uppercase font-bold font-mono flex items-center gap-1 animate-pulse">
                <Bot className="w-3 h-3 text-blue-505" />
                Enginia Deciphering...
              </span>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Preset Topics Quick Access */}
      <div className={`p-3 border-t overflow-x-auto whitespace-nowrap flex gap-2 no-scrollbar scroll-smooth transition-all ${
        darkMode ? 'border-slate-850 bg-slate-950/60' : 'border-slate-150 bg-[#FAFCFF]/80'
      }`}>
        {presetTopics.map((topic, idx) => (
          <button
            key={idx}
            id={`preset-topic-${idx}`}
            onClick={() => handleSendMessage(topic.prompt)}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition duration-200 cursor-pointer shrink-0 border ${
              darkMode 
                ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200' 
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-3xs'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
            {topic.title}
          </button>
        ))}
      </div>

      {/* Input controls footer */}
      <div className={`p-3 border-t space-y-3 transition duration-300 ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-150 shadow-2xs'
      }`}>
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(userInput); }} 
          className="flex items-center gap-2"
        >
          {/* Simulated Voice Search / Voice Control button */}
          <button
            type="button"
            id="voice-search-assistant"
            onClick={() => {
              setVoiceActive(!voiceActive);
              if (!voiceActive) {
                // Simulate speaking commands
                setUserInput("Recommend the Sol-Gen Monocrystalline Solar Panel components setup...");
              }
            }}
            className={`p-2.5 rounded-xl transition cursor-pointer shrink-0 border ${
              voiceActive 
                ? 'bg-orange-500 text-white border-orange-400 animate-pulse' 
                : (darkMode ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-500')
            }`}
            title="Simulate Voice Input"
          >
            {voiceActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>

          <input
            id="assistant-chat-input"
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={voiceActive ? "Listening..." : "Ask Enginia assistant helper..."}
            className={`flex-1 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-all border ${
              darkMode 
                ? 'bg-[#0E1524] border-slate-800 focus:border-blue-500 text-slate-101 placeholder:text-slate-500'
                : 'bg-[#FAFCFF] border-slate-205 focus:border-blue-500 text-slate-805 placeholder:text-slate-400 shadow-3xs'
            }`}
          />

          <button
            id="submit-assistant-chat"
            type="submit"
            disabled={!userInput.trim() || isTyping}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-200 disabled:text-slate-400 font-bold p-2.5 rounded-xl text-white transition shrink-0 cursor-pointer shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className={`text-[9.5px] text-center select-none font-medium ${darkMode ? 'text-slate-550' : 'text-slate-450'}`}>
          Electrical safety warnings applied. Powered by Enginia Full-Stack Intelligence.
        </p>
      </div>
    </div>
  );
}
