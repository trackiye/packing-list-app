/**
 * Generate Amazon affiliate search link for an item
 */
export function generateAmazonLink(itemName: string): string {
  const associateId = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || 'trackiye-20';
  
  // Clean the item name for search
  const searchQuery = cleanItemName(itemName);
  
  // Amazon search URL with affiliate tag
  const baseUrl = 'https://www.amazon.com/s';
  const params = new URLSearchParams({
    k: searchQuery,
    tag: associateId,
    linkCode: 'll2',
    linkId: generateLinkId(),
  });
  
  return `${baseUrl}?${params.toString()}`;
}

/**
 * Generate Amazon product link (if you have ASIN)
 */
export function generateAmazonProductLink(asin: string): string {
  const associateId = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || 'trackiye-20';
  return `https://www.amazon.com/dp/${asin}?tag=${associateId}`;
}

/**
 * Clean item name for better Amazon search results
 */
function cleanItemName(itemName: string): string {
  return itemName
    .toLowerCase()
    .replace(/\([^)]*\)/g, '')
    .replace(/\d+\s*(pairs?|pcs?|items?|x)/gi, '')
    .replace(/\b(for|with|or|and)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Generate unique link ID for tracking
 */
function generateLinkId(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Check if item is likely a physical product worth linking
 */
export function isShoppableItem(itemName: string): boolean {
  const lowerName = itemName.toLowerCase();
  
  const nonShoppable = [
    'passport', 'visa', 'id', 'license', 'permit',
    'reservation', 'confirmation', 'ticket',
    'insurance', 'cash', 'credit card', 'money',
    'contact information', 'emergency contact',
  ];
  
  const isNonShoppable = nonShoppable.some(keyword => 
    lowerName.includes(keyword)
  );
  
  return !isNonShoppable && itemName.length > 3;
}
