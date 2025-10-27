// data/affiliateProducts.ts

export const ASSOCIATE_ID = "packmindai-20";
const GENERIC_AFFILIATE_FALLBACK_LINK = `https://www.amazon.com/s?k=travel+essentials&tag=${ASSOCIATE_ID}`;

export const LOCAL_PRODUCT_DATABASE = [
    { name: "Ultimate Ears WONDERBOOM 4", image: "https://m.media-amazon.com/images/I/71O-9Qt8GXL._AC_SL1500_.jpg", link: "https://amzn.to/4oc8z9Y" },
    { name: "Bose QuietComfort Headphones", image: "https://m.media-amazon.com/images/I/51tItfLj8xL._AC_SL1500_.jpg", link: "https://amzn.to/47GEXeW" },
    { name: "Anker Laptop Power Bank 25,000mAh", image: "https://m.media-amazon.com/images/I/71oKDPsgf6L._AC_SL1500_.jpg", link: "https://amzn.to/3Lu3Rpi" },
    { name: "Ceptics Universal Travel Adapter", image: "https://m.media-amazon.com/images/I/61CCl7uqCxL._AC_SL1500_.jpg", link: "https://amzn.to/3Ju6ua8" },
    { name: "Anker USB C Hub 5-in-1", image: "https://m.media-amazon.com/images/I/61EOCctihsL._AC_SL1500_.jpg", link: "https://www.amazon.com/Anker-Delivery-Compact-Stylish-Included/dp/B0DKT8BB4M?&tag=packmindai-20" },
    { name: "SanDisk 500GB Extreme Portable SSD", image: "https://m.media-amazon.com/images/I/61zuR3UMnWL._AC_SL1500_.jpg", link: "https://www.amazon.com/SanDisk-500GB-Extreme-Portable-SDSSDE61-500G-G25/dp/B08GTXVG9P?&tag=packmindai-20" },
    { name: "JBL Flip 7 Waterproof Speaker", image: "https://m.media-amazon.com/images/I/81aeuAp3lAL._AC_SL1500_.jpg", link: "https://www.amazon.com/dp/B0DMYJ48DK?&tag=packmindai-20" },
    { name: "Apple AirTag 4 Pack", image: "https://m.media-amazon.com/images/I/61bMNCeAUAL._AC_SL1500_.jpg", link: "https://www.amazon.com/Apple-MX542LL-A-AirTag-Pack/dp/B0D54JZTHY?&tag=packmindai-20" },
    { name: "Osprey Ultralight Collapsible Pack", image: "https://m.media-amazon.com/images/I/51kyoABOz5L._AC_SL1500_.jpg", link: "https://www.amazon.com/dp/B0BKQKCMWG?&tag=packmindai-20" },
    { name: "WANDF Large Hanging Toiletry Bag", image: "https://m.media-amazon.com/images/I/71Zvuq4gV0L._AC_SL1500_.jpg", link: "https://www.amazon.com/WANDF-Toiletry-Cosmetic-Organizer-Water-Resistant/dp/B0BTKM1YV7?&tag=packmindai-20" },
    { name: "Travelon Wet Dry 1 Quart Bag", image: "https://m.media-amazon.com/images/I/A1om1lXTeQL._AC_SL1500_.jpg", link: "https://www.amazon.com/gp/product/B00ICD5L8I?&tag=packmindai-20" },
    { name: "Airplane Travel Footrest Hammock", image: "https://m.media-amazon.com/images/I/616BnXTfamL._AC_SL1500_.jpg", link: "https://www.amazon.com/Accessories-Ergonomic-Removable-Comfortable-Hardboard/dp/B0DPX85LM8?&tag=packmindai-20" },
    { name: "Physix Gear Compression Socks", image: "https://m.media-amazon.com/images/I/711vGxLodJL._AC_SX679_.jpg", link: "https://www.amazon.com/dp/B01J4MF53Q?&tag=packmindai-20" },
    { name: "slip Contour Sleep Mask", image: "https://m.media-amazon.com/images/I/71nMCB6D0nL._AC_SL1500_.jpg", link: "https://www.amazon.com/Mulberry-Contoured-Prevents-Pressure-Adjustable/dp/B09CLHKX26?&tag=packmindai-20" },
    { name: "MZOO Luxury Sleep Mask", image: "https://m.media-amazon.com/images/I/81-NLK0E4HL._AC_SL1500_.jpg", link: "https://www.amazon.com/MZOO-Sleeping-Contoured-Blindfold-Breathable/dp/B0B14QQV6R?&tag=packmindai-20" },
    { name: "Amazon Basics 30 Hardside Luggage", image: "https://m.media-amazon.com/images/I/71A4GeZHbCL._AC_SL1500_.jpg", link: "https://www.amazon.com/Amazon-Basics-Expandable-Hardside-Scratch-Resistant/dp/B071HHXB27?&tag=packmindai-20" },
    { name: "Travel Inspira Digital Luggage Scale", image: "https://m.media-amazon.com/images/I/61j+KL+aFrL._AC_SX679_.jpg", link: "https://www.amazon.com/travel-inspira-Portable-Suitcase-Included/dp/B01CNGXR6C?&tag=packmindai-20" },
    { name: "LHKNL Headlamp Flashlight (2-Pack)", image: "https://m.media-amazon.com/images/I/71DxWxvCwlL._AC_SL1500_.jpg", link: "https://www.amazon.com/Flashlight-LHKNL-Ultra-Light-Rechargeable-Waterproof/dp/B08D66HCXW?&tag=packmindai-20" },
    { name: "LifeStraw Personal Water Filter", image: "https://m.media-amazon.com/images/I/41n22pfFzMS._AC_SL1144_.jpg", link: "https://www.amazon.com/LifeStraw-Personal-Camping-Emergency-Preparedness/dp/B07C56LR6N?&tag=packmindai-20" },
    { name: "LifeStraw Go Water Filter Bottle", image: "https://m.media-amazon.com/images/I/71C0x0WWJiL._AC_SL1500_.jpg", link: "https://www.amazon.com/LifeStraw-Go-Insulated-Stainless-Microplastics/dp/B0BY39KS2D?&tag=packmindai-20" },
    { name: "Pelican Waterproof Phone Pouch", image: "https://m.media-amazon.com/images/I/71C0x0WWJiL._AC_SL1500_.jpg", link: "https://www.amazon.com/Pelican-Marine-Waterproof-Floating-Detachable/dp/B08GHKMR82?&tag=packmindai-20" },
    { name: "MZOO Sleep Mask (3D)", image: "https://m.media-amazon.com/images/I/81-NLK0E4HL._AC_SL1500_.jpg", link: "https://www.amazon.com/MZOO-Sleeping-Contoured-Blindfold-Breathable/dp/B0B14QQV6R?&tag=packmindai-20" },
];

export const getLocalProductData = (itemName: string) => {
    const normalizedItemName = itemName.toLowerCase().trim();
    const itemKeywords = normalizedItemName.split(/\s+/).filter(word => word.length > 3);
    const fallbackImage = "https://via.placeholder.com/150/d3d3d3/808080?text=Packmind";

    const found = LOCAL_PRODUCT_DATABASE.find(product => {
        const productName = product.name.toLowerCase();
        if (productName === normalizedItemName) return true;
        if (normalizedItemName.includes(productName)) return true;
        const matches = itemKeywords.filter(keyword => productName.includes(keyword));
        return matches.length >= Math.ceil(itemKeywords.length * 0.6); 
    });

    if (found) {
        return {
            product_title: found.name,
            product_link: found.link,
            image_link: found.image,
            is_affiliate: true
        };
    } else {
         return {
            product_title: itemName,
            product_link: `${GENERIC_AFFILIATE_FALLBACK_LINK}&k=${encodeURIComponent(itemName)}`, 
            image_link: fallbackImage,
            is_affiliate: false
        };
    }
};