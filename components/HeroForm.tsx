// components/HeroForm.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import UpgradeDialog from '@/components/upgrade-dialog';
import { Loader2, ArrowRight, Plane, Calendar, MapPin } from 'lucide-react'; 
import { useSession } from 'next-auth/react';
// Assuming useToast is correctly configured in components/ui/use-toast.ts
// If you deleted the file, this import will fail, but we'll assume it exists.
import { useToast } from '@/components/ui/use-toast'; 

interface FormData {
  tripName: string;
  destination: string;
  duration: number;
}

const MAX_FREE_LISTS = 3; 

export default function HeroForm() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast(); 
  const isSignedIn = status === 'authenticated';
  const [formData, setFormData] = useState<FormData>({
    tripName: '',
    destination: '',
    duration: 3,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [listsRemaining, setListsRemaining] = useState<number | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  // MOCK isPro check 
  const isPro = isSignedIn && session?.user?.name?.includes('Pro');

  // Fetch the initial count on load (using mock logic from storage)
  React.useEffect(() => {
    // NOTE: This now uses a mock in-memory counter due to the ioredis failure
    setListsRemaining(MAX_FREE_LISTS);
  }, [isSignedIn]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check 1: User authentication 
    if (!isSignedIn) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to generate your personalized packing list.",
        type: "warning",
      });
      router.push('/login'); // CRITICAL NUDGE
      return; // STOP EXECUTION HERE
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...formData, tripDetails: `Trip to ${formData.destination} for ${formData.duration} days.`}),
      });
      
      // CRITICAL FIX: Handle non-JSON 401/400/500 errors (Fixes: Unexpected token 'U')
      if (!response.ok) {
          const textError = await response.text(); // Read as plain text
          
          if (response.status === 402) {
             const data = JSON.parse(textError);
             if (data.error === 'LIST_LIMIT_REACHED') {
                setShowUpgrade(true);
                setListsRemaining(0);
                return;
             }
          }

          toast({
              title: "Error: API Failed",
              description: textError || `Status ${response.status}: Failed to generate list.`,
              type: "error"
          });
          setIsLoading(false);
          return;
      }

      const data = await response.json(); // Safely parse successful JSON response

      // Successful generation
      // setListsRemaining(data.listsRemaining); 
      toast({
          title: "Success! List Generated.",
          description: `Your list for ${formData.tripName} is ready.`,
          type: "success"
      });
      router.push(`/list/${data.listId}`); // Redirect to the new list page
    } catch (error) {
      console.error("List generation failed:", error);
      toast({
          title: "System Error",
          description: "Could not connect to AI service. Please try again.",
          type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const gradientButtonClass = 'ocean-gradient-button'; 

  const InputWithIcon = ({ Icon, ...props }: { Icon: any } & React.ComponentProps<typeof Input>) => (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      <Input {...props} className="pl-10 h-12 text-md focus:border-cyan-ocean focus:ring-1 focus:ring-cyan-ocean" />
    </div>
  );

  return (
    <Card className="w-full max-w-md shadow-2xl border-none">
      <CardHeader className="p-6">
        <CardTitle className="text-3xl font-extrabold text-center text-gray-900">
          <span className="ocean-gradient-text">Plan Your Next Trip</span> ✈️
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

          <div className="text-center pt-2">
              <span className="text-sm font-medium text-gray-500">
                  {listsRemaining !== null ? (
                      <span className={listsRemaining === 0 ? 'text-red-500 font-bold' : 'text-emerald-600 font-bold'}>
                          {listsRemaining} {listsRemaining === 1 ? 'list' : 'lists'} remaining
                      </span>
                  ) : 'Loading counter...'}
                  {listsRemaining === 0 && ' (Upgrade to continue!)'}
              </span>
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <Button
            type="submit"
            className={`w-full h-14 text-xl font-extrabold shadow-2xl ${gradientButtonClass}`}
            disabled={isLoading || (isSignedIn && listsRemaining === 0 && !isPro)}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <>
                Generate Personalized List <ArrowRight className="ml-3 h-6 w-6" />
              </>
            )}
          </Button>
        </CardFooter>
      </form>

      {/* Upgrade Modal Component (Hidden by default) */}
      <UpgradeDialog open={showUpgrade} onOpenChange={setShowUpgrade} />
    </Card>
  );
}
