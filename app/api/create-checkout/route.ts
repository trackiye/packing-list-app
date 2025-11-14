import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

const PLANS = {
  pro: {
    name: "Pro",
    price: 1200,
    interval: "month" as const,
  },
  lifetime: {
    name: "Lifetime",
    price: 14900,
    interval: null,
  },
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await req.json();
    
    if (!plan || !PLANS[plan as keyof typeof PLANS]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json(
        { error: "Payment system not configured. Add STRIPE_SECRET_KEY to environment." },
        { status: 503 }
      );
    }

    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2024-11-20.acacia",
    });

    const planDetails = PLANS[plan as keyof typeof PLANS];
    
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: planDetails.interval ? "subscription" : "payment",
      customer_email: session.user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `PackMind AI ${planDetails.name}`,
              description: planDetails.interval 
                ? "AI-powered packing lists with unlimited generations"
                : "Lifetime access to PackMind AI Pro features",
            },
            unit_amount: planDetails.price,
            ...(planDetails.interval && {
              recurring: {
                interval: planDetails.interval,
              },
            }),
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing?canceled=true`,
      metadata: {
        userId: session.user.email,
        plan,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe error:", error);
    return NextResponse.json(
      { error: "Payment setup failed" },
      { status: 500 }
    );
  }
}
