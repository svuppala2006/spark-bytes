"use client";

import { ArrowRight, Search, MapPin, Utensils, Leaf, Users, Calendar, TrendingUp } from 'lucide-react';
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
// import Image from "next/image";
import { useEffect, useState } from "react";
import { getAllEvents, Event, getDashboardStats, DashboardStats } from "@/lib/api";

export default function Page() {
  const router = useRouter();
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [events, dashboardStats] = await Promise.all([
          getAllEvents(),
          getDashboardStats()
        ]);

        // Take first 3 events as featured
        setFeaturedEvents(events.slice(0, 3));
        setStats(dashboardStats);
        setError(null);
      } catch (error) {
        console.error('Failed to load data:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoadingEvents(false);
        setLoadingStats(false);
      }
    }
    fetchData();
  }, []);

  const statsDisplay = stats ? [
    { label: 'Events Tracked', value: `${stats.total_events}+`, icon: Calendar },
    { label: 'Food Items Saved', value: `${stats.total_food_saved.toLocaleString()}+`, icon: Utensils },
    { label: 'Active Users', value: `${stats.active_users}+`, icon: Users },
    { label: 'Pounds Rescued', value: `${stats.total_pounds_rescued.toLocaleString()}+`, icon: TrendingUp },
  ] : [];

  const steps = [
    {
      number: '01',
      title: 'Browse Events',
      description: 'Search for campus events with leftover food.',
      icon: Search,
    },
    {
      number: '02',
      title: 'Find Your Food',
      description: 'View available food items, locations, and pickup times.',
      icon: MapPin,
    },
    {
      number: '03',
      title: 'Place Your Order',
      description: 'Pick up and enjoy delicious food.',
      icon: Utensils,
    },
  ];

  const benefits = [
    { icon: Leaf, title: 'Reduce Food Waste', description: 'Help BU become more sustainable.' },
    { icon: Utensils, title: 'Free Food', description: 'Save money while enjoying great meals.' },
    { icon: Users, title: 'Build Community', description: 'Connect with fellow Terriers.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-8 py-24">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Our Mission!
          </h1>
          <p className="text-gray-600 text-lg mb-8 max-w-xl">
            Spark!Bytes connects Boston University students with leftover food from campus events.
            Save money, reduce waste, and join the community.
          </p>
          <div className="flex gap-4">
            <Button onClick={() => router.push("/search")} size="lg" className="bg-red-600 text-white hover:bg-red-700">
              Browse Events 
            </Button>
            <Button onClick={() => router.push("/about")} size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="max-w-6xl mx-auto px-8 py-16">
        {error ? (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        ) : loadingStats ? (
          //loading state
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Array(4).fill(0).map((_, index) => (
              <Card key={index} className="p-6 shadow bg-white">
                <div className="animate-pulse">
                  <div className="h-6 w-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-7 w-16 bg-gray-300 rounded mb-1"></div>
                  <div className="h-5 w-20 bg-gray-300 rounded"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : stats ? (
          //get stats
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {statsDisplay.map((stat, index) => (
              <Card key={index} className="p-6 shadow bg-white">
                <stat.icon className="h-6 w-6 text-red-600 mb-2" />
                <div className="text-xl font-semibold text-gray-900">{stat.value}</div>
                <div className="text-gray-900">{stat.label}</div>
              </Card>
            ))}
          </div>
        ) : null}
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-5xl mx-auto px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mb-4">
                <step.icon className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
              <p className="text-gray-600 mt-2">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED EVENTS */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Events</h2>

          {loadingEvents ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading events...</p>
            </div>
          ) : featuredEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No events available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredEvents.map(event => (
                <Card
                  key={event.id}
                  className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
                  onClick={() => router.push(`/events/${event.id}`)}
                >
                  <div className="relative h-48 w-full bg-gray-200">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                      <Utensils className="h-16 w-16" />
                    </div>
                    <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                      {event.start_time}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-1">{event.name}</h3>
                    <p className="text-gray-900 flex items-center mb-4"><MapPin className="h-4 w-4 mr-2" /> {event.location}</p>
                    <div className="flex flex-wrap gap-2">
                      {event.food.slice(0, 3).map((item, i) => (
                        <span key={i} className="px-3 py-1 text-sm bg-gray-100 text-gray-900 rounded-full">{item}</span>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}