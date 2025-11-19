"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Background from "@/components/Background";
import ChatInterface from "@/components/Conversation/ChatInterface";
import EmailCapture from "@/components/EmailCapture";
import Footer from "@/components/Footer";
import GenerationAnimation from "@/components/GenerationAnimation";

export default function Home() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [tripDetails, setTripDetails] = useState<any>(null);

  const handleGenerateList = async (message: string, context?: any) => {
    setIsGenerating(true);
    setStreamingContent('');

    // Store trip details for animation
    setTripDetails({
      destination: context?.destination || context?.tripName || 'your destination',
      duration: context?.duration || 7,
      accommodation: context?.accommodation || 'hotel',
      season: context?.season || 'current season',
    });

    try {
      const tripName = context?.tripName || message || 'My Trip';
      const destination = context?.destination || 'Unknown Destination';
      const duration = context?.duration || 7;

      const requestBody = {
        message: message,
        context: context,
        tripName: tripName,
        destination: destination,
        duration: duration,
        tripDetails: `Trip to ${destination} for ${duration} days. ${message || ''}`
      };

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `API Error: ${response.status}`);
      }

      // Check if it's a cached response (JSON) or streaming response
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        // Cached response - instant!
        const data = await response.json();
        
        if (data.listId) {
          const params = new URLSearchParams({
            content: encodeURIComponent(data.content || ''),
            tripName: data.tripName || tripName,
            destination: data.destination || destination,
            duration: data.duration || duration.toString(),
            listsUsed: data.listsUsed?.toString() || '0',
            isPro: data.isPro?.toString() || 'false'
          });
          
          router.push(`/list/${data.listId}?${params.toString()}`);
          setIsGenerating(false);
        }
      } else {
        // Streaming response - read the stream!
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullContent = '';
        
        // Get metadata from headers
        const listId = response.headers.get('X-List-Id') || `list-${Date.now()}`;
        const tripNameHeader = response.headers.get('X-Trip-Name') || tripName;
        const destinationHeader = response.headers.get('X-Destination') || destination;
        const durationHeader = response.headers.get('X-Duration') || duration.toString();
        const isPro = response.headers.get('X-Is-Pro') === 'true';

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value);
            fullContent += chunk;
            setStreamingContent(fullContent);
          }
        }

        // Stream complete - redirect with full content
        const params = new URLSearchParams({
          content: encodeURIComponent(fullContent),
          tripName: tripNameHeader,
          destination: destinationHeader,
          duration: durationHeader,
          listsUsed: '0',
          isPro: isPro.toString()
        });
        
        router.push(`/list/${listId}?${params.toString()}`);
        setIsGenerating(false);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(`Failed to generate list: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsGenerating(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 -z-10" />
      <Background />
      <Header />
      
      {isGenerating && (
        <GenerationAnimation 
          onComplete={false}
          tripDetails={tripDetails}
          streamingContent={streamingContent}
        />
      )}

      <div className="min-h-screen">
        <Hero />
        <div className="section-padding pb-20">
          <main className="max-w-4xl mx-auto">
            <ChatInterface
              onGenerateList={handleGenerateList}
              isGenerating={isGenerating}
            />
          </main>
        </div>
        
        <EmailCapture />
        <Footer />
      </div>
    </>
  );
}
