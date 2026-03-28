# 🎓 NP-Monstret

**AI-powered national exam practice for Swedish students**

En webbapp där svenska elever (åk 6–gymnasiet) tränar på helt nya, dynamiskt genererade nationella prov i Matematik, Engelska och Svenska.

## 🚀 Features

- **12 Complete Courses** - Åk 6, Åk 9, Gymnasiet (4 nivåer)
- **AI-Generated Questions** - Every quiz is unique, generated in real-time
- **Adaptive Learning** - System analyzes weak topics and prioritizes them
- **Real National Exam Format** - Questions match Skolverket's exact style
- **Dark Theme** - Premium neon-blue design with glassmorphism effects
- **Stripe Integration** - 99 kr/month subscription with 7-day trial
- **Supabase Backend** - Secure auth, database, real-time updates
- **Mobile-First** - Fully responsive design

## 📋 Courses (12 Total)

### Åk 6
- Matematik
- Engelska
- Svenska

### Åk 9
- Matematik
- Engelska
- Svenska

### Gymnasiet
- Engelska Nivå 1 & 2
- Svenska Nivå 1 & 3
- Matematik Nivå 1 & 2

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 App Router + TypeScript
- **Styling**: CSS + Glassmorphism effects
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Payments**: Stripe
- **Deployment**: Vercel

## 📦 Setup

```bash
# Install
npm install

# Build
npm run build

# Run locally
npm start

# Visit
http://localhost:3000
```

## 🌍 Deployment

See `DEPLOYMENT.md` for Vercel + GitHub setup instructions.

## 📱 Pages

- **/** - Landing page with features & pricing
- **/auth/signup** - Register with 7-day free trial
- **/auth/login** - User login
- **/kurser** - Course grid with progress
- **/dashboard** - User stats & progress charts
- **/quiz/[courseId]** - Interactive quiz
- **/pricing** - Subscription page

## 🎮 Quiz Generation

API endpoint: `/api/quiz/generate`

```json
{
  "courseId": "uuid",
  "userId": "uuid",
  "weaknesses": ["topic1", "topic2"]
}
```

Returns 10-15 questions with:
- Question text (Swedish)
- 4 multiple choice options
- Correct answer index
- Explanation
- Topic & difficulty level

## 💳 Pricing

- **Free Trial**: 7 days, all features
- **Premium**: 99 kr/month, unlimited access

## 🔐 Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
STRIPE_SECRET_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
STRIPE_PRICE_ID=...
STRIPE_WEBHOOK_SECRET=...
```

## 📊 Database Schema

- `profiles` - Users with subscription status
- `courses` - 12 courses by level/subject
- `quizzes` - Quiz sessions with scores
- `quiz_answers` - Individual question answers
- `user_progress` - Per-course stats & weaknesses

RLS policies ensure users can only see their own data.

## ✨ UI Design

- **Dark Theme**: #0F172A background
- **Neon Blue**: #00BFFF accents
- **Glassmorphism**: Frosted glass effects
- **Smooth Animations**: Transitions & hover effects
- **Swedish Text**: All labels & headers in Swedish

## 🚀 Next Steps

1. Deploy to Vercel
2. Set custom domain to npmonstret.se
3. Configure Stripe webhook
4. Set up email notifications (optional)
5. Add analytics tracking

---

**Status**: ✅ Build successful - Ready for production deployment
