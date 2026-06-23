import "server-only";

import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const PLAN_PRICE_ID = {
  user_pro: "price_1TlTrHQUbAh717FvO6DQE5uN",
  user_premium: "price_1TlTJGQUbAh717FvHe4IRfV5",
  annual_user_pro: "price_1TfP9zIzLpOm3WSXfNhY0LOn",
  annual_user_premium: "price_1TfPAhIzLpOm3WSWWJFbXZl",
};
