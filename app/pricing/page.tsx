"use client";

import { Check, Crown, Zap, Rocket } from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import BeautifulFooter from "@/components/BeautifulFooter";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out PackMind",
    icon: Zap,
    features: [
      "3 AI generations per day",
      "Basic AI suggestions",
      "Standard categories",
      "Community support",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "month",
    description: "For frequent travelers",
    icon: Rocket,
    features: [
      "Unlimited AI generations",
      "Advanced AI suggestions",
      "Custom categories",
      "Save & organize lists",
      "PDF export",
      "Share lists",
      "Priority support",
      "Weather integration",
    ],
    cta: "Upgrade to Pro",
    highlighted: true,
    popular: true,
  },
  {
    name: "Lifetime",
    price: "$149",
    period: "one-time",
    description: "Best value for power users",
    icon: Crown,
    features: [
      "Everything in Pro",
      "Lifetime access",
      "Early access to features",
      "Premium support",
      "API access",
      "White-label option",
      "Custom integrations",
    ],
    cta: "Get Lifetime Access",
    highlighted: false,
    lifetime: true,
  },
];

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSelectPlan = async (planName: string) => {
    if (planName === "Free") {
      if (!session) {
        signIn("google");
      } else {
        toast.success("You're on the Free plan!");
      }
    } else {
      // Redirect to payment
      if (!session) {
        toast.error("Please sign in first");
        signIn("google");
        return;
      }
      
      try {
        const response = await fetch("/api/create-checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan: planName.toLowerCase() }),
        });
        
        const { url } = await response.json();
        if (url) {
          window.location.href = url;
        }
      } catch (error) {
        toast.error("Payment system coming soon!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-main">
      <div className="floating-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <Header />
      <div className="h-14" />

      <main className="relative z-10 section-padding content-section">
        <div className="container-custom max-w-6xl">
          <div className="text-center mb-16 animate-fadeIn">
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
              Choose Your <span className="gradient-text">Plan</span>
            </h1>
            <p className="text-xl text-white/80 mb-4">
              Start free, upgrade when you need more
            </p>
            <p className="text-white/60">No hidden fees. Cancel anytime.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, idx) => {
              const Icon = plan.icon;
              return (
                <div
                  key={plan.name}
                  className={`card p-6 animate-fadeIn relative hover-lift flex flex-col ${
                    plan.highlighted ? "shadow-glow-purple border-purple-400/50" : ""
                  }`}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="premium-badge">
                        <Rocket className="w-3 h-3" />
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      plan.highlighted 
                        ? "bg-gradient-to-br from-purple-600 to-pink-600 shadow-glow-purple" 
                        : "bg-white/10"
                    }`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-white/60 text-sm mb-4">{plan.description}</p>
                    <div className="mb-2">
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      <span className="text-white/60 text-sm">/{plan.period}</span>
                    </div>
                    {plan.lifetime && (
                      <p className="text-green-400 text-xs font-semibold">
                        Save $250+ over 2 years
                      </p>
                    )}
                  </div>

                  {/* Features - centered with proper spacing */}
                  <ul className="space-y-2.5 mb-auto flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-white/90">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Button at bottom */}
                  <button
                    onClick={() => handleSelectPlan(plan.name)}
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all hover-lift mt-6 ${
                      plan.highlighted ? "btn-primary" : "btn-secondary"
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="card p-8 max-w-3xl mx-auto animate-fadeIn hover-lift">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-2">Can I change plans later?</h3>
                <p className="text-white/70 text-sm">
                  Yes! Upgrade or downgrade anytime. Changes take effect immediately.
                </p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">What payment methods do you accept?</h3>
                <p className="text-white/70 text-sm">
                  We accept all major credit cards via Stripe. Secure and encrypted.
                </p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Is there a refund policy?</h3>
                <p className="text-white/70 text-sm">
                  Yes! 30-day money-back guarantee. No questions asked.
                </p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">How does the Lifetime plan work?</h3>
                <p className="text-white/70 text-sm">
                  Pay once, use forever. All future updates included. Best value for serious travelers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BeautifulFooter />
    </div>
  );
}
