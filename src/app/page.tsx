'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '../../lib/supabase'
import type { User } from '@supabase/supabase-js'

// Disable static optimization to prevent build-time Supabase client creation  
export const dynamic = 'force-dynamic'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const initSupabase = async () => {
      const supabase = await createSupabaseClient()
      
      // If Supabase is not configured, just set loading to false
      if (!supabase) {
        setLoading(false)
        return
      }

      // Check if user is logged in
      const checkUser = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser()
          setUser(user)
          setLoading(false)
        } catch (error) {
          console.error('Auth error:', error)
          setLoading(false)
        }
      }

      await checkUser()

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setUser(session?.user ?? null)
          setLoading(false)
        }
      )

      return () => subscription.unsubscribe()
    }

    initSupabase()
  }, [mounted])

  const signIn = async () => {
    const supabase = await createSupabaseClient()
    if (!supabase) return
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
    })
    if (error) console.error('Error signing in:', error)
  }

  const signOut = async () => {
    const supabase = await createSupabaseClient()
    if (!supabase) return
    
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Error signing out:', error)
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Gold Standard Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-2 rounded-full font-semibold text-sm mb-6 shadow-lg">
            ⭐ GOLD STANDARD ⭐
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Next.js + Supabase + Vercel
          </h1>
          <p className="text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-semibold mb-4">
            Gold Standard in Modern Web App Development
          </p>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The ultimate stack combining React's most powerful framework, PostgreSQL-powered backend, 
            and the world's fastest deployment platform. Built for scale, optimized for performance. 🚀
          </p>
        </div>

        {/* Authentication Card */}
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-xl p-8 mb-16 border border-gray-100">
          {user ? (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✅</span>
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  Authentication Success!
                </h2>
                <p className="text-gray-600">
                  Welcome, {user.email}
                </p>
              </div>
              <button
                onClick={signOut}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 shadow-md"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🔐</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Experience the Power
              </h2>
              <button
                onClick={signIn}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 mb-4 shadow-md"
              >
                Sign in with GitHub
              </button>
              <p className="text-sm text-gray-500">
                Test Supabase authentication in action
              </p>
            </div>
          )}
        </div>

        {/* Why Gold Standard Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why This Stack is the Gold Standard
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Lightning Fast
              </h3>
              <p className="text-gray-600 text-sm">
                Next.js 15 with Turbopack delivers instant hot reloads and optimized builds
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
              <div className="text-3xl mb-4">🔒</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Enterprise Security
              </h3>
              <p className="text-gray-600 text-sm">
                Supabase provides row-level security, OAuth, and PostgreSQL reliability
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
              <div className="text-3xl mb-4">🌍</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Global Edge Network
              </h3>
              <p className="text-gray-600 text-sm">
                Vercel's edge functions and CDN ensure sub-100ms response times worldwide
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
              <div className="text-3xl mb-4">📈</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Infinite Scale
              </h3>
              <p className="text-gray-600 text-sm">
                Auto-scaling infrastructure that grows from MVP to millions of users
              </p>
            </div>
          </div>
        </div>

        {/* Tech Stack Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl mb-4">⚛️</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Next.js 15
            </h3>
            <ul className="text-gray-600 space-y-2 text-sm">
              <li>✓ App Router with nested layouts</li>
              <li>✓ Server & Client Components</li>
              <li>✓ Turbopack for 700x faster builds</li>
              <li>✓ Built-in TypeScript support</li>
              <li>✓ Image & Font optimization</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl mb-4">🗄️</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Supabase
            </h3>
            <ul className="text-gray-600 space-y-2 text-sm">
              <li>✓ PostgreSQL database</li>
              <li>✓ Real-time subscriptions</li>
              <li>✓ Built-in authentication</li>
              <li>✓ Row Level Security (RLS)</li>
              <li>✓ Auto-generated APIs</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Vercel
            </h3>
            <ul className="text-gray-600 space-y-2 text-sm">
              <li>✓ Zero-config deployments</li>
              <li>✓ Edge Functions globally</li>
              <li>✓ Automatic HTTPS & CDN</li>
              <li>✓ Git-based workflows</li>
              <li>✓ Preview deployments</li>
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Build the Future?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Join thousands of developers using the gold standard stack for modern web applications
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://github.com/zazakia/nextjs-supabase-vercel-app"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                View Source Code
              </a>
              <a
                href="https://vercel.com/new/clone?repository-url=https://github.com/zazakia/nextjs-supabase-vercel-app"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200"
              >
                Deploy Your Own
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
