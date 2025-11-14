// app/api/email-list/route.ts - FINAL TYPE-SAFE VERSION
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Define the assumed interface for PackingItem (must match your frontend/chat API structure)
interface PackingItem {
  item_name: string;
  description: string;
  category: string;
}

// Initialize Resend using the environment variable
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Assert the type of packingList and tripContext (tripContext is treated as string for subject)
    const {
      email,
      packingList,
      tripContext,
    }: { email: string; packingList: PackingItem[]; tripContext: string } =
      body;

    // 1. Basic validation
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    if (!packingList || !Array.isArray(packingList)) {
      return NextResponse.json(
        { error: "Invalid packing list format" },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set.");
      return NextResponse.json(
        { error: "Email service is unavailable. Missing API key." },
        { status: 503 }
      );
    }

    // 2. Group items by category for the HTML template (Type-safe reducer)
    const categories: Record<string, PackingItem[]> = packingList.reduce(
      (acc: Record<string, PackingItem[]>, item: PackingItem) => {
        const category = item.category || "Other";
        if (!acc[category]) acc[category] = [];
        acc[category].push(item);
        return acc;
      },
      {} as Record<string, PackingItem[]>
    ); // Use assertion for initial empty object

    // 3. Build HTML Email Content
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Packing List from Packmind AI</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          
          <tr>
            <td style="background: linear-gradient(135deg, #9333ea 0%, #ec4899 50%, #3b82f6 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Packmind AI</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px;">Your Intelligent Packing Assistant</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px;">
              <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 20px;">Your Trip</h2>
              <p style="color: #6b7280; margin: 0; font-size: 14px; line-height: 1.6;">${
                tripContext || "Your upcoming adventure"
              }</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px;">Your Packing List</h2>
              
              ${Object.entries(categories)
                .map(
                  ([category, items]: [string, PackingItem[]]) => `
                <div style="margin-bottom: 25px;">
                  <h3 style="color: #9333ea; margin: 0 0 12px 0; font-size: 16px; font-weight: bold; border-bottom: 2px solid #9333ea; padding-bottom: 5px;">${category}</h3>
                  
                  ${items
                    .map(
                      (item: PackingItem) => `
                    <div style="margin-bottom: 12px; padding: 12px; background-color: #f9fafb; border-radius: 6px;">
                      <div style="display: flex; align-items: start;">
                        <div style="width: 16px; height: 16px; border: 2px solid #9333ea; border-radius: 3px; margin-right: 10px; margin-top: 2px;"></div>
                        <div>
                          <p style="margin: 0; font-weight: bold; color: #1f2937; font-size: 14px;">${
                            item.item_name
                          }</p>
                          <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 13px; line-height: 1.4;">${
                            item.description || ""
                          }</p>
                        </div>
                      </div>
                    </div>
                  `
                    )
                    .join("")}
                </div>
              `
                )
                .join("")}
            </td>
          </tr>

          <tr>
            <td style="padding: 0 30px 30px 30px; text-align: center;">
              <a href="https://packmind.ai" style="display: inline-block; background-color: #9333ea; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; font-size: 14px;">Create Another List</a>
            </td>
          </tr>

          <tr>
            <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #6b7280; font-size: 12px;">
                Generated by <a href="https://packmind.ai" style="color: #9333ea; text-decoration: none;">Packmind AI</a>
              </p>
              <p style="margin: 5px 0 0 0; color: #9ca3af; font-size: 11px;">
                Safe travels! ✈️
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // ✅ BEST PRACTICE - Fully type-safe version
    const response = await resend.emails.send({
      from: "Packmind AI <noreply@packmind.ai>",
      to: email,
      subject: `Your Packing List for ${tripContext || "Your Trip"}`,
      html: htmlContent,
    });

    // Handle the response safely
    const emailId = response.data?.id || "unknown";

    return NextResponse.json({
      success: true,
      messageId: emailId,
      message: "Email sent successfully",
    });
  } catch (error: unknown) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { error: "Failed to send email", details: (error as Error).message },
      { status: 500 }
    );
  }
}
