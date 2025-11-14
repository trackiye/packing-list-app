import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email required" },
        { status: 400 }
      );
    }

    // TODO: Integrate with your email service (SendGrid, Resend, etc.)
    // For now, we'll log it and return success
    console.log("New subscriber:", email);

    // Store in a simple way for now (you'll want a database later)
    // This could be Supabase, Airtable, or any DB

    return NextResponse.json({ 
      success: true,
      message: "Check your email for the Ultimate Packing Guide!"
    });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
