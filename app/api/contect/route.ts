// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Send email notification to your team
    await resend.emails.send({
      from: "Packmind Contact <onboarding@resend.dev>",
      to: "hello@packmind.ai", // Replace with your actual email
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background: #f9f9f9;
              border-radius: 10px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 20px;
              border-radius: 10px 10px 0 0;
              text-align: center;
            }
            .content {
              background: white;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .field {
              margin: 15px 0;
            }
            .field-label {
              font-weight: bold;
              color: #667eea;
              display: block;
              margin-bottom: 5px;
            }
            .field-value {
              color: #333;
              padding: 10px;
              background: #f5f5f5;
              border-radius: 5px;
            }
            .message-box {
              padding: 15px;
              background: #f0f4ff;
              border-left: 4px solid #667eea;
              border-radius: 5px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>📧 New Contact Form Submission</h2>
            </div>
            <div class="content">
              <div class="field">
                <span class="field-label">From:</span>
                <div class="field-value">${name}</div>
              </div>
              
              <div class="field">
                <span class="field-label">Email:</span>
                <div class="field-value"><a href="mailto:${email}">${email}</a></div>
              </div>
              
              <div class="field">
                <span class="field-label">Subject:</span>
                <div class="field-value">${subject}</div>
              </div>
              
              <div class="field">
                <span class="field-label">Message:</span>
                <div class="message-box">
                  ${message.replace(/\n/g, "<br>")}
                </div>
              </div>
              
              <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
                Reply directly to this email to respond to ${name}
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // Send confirmation email to user
    await resend.emails.send({
      from: "Packmind AI <onboarding@resend.dev>",
      to: email,
      subject: "We received your message! - Packmind AI",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 10px;
              text-align: center;
            }
            .content {
              padding: 30px;
              background: white;
              border-radius: 10px;
              margin-top: 20px;
            }
            .cta-button {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 50px;
              font-weight: bold;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Message Received!</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              
              <p>Thanks for reaching out to Packmind AI! We've received your message and we'll get back to you within 24-48 hours.</p>
              
              <div style="background: #f0f4ff; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Your message:</strong></p>
                <p style="margin: 10px 0 0 0; color: #666;">${message.substring(
                  0,
                  200
                )}${message.length > 200 ? "..." : ""}</p>
              </div>
              
              <p>In the meantime, why not create a personalized packing list?</p>
              
              <div style="text-align: center;">
                <a href="https://packmind-ai.vercel.app" class="cta-button">
                  🎒 Create Packing List
                </a>
              </div>
              
              <p style="margin-top: 30px; color: #666; font-size: 14px;">
                Thanks for using Packmind AI!<br>
                The Packmind Team
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
