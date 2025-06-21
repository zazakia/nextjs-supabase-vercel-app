# Next.js + Supabase + Vercel Stack

A modern web application stack with **Next.js 15**, **Supabase**, and **Vercel** deployment.

## 🚀 Features

- **Next.js 15** with App Router and Turbopack
- **Supabase** for database, authentication, and real-time features
- **Vercel** for deployment and edge functions
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **GitHub OAuth** authentication demo

## 🛠️ Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: For server-side operations
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. Supabase Setup

1. Go to [Supabase](https://supabase.com) and create a new project
2. Copy your **Project URL** and **Anon Key** from Settings > API
3. Add these to your `.env.local` file
4. Enable GitHub OAuth in Authentication > Providers

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Quick Deploy:**
   ```bash
   # Install Vercel CLI (if not already installed)
   npm install -g vercel
   
   # Deploy with one command
   vercel
   ```

2. **Web Dashboard:**
   - Go to [vercel.com](https://vercel.com)
   - Connect your GitHub repository
   - Click "Deploy" (zero configuration needed!)

3. **Environment Variables:**
   Add your environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (optional)

4. **Auto-Deploy:**
   - Vercel automatically deploys on every push to main branch
   - Preview deployments for all pull requests

## 📁 Project Structure

```
my-app/
├── src/
│   └── app/
│       ├── layout.tsx
│       └── page.tsx
├── lib/
│   └── supabase.ts
├── public/
├── .env.local
├── vercel.json
├── next.config.ts
├── tailwind.config.js
└── package.json
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔐 Authentication

The app includes a demo authentication system:
- GitHub OAuth login
- User session management
- Protected routes (can be added)

## 🗄️ Database

Set up your Supabase database:

```sql
-- Example: Create a simple posts table
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  author_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own posts
CREATE POLICY "Users can view their own posts" ON posts
  FOR SELECT USING (auth.uid() = author_id);
```

## 🎯 Next Steps

1. **Customize the UI** - Update the homepage design
2. **Add more pages** - Create additional routes
3. **Database integration** - Add CRUD operations
4. **Real-time features** - Use Supabase subscriptions
5. **Edge functions** - Add Netlify/Supabase functions

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🐛 Troubleshooting

### Build Errors
- Make sure all environment variables are set
- Check that Supabase URL and keys are valid
- Ensure Node.js version is 18 or higher

### Authentication Issues
- Verify GitHub OAuth is enabled in Supabase
- Check redirect URLs in GitHub OAuth app settings
- Ensure environment variables are set in Vercel

---

Made with ❤️ using Next.js, Supabase, and Vercel
