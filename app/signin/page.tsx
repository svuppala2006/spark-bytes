"use client";

import Link from "next/link";

export default function LoginChoice() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      {/* Background overlay if needed */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">SparkBytes Portal</h1>
        <p className="text-lg opacity-80">
          Self-service portal for campus users and organizers
        </p>

        <div className="flex gap-6 mt-8">
          <Link
            href="/register?role=user"
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg text-xl font-semibold transition"
          >
            User Login
          </Link>
          
          <Link
            href="/register?role=organizer"
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg text-xl font-semibold transition"
          >
            Organizer Login
          </Link>
        </div>
      </div>
    </main>
  );
}
