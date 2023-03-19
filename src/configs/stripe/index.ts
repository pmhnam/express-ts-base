import Stripe from 'stripe';
import { config } from 'dotenv';

config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'STRIPE_SECRET_KEY', {
  apiVersion: '2022-11-15',
  appInfo: {
    name: 'stripe-samples/accept-a-payment',
    url: 'https://github.com/stripe-samples',
    version: '0.0.2',
  },
  typescript: true,
});

export default stripe;
