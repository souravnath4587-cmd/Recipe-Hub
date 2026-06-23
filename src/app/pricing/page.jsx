"use client";

import React, { useState } from "react";
import { Card, Button, Chip, Accordion, AccordionItem } from "@heroui/react";
import { motion } from "framer-motion";
import {
  FiCheck,
  FiUser,
  FiAward,
  FiZap,
  FiTrendingUp,
  FiBookOpen,
  FiDatabase,
  FiHelpCircle,
} from "react-icons/fi";
import { GiChefToque, GiNoodles, GiCakeSlice } from "react-icons/gi";

export default function PricingPlansPage() {
  const [billingPeriod, setBillingPeriod] = useState("monthly");

  const plans = [
    {
      name: "Free Plan",
      id: "user_free",
      icon: <GiNoodles size={32} className="text-amber-500" />,
      price: "Free",
      description:
        "Perfect for home cooks getting started sharing their daily culinary workflows.",
      features: [
        "Publish up to 3 recipes",
        "Basic recipe management",
        "Public recipe sharing",
        "Community access",
        "Standard support",
      ],
      cta: "Get Started",
      color: "default",
      popular: false,
    },
    {
      name: "Pro Plan",
      id: "user_pro",
      icon: <GiChefToque size={32} className="text-orange-500" />,
      price: "$9.99",
      period: "/mo",
      description:
        "For active food creators looking to grow their digital kitchen audience.",
      features: [
        "Publish up to 10 recipes",
        "Advanced recipe management",
        "Priority recipe visibility",
        "Access to recipe analytics",
        "Priority support",
        "Premium badges enabled",
      ],
      cta: "Upgrade to Pro",
      color: "primary", // Uses primary brand accent (orange/red)
      popular: true,
    },
    {
      name: "Premium Plan",
      id: "user_premium",
      icon: <GiCakeSlice size={32} className="text-red-500" />,
      price: "$24.99",
      period: "/mo",
      description:
        "For professional culinary masters, restaurants, and brand publishers.",
      features: [
        "Unlimited recipe publishing",
        "Advanced analytics & insights",
        "Featured creator badge token",
        "Priority recipe promotion",
        "Early access to new features",
        "Dedicated support pipeline",
        "Unlimited recipe storage",
      ],
      cta: "Go Premium",
      color: "secondary",
      popular: false,
    },
  ];

  return (
    <div className="w-full min-h-screen bg-background text-foreground py-16 px-4 space-y-20">
      {/* --- SECTION 1: HEADER TEXT & TOGGLE --- */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <Chip
          variant="flat"
          color="warning"
          className="font-bold uppercase tracking-wider text-xs"
        >
          Subscription Portal
        </Chip>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
          Choose the Perfect Plan for Your{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-500 via-orange-500 to-red-600">
            Culinary Journey
          </span>
        </h1>
        <p className="text-default-400 text-sm font-medium">
          Unlock advanced analytics, boost publication exposure visibility
          metrics, and share your favorite blueprints with millions of active
          cooks globally.
        </p>

        {/* Dynamic Billing Period Switcher */}
        <div className="pt-4 flex justify-center">
          <div className="bg-default-100 p-1 rounded-2xl border border-divider flex gap-1">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all ${billingPeriod === "monthly" ? "bg-white text-black shadow-sm dark:bg-zinc-800 dark:text-white" : "text-default-400 hover:text-foreground"}`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${billingPeriod === "yearly" ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm" : "text-default-400 hover:text-foreground"}`}
            >
              Annual Save 20%
            </button>
          </div>
        </div>
      </div>

      {/* --- SECTION 2: 3-CARD CAROUSEL GRID LAYOUT --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
            whileHover={{ y: -10 }}
            className="flex"
          >
            {/* Exact HeroUI 3.2.1 Compound Syntax Card Container */}
            <Card
              className={`w-full bg-content1 rounded-3xl overflow-hidden shadow-md flex flex-col justify-between p-6 relative border transition-colors ${
                plan.popular
                  ? "border-orange-500 ring-2 ring-orange-500/20 shadow-orange-500/10"
                  : "border-divider/70"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-4 right-4 z-20">
                  <Chip
                    size="sm"
                    className="bg-linear-to-r from-orange-500 to-red-600 text-white font-black tracking-wider uppercase text-[10px]"
                    startContent={<FiZap className="fill-current" />}
                  >
                    Most Popular
                  </Chip>
                </div>
              )}

              {/* Card Header Structure Section */}
              <Card.Header className="flex flex-col items-start gap-3 pb-4 border-b border-divider/40">
                <div className="p-3 bg-default-50 rounded-2xl border border-divider/40 shadow-inner">
                  {plan.icon}
                </div>
                <div>
                  <Card.Title className="text-xl font-black text-foreground tracking-tight">
                    {plan.name}
                  </Card.Title>
                  <Card.Description className="text-xs text-default-400 min-h-[32] pt-1 leading-relaxed">
                    {plan.description}
                  </Card.Description>
                </div>
              </Card.Header>

              {/* Card Pricing Content Section Core */}
              <Card.Content className="py-6 grow space-y-6">
                <div className="flex items-baseline text-foreground">
                  <span className="text-4xl font-black tracking-tight">
                    {billingPeriod === "yearly" && plan.price !== "Free"
                      ? `$${(parseFloat(plan.price.replace("$", "")) * 0.8).toFixed(2)}`
                      : plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-default-400 text-xs font-bold ml-1">
                      {plan.period}
                    </span>
                  )}
                </div>

                {/* Features Unordered Matrix Grid list */}
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-xs text-default-600 font-medium"
                    >
                      <div
                        className={`p-0.5 rounded-full mt-0.5 ${plan.popular ? "bg-orange-500/10 text-orange-500" : "bg-default-100 text-default-500"}`}
                      >
                        <FiCheck size={12} className="stroke-3" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card.Content>

              {/* Card Interactive Footer CTA Block */}
              <Card.Footer className="pt-4 border-t border-divider/40">
                <motion.div className="w-full" whileTap={{ scale: 0.97 }}>
                  {/* // Inside your plans.map loop: */}
                  <form action="/api/checkout_sessions" method="POST">
                    {/* Pass the ID */}
                    <input type="hidden" name="plan_id" value={plan.id} />

                    {/* Pass the Billing Period (monthly or yearly) */}
                    <input
                      type="hidden"
                      name="billing_period"
                      value={billingPeriod}
                    />

                    <section>
                      {plan.id === "user_free" ? (
                        <Button
                          fullWidth
                          className="font-black p-2 text-sm tracking-tight"
                          variant="flat"
                        >
                          Current Plan
                        </Button>
                      ) : (
                        <button
                          type="submit"
                          role="link"
                          className={`font-black w-full p-2 rounded-xl text-sm tracking-tight transition-transform active:scale-95 ${
                            plan.popular
                              ? "text-black bg-linear-to-r from-amber-400 to-orange-500 shadow-md"
                              : "bg-default-200 text-default-700"
                          }`}
                        >
                          Checkout
                        </button>
                      )}
                    </section>
                  </form>
                </motion.div>
              </Card.Footer>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* --- SECTION 3: PUBLISHING COMPARISON MATRIX --- */}
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black tracking-tight">
            Limits & Scaling Benchmarks
          </h2>
          <p className="text-xs text-default-400 font-medium">
            Clear metrics detailing capacity allocations across infrastructure.
          </p>
        </div>

        <div className="bg-content1 border border-divider rounded-2xl overflow-hidden p-4 grid grid-cols-3 text-center text-xs font-bold divide-x divide-divider">
          <div className="space-y-1 py-2">
            <div className="text-default-400 font-medium">
              Free Storage Tier
            </div>
            <div className="text-lg text-foreground flex justify-center items-center gap-1">
              <FiUser size={14} className="text-amber-500" /> 3 Recipes Max
            </div>
          </div>
          <div className="space-y-1 py-2">
            <div className="text-orange-500 font-black uppercase tracking-wider text-[10px]">
              Pro Growth Limit
            </div>
            <div className="text-lg text-foreground flex justify-center items-center gap-1">
              <FiTrendingUp size={14} className="text-orange-500" /> 10 Recipes
              Max
            </div>
          </div>
          <div className="space-y-1 py-2">
            <div className="text-default-400 font-medium">
              Premium Architecture
            </div>
            <div className="text-lg text-foreground flex justify-center items-center gap-1">
              <FiDatabase size={14} className="text-red-500" /> Unlimited Slots
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION 4: CORE VALUE BENEFITS --- */}
      <div className="max-w-5xl mx-auto space-y-8">
        <h2 className="text-2xl font-black text-center tracking-tight">
          Why Creators Upgrade to Premium Blueprints
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-default-50 border border-divider/40 p-5 rounded-2xl space-y-2">
            <FiAward className="text-orange-500" size={24} />
            <h3 className="font-bold text-sm">Verified Creator Credibility</h3>
            <p className="text-xs text-default-400 leading-relaxed font-medium">
              Gain access to elite search positioning algorithms to ensure your
              content maps first on feeds.
            </p>
          </div>
          <div className="bg-default-50 border border-divider/40 p-5 rounded-2xl space-y-2">
            <FiBookOpen className="text-amber-500" size={24} />
            <h3 className="font-bold text-sm">Granular Engagement Matrix</h3>
            <p className="text-xs text-default-400 leading-relaxed font-medium">
              Track exactly who bookmarks, duplicates, logs prints, or likes
              your food catalog indexes.
            </p>
          </div>
          <div className="bg-default-50 border border-divider/40 p-5 rounded-2xl space-y-2">
            <FiZap className="text-red-500" size={24} />
            <h3 className="font-bold text-sm">Direct Monetization Channels</h3>
            <p className="text-xs text-default-400 leading-relaxed font-medium">
              Premium nodes open access pipelines to paywall custom cooking
              courses and hidden food logs.
            </p>
          </div>
        </div>
      </div>

      {/* --- SECTION 5: FREQUENTLY ASKED QUESTIONS --- */}
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black tracking-tight flex items-center justify-center gap-2">
            <FiHelpCircle className="text-orange-500" /> Frequently Asked
            Questions
          </h2>
          <p className="text-xs text-default-400 font-medium">
            Got system operation constraints queries? Here are standard pipeline
            solutions.
          </p>
        </div>

        <Accordion variant="splitted" className="p-0">
          <AccordionItem
            key="1"
            title="Can I cancel my active subscription later?"
            className="text-sm font-bold bg-content1 border border-divider"
          >
            <p className="text-xs font-medium text-default-500 leading-relaxed">
              Yes, absolutely. You can cancel, upgrade, or downgrade your
              Recipe-Hub subscription pipeline at any time directly through your
              account dashboard settings console safely without any hidden
              processing penalties.
            </p>
          </AccordionItem>
          <AccordionItem
            key="2"
            title="What happens to my data if I downgrade back to Free?"
            className="text-sm font-bold bg-content1 border border-divider"
          >
            <p className="text-xs font-medium text-default-500 leading-relaxed">
              If you drop down to the standard Free layout, your historical data
              records remain safely cached within MongoDB cloud architectures.
              However, further recipe document inserts will be paused until
              allocation capacity resets or slots open up.
            </p>
          </AccordionItem>
          <AccordionItem
            key="3"
            title="Are there custom enterprise bundles for large institutions?"
            className="text-sm font-bold bg-content1 border border-divider"
          >
            <p className="text-xs font-medium text-default-500 leading-relaxed">
              Yes! For culinary schools, restaurants, or collaborative kitchen
              networks, reach out directly to our operations core through the
              enterprise review node for bulk clearance configurations.
            </p>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
