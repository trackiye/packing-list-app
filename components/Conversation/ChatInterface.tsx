"use client";
import { useState, useRef, useEffect } from "react";
import { Loader2, Send, Sparkles, Wand2, ArrowRight } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  isQuestion?: boolean;
  quickReplies?: string[];
}

interface ChatInterfaceProps {
  onGenerateList: (message: string, context?: any) => void;
  isGenerating: boolean;
  tripContext?: any;
}

const SUGGESTIONS = [
  { trigger: "weekend", completion: "beach trip to Hawaii" },
  { trigger: "going to", completion: "Japan for 2 weeks" },
  { trigger: "business", completion: "conference in NYC" },
];

export default function ChatInterface({ onGenerateList, isGenerating }: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationContext, setConversationContext] = useState<any>({});
  const [awaitingAnswer, setAwaitingAnswer] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isGenerating) {
      const userMessage = { role: "user" as const, content: message };
      
      if (messages.length === 0) {
        setMessages([userMessage]);
        setAwaitingAnswer(true);
        setConversationContext({ initialTrip: message });
        
        setTimeout(() => {
          const q: Message = {
            role: "assistant",
            content: "Great! Where will you be staying?",
            isQuestion: true,
            quickReplies: ["Hotel", "Airbnb", "Friend's/Family", "Camping"]
          };
          setMessages(prev => [...prev, q]);
        }, 800);
      } else if (!conversationContext.accommodation) {
        setConversationContext(prev => ({ ...prev, accommodation: message }));
        setMessages(prev => [...prev, userMessage]);
        
        setTimeout(() => {
          const q: Message = {
            role: "assistant",
            content: "Perfect! What season/weather?",
            isQuestion: true,
            quickReplies: ["Summer/Hot", "Winter/Cold", "Spring/Mild"]
          };
          setMessages(prev => [...prev, q]);
        }, 600);
      } else {
        const ctx = { ...conversationContext, season: message };
        setMessages(prev => [...prev, userMessage]);
        onGenerateList(message, ctx);
        setAwaitingAnswer(false);
      }
      
      setMessage("");
    }
  };

  const handleQuickReply = (reply: string) => {
    setMessage(reply);
    setTimeout(() => handleSubmit({ preventDefault: () => {} } as any), 100);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
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
                  <div className="flex gap-2 mt-3">
                    {msg.quickReplies.map((reply, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuickReply(reply)}
                        className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/40 text-purple-200 rounded-full text-sm"
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
            placeholder="Describe your trip..."
            className="w-full px-6 py-5 bg-transparent text-white placeholder-white/50 resize-none focus:outline-none min-h-[140px] text-lg"
            disabled={isGenerating}
          />
          <div className="flex justify-end px-6 py-4 border-t border-white/10">
            <button
              type="submit"
              disabled={!message.trim() || isGenerating}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {messages.length === 0 ? "Start" : "Send"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
