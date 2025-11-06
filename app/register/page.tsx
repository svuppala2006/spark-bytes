"use client";

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export default function Register() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function onRegister(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')
    if (!email || !password) return setMessage('Email and password required')
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) setMessage(error.message)
    else {
      if (data.session) {
        router.replace('/dashboard')
      } else {
        setMessage('Check your email to confirm, then sign in.')
      }
    }
    setLoading(false)
  }

  return (
    <main>
      <h2>Register</h2>
      <div className="card">
        <form onSubmit={onRegister}>
          <div className="row">
            <input type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
            <input type="password" placeholder="Choose a password" value={password} onChange={e=>setPassword(e.target.value)} />
            <button disabled={loading}>{loading ? 'Creating…' : 'Create account'}</button>
          </div>
          {message && <small>{message}</small>}
        </form>
        <small>Already registered? <Link href="/signin">Sign in</Link></small>
      </div>
    </main>
  )
}
