//This is test search page for the card components 
//This file should be renewed by Shuwan later
"use client";
import { CardGrid } from "../components/CardGrid";

export default function SearchPage() {
  const mockEvents = Array.from({ length: 30 }).map((_, i) => ({
    id: i + 1,
    name: `Event ${i + 1}`,
    location: "Boston University",
    foodType: ["Pizza", "Bagels", "Pasta"][i % 3],
    date: "Nov " + (10 + (i % 10)),
    image: "/placeholder.jpg",
  }));

  return (
    <main className="min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-center mt-6 mb-4">
        Available Food Events
      </h1>
      <CardGrid allEvents={mockEvents} />
    </main>
  );
}
