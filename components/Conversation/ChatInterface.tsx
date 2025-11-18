"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Loader2, Send, Palmtree, Mountain, Briefcase, Tent, Plane, Ship, Sun, Snowflake, CloudRain, Wind } from "lucide-react";

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

const WEATHER_ICONS = {
  "Summer/Hot": Sun,
  "Winter/Cold": Snowflake,
  "Spring/Mild": CloudRain,
  "Fall/Cool": Wind,
};

export default function ChatInterface({ onGenerateList, isGenerating }: ChatInterfaceProps) {
  const { data: session } = useSession();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationContext, setConversationContext] = useState<any>({});
  const [showSuggestions, setShowSuggestions] = useState(true);

  const parseInitialTrip = (tripText: string) => {
    const durationMatch = tripText.match(/(\d+)\s+(day|week|month)s?/i);
    const duration = durationMatch ? parseInt(durationMatch[1]) * (durationMatch[2].toLowerCase().includes('week') ? 7 : durationMatch[2].toLowerCase().includes('month') ? 30 : 1) : 7;
    
    const destinationMatch = tripText.match(/(?:to|in)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i);
    const destination = destinationMatch ? destinationMatch[1] : tripText.split(' ')[0];
    
    return { destination, duration };
  };

  const handleQuickStart = (suggestion: string) => {
    const userMessage = { role: "user" as const, content: suggestion };
    const { destination, duration } = parseInitialTrip(suggestion);
    
    setMessages([userMessage]);
    setConversationContext({ 
      initialTrip: suggestion,
      destination,
      duration,
      tripName: suggestion 
    });
    setShowSuggestions(false);
    
    setTimeout(() => {
      const q: Message = {
        role: "assistant",
        content: "Great! Where will you be staying?",
        isQuestion: true,
        quickReplies: ["Hotel", "Airbnb", "Friend's Place", "Camping", "Hostel"]
      };
      setMessages((prev: Message[]) => [...prev, q]);
    }, 800);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isGenerating) {
      const userMessage = { role: "user" as const, content: message };
      
      if (messages.length === 0) {
        const { destination, duration } = parseInitialTrip(message);
        setMessages([userMessage]);
        setConversationContext({ 
          initialTrip: message, 
          destination, 
          duration,
          tripName: message 
        });
        setShowSuggestions(false);
        
        setTimeout(() => {
          const q: Message = {
            role: "assistant",
            content: "Great! Where will you be staying?",
            isQuestion: true,
            quickReplies: ["Hotel", "Airbnb", "Friend's Place", "Camping", "Hostel"]
          };
          setMessages((prev: Message[]) => [...prev, q]);
        }, 800);
      } else if (!conversationContext.accommodation) {
        setConversationContext((prev: any) => ({ ...prev, accommodation: message }));
        setMessages((prev: Message[]) => [...prev, userMessage]);
        
        setTimeout(() => {
          const q: Message = {
            role: "assistant",
            content: "Perfect! What's the weather/season?",
            isQuestion: true,
            quickReplies: ["Summer/Hot", "Winter/Cold", "Spring/Mild", "Fall/Cool"]
          };
          setMessages((prev: Message[]) => [...prev, q]);
        }, 600);
      } else {
        const ctx = { ...conversationContext, season: message };
        setMessages((prev: Message[]) => [...prev, userMessage]);
        onGenerateList(message, ctx);
      }
      
      setMessage("");
    }
  };

  const handleQuickReply = (reply: string) => {
    const userMessage = { role: "user" as const, content: reply };
    setMessages((prev: Message[]) => [...prev, userMessage]);
    
    if (!conversationContext.accommodation) {
      setConversationContext((prev: any) => ({ ...prev, accommodation: reply }));
      setTimeout(() => {
        const q: Message = {
          role: "assistant",
          content: "Perfect! What's the weather/season?",
          isQuestion: true,
          quickReplies: ["Summer/Hot", "Winter/Cold", "Spring/Mild", "Fall/Cool"]
        };
        setMessages((prev: Message[]) => [...prev, q]);
      }, 600);
    } else {
      const finalContext = { ...conversationContext, season: reply };
      onGenerateList(reply, finalContext);
    }
  };

  const getWeatherIcon = (text: string) => {
    const Icon = WEATHER_ICONS[text as keyof typeof WEATHER_ICONS];
    return Icon ? <Icon className="w-4 h-4 mr-2" /> : null;
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        {showSuggestions && messages.length === 0 ? (
          <div className="p-8">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              ✨ Where are you headed?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {QUICK_START_SUGGESTIONS.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickStart(suggestion.text)}
                  className="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all hover:scale-105 text-left border border-white/10"
                  disabled={isGenerating}
                >
                  <suggestion.Icon className={`w-6 h-6 ${suggestion.color}`} />
                  <span className="text-white font-medium">{suggestion.text}</span>
                </button>
              ))}
            </div>
            
            <div className="border-t border-white/20 pt-6">
              <p className="text-white/70 text-center mb-4 text-sm">Or describe your trip:</p>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g., Weekend camping in Yosemite for 3 days"
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  disabled={isGenerating}
                />
                <button
                  type="submit"
                  disabled={isGenerating || !message.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                  ) : (
                    <Send className="w-5 h-5 text-white" />
                  )}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <>
            <div className="p-6 max-h-96 overflow-y-auto space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                        : "bg-white/20 text-white"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    {msg.quickReplies && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {msg.quickReplies.map((reply, i) => (
                          <button
                            key={i}
                            onClick={() => handleQuickReply(reply)}
                            className="flex items-center px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-xs font-medium transition-all"
                            disabled={isGenerating}
                          >
                            {getWeatherIcon(reply)}
                            {reply}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  disabled={isGenerating}
                />
                <button
                  type="submit"
                  disabled={isGenerating || !message.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                  ) : (
                    <Send className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
