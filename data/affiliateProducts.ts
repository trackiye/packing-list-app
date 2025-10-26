// data/affiliateProducts.ts

// --- 1. CORE CONSTANTS ---
export const ASSOCIATE_ID = "packmindai-20";
const GENERIC_AFFILIATE_FALLBACK_LINK = `https://www.amazon.com/s?k=travel+essentials&tag=${ASSOCIATE_ID}`;

// --- 2. PRODUCT DATABASE (22 Items) ---
export const LOCAL_PRODUCT_DATABASE = [
    // BATCH 1: TECH & ORGANIZATION
    { 
        name: "Ultimate Ears WONDERBOOM 4 Waterproof Bluetooth Outdoor Speaker", 
        image: "https://m.media-amazon.com/images/I/71O-9Qt8GXL._AC_SL1500_.jpg", 
        link: "https://amzn.to/4oc8z9Y" 
    },
    { 
        name: "Bose QuietComfort Bluetooth Headphones (Noise Cancelling)", 
        image: "https://m.media-amazon.com/images/I/51tItfLj8xL._AC_SL1500_.jpg", 
        link: "https://amzn.to/47GEXeW" 
    },
    { 
        name: "Anker Laptop Power Bank, 25,000mAh Portable Charger", 
        image: "https://m.media-amazon.com/images/I/71oKDPsgf6L._AC_SL1500_.jpg", 
        link: "https://amzn.to/3Lu3Rpi" 
    },
    { 
        name: "Ceptics Universal Travel Adapter, 35W International Power Adapter", 
        image: "https://m.media-amazon.com/images/I/61CCl7uqCxL._AC_SL1500_.jpg", 
        link: "https://amzn.to/3Ju6ua8" 
    },
    { 
        name: "Anker USB C Hub, 5-in-1 USB Hub for Laptops", 
        image: "https://m.media-amazon.com/images/I/61EOCctihsL._AC_SL1500_.jpg", 
        link: "https://www.amazon.com/Anker-Delivery-Compact-Stylish-Included/dp/B0DKT8BB4M?ascsubtag=srctok-7f8178902d33ba6a&btn_ref=srctok-7f8178902d33ba6a&linkCode=ll1&tag=packmindai-20&linkId=f2e9ae553baca3b223110885152052f1&language=en_US&ref_=as_li_ss_tl" 
    },
    { 
        name: "SanDisk 500GB Extreme Portable SSD (Water and Dust Resistance)", 
        image: "https://m.media-amazon.com/images/I/61zuR3UMnWL._AC_SL1500_.jpg", 
        link: "https://www.amazon.com/SanDisk-500GB-Extreme-Portable-SDSSDE61-500G-G25/dp/B08GTXVG9P?ascsubtag=srctok-232900c770d63f66&btn_ref=srctok-232900c770d63f66&th=1&linkCode=ll1&tag=packmindai-20&linkId=d981fd778b5982767b64ae1be3d73e55&language=en_US&ref_=as_li_ss_tl" 
    },
    { 
        name: "JBL Flip 7 Portable Waterproof Speaker (Red)", 
        image: "https://m.media-amazon.com/images/I/81aeuAp3lAL._AC_SL1500_.jpg", 
        link: "https://www.amazon.com/dp/B0DMYJ48DK?th=1&ascsubtag=trd-us-7379717531655947394-20&geniuslink=true&linkCode=ll1&tag=packmindai-20&linkId=56d39db06f68c674c49e70d7dbd09bdb&language=en_US&ref_=as_li_ss_tl" 
    },
    { 
        name: "Apple AirTag 4 Pack (Luggage/Key Tracker)", 
        image: "https://m.media-amazon.com/images/I/61bMNCeAUAL._AC_SL1500_.jpg", 
        link: "https://www.amazon.com/Apple-MX542LL-A-AirTag-Pack/dp/B0D54JZTHY?crid=PP5K5OLLATOV&dib=eyJ2IjoiMSJ9.34Y5eLJt-Syg--Dpi7ueLVqJBXnJnIZ0dPSiMQasydY3yxNfrYPE184Y006fpLbadYbGlqOiRoG_Q1-2O1Z3HcOA1iizQHC4skXjW4wKfDXdCP3hmGebMcQ1ckMb78VhTOO_AFGLabzABOpLZL5IsftxcSfvfv8qIBoVhZTR2uSfLgRzYvN8nQ5e5tHLOkyJfotgMkksj6JW8EccbA37YK6M90dbasasX8vAoEaG2fM._NXmozT6letrdqHqlYkCbFlWDRIIpbyhHPLpNRr2GhU&dib_tag=se&keywords=apple+airtag+%2F+tile+tracker+for+luggage+tracking&qid=1761448473&sprefix=%2Caps%2C156&sr=8-3&linkCode=ll1&tag=packmindai-20&linkId=71f08ccf94e4ba4700c58e986e9a51b0&language=en_US&ref_=as_li_ss_tl" 
    },
    { 
        name: "Osprey Ultralight Collapsible Stuff Pack (18 L Daypack)", 
        image: "https://m.media-amazon.com/images/I/51kyoABOz5L._AC_SL1500_.jpg", 
        link: "https://www.amazon.com/dp/B0BKQKCMWG?ascsubtag=7481992%7Cn26bd94a2a7fe433f892aab533c842e0103%7CB0BKQKCMWG%7C1761448520780%7C%7C&th=1&linkCode=ll1&tag=packmindai-20&linkId=1096839d0a772e956ed0afece89&language=en_US&ref_=as_li_ss_tl" 
    },
    { 
        name: "WANDF Large Hanging Toiletry Bag (Water-Resistant)", 
        image: "https://m.media-amazon.com/images/I/71Zvuq4gV0L._AC_SL1500_.jpg", 
        link: "https://www.amazon.com/WANDF-Toiletry-Cosmetic-Organizer-Water-Resistant/dp/B0BTKM1YV7?th=1&linkCode=ll1&tag=packmindai-20&linkId=87385f89a5ace40d503c4068c3d6b02c&language=en_US&ref_=as_li_ss_tl" 
    },
    { 
        name: "Travelon Wet Dry 1 Quart Bag (TSA Compliant)", 
        image: "https://m.media-amazon.com/images/I/A1om1lXTeQL._AC_SL1500_.jpg", 
        link: "https://www.amazon.com/gp/product/B00ICD5L8I?ie=UTF8&th=1&linkCode=ll1&tag=packmindai-20&linkId=4d81e23fecea9acd4cce9f6e0f77e19b&language=en_US&ref_=as_li_ss_tl" 
    },
    { 
        name: "Airplane Travel Footrest Hammock (Memory Foam)", 
        image: "https://m.media-amazon.com/images/I/616BnXTfamL._AC_SL1500_.jpg", 
        link: "https://www.amazon.com/Accessories-Ergonomic-Removable-Comfortable-Hardboard/dp/B0DPX85LM8?crid=3PYS5CCRJ18DL&dib=eyJ2IjoiMSJ9.LqPSWaRT8e9rQcc8tljM-Nmx9JOtiHU9LAkUXB76muuhr3KR1aPMK1HwCK5KPKAZzAMwUHCMbZlIJJFCpxdTQH7arYBCNM_-v1Xz_7Ri_GLVITp8UGEHHdkNWC1QOG9BZkwb69T43Mj4IjbuHfBujDnkeHLHopitRgJQK8CVe7V7vhYzL2ZRmh4xYDYumi2XbdjfgWIm80zJ4K4buyiu63ai7v6MyyGzZYtgFOJf2a5birhS6NSrinqZPMLDfp9Fa94db0IwbEs4MFjSKldYerhitSTTkGBoUv8Lw1qblMg.Sx-07pAicKnsQd2lQisoR9YW5czMIDDyJ3ycSHGlF_k&dib_tag=se&keywords=2-Pack%2BAirplane%2BTravel%2BFootrest%2BHammock&qid=1761448762&sprefix=2-pack%2Bairplane%2Btravel%2Bfootrest%2Bhammock%2B%2Caps%2C122&sr=8-2-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1&linkCode=ll1&tag=packmindai-20&linkId=2c90b83c504dc6c91a60394f2db124f5&language=en_US&ref_=as_li_ss_tl" 
    },
    { 
        name: "Physix Gear Compression Socks (20-30 mmHg)", 
        image: "https://m.media-amazon.com/images/I/711vGxLodJL._AC_SX679_.jpg", 
        link: "https://www.amazon.com/dp/B01J4MF53Q?th=1&ascsubtag=%5Bartid%7C2140.a.29269744%5Bsrc%7C%5Bch%7C%5Blt%7Csale%5Bpid%7C1febfe56-fdc0-44a8-a6da-06c552d2d0ec%5Baxid%7C4281d163-835d-4461-bed0-cb09130cd01d%5Bofsxid%7Cread_time_estimate%5Bofsvid%7Con-1496399%5Bofsxid%7Creaders_also_read%5Bofsvid%7Con-1514778&psc=1&linkCode=ll1&tag=packmindai-20&linkId=c8fa86cb109d04ba6455f4477d1e25f9&language=en_US&ref_=as_li_ss_tl" 
    },
    
    // BATCH 3: SLEEP, LUGGAGE, OUTDOOR
    { 
        name: "slip Contour Sleep Mask (100% Pure Mulberry Silk)", 
        image: "https://m.media-amazon.com/images/I/71nMCB6D0nL._AC_SL1500_.jpg", 
        link: "https://www.amazon.com/Mulberry-Contoured-Prevents-Pressure-Adjustable/dp/B09CLHKX26?crid=3NG99D35ULGOO&dib=eyJ2IjoiMSJ9.g2mUCTf67GOMTQH--hUZRXKT6MCT_P-BgAlWux1LaPx4FyCz_vL4zXLnPgISBwKHVTbw3p7T6MuqJ_0kldB5imnEEeLwTW1iPkgzKDVstzU194_EjfYrsmfUpQsa6vJWvw_7Efs8Y7yq_YiH6zOL4YBJMYRnMc9ulT1utXBGI2meFJ_eRQ20sO-m-XQQ53F5tRxaNFhWZMwxFfv4z0DARWKJcWyUU8LHuT5s49yT2Vobuc8txlb_g-tfdAAnnJQ_UrKldcvyfTObtn9TeIcqpwSK6F2mUH13zqMNeV9nKc.vzldwxdjYdFeykqV9Kbi010RCuZJQp9-xlrwvQQyXxo&dib_tag=se&keywords=slip%2Bsleep%2Bmask&qid=1761449966&sprefix=slip%2Bsleep%2B%2Caps%2C120&sr=8-6&th=1&linkCode=ll1&tag=packmindai-20&linkId=2e5f7aebe4a1b3c52cca965e4cf69958&language=en_US&ref_=as_li_ss_tl" 
    },
    { 
        name: "MZOO Luxury Sleep Mask (3D Zero Pressure)", 
        image: "https://m.media-amazon.com/images/I/81-NLK0E4HL._AC_SL1500_.jpg", 
        link: "https://www.amazon.com/MZOO-Sleeping-Contoured-Blindfold-Breathable/dp/B0B14QQV6R?crid=3I53W91X3IUBV&dib=eyJ2IjoiMSJ9.3KLzcvDubNH8hbUMVYKM4lwJvqGUFN9qjIDmzAEuvkidt3tKwyynNE0IAzYukQSSa9d6PO1KIS-rOFxMv63xk9Rn4IB5ksow4O4RHHkibm7ehLwMTvJfCHj9ppt5toZkXY0rq_9U_B-e7MawDqlYEqKr_pDUwGstwQYQTGt0jguZLk7JSWBa6G80xDOXfasxHoDTzgd43iwJ0j69S3ws5cQzmtzPWz02ZZ7dQQYJJZw4mRd7tEm8CzRnG6pf7SmI8VIaSLx8VTE6wlato5ZiBqgRIEFgWZDMsJzMZw2iF3s.c8fQzTgvOc2GGT7l51I6ilb8kLeSdmPkovnkHbms7jY&dib_tag=se&keywords=sleeping%2Bmask&qid=1761450028&sprefix=sle%2Caps%2C170&sr=8-7&th=1&linkCode=ll1&tag=packmindai-20&linkId=c7cf24568371d07d080094f4cfc949ac&language=en_US&ref_=as_li_ss_tl" 
    },
    { 
        name: "Amazon Basics 30 Hardside Checked Luggage (Expandable)", 
        image: "https://m.media-amazon.com/images/I/71A4GeZHbCL._AC_SL1500_.jpg", 
        link: "https://www.amazon.com/Amazon-Basics-Expandable-Hardside-Scratch-Resistant/dp/B071HHXB27?crid=17YFL1V7SE6VY&dib=eyJ2IjoiMSJ9.-KGDKT2q5WBCckaNLy4RL9syF1fwxhZOlnaNRvP8Pc6INnl2LvKc82kb2K_ebduZSXdlIrRJvd0sMdsHXfvjB7zEkZYqqR7WSOY9uiwDTr2y8ynfBlbYRcsq42EyDYdrSpftm45Cjit2DPSTuerdWx1aaHRiFse3LqoTuNxlj94ethcST0xSiQFiA6lJsUp7Va-CCwIwent6QGY_KCucvfG-Az14FjJncu2piAyF5jGTdjUmnqI4ZWVBJgYUp8EDv9fKVwYl0R42YN4RgJF7Fudxdp7gdXVFATHoYSYR4k.xgE3FjLDtaIcg7LOCO2N8U22Qr7aT72JSkE_-4xE2xw&dib_tag=se&keywords=luggage&qid=1761450105&sprefix=laugege%2Caps%2C182&sr=8-12-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9tdGY&th=1&linkCode=ll1&tag=packmindai-20&linkId=e40b458e1cf9888987813e692ae87662&language=en_US&ref_=as_li_ss_tl" 
    },
    { 
        name: "Travel Inspira Digital Hanging Luggage Scale (110 Lbs)", 
        image: "https://m.media-amazon.com/images/I/61j+KL+aFrL._AC_SX679_.jpg", 
        link: "https://www.amazon.com/travel-inspira-Portable-Suitcase-Included/dp/B01CNGXR6C?content-id=amzn1.sym.f3a06935-0d55-4a43-b918-4ea35f8505e5%3Aamzn1.sym.f3a06935-0d55-4a43-b918-4ea35f8505e5&crid=1M8YYMWAND5DO&cv_ct_cx=luggage%2Bscale&keywords=luggage%2Bscale&pd_rd_i=B01CNGXR6C&pd_rd_r=f13df59f-3a66-4ef4-9f0b-962cf01e4a49&pd_rd_w=rCPy0&pd_rd_wg=w0vWf&pf_rd_p=f3a06935-0d55-4a43-b918-4ea35f8505e5&pf_rd_r=EYKB9EFD8AE1K17WQREM&qid=1761450155&sbo=RZvfv%2F%2FHxDF%2BO5021pAnSA%3D%3D&sprefix=luggage%2Caps%2C183&sr=1-1-6024b2a3-78e4-4fed-8fed-e1613be3bcce-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9zZWFyY2hfdGhlbWF0aWM&th=1ANd9GcQ&linkCode=ll1&tag=packmindai-20&linkId=ffbed4cacad1cc2c4cef251893eac8ce&language=en_US&ref_=as_li_ss_tl" 
    },
    { 
        name: "LHKNL Headlamp Flashlight (Rechargeable, 2-Pack)", 
        image: "https://m.media-amazon.com/images/I/71DxWxvCwlL._AC_SL1500_.jpg", 
        link: "https://www.amazon.com/Flashlight-LHKNL-Ultra-Light-Rechargeable-Waterproof/dp/B08D66HCXW?crid=UZAFN6MFMJD4&dib=eyJ2IjoiMSJ9.z88GhzYc19WVBQiWEWhHujZWiiJFHSP2UMYAntDCSwJG2_WdxN2yTgSH50MPq-3SwcMhsnWheFH4KQHWWUW1-nqKRMFZRFmJafUqUG6RjBpeU7oYOzd4Hpj8wzyg4DelVPpUdGNQJIuKqxdh_NHcUCMMA_o5AcYCfQCb23Pj2p8ZbAlaqiq3I16_XBCtfBrStckQ5hOJhC3fISSE0Z3zRx37ssvcBRObkUrtYoaVpS2VjaA54tIc0Zy_KTQy5LYCWV3YgFdDqguKS0r6L8XpjirnPQEdWYv5IXH3N7Lv84.KPQoL3l2gPXt9CGHGiPw5zVkB6kSROMyzVAGskCJr_M&dib_tag=se&keywords=headlamp&qid=1761450330&sprefix=head%2Caps%2C133&sr=8-1-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1&linkCode=ll1&tag=packmindai-20&linkId=47814243afa70f3b294175ff711b6ca9&language=en_US&ref_=as_li_ss_tl" 
    },
    { 
        name: "LifeStraw Personal Water Filter", 
        image: "https://m.media-amazon.com/images/I/41n22pfFzMS._AC_SL1144_.jpg", 
        link: "https://www.amazon.com/LifeStraw-Personal-Camping-Emergency-Preparedness/dp/B07C56LR6N?crid=1BG7RZUL9A8L3&dib=eyJ2IjoiMSJ9.y2ZCdFttMlasP7ZmrjR-jFBImduayFwp588egZdTYFHnT28LBiFcEoRQ34b_Mq-pB7ESMrvxS9nkZwrTnLVy5d4Gx1Wgad-5m_trUbbJUK8Jtlx4HEKVD_V3F2311-yhPRhf5Ixf3rE4reZuRkzOsDCg3VJyc58iRtJASK-rRZ34sFhQN_kSFAizSOEqNo82m6QtZxd7SF5eEMajulcDqzvmz_hDSjiB_53TF8l-ltE5efHX6jxcg8-0pkHIg-2Rxsh-gkqnOACBrNy46Vh_bQzp2J8FKAxpK22YEwKLIf0.ryWPSJLllM9DuhLlVK-SFqZ24-TOcH_LmqSsA2J948c&dib_tag=se&keywords=life+straw&qid=1761450380&sprefix=life+%2Caps%2C139&sr=8-7&linkCode=ll1&tag=packmindai-20&linkId=e6bb574f9e9e15470bed850df30eb0f4&language=en_US&ref_=as_li_ss_tl" 
    },
    { 
        name: "LifeStraw Go Series (Insulated Stainless Steel Water Filter Bottle)", 
        image: "https://m.media-amazon.com/images/I/61O36lWvaNL._AC_SL1500_.jpg", 
        link: "https://www.amazon.com/LifeStraw-Go-Insulated-Stainless-Microplastics/dp/B0BY39KS2D?crid=2DLMRKNW9WN4Z&dib=eyJ2IjoiMSJ9.1gn3YbuVaP6Y_s19p_FhGpO8oqmuss7qQM0PoBy77b_PEBdgKy14vWi6vi-_kjZLUZpxs3-DEqeu3VrTPr3cYC3_uetu6wM0BnZFXac9nnfrgWx7URSpPJchTutEFm9PgvYfqH6ybN0faPIV5hmy49cR7wnmc8TR0vkZB50pagOZ9MlqBuLtx2_t8-ajlw2tge8ydSrq4WdcQUTvBmGmVOgzPV8SxhZHOAg3JJBnyHYkO4SmPj5H9LvrmRkkNaKoHtvDeX0cmh9eUbSuSpujNbWK68ewXuQoyPqGr2wNwoGc.3Nfc_7Z5G3bg_2PGpDkSUQ26gxuizBWiaZbvu_pHmT8&dib_tag=se&keywords=life%2Bstraw%2Bgo%2Bseries&qid=1761450460&sprefix=life%2Bstraw%2Bgo%2Caps%2C170&sr=8-1&th=1&linkCode=ll1&tag=packmindai-20&linkId=d2849f5485d37e6c9491a8e75841df75&language=en_US&ref_=as_li_ss_tl" 
    },
    { 
        name: "Pelican Marine - IP68 Waterproof Phone Pouch", 
        image: "https://m.media-amazon.com/images/I/71C0x0WWJiL._AC_SL1500_.jpg", 
        link: "https://www.amazon.com/Pelican-Marine-Waterproof-Floating-Detachable/dp/B08GHKMR82?th=1&ascsubtag=5429531%7Cn7fdbadb9d6824b2c8c46685dcd425dbd03%7CB08GHKMR82%7C1761450554131%7C%7C&linkCode=ll1&tag=packmindai-20&linkId=75403d80ac0cf4297086374b143a142c&language=en_US&ref_=as_li_ss_tl" 
    },
    // ... You can add many more here ...
];

