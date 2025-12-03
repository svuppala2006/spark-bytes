//This version was edited to test components

"use client";

import { useState, useMemo, useEffect } from 'react';
import { CardGrid } from '../components/CardGrid';
import { Button } from '../components/ui/button';
import { Search, SlidersHorizontal, MapPin, Utensils } from 'lucide-react';
import { getAllEvents, Event } from '@/lib/api';
import { EventCard } from '../components/EventCard';
// add same data structure with CardGrid
const mockEvents = [
  {
    id: 1,
    name: "CS Department Social",
    description: "Join us for a networking event with professors and students. Leftover pizza, drinks, and snacks available!",
    location: "Computer Science Building, Room 101",
    food: ["Pizza", "Soda", "Chips"],
    foodType: "Pizza, Soda, Chips",
    image: "https://images.unsplash.com/photo-1606066889831-35fad6fa6ff6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMHBhcnR5fGVufDF8fHx8MTc2MTY2OTMzMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    date: "2024-11-15",
    distance: "0.3",
    diet: ["vegetarian"]
  },
  {
    id: 2,
    name: "Business Conference",
    description: "Annual BU business conference with keynote speakers. Catered lunch leftovers available for pickup.",
    location: "Questrom School of Business",
    food: ["Sandwiches", "Salad", "Fruit", "Cookies"],
    foodType: "Sandwiches, Salad, Fruit, Cookies",
    image: "https://images.unsplash.com/photo-1746364062975-7dd2509212fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWZmZXQlMjBjYXRlcmluZ3xlbnwxfHx8fDE3NjE3NzM3MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    date: "2024-11-16",
    distance: "0.5",
    diet: ["vegetarian", "vegan"]
  },
  {
    id: 3,
    name: "Student Networking Mixer",
    description: "Meet fellow students and alumni at this networking event. Appetizers and refreshments provided.",
    location: "George Sherman Union",
    food: ["Appetizers", "Wine", "Cheese"],
    foodType: "Appetizers, Wine, Cheese",
    image: "https://images.unsplash.com/photo-1550305080-4e029753abcf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwbmV0d29ya2luZ3xlbnwxfHx8fDE3NjE3NzM3MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    date: "2024-11-17",
    distance: "0.2",
    diet: ["vegetarian"]
  },

  // add more events to show pages
  ...Array.from({ length: 20 }).map((_, i) => ({
    id: i + 4,
    name: `Campus Event ${i + 1}`,
    description: `This is a sample campus event description for testing purposes.`,
    location: `BU ${['West Campus', 'East Campus', 'Central Campus', 'South Campus'][i % 4]}`,
    food: [["Pizza", "Burgers"][i % 2], "Salad", "Drinks"],
    foodType: [["Pizza", "Burgers"][i % 2], "Salad", "Drinks"].join(", "),
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=250&fit=crop",
    date: `2024-11-${18 + (i % 10)}`,
    distance: (0.1 + (i * 0.1)).toFixed(1),
    diet: i % 3 === 0 ? ["vegetarian"] : i % 3 === 1 ? ["vegan"] : []
  }))
];

