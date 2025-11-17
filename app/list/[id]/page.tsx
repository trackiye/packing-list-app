// app/list/[id]/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, CheckCircle, Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react'; // CLEANED IMPORT

// Dummy data structure for the list page
const MOCK_LIST_DATA = {
    id: '123',
    tripName: 'Tokyo Adventure',
    items: [
        'Universal Travel Adapter', 
        '2x T-Shirts', 
        'Passport', 
        'Microfiber Travel Towel'
    ]
};

// Affiliate button component
const AffiliateButton = ({ itemName, isPro }: { itemName: string, isPro: boolean }) => {
    const [affiliateData, setAffiliateData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Ocean gradient button class
    const gradientButtonClass = 'bg-gradient-to-r from-cyan-400 to-emerald-600 hover:from-cyan-500 hover:to-emerald-700 text-white transition-colors shadow-lg';

    useEffect(() => {
        if (isPro) {
            setIsLoading(true);
            // Call the new affiliate API endpoint
            fetch(`/api/affiliate-search?item=${encodeURIComponent(itemName)}`)
                .then(res => res.json())
                .then(data => {
                    if (data.buyLink) {
                        setAffiliateData(data);
                    }
                })
                .catch(console.error)
                .finally(() => setIsLoading(false));
        }
    }, [itemName, isPro]);

    if (!isPro) {
        // Nudge to upgrade
        return <span className="text-sm text-yellow-600 font-medium">Upgrade to Pro to see gear recommendations!</span>;
    }

    if (isLoading) {
        return <Loader2 className="h-4 w-4 animate-spin text-cyan-500" />;
    }

    if (affiliateData) {
        // Final implementation of the affiliate button
        return (
            <a 
                href={affiliateData.buyLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`inline-flex items-center px-3 py-1.5 text-sm font-semibold rounded-full ${gradientButtonClass}`}
            >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Buy: ${affiliateData.productName} (${affiliateData.price})
            </a>
        );
    }

    return null; // Don't show button if no link found
};

// Main component
export default function ListPage({ params }: { params: { id: string } }) {
    const { data: session, status } = useSession();
    // NOTE: In a real app, you'd fetch the user's isPro status from lib/user-storage/database
    const isPro = status === 'authenticated' && session?.user?.name?.includes('Pro'); // Simple mock check

    if (status === 'loading') {
        return <div className="p-10 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-cyan-500" /> Loading List...</div>;
    }

    // This should fetch the real list data based on params.id
    // For now, it uses MOCK_LIST_DATA
    const listData = MOCK_LIST_DATA; 

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-6">{listData.tripName} Packing List</h1>

            <ul className="space-y-4">
                {listData.items.map((item, index) => (
                    <li key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm transition-shadow hover:shadow-md">
                        <div className="flex items-center mb-2 sm:mb-0">
                            <CheckCircle className="h-5 w-5 mr-3 text-green-500" />
                            <span className="text-lg font-medium text-gray-800">{item}</span>
                        </div>
                        <div className="mt-2 sm:mt-0">
                            <AffiliateButton itemName={item} isPro={isPro} />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
