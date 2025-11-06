"use client";

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function Dashboard() {
  const router = useRouter()

  useEffect(() => {
    async function ensureAuth() {
      const { data } = await supabase.auth.getUser()
      if (!data?.user) router.replace('/signin')
      
    }
    ensureAuth()
  }, [router])

  return (
    <main>
      <h2>Dashboard</h2>
      <p>Welcome! You are authenticated.</p>
    </main>
  )
}
