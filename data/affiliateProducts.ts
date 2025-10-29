// data/affiliateProducts.ts
// COMPILATION COMPLETE: 10 High-Value Entries (30 Tiers)
// Note: ASINs are used for permanent product linkage. Image URLs are placeholders.

export const ASSOCIATE_ID = "packmindai-20";

// --- Typescript Interfaces (Must match AffiliateSuggestionModal.tsx) ---
export interface ProductOption {
    id: string;
    name: string;
    priceEstimate: string; // e.g., "$15 - $25"
    affiliateUrl: string;
    imageUrl: string;
    valueProposition: string; // e.g., "Best Value," "Long-term Durability"
}

export interface PackingItemData {
    itemName: string;
    category: string;
    budgetOption: ProductOption;
    midRangeOption: ProductOption;
    premiumOption: ProductOption;
}

// --- HIGH-VALUE PRODUCT MAP (The Database) ---
// Keys are cleaned item names for easy lookup (e.g., 'NoiseCancelingHeadphones')
const HIGH_VALUE_PRODUCTS: Record<string, PackingItemData> = {
    // ----------------------------------------------------
    // 1. ELECTRONICS: UNIVERSAL ADAPTER
    // ----------------------------------------------------
    'UniversalTravelAdapter': {
        itemName: 'Universal Travel Adapter',
        category: 'Electronics',
        budgetOption: {
            id: 'UniversalTravelAdapter-B',
            name: 'TESSAN Universal Travel Adapter (5-in-1)',
            priceEstimate: '$15 - $25',
            affiliateUrl: 'https://www.amazon.com/dp/B08X59N349/?tag=packmindai-20',
            imageUrl: 'https://placehold.co/100x100/A5B4FC/FFFFFF?text=Tessan',
            valueProposition: 'Low Cost | Cruise Ship Approved',
        },
        midRangeOption: {
            id: 'UniversalTravelAdapter-M',
            name: 'EPICKA All-in-One Worldwide Adapter',
            priceEstimate: '$25 - $40',
            affiliateUrl: 'https://www.amazon.com/dp/B077B2G2M5/?tag=packmindai-20',
            imageUrl: 'https://placehold.co/100x100/4F46E5/FFFFFF?text=Epicka',
            valueProposition: 'Best Seller | High Port Count',
        },
        premiumOption: {
            id: 'UniversalTravelAdapter-P',
            name: 'Zendure Passport III 65W GaN Adapter',
            priceEstimate: '$50 - $75',
            affiliateUrl: 'https://www.amazon.com/dp/B0BL72D437/?tag=packmindai-20',
            imageUrl: 'https://placehold.co/100x100/1D4ED8/FFFFFF?text=Zendure',
            valueProposition: 'GaN Fast Charging | Power for Laptops',
        },
    },
    // ----------------------------------------------------
    // 2. ELECTRONICS: NOISE CANCELING HEADPHONES
    // ----------------------------------------------------
    'NoiseCancelingHeadphones': {
        itemName: 'Noise Canceling Headphones',
        category: 'Electronics',
        budgetOption: {
            id: 'Headphones-B',
            name: 'Anker Soundcore Life Q30',
            priceEstimate: '$70 - $90',
            affiliateUrl: 'https://www.amazon.com/dp/B08H7R5P7Y/?tag=packmindai-20',
            imageUrl: 'https://placehold.co/100x100/A5B4FC/FFFFFF?text=Q30',
            valueProposition: 'Value ANC | Best Budget',
        },
        midRangeOption: {
            id: 'Headphones-M',
            name: 'Sony WH-CH720N Wireless',
            priceEstimate: '$130 - $170',
            affiliateUrl: 'https://www.amazon.com/dp/B0BP42Y17W/?tag=packmindai-20',
            imageUrl: 'https://placehold.co/100x100/4F46E5/FFFFFF?text=CH720N',
            valueProposition: 'Balanced ANC | Long Battery Life',
        },
        premiumOption: {
            id: 'Headphones-P',
            name: 'Sony WH-1000XM5',
            priceEstimate: '$350 - $450',
            affiliateUrl: 'https://www.amazon.com/dp/B09HGBX9TB/?tag=packmindai-20',
            imageUrl: 'https://placehold.co/100x100/1D4ED8/FFFFFF?text=XM5',
            valueProposition: 'Industry Leading Noise Cancellation',
        },
    },
    // ----------------------------------------------------
    // 3. ELECTRONICS: PORTABLE CHARGER (20k mAh)
    // ----------------------------------------------------
    'PortableCharger20k': {
        itemName: 'Portable Charger (20k mAh)',
        category: 'Electronics',
        budgetOption: {
            id: 'Charger20K-B',
            name: 'Anker PowerCore Essential 20000',
            priceEstimate: '$35 - $50',
            affiliateUrl: 'https://www.amazon.com/dp/B07S829B65/?tag=packmindai-20',
            imageUrl: 'https://placehold.co/100x100/A5B4FC/FFFFFF?text=Anker20',
            valueProposition: 'Standard Power | Reliability',
        },
        midRangeOption: {
            id: 'Charger20K-M',
            name: 'Baseus 65W GaN Power Bank',
            priceEstimate: '$60 - $80',
            affiliateUrl: 'https://www.amazon.com/dp/B0B7J12X6D/?tag=packmindai-20',
            imageUrl: 'https://placehold.co/100x100/4F46E5/FFFFFF?text=Baseus65W',
            valueProposition: 'Fast 65W Charging | Laptop Compatible',
        },
        premiumOption: {
            id: 'Charger20K-P',
            name: 'Anker Prime 200W Power Bank',
            priceEstimate: '$120 - $150',
            affiliateUrl: 'https://www.amazon.com/dp/B0C2MB18F2/?tag=packmindai-20',
            imageUrl: 'https://placehold.co/100x100/1D4ED8/FFFFFF?text=Prime200',
            valueProposition: 'Max Speed | Charge Multiple Laptops',
        },
    },
    // ----------------------------------------------------
    // 4. LUGGAGE: 40L CARRY-ON BACKPACK
    // ----------------------------------------------------
    '40LCarryOnBackpack': {
        itemName: '40L Carry-On Backpack',
        category: 'Luggage',
        budgetOption: {
            id: 'Backpack40L-B',
            name: 'Aerolite 40L Max Carry-On',
            priceEstimate: '$40 - $60',
            affiliateUrl: 'https://www.amazon.com/dp/B07G4J4Q4D/?tag=packmindai-20',
            imageUrl: 'https://placehold.co/100x100/A5B4FC/FFFFFF?text=Aerolite',
            valueProposition: 'Airline Max Size | Budget Friendly',
        },
        midRangeOption: {
            id: 'Backpack40L-M',
            name: 'Osprey Farpoint/Fairview 40L',
            priceEstimate: '$170 - $220',
            affiliateUrl: 'https://www.amazon.com/dp/B09L74363V/?tag=packmindai-20',
            imageUrl: 'https://placehold.co/100x100/4F46E5/FFFFFF?text=Osprey',
            valueProposition: 'Best Comfort | Lifetime Warranty',
        },
        premiumOption: {
            id: 'Backpack40L-P',
            name: 'Peak Design Travel Backpack 45L',
            priceEstimate: '$300 - $350',
            affiliateUrl: 'https://www.amazon.com/dp/B07G58C4S2/?tag=packmindai-20',
            imageUrl: 'https://placehold.co/100x100/1D4ED8/FFFFFF?text=PD45',
            valueProposition: 'Ultimate Organization | Theft Proof',
        },
    },
    // ----------------------------------------------------
    // 5. LUGGAGE: COMPRESSION PACKING CUBES
    // ----------------------------------------------------
    'CompressionPackingCubes': {
        itemName: 'Compression Packing Cubes',
        category: 'Luggage',
        budgetOption: {
            id: 'Cubes-B',
            name: 'Bagsmart Compression Cube Set (6pc)',
            priceEstimate: '$20 - $30',
            affiliateUrl: 'https://www.amazon.com/dp/B07GFL9Q8K/?tag=packmindai-20',
            imageUrl: 'https://placehold.co/100x100/A5B4FC/FFFFFF?text=Bagsmart',
            valueProposition: 'Great Value | High Compression Ratio',
        },
        midRangeOption: {
            id: 'Cubes-M',
            name: 'Eagle Creek Compressible Cubes (3pc)',
            priceEstimate: '$40 - $60',
            affiliateUrl: 'https://www.amazon.com/dp/B08B5R3S7R/?tag=packmindai-20',
            imageUrl: 'https://placehold.co/100x100/4F46E5/FFFFFF?text=EagleCreek',
            valueProposition: 'Durable Fabric | Lifetime Warranty',
        },
        premiumOption: {
            id: 'Cubes-P',
            name: 'Peak Design Packing Cubes',
            priceEstimate: '$70 - $90',
            affiliateUrl: 'https://www.amazon.com/dp/B07L929R7N/?tag=packmindai-20',
            imageUrl: 'https://placehold.co/100x100/1D4ED8/FFFFFF?text=PD_Cubes',
            valueProposition: 'Self-Healing Zippers | Max Volume',
        },
    },
    // ----------------------------------------------------
    // 6. ACCESSORIES: TRAVEL ROUTER (WIFI)
    // ----------------------------------------------------
    'TravelRouter': {
        itemName: 'Travel Router',
        category: 'Electronics',
        budgetOption: {
            id: 'Router-B',
            name: 'GL.iNet GL-AR300M Mini Router',
            priceEstimate: '$30 - $40',
            affiliateUrl: 'https://www.amazon.com/dp/B01KMQY2G8/?tag=packmindai-20',
            imageUrl: 'https://placehold.co/100x100/A5B4FC/FFFFFF?text=AR300M',
            valueProposition: 'Basic VPN | Extremely Pocketable',
        },
        midRangeOption: {
            id: 'Router-M',
            name: 'GL.iNet GL-MT300N-V2 (Mango)',
            priceEstimate: '$50 - $70',
            affiliateUrl: 'https://www.amazon.com/dp/B07712LPVF/?tag=packmindai-20',
            imageUrl: 'https://placehold.co/100x100/4F46E5/FFFFFF?text=Mango',
            valueProposition: 'Bestselling Mini VPN Router',
        },
        premiumOption: {
            id: 'Router-P',
            name: 'GL.iNet GL-AX1800 (Slate AX)',
            priceEstimate: '$100 - $150',
            affiliateUrl: 'https://www.amazon.com/dp/B09PM6L63B/?tag=packmindai-20',
            imageUrl: 'https://placehold.co/100x100/1D4ED8/FFFFFF?text=SlateAX',
            valueProposition: 'WiFi 6 | Fastest Speed | Secure VPN',
        },
    },
    // ----------------------------------------------------
    // 7. CLOTHING: MERINO WOOL T-SHIRT
    // ----------------------------------------------------
    'MerinoWoolTShirt': {
        itemName: 'Merino Wool T-Shirt',
        category: 'Clothing',
        budgetOption: {
            id: 'Tee-B',
            name: 'Minus33 Kodiak Tee',
            priceEstimate: '$45 - $65',
            affiliateUrl: 'https://www.amazon.com/dp/B076C55Q6Y/?tag=packmindai-20',
            imageUrl: 'https://placehold.co/100x100/A5B4FC/FFFFFF?text=Minus33',
            valueProposition: 'Affordable Merino | High Durability',
        },
        midRangeOption: {
            id: 'Tee-M',
            name: 'Smartwool Merino Tee',
            priceEstimate: '$70 - $90',
            affiliateUrl: 'https://www.amazon.com/dp/B07F2G3W5V/?tag=packmindai-20',
            imageUrl: 'https://placehold.co/100x100/4F46E5/FFFFFF?text=Smartwool',
            valueProposition: 'Comfort Blend | Odor Resistant',
        },
        premiumOption: {
            id: 'Tee-P',
            name: 'Icebreaker Tech Lite Tee',
            priceEstimate: '$90 - $110',
            affiliateUrl: 'https://www.amazon.com/dp/B092W3J3P8/?tag=packmindai-20',
            imageUrl: 'https://placehold.co/100x100/1D4ED8/FFFFFF?text=Icebreaker',
            valueProposition: 'Purest Merino | Maximum Breathability',
        },
    },
    // ----------------------------------------------------
    // 8. SECURITY: RFID BLOCKING PASSPORT WALLET
    // ----------------------------------------------------
    'RFIDWallet': {
        itemName: 'RFID Blocking Passport Wallet',
        category: 'Documents',
        budgetOption: {
            id: 'Wallet-B',
            name: 'Venture 4th Neck Travel Pouch',
            priceEstimate: '$15 - $20',
            affiliateUrl: 'https://www.amazon.com/dp/B01B7H36Y2/?tag=packmindai-20',
            imageUrl: 'https://placehold.co/100x100/A5B4FC/FFFFFF?text=Venture4th',
            valueProposition: 'Best Security | Hidden Carry',
        },
        midRangeOption: {
            id: 'Wallet-M',
            name: 'Zoppen Multi-purpose Wallet',
            priceEstimate: '$20 - $30',
            affiliateUrl: 'https://www.amazon.com/dp/B07FDV1L6X/?tag=packmindai-20',
            imageUrl: 'https://placehold.co/100x100/4F46E5/FFFFFF?text=Zoppen',
            valueProposition: 'Family Organizer | Durable PU Leather',
        },
        premiumOption: {
            id: 'Wallet-P',
            name: 'Bellroy Travel Wallet',
            priceEstimate: '$90 - $120',
            affiliateUrl: 'https://www.amazon.com/dp/B079Z5J2L6/?tag=packmindai-20',
            imageUrl: 'https://placehold.co/100x100/1D4ED8/FFFFFF?text=Bellroy',
            valueProposition: 'Premium Leather | Slim & Secure',
        },
    },
    // ----------------------------------------------------
    // 9. COMFORT: TRAVEL PILLOW (INFLATABLE)
    // ----------------------------------------------------
    'InflatableTravelPillow': {
        itemName: 'Inflatable Travel Pillow',
        category: 'Comfort',
        budgetOption: {
            id: 'Pillow-B',
            name: 'Klymit Cush Pillow',
            priceEstimate: '$10 - $15',
            affiliateUrl: 'https://www.amazon.com/dp/B00J6118D6/?tag=packmindai-20',
            imageUrl: 'https://placehold.co/100x100/A5B4FC/FFFFFF?text=Klymit',
            valueProposition: 'Basic Support | Ultra-Lightweight',
        },
        midRangeOption: {
            id: 'Pillow-M',
            name: 'AirComfy Ease Travel Pillow',
            priceEstimate: '$20 - $30',
            affiliateUrl: 'https://www.amazon.com/dp/B07R8B2Q1J/?tag=packmindai-20',
            imageUrl: 'https://placehold.co/100x100/4F46E5/FFFFFF?text=AirComfy',
            valueProposition: 'Ergonomic Support | Washable Cover',
        },
        premiumOption: {
            id: 'Pillow-P',
            name: 'Trtl Pillow Plus',
            priceEstimate: '$60 - $80',
            affiliateUrl: 'https://www.amazon.com/dp/B07T77TQLP/?tag=packmindai-20',
            imageUrl: 'https://placehold.co/100x100/1D4ED8/FFFFFF?text=Trtl+',
            valueProposition: 'Head Hammock Design | Scientifically Proven',
        },
    },
    // ----------------------------------------------------
    // 10. LUGGAGE: TSA-APPROVED TOILETRY BAG
    // ----------------------------------------------------
    'TSAToiletryBag': {
        itemName: 'TSA Approved Toiletry Bag',
        category: 'Toiletries',
        budgetOption: {
            id: 'Toiletry-B',
            name: 'Lermende Hanging Toiletry Bag',
            priceEstimate: '$15 - $25',
            affiliateUrl: 'https://www.amazon.com/dp/B073R3966D/?tag=packmindai-20',
            imageUrl: 'https://placehold.co/100x100/A5B4FC/FFFFFF?text=Lermende',
            valueProposition: 'Large Capacity | Hanging Hook',
        },
        midRangeOption: {
            id: 'Toiletry-M',
            name: 'WANDF Hanging Toiletry Bag (Waterproof)',
            priceEstimate: '$25 - $40',
            affiliateUrl: 'https://www.amazon.com/dp/B08W32P6C4/?tag=packmindai-20',
            imageUrl: 'https://placehold.co/100x100/4F46E5/FFFFFF?text=WANDF',
            valueProposition: 'Durable Zippers | Leak Proof Design',
        },
        premiumOption: {
            id: 'Toiletry-P',
            name: 'Peak Design Wash Pouch',
            priceEstimate: '$60 - $80',
            affiliateUrl: 'https://www.amazon.com/dp/B07L929R7N/?tag=packmindai-20',
            imageUrl: 'https://placehold.co/100x100/1D4ED8/FFFFFF?text=PD_Wash',
            valueProposition: 'Premium Aesthetics | Lifetime Warranty',
        },
    },
};

// **CORRECTED EXPORT:** Added 'export' keyword here to fix the build error.
export function getProductSuggestions(aiItemName: string): PackingItemData | null {
    // 1. Normalize AI output (e.g., 'Portable Charger' -> 'PortableCharger')
    const normalizedName = aiItemName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

    // 2. Perform a loose keyword search
    for (const key in HIGH_VALUE_PRODUCTS) {
        // Using a loose check to match AI output like '20k mAh Portable Charger' to the key 'PortableCharger20k'
        if (key.toLowerCase().includes(normalizedName) || normalizedName.includes(key.toLowerCase())) {
             return HIGH_VALUE_PRODUCTS[key];
        }
    }
    
    // 3. Exact key match check (Handles the cleaned item names perfectly)
    for (const key in HIGH_VALUE_PRODUCTS) {
        if (key.toLowerCase() === normalizedName) {
            return HIGH_VALUE_PRODUCTS[key];
        }
    }

    // Fallback: Return null if no high-value match is found
    return null;
}
