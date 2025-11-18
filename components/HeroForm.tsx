'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowRight, Plane, Calendar, MapPin } from 'lucide-react';

interface FormData {
  tripName: string;
  destination: string;
  duration: number;
}

export default function HeroForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    tripName: '',
    destination: '',
    duration: 3,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) || 1 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log('Submitting form:', formData);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tripDetails: `Trip to ${formData.destination} for ${formData.duration} days.`
        }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Success! Received data:', data);

      // Redirect to the list page with the content
      const params = new URLSearchParams({
        content: encodeURIComponent(data.content || ''),
        tripName: data.tripName || formData.tripName,
        destination: data.destination || formData.destination,
        duration: data.duration || formData.duration.toString()
      });

      router.push(`/list/${data.listId}?${params.toString()}`);

    } catch (error) {
      console.error("List generation failed:", error);
      setError(error instanceof Error ? error.message : 'Failed to generate list');
    } finally {
      setIsLoading(false);
    }
  };

  const InputWithIcon = ({ Icon, ...props }: { Icon: any } & React.ComponentProps<typeof Input>) => (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      <Input {...props} className="pl-10 h-12 text-md focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" />
    </div>
  );

  return (
    <Card className="w-full max-w-md shadow-2xl border-none">
      <CardHeader className="p-6">
        <CardTitle className="text-3xl font-extrabold text-center text-gray-900">
          <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
            Plan Your Next Trip
          </span> ✈️
        </CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 p-6 pt-0">
          <InputWithIcon
            Icon={Plane}
            name="tripName"
            placeholder="Trip Name (e.g., Bali Honeymoon)"
            value={formData.tripName}
            onChange={handleChange}
            required
          />
          
          <InputWithIcon
            Icon={MapPin}
            name="destination"
            placeholder="Destination (e.g., Tokyo, Japan)"
            value={formData.destination}
            onChange={handleChange}
            required
          />
          
          <InputWithIcon
            Icon={Calendar}
            name="duration"
            type="number"
            placeholder="Duration (Days)"
            value={formData.duration}
            onChange={handleChange}
            min="1"
            max="30"
            required
          />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="p-6 pt-0">
          <Button
            type="submit"
            className="w-full h-14 text-xl font-extrabold shadow-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                Generate Personalized List <ArrowRight className="ml-3 h-6 w-6" />
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
