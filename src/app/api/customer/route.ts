import { getStripe } from "@/utils/stripe/stripe";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// Move this to a helper function (not exported)
async function createStripeCustomer(userId: string, email: string) {
  const supabase = await createClient();
  const stripe = getStripe();

  const { data: existing } = await supabase
    .from("suscripciones")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .single();

  if (existing?.stripe_customer_id) {
    return existing.stripe_customer_id;
  }

  const customer = await stripe.customers.create({ email });

  await supabase
    .from("suscripciones")
    .update({ stripe_customer_id: customer.id })
    .eq("user_id", userId);

  return customer.id;
}

// Export a proper HTTP method handler
export async function POST(request: Request) {
  try {
    const { userId, email } = await request.json();

    if (!userId || !email) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    const customerId = await createStripeCustomer(userId, email);

    return NextResponse.json({
      success: true,
      customerId,
    });
  } catch (error) {
    console.error("Error creating Stripe customer:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}
