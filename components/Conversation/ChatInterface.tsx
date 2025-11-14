"use client";
import { useState } from "react";
import { Loader2, Send, Palmtree, Mountain, Briefcase, Tent, Plane, Ship } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  isQuestion?: boolean;
  quickReplies?: string[];
}

interface ChatInterfaceProps {
  onGenerateList: (message: string, context?: any) => void;
  isGenerating: boolean;
}

const QUICK_START_SUGGESTIONS = [
  { Icon: Palmtree, text: "Beach trip to Hawaii for 1 week", color: "text-yellow-400" },
  { Icon: Mountain, text: "Ski trip to Colorado for 5 days", color: "text-blue-400" },
  { Icon: Briefcase, text: "Business trip to NYC for 3 days", color: "text-purple-400" },
  { Icon: Tent, text: "Camping in Yellowstone for 4 days", color: "text-green-400" },
  { Icon: Plane, text: "Europe backpacking for 2 weeks", color: "text-pink-400" },
  { Icon: Ship, text: "Caribbean cruise for 7 days", color: "text-cyan-400" },
];

export default function ChatInterface({ onGenerateList, isGenerating }: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationContext, setConversationContext] = useState<any>({});
  const [showSuggestions, setShowSuggestions] = useState(true);

  const handleQuickStart = (suggestion: string) => {
    const userMessage = { role: "user" as const, content: suggestion };
    setMessages([userMessage]);
    setConversationContext({ initialTrip: suggestion });
    setShowSuggestions(false);
    
    setTimeout(() => {
      const q: Message = {
        role: "assistant",
        content: "Great! Where will you be staying?",
        isQuestion: true,
        quickReplies: ["Hotel", "Airbnb", "Friend's Place", "Camping", "Hostel"]
      };
      setMessages(prev => [...prev, q]);
    }, 800);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isGenerating) {
      const userMessage = { role: "user" as const, content: message };
      
      if (messages.length === 0) {
        setMessages([userMessage]);
        setConversationContext({ initialTrip: message });
        setShowSuggestions(false);
        
        setTimeout(() => {
          const q: Message = {
            role: "assistant",
            content: "Great! Where will you be staying?",
            isQuestion: true,
            quickReplies: ["Hotel", "Airbnb", "Friend's Place", "Camping", "Hostel"]
          };
          setMessages(prev => [...prev, q]);
        }, 800);
      } else if (!conversationContext.accommodation) {
        setConversationContext(prev => ({ ...prev, accommodation: message }));
        setMessages(prev => [...prev, userMessage]);
        
        setTimeout(() => {
          const q: Message = {
            role: "assistant",
            content: "Perfect! What's the weather/season?",
            isQuestion: true,
            quickReplies: ["Summer/Hot ☀️", "Winter/Cold ❄️", "Spring/Mild 🌸", "Fall/Cool 🍂"]
          };
          setMessages(prev => [...prev, q]);
        }, 600);
      } else {
        const ctx = { ...conversationContext, season: message };
        setMessages(prev => [...prev, userMessage]);
        onGenerateList(message, ctx);
      }
      
      setMessage("");
    }
  };

  const handleQuickReply = (reply: string) => {
    const userMessage = { role: "user" as const, content: reply };
    setMessages(prev => [...prev, userMessage]);
    
    if (!conversationContext.accommodation) {
      setConversationContext(prev => ({ ...prev, accommodation: reply }));
      setTimeout(() => {
        const q: Message = {
          role: "assistant",
          content: "Perfect! What's the weather/season?",
          isQuestion: true,
          quickReplies: ["Summer/Hot ☀️", "Winter/Cold ❄️", "Spring/Mild 🌸", "Fall/Cool 🍂"]
        };
        setMessages(prev => [...prev, q]);
      }, 600);
    } else {
      const ctx = { ...conversationContext, season: reply };
      onGenerateList(reply, ctx);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {showSuggestions && messages.length === 0 && (
        <div className="mb-8">
          <h3 className="text-white/80 text-sm font-medium mb-4 text-center">
            Quick Start - Choose a trip:
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {QUICK_START_SUGGESTIONS.map((sug, idx) => {
              const Icon = sug.Icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleQuickStart(sug.text)}
                  className="glass-medium p-4 rounded-xl hover:bg-white/15 transition-all text-left group hover:scale-105"
                >
                  <Icon className={`w-8 h-8 mb-2 ${sug.color}`} />
                  <div className="text-white text-sm">{sug.text}</div>
                </button>
              );
            })}
          </div>
          <div className="text-center mt-6 text-white/50 text-sm">
            Or describe your own trip below ↓
          </div>
        </div>
      )}

      {messages.length > 0 && (
        <div className="mb-6 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] ${msg.role === "user" ? "" : "w-full"}`}>
                <div className={`px-4 py-3 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "bg-white/10 text-white border border-white/20"
                }`}>
                  {msg.content}
                </div>
                {msg.quickReplies && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {msg.quickReplies.map((reply, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuickReply(reply)}
                        className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/40 text-purple-200 rounded-full text-sm transition-all hover:scale-105"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border-2 border-white/20">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={messages.length === 0 ? "Describe your trip... (e.g., 'Weekend trip to Paris')" : "Type your answer..."}
            className="w-full px-6 py-5 bg-transparent text-white placeholder-white/50 resize-none focus:outline-none min-h-[120px] text-lg"
            disabled={isGenerating}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <div className="flex justify-end px-6 py-4 border-t border-white/10">
            <button
              type="submit"
              disabled={!message.trim() || isGenerating}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold disabled:opacity-50 hover:shadow-lg transition-all"
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {messages.length === 0 ? "Start Packing" : "Send"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
