// app/api/genarate-pdf/route.ts - FINAL TYPE-SAFE PDF EXPORT
import { NextRequest, NextResponse } from "next/server";

// Interface must be defined or imported to avoid 'any'
interface PackingItem {
  item_name: string;
  description: string;
  category: string;
}

// Interface for the incoming POST request body
interface PdfRequestBody {
  items: PackingItem[];
  userName: string;
  tripDetails: string;
}

export async function POST(request: NextRequest) {
  try {
    const { items, userName, tripDetails }: PdfRequestBody =
      await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "No items provided for PDF generation" },
        { status: 400 }
      );
    }

    // Group items by category (Type-safe reducer)
    const categorized: Record<string, PackingItem[]> = {};
    items.forEach((item) => {
      const cat = item.category || "Miscellaneous";
      if (!categorized[cat]) categorized[cat] = [];
      categorized[cat].push(item);
    });

    // Generate beautiful HTML for printing
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Packing List - ${userName || "Traveler"}</title>
  <style>
    @media print {
      body { margin: 0; padding: 20px; }
      .no-print { display: none !important; }
      .page-break { page-break-before: always; }
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
    }
    
    .container {
      background: white;
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 30px;
      border-bottom: 4px solid #667eea;
    }
    
    .logo {
      font-size: 36px;
      font-weight: 900;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 10px;
    }
    
    h1 {
      color: #1f2937;
      font-size: 28px;
      margin-bottom: 8px;
    }
    
    .trip-details {
      color: #6b7280;
      font-size: 16px;
      margin-bottom: 6px;
    }
    
    .generated-date {
      color: #9ca3af;
      font-size: 14px;
      font-style: italic;
    }
    
    .category {
      margin-bottom: 32px;
      break-inside: avoid;
    }
    
    .category-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .category-icon {
      font-size: 24px;
    }
    
    .items-list {
      list-style: none;
    }
    
    .item {
      padding: 16px;
      margin-bottom: 12px;
      background: #f9fafb;
      border-radius: 8px;
      border-left: 4px solid #667eea;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      break-inside: avoid;
    }
    
    .checkbox {
      width: 24px;
      height: 24px;
      border: 3px solid #667eea;
      border-radius: 6px;
      flex-shrink: 0;
      margin-top: 2px;
      cursor: pointer;
      position: relative;
    }
    
    .checkbox:hover {
      background: #f3f4f6;
    }
    
    /* When checkbox is checked via click */
    .item.checked .checkbox {
      background: #667eea;
    }
    
    .item.checked .checkbox::after {
      content: "✓";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 16px;
      font-weight: bold;
    }
    
    .item.checked {
      opacity: 0.6;
    }
    
    .item-content {
      flex: 1;
    }
    
    .item-name {
      font-size: 16px;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 4px;
    }
    
    .item-description {
      font-size: 14px;
      color: #6b7280;
      line-height: 1.5;
    }
    
    .footer {
      margin-top: 50px;
      padding-top: 30px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
    }
    
    .footer-logo {
      font-size: 20px;
      font-weight: bold;
      color: #667eea;
      margin-bottom: 8px;
    }
    
    .footer-text {
      color: #9ca3af;
      font-size: 13px;
      margin-bottom: 20px;
    }
    
    .print-button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 14px 32px;
      font-size: 16px;
      font-weight: bold;
      border-radius: 8px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      transition: transform 0.2s;
    }
    
    .print-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
    }
    
    .print-button:active {
      transform: translateY(0);
    }
    
    .stats {
      display: flex;
      justify-content: center;
      gap: 40px;
      margin: 20px 0;
      padding: 20px;
      background: #f9fafb;
      border-radius: 12px;
    }
    
    .stat {
      text-align: center;
    }
    
    .stat-number {
      font-size: 32px;
      font-weight: bold;
      color: #667eea;
    }
    
    .stat-label {
      font-size: 14px;
      color: #6b7280;
      margin-top: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🎒 PackMind AI</div>
      <h1>${userName ? `${userName}'s` : "Your"} Packing List</h1>
      <p class="trip-details">${tripDetails || "Personalized for your trip"}</p>
      <p class="generated-date">Generated on ${new Date().toLocaleDateString(
        "en-US",
        {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      )}</p>
    </div>

    <div class="stats">
      <div class="stat">
        <div class="stat-number" id="total-items">${items.length}</div>
        <div class="stat-label">Total Items</div>
      </div>
      <div class="stat">
        <div class="stat-number" id="checked-count">0</div>
        <div class="stat-label">Packed</div>
      </div>
      <div class="stat">
        <div class="stat-number" id="remaining-count">${items.length}</div>
        <div class="stat-label">Remaining</div>
      </div>
    </div>

    ${Object.entries(categorized)
      .map(
        ([category, categoryItems]: [string, PackingItem[]]) => `
      <div class="category">
        <div class="category-header">
          <span class="category-icon">${getCategoryIcon(category)}</span>
          <span>${category}</span>
          <span style="margin-left: auto; font-size: 14px; opacity: 0.9;">${
            categoryItems.length
          } items</span>
        </div>
        <ul class="items-list">
          ${categoryItems
            .map(
              (item: PackingItem) => `
            <li class="item" onclick="this.classList.toggle('checked'); updateStats();">
              <div class="checkbox"></div>
              <div class="item-content">
                <div class="item-name">${item.item_name}</div>
                <div class="item-description">${item.description}</div>
              </div>
            </li>
          `
            )
            .join("")}
        </ul>
      </div>
    `
      )
      .join("")}

    <div class="footer">
      <div class="footer-logo">PackMind AI</div>
      <p class="footer-text">
        Smart packing lists powered by AI<br>
        Visit <strong>packmind.ai</strong> to create your own list
      </p>
      <button class="print-button no-print" onclick="window.print()">
        🖨️ Print or Save as PDF
      </button>
      <p class="footer-text no-print" style="margin-top: 16px;">
        <small>Tip: Use your browser's print function to save this as a PDF</small>
      </p>
    </div>
  </div>

  <script>
    // Update stats when items are checked
    function updateStats() {
      const checkedItems = document.querySelectorAll('.item.checked').length;
      const totalItems = ${items.length};
      const remaining = totalItems - checkedItems;
      
      document.getElementById('checked-count').textContent = checkedItems;
      document.getElementById('remaining-count').textContent = remaining;
    }
  </script>
</body>
</html>`;

    // Return HTML as downloadable file
    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="PackMind-${
          userName || "Packing-List"
        }-${Date.now()}.html"`,
      },
    });
  } catch (error: unknown) {
    // FIX: Use unknown for type safety
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    console.error("❌ PDF Generation Error:", errorMessage, error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}

// Helper function for category icons
function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    "Documents & Essentials": "📄",
    Clothing: "👕",
    "Clothing & Footwear": "👕",
    Toiletries: "🧴",
    "Toiletries & Personal Care": "🧴",
    Electronics: "🔌",
    "Electronics & Gadgets": "🔌",
    "Beach & Water": "🏖️",
    "Beach & Water Activities": "🏖️",
    "Health & Safety": "⚕️",
    Entertainment: "🎮",
    "Entertainment & Comfort": "🎮",
    "Food & Snacks": "🍎",
    Footwear: "👟",
    Accessories: "🎒",
    Miscellaneous: "📦",
  };

  return icons[category] || "📦";
}
