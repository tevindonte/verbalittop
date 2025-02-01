import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("your-public-stripe-key");

export const handleCheckout = async (priceId) => {
  const stripe = await stripePromise;

  const response = await fetch("/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ priceId }),
  });

  const session = await response.json();
  stripe.redirectToCheckout({ sessionId: session.id });
};
