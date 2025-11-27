"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Portal() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const userId = session.user.id;
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      router.replace("/home")
    })();
  }, [router]);
  
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Spark!Bytes</h1>
        <p className="text-lg opacity-80">
          Self-service portal for campus users and organizers
        </p>

        <div className="flex gap-6 mt-8">
          <Link
            href="/register?role=user"
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg text-xl font-semibold transition"
          >
            User Registration
          </Link>

          <Link
            href="/register?role=organizer"
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg text-xl font-semibold transition"
          >
            Event Organizer Registration
          </Link>
        </div>

        <p className="mt-6 text-sm">
          Already have an account?{" "}
          <Link href="/signin" className="underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}