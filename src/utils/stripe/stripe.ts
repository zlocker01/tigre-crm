import { Stripe } from 'stripe';

let stripeInstance: Stripe | null = null;

export function getStripe() {
  if (stripeInstance) {
    return stripeInstance;
  }

  const apiKey = process.env.STRIPE_API_KEY;

  if (!apiKey) {
    throw new Error(
      'Falta STRIPE_API_KEY. Configura la variable para usar checkout y clientes de Stripe.',
    );
  }

  stripeInstance = new Stripe(apiKey, {
    apiVersion: '2025-08-27.basil',
  });

  return stripeInstance;
}
