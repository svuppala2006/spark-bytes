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

  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    if (!email || !password) return setMessage('Email and password required')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMessage(error.message)
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
    router.replace(role == "organizer" ? "/organizer" : "/dashboard")
    setLoading(false)
  }, [email, password, router])

  return (
    <main>
      <h2>Sign in</h2>
      <form onSubmit={onSubmit}>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {message && <p>{message}</p>}

        <button disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <p>
        No account?{" "}
        <Link href="/register">
          Register
        </Link>
      </p>
    </main>
  )
}