// --- 3. HELPER FUNCTION DEFINITION (EXPORTED) ---
export const getLocalProductData = (itemName: string) => {
    // Search database: look for item name anywhere in our product list (case-insensitive)
    const normalizedItemName = itemName.toLowerCase().trim();
    // Split keywords to match the AI's varied suggestions
    const itemKeywords = normalizedItemName.split(/\s+/).filter(word => word.length > 3);
    const fallbackImage = "https://via.placeholder.com/150/d3d3d3/808080?text=Packmind";

    const found = LOCAL_PRODUCT_DATABASE.find(product => {
        const productName = product.name.toLowerCase();
        
        // Check for exact match first
        if (productName === normalizedItemName) return true;

        // Check if the AI's name *includes* the database name (e.g., AI: "Anker Power Bank", DB: "Power Bank")
        if (normalizedItemName.includes(productName)) return true;

        // Check if the product name contains at least 60% of the AI's keywords
        // (e.g., AI: "Noise Cancelling Headphones", DB: "Bose Noise Cancelling Headphones")
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
            product_title: itemName, // Use AI's name
            // Use a dynamic search link for the fallback
            product_link: `${GENERIC_AFFILIATE_FALLBACK_LINK}&k=${encodeURIComponent(itemName)}`, 
            image_link: fallbackImage,
            is_affiliate: false
        };
    }
};