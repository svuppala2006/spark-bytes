// AboutPage.tsx
"use client";

import { Recycle, Search as SearchIcon, UtensilsCrossed, TrendingDown } from 'lucide-react';
import { Card } from './ui/card';
import { ImageWithFallback } from './ImageWithFallback';

export function AboutPage() {
  const teamMembers = [
    {
      name: "Alex Chen",
      role: "Co-Founder & Developer",
      major: "Computer Science '25",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NjE3NzM2MzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      name: "Sarah Martinez",
      role: "Co-Founder & Designer",
      major: "Business Administration '25",
      image: "https://images.unsplash.com/photo-1655977237812-ee6beb137203?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwc3R1ZGVudCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MTczMDk1N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      name: "Jordan Kim",
      role: "Marketing Lead",
      major: "Communications '26",
      image: "https://images.unsplash.com/photo-1706102005254-8f0611b5b22b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwbWVldGluZyUyMHVuaXZlcnNpdHl8ZW58MXx8fHwxNzYxNzg2MzcwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      name: "Thomas Wilson",
      role: "Frontend Developer",
      major: "Computer Engineering '26",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxODc5MjAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      name: "Emily Rodriguez",
      role: "UX Designer",
      major: "Graphic Design '25",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MTg3OTIwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      name: "Michael Brown",
      role: "Backend Developer",
      major: "Software Engineering '26",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjE4NzkyMDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
  ];

  const stats = [
    { number: "500+", label: "Meals Saved" },
    { number: "50+", label: "Events Hosted" },
    { number: "300+", label: "Students Served" },
    { number: "75%", label: "Waste Reduction" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-6">
            About TerrierBytes
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Reducing food waste at Boston University by connecting students with leftover food from campus events.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center p-6 border-gray-200 shadow-sm">
              <div className="text-2xl md:text-3xl font-bold text-red-600 mb-2">
                {stat.number}
              </div>
              <div className="text-sm md:text-base text-gray-600 font-medium">
                {stat.label}
              </div>
            </Card>
          ))}
        </div>

        {/* Our Mission Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <Card className="border-gray-200 shadow-sm">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-red-600 p-3 rounded-lg">
                  <Recycle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p className="text-lg leading-relaxed">
                  TerrierBytes is committed to reducing food waste on Boston University's campus by connecting students with leftover food from campus events. We believe that every meal saved is a step towards a more sustainable future.
                </p>
                <p className="text-lg leading-relaxed">
                  Our platform makes it easy for students to find and claim nutritious food that would otherwise go to waste, while helping event organizers ensure their catering doesn't end up in the trash. Together, we're building a more sustainable BU community.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* How It Works Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="bg-red-100 p-4 rounded-lg w-fit mb-4">
                  <SearchIcon className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Find Events</h3>
                <p className="text-gray-700 leading-relaxed">
                  Browse through campus events with available leftover food. Use our search and filter tools to find food near you that matches your dietary preferences.
                </p>
              </div>
            </Card>

            <Card className="border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="bg-red-100 p-4 rounded-lg w-fit mb-4">
                  <UtensilsCrossed className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Pick Up Food</h3>
                <p className="text-gray-700 leading-relaxed">
                  Reserve your portion and head to the event location to pick up your food. Each listing includes the exact location, available items, and pickup instructions.
                </p>
              </div>
            </Card>

            <Card className="border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="bg-red-100 p-4 rounded-lg w-fit mb-4">
                  <TrendingDown className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Reduce Waste</h3>
                <p className="text-gray-700 leading-relaxed">
                  By claiming leftover food, you're helping reduce waste on campus and contributing to a more sustainable BU community. Every meal counts!
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Impact Section */}
        <div className="mb-20">
          <Card className="border-gray-200 bg-red-50">
            <div className="p-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Impact</h2>
              <div className="max-w-2xl mx-auto">
                <p className="text-lg text-gray-700 mb-6">
                  Since our launch, TerrierBytes has helped save over 500 meals from being wasted, 
                  serving more than 300 students across 50+ campus events.
                </p>
                <p className="text-lg text-gray-700">
                  We've helped reduce food waste by approximately 75% at participating events, 
                  making BU a more sustainable campus one meal at a time.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Meet the Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Meet the Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="border-gray-200 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  <div className="mb-4">
                    <ImageWithFallback
                      src={member.image}
                      alt={member.name}
                      width={128}
                      height={128}
                      className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-red-100"
                      fallback="/next.svg"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-red-600 font-medium mb-2">
                    {member.role}
                  </p>
                  <p className="text-gray-600">
                    {member.major}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="text-center mb-16">
          <Card className="border-red-200 bg-red-600 text-white">
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-4">Join Our Mission</h2>
              <p className="text-red-100 mb-6 text-lg">
                Help us reduce food waste and build a more sustainable campus community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors">
                  Get Started
                </button>
                <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors">
                  Contact Us
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-gray-200">
          <p className="text-gray-600">
            © 2025 TerrierBytes | Boston University
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Making campus sustainability deliciously easy.
          </p>
        </footer>
      </div>
    </div>
  );
}