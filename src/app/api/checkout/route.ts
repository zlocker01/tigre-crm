import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { getStripe } from "@/utils/stripe/stripe";
import { getPlans } from "@/data/plans/getPlans";

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();
    // Destructure the specific stripePriceId sent from the frontend
    const { planId, userId, email, stripePriceId } = await request.json();

    if (!planId || !userId || !email || !stripePriceId) {
      return NextResponse.json(
        {
          error:
            "Datos incompletos (falta planId, userId, email o stripePriceId)",
        },
        { status: 400 },
      );
    }

    // Optional: You might still want to find the plan for other logic like trial days
    // Find the plan details from your predefined plans
    const plans = await getPlans();
    const plan = plans?.find((p: { plan_id: string }) => p.plan_id === planId);

    if (!plan) {
      return NextResponse.json(
        { error: "Plan no encontrado" },
        { status: 404 },
      );
    }
    // If plan lookup is only for stripePriceId, this 'find' operation is no longer strictly necessary
    // for the checkout session creation itself, but keep it if needed for trial logic.
    if (!plan) {
      // Keep this check if you rely on the plan object for trial or other metadata
      console.warn(
        `Plan with planId ${planId} not found in plans.ts, but proceeding with received stripePriceId: ${stripePriceId}`,
      );
      // If you don't need the plan object at all, you could remove the find and this check.
    }

    // Use supabaseAdmin to query the 'suscripciones' table
    const { data: subscription, error: subError } = await supabaseAdmin
      .from("suscripciones")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .single();

    if (subError && subError.code !== "PGRST116") {
      // Ignore 'PGRST116' (No rows found)
      console.error("Error fetching subscription:", subError);
      throw subError;
    }

    let stripeCustomerId = subscription?.stripe_customer_id;

    if (!stripeCustomerId) {
      console.log(
        `No existing Stripe customer found for user ${userId}. Creating new customer.`,
      ); // Added log
      const customer = await stripe.customers.create({
        email,
        metadata: { userId },
      });
      console.log(`Created Stripe customer ${customer.id} for user ${userId}.`); // Added log

      stripeCustomerId = customer.id;

      // CHANGE: Replace upsert with insert, as we know the record doesn't exist yet.
      console.log(
        `Inserting new record into suscripciones for user ${userId} with customer ID ${stripeCustomerId}.`,
      ); // Added log
      const { error: insertError } = await supabaseAdmin
        .from("suscripciones")
        // Add an initial status value
        .insert({
          user_id: userId,
          stripe_customer_id: stripeCustomerId,
          status: "pending",
          // Add any other required columns with default values if necessary
        });

      // Check specifically for insert errors
      if (insertError) {
        console.error(
          `Error inserting subscription for user ${userId}:`,
          insertError,
        ); // Updated error variable name
        // Rethrow the error to be caught by the outer catch block
        throw insertError; // Updated error variable name
      }
      console.log(`Successfully inserted record for user ${userId}.`); // Added log
    } else {
      console.log(
        `Found existing Stripe customer ID ${stripeCustomerId} for user ${userId}.`,
      ); // Added log
    }

    // Determine trial days (keep this logic if needed)
    // Ensure 'plan' object is available if this logic is kept
    // Determine trial period based on plan ID (Example: 10 days for 'basico')
    // Adjust this logic based on your actual plan IDs and trial policies
    const trialDays = plan?.plan_id === "basico" ? 10 : 0; // Fix: Use plan_id

    // Add logging before creating the session
    console.log(
      `Attempting to create checkout session for Stripe Customer ID: ${stripeCustomerId}, Price ID: ${stripePriceId}`,
    );

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer: stripeCustomerId,
      // Use the stripePriceId received directly from the request body
      line_items: [{ price: stripePriceId, quantity: 1 }],
      subscription_data: {
        // Only add trial_period_days if trialDays is greater than 0
        ...(trialDays > 0 && { trial_period_days: trialDays }),
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/perfil`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/precios`,
      metadata: { user_id: userId },
    });

    // Add logging after successful session creation
    console.log(
      `Successfully created checkout session ${session.id} for customer ${stripeCustomerId}`,
    );

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (error) {
    // Log the specific error when session creation fails
    console.error("Error details during checkout session creation:", error);
    console.error("Error creando sesión de checkout:", error); // Keep existing log
    const errorMessage =
      error instanceof Error ? error.message : "Error interno del servidor";
    return NextResponse.json(
      { error: `Error interno: ${errorMessage}` },
      { status: 500 },
    );
  }
}
