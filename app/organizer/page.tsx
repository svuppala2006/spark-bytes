"use client";

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function OrganizerDashboard() {
  const router = useRouter()

  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser()
      if (!auth?.user) return router.replace('/signin')
      
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", auth.user.id)
        .single();
      if (profile?.role !== "organizer") return router.replace("/dashboard");
    })();
  }, [router])

  return (
    <main>
      <h2>Event Organizer's Dashboard</h2>
      <p>Welcome! You are authenticated.</p>
    </main>
  )
}

