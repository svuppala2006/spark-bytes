"use client";

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export default function SignIn() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    if (!email || !password) return setMessage('Email and password required')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMessage(error.message)
    else router.push('/dashboard')
    setLoading(false)
  }, [email, password, router])

  return (
    <main>
      <h2>Sign In</h2>
      <div className="card">
        <form onSubmit={onSubmit}>
          <div className="row">
            <input type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
            <input type={show ? 'text' : 'password'} placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} />
            <label><input type="checkbox" checked={show} onChange={e=>setShow(e.target.checked)} /> Show</label>
            <button disabled={loading}>{loading ? 'Signing in…' : 'Sign In'}</button>
          </div>
          {message && <small>{message}</small>}
        </form>
        <small>No account? <Link href="/register">Register</Link></small>
      </div>
    </main>
  )
}
