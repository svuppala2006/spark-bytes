// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//       <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={100}
//           height={20}
//           priority
//         />
//         <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
//           <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
//             To get started, edit the page.tsx file.
//           </h1>
//           <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
//             Looking for a starting point or more instructions? Head over to{" "}
//             <a
//               href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Templates
//             </a>{" "}
//             or the{" "}
//             <a
//               href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Learning
//             </a>{" "}
//             center.
//           </p>
//         </div>
//         <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
//           <a
//             className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={16}
//               height={16}
//             />
//             Deploy Now
//           </a>
//           <a
//             className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Documentation
//           </a>
//         </div>
//       </main>
//     </div>
//   );
// }

"use client";

import { ArrowRight, Search, MapPin, Utensils, Leaf, Users, Calendar, TrendingUp } from 'lucide-react';
import { useRouter } from "next/navigation";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";

export default function Page() {
  const router = useRouter();

  const stats = [
    { label: 'Events Tracked', value: '150+', icon: Calendar },
    { label: 'Food Items Saved', value: '2,400+', icon: Utensils },
    { label: 'Active Users', value: '800+', icon: Users },
    { label: 'Pounds Rescued', value: '1,200+', icon: TrendingUp },
  ];

  const steps = [
    { number: '01', title: 'Browse Events', description: 'Search for campus events with leftover food.', icon: Search },
    { number: '02', title: 'Find Your Food', description: 'View available items and pickup details.', icon: MapPin },
    { number: '03', title: 'Claim & Enjoy', description: 'Grab your food and enjoy.', icon: Utensils },
  ];

  const benefits = [
    { icon: Leaf, title: 'Reduce Food Waste', description: 'Make BU more sustainable.' },
    { icon: Utensils, title: 'Free Food', description: 'Save money and eat well.' },
    { icon: Users, title: 'Build Community', description: 'Connect with other students.' },
  ];

  const featuredEvents = [
    {
      id: 1,
      name: 'CS Department Symposium',
      location: 'Photonics Center',
      foodItems: ['Pizza', 'Salad', 'Cookies'],
      image: 'https://images.unsplash.com/photo-1579178404017-47844de5ca6a',
      time: 'Today, 4:00 PM',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="px-8 py-24">
        <h1 className="text-4xl font-bold mb-4">Never Let Campus Food Go to Waste</h1>
        <p className="text-lg text-gray-600 mb-8">
          TerrierBytes connects Boston University students with leftover food.
        </p>
        <Button size="lg" onClick={() => router.push("/search")}>
          Browse Events <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </section>

      {/* Stats */}
      <section className="px-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <Card key={i} className="p-6 shadow">
            <s.icon className="h-6 w-6 text-red-600 mb-2" />
            <div className="text-xl font-bold">{s.value}</div>
            <div className="text-sm text-gray-600">{s.label}</div>
          </Card>
        ))}
      </section>
    </div>
  );
}
