"use client";
import { useState } from "react";
import { Check, Zap, Sparkles, Users } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  const plans = [
    {
      id: "free",
      name: "Free",
      icon: Zap,
      price: 0,
      period: "/forever",
      description: "Perfect for trying out PackMind",
      color: "from-green-600 to-emerald-600",
      borderColor: "border-green-500",
      features: [
        "3 AI generations per day",
        "Basic AI suggestions",
        "Standard categories",
        "Community support",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      icon: Sparkles,
      price: 15,
      period: "/month",
      description: "For frequent travelers",
      color: "from-purple-600 to-pink-600",
      borderColor: "border-purple-500",
      popular: true,
      features: [
        "Unlimited AI generations",
        "Advanced AI suggestions",
        "Custom categories",
        "Save & organize lists",
        "PDF export",
        "Email lists",
        "Share lists",
        "Priority support",
      ],
    },
    {
      id: "team",
      name: "Team",
      icon: Users,
      price: 39,
      period: "/month",
      description: "For travel agencies & groups",
      color: "from-indigo-600 to-blue-600",
      borderColor: "border-indigo-500",
      features: [
        "Everything in Pro",
        "Up to 10 team members",
        "Shared workspace",
        "Team analytics",
        "API access",
        "White-label option",
        "Dedicated support",
        "Custom integrations",
      ],
    },
  ];

  const handleSelectPlan = async (planId: string) => {
    if (!session) {
      signIn("google", { callbackUrl: "/pricing" });
      return;
    }

    if (planId === "free") {
      router.push("/dashboard");
      return;
    }

    try {
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });

      const { url } = await response.json();
      if (url) window.location.href = url;
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 -z-10" />
      <Header />
      
      <div className="min-h-screen relative">
        <div className="relative z-10 pt-32 pb-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                Start free, upgrade when you need more
              </h1>
              <p className="text-xl text-white/70">
                No hidden fees. Cancel anytime.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan) => {
                const Icon = plan.icon;
                const isHovered = hoveredPlan === plan.id;
                
                return (
                  <div
                    key={plan.id}
                    onMouseEnter={() => setHoveredPlan(plan.id)}
                    onMouseLeave={() => setHoveredPlan(null)}
                    className={`relative rounded-2xl p-8 transition-all duration-300 ${
                      isHovered 
                        ? `glass-medium texture-bg border-l-4 ${plan.borderColor} shadow-2xl` 
                        : "glass-medium border border-white/20"
                    } ${plan.popular ? "md:scale-105" : ""} hover:scale-105`}
                  >
                    {isHovered && (
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent rounded-2xl pointer-events-none" />
                    )}

                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                          ⭐ Most Popular
                        </div>
                      </div>
                    )}

                    <div className={`p-3 rounded-xl bg-gradient-to-br ${plan.color} w-fit mb-4 transition-transform ${isHovered ? "scale-110" : ""}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-white/60 text-sm mb-6">{plan.description}</p>

                    <div className="mb-6">
                      <span className="text-5xl font-bold text-white">${plan.price}</span>
                      <span className="text-white/60">{plan.period}</span>
                    </div>

                    <button
                      onClick={() => handleSelectPlan(plan.id)}
                      className={`w-full py-3 rounded-xl font-semibold transition-all mb-6 ${
                        plan.popular
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:scale-105"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      {plan.id === "free" ? "Get Started" : "Upgrade Now"}
                    </button>

                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 transition-colors ${
                            isHovered ? "text-purple-400" : "text-green-400"
                          }`} />
                          <span className="text-white/80 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
