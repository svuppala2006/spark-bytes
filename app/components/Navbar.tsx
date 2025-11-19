"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (mounted) setUserEmail(data?.user?.email ?? null);
    }

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setUserEmail(null);
    router.replace("/portal");
  }
  
  if (!userEmail) return null;
  
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">SB</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">Spark!Bytes</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/home" 
              className={`flex items-center gap-2 transition-colors ${
                isActive("/home") ? "text-red-600" : "text-gray-700 hover:text-red-600"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span className="font-medium">Home</span>
            </Link>

            <Link
              href="/search"
              className={`flex items-center gap-2 transition-colors ${
                isActive("/search") ? "text-red-600" : "text-gray-700 hover:text-red-600"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Search</span>
            </Link>

            <Link
              href="/food"
              className={`flex items-center gap-2 transition-colors ${
                isActive("/food") ? "text-red-600" : "text-gray-700 hover:text-red-600"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
              </svg>
              <span className="font-medium">Food</span>
            </Link>

            <Link
              href="/about"
              className={`flex items-center gap-2 transition-colors ${
                isActive("/about") ? "text-red-600" : "text-gray-700 hover:text-red-600"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">About</span>
            </Link>
          </div>

          {/* User Profile Section */}
          <div className="flex items-center gap-3">
            {userEmail ? (
              <>
                <div className="w-10 h-10 bg-red-600 rounded-full text-white flex items-center justify-center">
                  <span className="font-semibold text-sm">
                    {userEmail.charAt(0).toUpperCase()}
                  </span>
                </div>

                <span className="hidden sm:block text-gray-700 font-medium">
                  {userEmail}
                </span>

                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:underline"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/signin"
                className="text-gray-700 font-medium hover:text-red-600"
              >
                Sign In
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}