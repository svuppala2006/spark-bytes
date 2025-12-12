"use client";

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

type Role = "user" | "organizer";

export default function SignIn() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Log environment variables on mount
  React.useEffect(() => {
    console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('NEXT_PUBLIC_SUPABASE_KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_KEY)
    console.log('NEXT_PUBLIC_SUPABASE_KEY length:', process.env.NEXT_PUBLIC_SUPABASE_KEY?.length)
    console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL)
  }, [])

  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    if (!email || !password) return setMessage('Email and password required')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setMessage(error.message)
      setLoading(false)
      return;
    }
    const { data: auth } = await supabase.auth.getUser()
    const userId = auth?.user?.id
    let role: Role = "user";
    if (userId) {
      const { data: profile } = await supabase
        .from("profiles")
        .select('role')
        .eq("id", userId)
        .single();
      if (profile?.role == "organizer") role = "organizer";
    }
    router.replace("/home")
    setLoading(false)
  }, [email, password, router])

  return (
    <div className="min-h-screen bg-[#f2f2f2] flex flex-col relative">
      <div className="flex flex-col items-center flex-grow justify-center">
        <div className="bg-white shadow-md p-10 rounded-md w-[380px]">
          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Sign in</h2>
            <p className="text-sm text-gray-500">
              Enter your BU email and password to continue.
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={onSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="BU email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md placeholder-gray-500 text-gray-600"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md placeholder-gray-500 text-gray-600"
            />

            {message && (
              <p className="text-red-600 text-sm" aria-live="polite">
                {message}
              </p>
            )}

            <button
              disabled={loading}
              className="w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          {/* Links */}
          <p className="mt-4 text-xs text-gray-600 text-left">
            No account?{" "}
            <Link href="/portal" className="text-blue-700 underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}