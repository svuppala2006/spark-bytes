"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const params = useSearchParams();

  const initialRole = params.get("role") === "organizer" ? "organizer" : "user";

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<"user" | "organizer">(
    params.get("role") == "organizer" ? "organizer" : "user"
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const newRole = params.get("role") == "organizer" ? "organizer" : "user"
    setRole(newRole);
  }, [params]);

  async function onRegister(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');
    if (!email || !password) return setMessage('Email and password required');
    
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role } }
    });

    if (error) {
      setMessage(error.message);
    } else {
      if (data.session) {
        router.replace(role == "organizer" ? "/organizer" : "/dashboard");
      } else {
        setMessage("Check your email to confirm, then sign in.");
      }
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#f2f2f2] flex flex-col relative">

      {/* CENTERED CARD */}
      <div className="flex flex-col items-center flex-grow justify-center">
        <div className="bg-white shadow-md p-10 rounded-md w-[380px]">
          
          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Create your account</h2>
            <p className="text-sm text-gray-500">
              You are registering as <b>{role}</b>.
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={onRegister} className="space-y-4">
            <input
              type="email"
              placeholder="BU Email"
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

            <button
              disabled={loading}
              className="w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              {loading ? "Creating…" : "Register"}
            </button>

            {/* Error message */}
            {message && <p className="text-red-600 text-sm">{message}</p>}
          </form>

          <p className="mt-4 text-xs text-gray-600">
            Already have an account?{" "}
            <Link href="/signin" className="text-blue-700 underline">Sign in</Link>
          </p>
          <p className="mt-2 text-xs text-gray-600 text-left">
            <Link
              href={`/register?role=${role == "organizer" ? "user" : "organizer"}`}
              className="text-blue-700 underline"
            >
              Register as {role == "organizer" ? "user" : "organizer"} instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
