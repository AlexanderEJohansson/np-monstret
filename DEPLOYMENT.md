# NP-Monstret Deployment Guide

## Project Info
- **Name**: NP-Monstret
- **Tech**: Next.js 14 + Supabase + Stripe
- **Build**: `npm run build`
- **Start**: `npm start`

## Environment Variables Required

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_PRICE_ID=your_stripe_price_id
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

## Deploy to Vercel

1. Push code to GitHub
2. Import to Vercel and add all environment variables
3. Add custom domain `npmonstret.se` in Vercel settings
4. Update DNS records to point to Vercel

## Supabase Setup

Run the SQL in `lib/database/schema.sql` in Supabase SQL Editor.

## Stripe Setup

1. Set up webhook endpoint: `https://npmonstret.se/api/stripe/webhook`
2. Listen for: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
