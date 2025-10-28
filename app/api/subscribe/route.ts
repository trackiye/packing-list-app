// app/api/subscribe/route.ts
import { NextResponse } from 'next/server';

export const maxDuration = 10;

// Simple email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, source = 'general' } = body;

    // Validate email
    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // --- OPTION 1: Mailchimp Integration ---
    if (process.env.MAILCHIMP_API_KEY && process.env.MAILCHIMP_LIST_ID) {
      try {
        const datacenter = process.env.MAILCHIMP_API_KEY.split('-')[1];
        const response = await fetch(
          `https://${datacenter}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_LIST_ID}/members`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `apikey ${process.env.MAILCHIMP_API_KEY}`,
            },
            body: JSON.stringify({
              email_address: normalizedEmail,
              status: 'subscribed',
              tags: [source],
              merge_fields: {
                SOURCE: source,
                SIGNUP_DATE: new Date().toISOString(),
              },
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          // Handle "already subscribed" gracefully
          if (data.title === 'Member Exists') {
            return NextResponse.json(
              { 
                success: true, 
                message: 'You are already subscribed!',
                alreadySubscribed: true 
              },
              { status: 200 }
            );
          }

          throw new Error(data.detail || 'Mailchimp error');
        }

        return NextResponse.json(
          { 
            success: true, 
            message: 'Successfully subscribed!',
            provider: 'mailchimp'
          },
          { status: 200 }
        );
      } catch (mailchimpError) {
        console.error('Mailchimp error:', mailchimpError);
        // Fall through to other options
      }
    }

    // --- OPTION 2: ConvertKit Integration ---
    if (process.env.CONVERTKIT_API_KEY && process.env.CONVERTKIT_FORM_ID) {
      try {
        const response = await fetch(
          `https://api.convertkit.com/v3/forms/${process.env.CONVERTKIT_FORM_ID}/subscribe`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              api_key: process.env.CONVERTKIT_API_KEY,
              email: normalizedEmail,
              tags: [source],
            }),
          }
        );

        if (!response.ok) {
          throw new Error('ConvertKit error');
        }

        return NextResponse.json(
          { 
            success: true, 
            message: 'Successfully subscribed!',
            provider: 'convertkit'
          },
          { status: 200 }
        );
      } catch (convertkitError) {
        console.error('ConvertKit error:', convertkitError);
        // Fall through to fallback
      }
    }

    // --- OPTION 3: Simple Google Sheets Logging (Fallback) ---
    if (process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
      try {
        await fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: normalizedEmail,
            source,
            timestamp: new Date().toISOString(),
          }),
        });

        return NextResponse.json(
          { 
            success: true, 
            message: 'Successfully subscribed!',
            provider: 'sheets'
          },
          { status: 200 }
        );
      } catch (sheetsError) {
        console.error('Google Sheets error:', sheetsError);
      }
    }

    // --- FALLBACK: Just log to console (for testing) ---
    console.log('📧 Email Subscription:', {
      email: normalizedEmail,
      source,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully subscribed!',
        provider: 'console'
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error('Subscription error:', error);
    
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json(
    { 
      status: 'ok',
      service: 'Email Subscription API',
      providers: {
        mailchimp: !!process.env.MAILCHIMP_API_KEY,
        convertkit: !!process.env.CONVERTKIT_API_KEY,
        sheets: !!process.env.GOOGLE_SHEETS_WEBHOOK_URL,
      }
    },
    { status: 200 }
  );
}