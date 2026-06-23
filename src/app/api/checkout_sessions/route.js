import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe, PLAN_PRICE_ID } from "@/app/lib/stripe"; // Make sure PLAN_PRICE_ID is exported
import { getUserSession } from "@/app/lib/core/session";

export async function POST(request) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");

    const formData = await request.formData();
    const planId = formData.get("plan_id");
    const billingPeriod = formData.get("billing_period"); // Get monthly/yearly

    // 1. Determine the correct lookup key
    // If yearly, we want "annual_user_pro". If monthly, just "user_pro"
    const lookupKey = billingPeriod === "yearly" ? `annual_${planId}` : planId;

    // 2. FIX: Access the object using brackets [], not ()
    const priceId = PLAN_PRICE_ID[lookupKey];

    if (!priceId) {
      throw new Error(`Invalid Price ID for plan: ${lookupKey}`);
    }

    const user = await getUserSession(); // Usually session fetching is async

    const session = await stripe.checkout.sessions.create({
      customer_email: user?.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      metadata: { planId },
      success_url: `${origin}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
    });

    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    console.error("STRIPE ERROR:", err.message); // This helps you see the error in terminal
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
