"use client";

import { ArrowRight, Search, MapPin, Utensils, Leaf, Users, Calendar, TrendingUp } from 'lucide-react';
import { useRouter } from "next/navigation";
import { Button } from "components/ui/button";
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
