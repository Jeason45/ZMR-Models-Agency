import Stripe from 'stripe';

// Stripe côté serveur - initialisation conditionnelle
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

// Créer une instance Stripe seulement si la clé est configurée
export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2025-11-17.clover' as const,
      typescript: true,
    })
  : null;

// Helper pour vérifier si Stripe est configuré
export const isStripeConfigured = (): boolean => {
  return !!stripeSecretKey && !!stripe;
};

// Helper pour formater les montants (Stripe utilise les centimes)
export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100);
};

export const formatAmountFromStripe = (amount: number): number => {
  return amount / 100;
};
