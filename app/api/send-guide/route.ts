// app/api/send-guide/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ultimate Packing Guide - Packmind AI</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 15px;
      margin: 0 auto 20px;
    }
    h1 {
      color: #667eea;
      font-size: 28px;
      margin: 0 0 10px 0;
    }
    .subtitle {
      color: #666;
      font-size: 16px;
    }
    .section {
      margin: 30px 0;
      padding: 20px;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      border-radius: 15px;
      border-left: 5px solid #667eea;
    }
    .section-title {
      color: #667eea;
      font-size: 20px;
      font-weight: bold;
      margin: 0 0 15px 0;
    }
    .tip {
      background: white;
      padding: 15px;
      border-radius: 10px;
      margin: 10px 0;
      border-left: 3px solid #764ba2;
    }
    .tip-title {
      font-weight: bold;
      color: #764ba2;
      margin-bottom: 5px;
    }
    .checklist {
      list-style: none;
      padding: 0;
    }
    .checklist li {
      background: white;
      padding: 12px;
      margin: 8px 0;
      border-radius: 8px;
      position: relative;
      padding-left: 35px;
    }
    .checklist li:before {
      content: "✓";
      position: absolute;
      left: 12px;
      color: #667eea;
      font-weight: bold;
      font-size: 18px;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px 30px;
      text-decoration: none;
      border-radius: 50px;
      font-weight: bold;
      margin: 20px auto;
      text-align: center;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo"></div>
      <h1>🎒 Ultimate Packing Guide</h1>
      <p class="subtitle">Your complete travel companion from Packmind AI</p>
    </div>

    <div class="section">
      <div class="section-title">✨ Master Packing Strategies</div>
      
      <div class="tip">
        <div class="tip-title">🎯 The Roll, Don't Fold Method</div>
        Rolling clothes saves 30% more space than folding and prevents wrinkles. Roll tightly from bottom to top, then store vertically in your luggage so you can see everything at a glance.
      </div>

      <div class="tip">
        <div class="tip-title">📦 The Packing Cube System</div>
        Invest in packing cubes! Organize by category: one for tops, one for bottoms, one for underwear/socks. This makes unpacking a breeze and helps you find items instantly without destroying your entire suitcase.
      </div>

      <div class="tip">
        <div class="tip-title">👗 The 5-4-3-2-1 Rule</div>
        For a week-long trip: 5 tops, 4 bottoms, 3 dresses/outfits, 2 pairs of shoes, 1 hat. Mix and match for multiple outfit combinations while packing light!
      </div>
    </div>

    <div class="section">
      <div class="section-title">🔥 Pro Traveler Tips</div>
      
      <div class="tip">
        <div class="tip-title">💡 Wear Your Bulkiest Items</div>
        Save precious luggage space by wearing your heaviest shoes, jacket, and jeans during travel. You can always remove layers once on the plane.
      </div>

      <div class="tip">
        <div class="tip-title">🧴 The 3-1-1 Toiletry Rule</div>
        TSA requires: 3.4oz (100ml) bottles max, 1 quart-sized clear bag, 1 bag per passenger. Pro tip: Buy travel-sized refillable bottles and decant your favorites!
      </div>

      <div class="tip">
        <div class="tip-title">📱 Digital Copies Are Essential</div>
        Scan your passport, ID, travel insurance, and important documents. Email them to yourself or store in cloud storage. This is a lifesaver if anything gets lost or stolen!
      </div>
    </div>

    <div class="section">
      <div class="section-title">✅ Never-Forget Essentials Checklist</div>
      <ul class="checklist">
        <li><strong>Passport/ID</strong> - Check expiration date (needs 6 months validity for many countries)</li>
        <li><strong>Phone Charger & Power Bank</strong> - Don't get stranded with a dead phone</li>
        <li><strong>Medications</strong> - Pack extras in carry-on in original containers</li>
        <li><strong>Travel Adapter</strong> - Research your destination's plug type</li>
        <li><strong>Credit Cards & Cash</strong> - Notify your bank of travel plans to avoid card blocks</li>
        <li><strong>Travel Insurance Info</strong> - Keep contact numbers easily accessible</li>
        <li><strong>Reusable Water Bottle</strong> - Save money and stay hydrated</li>
        <li><strong>Hand Sanitizer & Wipes</strong> - Especially important for planes and airports</li>
        <li><strong>Pen</strong> - For filling out customs forms on the plane</li>
        <li><strong>Snacks</strong> - Airport food is expensive; pack protein bars or nuts</li>
      </ul>
    </div>

    <div class="section">
      <div class="section-title">🎨 Bonus: Destination-Specific Tips</div>
      
      <div class="tip">
        <div class="tip-title">🏖️ Beach Destinations</div>
        Pack a dry bag for wet swimsuits, reef-safe sunscreen (required in many places), and a sarong (doubles as beach blanket, cover-up, or scarf).
      </div>

      <div class="tip">
        <div class="tip-title">🏔️ Mountain/Hiking Trips</div>
        Layers are key! Pack moisture-wicking base layers, insulating mid-layers, and waterproof outer layers. Don't forget blister-prevention supplies!
      </div>

      <div class="tip">
        <div class="tip-title">🏙️ City Breaks</div>
        Comfortable walking shoes are #1 priority. Bring a crossbody bag for safety, and dress in layers for unpredictable weather and varied indoor/outdoor temperatures.
      </div>
    </div>

    <div style="text-align: center; margin: 40px 0;">
      <a href="https://packmind-ai.vercel.app" class="cta-button">
        🚀 Create Your Custom Packing List Now
      </a>
    </div>

    <div class="footer">
      <p><strong>Happy Travels! ✈️</strong></p>
      <p>From the team at Packmind AI</p>
      <p style="font-size: 12px; color: #999; margin-top: 20px;">
        You received this because you requested our Ultimate Packing Guide.<br>
        Questions? Reply to this email anytime!
      </p>
    </div>
  </div>
</body>
</html>
    `;

    await resend.emails.send({
      from: "Packmind AI <onboarding@resend.dev>",
      to: email,
      subject: "🎒 Your Ultimate Packing Guide is Here!",
      html: emailHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Send guide error:", error);
    return NextResponse.json(
      { error: "Failed to send guide" },
      { status: 500 }
    );
  }
}
