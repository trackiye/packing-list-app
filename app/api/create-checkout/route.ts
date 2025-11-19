import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const PLANS = {
  lifetime: {
    name: "Lifetime Pro",
    price: 1900,
    priceId: process.env.STRIPE_PRICE_ID_LIFETIME,
  },
};

export async function POST(req: Request) {
  try {
    console.log('🔵 Checkout API called');

    const session = await getServerSession(authOptions);
    console.log('🔵 Session:', session?.user?.email);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { plan } = await req.json();
    console.log('🔵 Plan requested:', plan);

    if (!plan || !PLANS[plan as keyof typeof PLANS]) {
      return NextResponse.json(
        { error: "Invalid plan" },
        { status: 400 }
      );
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    console.log('🔵 Stripe key exists:', !!stripeKey);

    if (!stripeKey) {
      console.error('❌ No STRIPE_SECRET_KEY in environment');
      return NextResponse.json(
        { error: "Stripe not configured. Please add STRIPE_SECRET_KEY to your environment variables." },
        { status: 500 }
      );
    }

    const planDetails = PLANS[plan as keyof typeof PLANS];
    console.log('🔵 Price ID:', planDetails.priceId);

    if (!planDetails.priceId) {
      console.error('❌ No STRIPE_PRICE_ID_LIFETIME in environment');
      return NextResponse.json(
        { error: "Price ID not configured. Please add STRIPE_PRICE_ID_LIFETIME to your environment variables." },
        { status: 500 }
      );
    }

    console.log('�� Creating Stripe instance...');
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2025-10-29.clover",
    });

    console.log('🔵 Creating checkout session...');
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: planDetails.priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/pricing?canceled=true`,
      customer_email: session.user.email || undefined,
      metadata: {
        userId: (session.user as { id?: string }).id || "",
        plan: plan,
      },
    });

    console.log('✅ Checkout session created:', checkoutSession.id);

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("❌ Stripe checkout error:", error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Stripe Error: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
