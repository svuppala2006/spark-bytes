"use client";

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export default function Register() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<"user" | "organizer">("user")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function onRegister(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')
    if (!email || !password) return setMessage('Email and password required')
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { role } } })
    if (error) setMessage(error.message)
    else {
      if (data.session) {
        router.replace(role == "organizer" ? "/organizer" : "/dashboard")
      } else {
        setMessage('Check your email to confirm, then sign in.')
      }
    }
    setLoading(false)
  }

  return (
    <main>
      <h2>Create account</h2>
      <form onSubmit={onRegister}>
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

        <div>
          <label>
            <input
              type="radio"
              checked={role === "user"}
              onChange={() => setRole("user")}
            />
            Regular user
          </label>
          <label>
            <input
              type="radio"
              checked={role === "organizer"}
              onChange={() => setRole("organizer")}
            />
            Event organizer
          </label>
        </div>

        {message && <p>{message}</p>}

        <button disabled={loading}>
          {loading ? "Creating…" : "Create account"}
        </button>
      </form>

      <p>
        Already registered?{" "}
        <Link href="/signin">
          Sign in
        </Link>
      </p>
    </main>
  )
}