function Pagination({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }) {
  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        Previous
      </Button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Button key={page} variant={currentPage === page ? "default" : "outline"} size="sm" onClick={() => onPageChange(page)}>
          {page}
        </Button>
      ))}
      <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        Next
      </Button>
    </div>
  );
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    distance: '',
    foodType: '',
    dietary: { vegetarian: false, vegan: false, glutenFree: false },
    location: '',
  });

  useEffect(() => {
    async function fetchEvents() {
      try {
        const events = await getAllEvents();
        setAllEvents(events);
      } catch (error) {
        console.error('Failed to load events:', error);
        // Fallback to mock data if API fails
        setAllEvents([]);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const eventsPerPage = 12;

  const filteredEvents = useMemo(() => {
    return allEvents.filter(event => {
      const matchesSearch =
        searchQuery === '' ||
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.food.some((food: string) => food.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Distance filtering removed (not in API data)
      const matchesDistance = true;
      
      const matchesFoodType =
        filters.foodType === '' ||
        event.food.some((food: string) => food.toLowerCase().includes(filters.foodType.toLowerCase()));
      
      // Dietary filtering removed (not in Event model, would need Food items)
      const matchesDietary = true;
      
      const matchesLocation =
        filters.location === '' ||
        event.location.toLowerCase().includes(filters.location.toLowerCase());
      
      return matchesSearch && matchesDistance && matchesFoodType && matchesDietary && matchesLocation;
    });
  }, [searchQuery, filters, allEvents]);

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, startIndex + eventsPerPage);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleDietaryChange = (diet: keyof typeof filters.dietary) => {
    setFilters(prev => ({ ...prev, dietary: { ...prev.dietary, [diet]: !prev.dietary[diet] } }));
    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-[1920px] mx-auto px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">Available Food Events</h1>
          
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for events by name, food, location..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="placeholder-gray-300 pl-10 h-12 text-lg border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Button variant="outline" className="h-12 px-6" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="w-5 h-5 mr-2" /> Filters
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="mb-3 block font-semibold text-gray-900">Distance</label>
                <select
                  value={filters.distance}
                  onChange={(e) => handleFilterChange('distance', e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any distance</option>
                  <option value="0.5">Within 0.5 mi</option>
                  <option value="1">Within 1 mi</option>
                  <option value="2">Within 2 mi</option>
                </select>
              </div>

              <div>
                <label className="mb-3 block font-semibold text-gray-900">Food Type</label>
                <select
                  value={filters.foodType}
                  onChange={(e) => handleFilterChange('foodType', e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All food types</option>
                  <option value="pizza">Pizza</option>
                  <option value="sandwich">Sandwiches</option>
                  <option value="salad">Salad</option>
                  <option value="dessert">Desserts</option>
                  <option value="beverage">Beverages</option>
                </select>
              </div>

              <div>
                <label className="mb-3 block font-semibold text-gray-900">Location</label>
                <select
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All locations</option>
                  <option value="West">West</option>
                  <option value="East">East</option>
                  <option value="Central">Central</option>
                  <option value="South">South</option>
                  <option value="Fenway">Fenway</option>
                  <option value="Off-Campus">Off-Campus</option>
                </select>
              </div>

              <div>
                <label className="mb-3 block font-semibold text-gray-900">Dietary Preferences</label>
                <div className="space-y-2">
                  {['vegetarian', 'vegan', 'glutenFree'].map(diet => (
                    <div key={diet} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={diet}
                        checked={filters.dietary[diet as keyof typeof filters.dietary]}
                        onChange={() => handleDietaryChange(diet as keyof typeof filters.dietary)}
                        className="rounded text-blue-500 focus:ring-blue-500"
                      />
                      <label htmlFor={diet} className="cursor-pointer text-sm capitalize text-gray-900">
                        {diet.replace(/([A-Z])/g, ' $1')}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({ 
                    distance: '', 
                    foodType: '', 
                    dietary: { vegetarian: false, vegan: false, glutenFree: false }, 
                    location: '' 
                  });
                }}
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        )}

        {/* result */}
        <div className="mb-6">
          <p className="text-gray-900 font-medium text-lg">
            {loading ? 'Loading events...' : `Found ${filteredEvents.length} event${filteredEvents.length !== 1 ? 's' : ''}`}
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-900 text-lg">Loading events...</p>
          </div>
        ) : currentEvents.length > 0 ? (
          <>
            {/* CardGrid components */}
            <CardGrid allEvents={currentEvents} />
            
            {/* pages */}
            {totalPages > 1 && (
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={setCurrentPage} 
              />
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Utensils className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-700 text-lg">
              Try adjusting your search criteria or filters to find more events.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}