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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Next.js + Supabase + Vercel
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your modern web app stack is ready! 🚀
          </p>
        </div>

        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          {user ? (
            <div className="text-center">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  Welcome back!
                </h2>
                <p className="text-gray-600">
                  Email: {user.email}
                </p>
              </div>
              <button
                onClick={signOut}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Get Started
              </h2>
              <button
                onClick={signIn}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 mb-4"
              >
                Sign in with GitHub
              </button>
              <p className="text-sm text-gray-500">
                Sign in to test Supabase authentication
              </p>
            </div>
          )}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              ⚡ Next.js 15
            </h3>
            <p className="text-gray-600 text-sm">
              Latest React framework with App Router, Turbopack, and more
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              🗄️ Supabase
            </h3>
            <p className="text-gray-600 text-sm">
              PostgreSQL database, authentication, and real-time subscriptions
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              🚀 Vercel
            </h3>
            <p className="text-gray-600 text-sm">
              Edge network, instant deployments, and optimized for Next.js
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
