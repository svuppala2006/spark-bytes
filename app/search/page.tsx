//This version was edited to test components

"use client";

import { useState, useMemo, useEffect } from 'react';
import { CardGrid } from '../components/CardGrid';
import { Button } from '../components/ui/button';
import { Search, SlidersHorizontal, MapPin, Utensils } from 'lucide-react';
import { getAllEvents, Event } from '@/lib/api';
import { EventCard } from '../components/EventCard';
// add same data structure with CardGrid

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
    dietary: { 
      vegetarian: false, 
      vegan: false, 
      'gluten-free': false,
      'dairy-free': false,
      'nut-free': false
    },
    campusLocation: '',
  });

  useEffect(() => {
    async function fetchEvents() {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        
        // Check if dietary tags are selected
        const selectedDietaryTags = Object.entries(filters.dietary)
          .filter(([_, selected]) => selected)
          .map(([tag, _]) => tag);
        
        let events: Event[] = [];
        let url = '';
        
        if (selectedDietaryTags.length > 0) {
          // Fetch events filtered by dietary tags from backend
          const dietaryTagsParam = selectedDietaryTags.join(',');
          url = `${API_BASE_URL}/search/dietary?tags=${encodeURIComponent(dietaryTagsParam)}`;
          console.log('Fetching with dietary tags:', dietaryTagsParam, 'URL:', url);
          const response = await fetch(url);
          if (response.ok) {
            const result = await response.json();
            console.log('Dietary filter result:', result);
            events = result.data || [];
          } else {
            console.error('Dietary filter response not ok:', response.status, response.statusText);
            events = [];
          }
        } else {
          // Fetch all events
          url = `${API_BASE_URL}/`;
          console.log('Fetching all events from:', url);
          const response = await fetch(url);
          if (response.ok) {
            const result = await response.json();
            console.log('All events result:', result);
            events = result.data || [];
          } else {
            console.error('All events response not ok:', response.status);
            events = [];
          }
        }
        
        console.log('Events fetched:', events.length, events);
        
        // Map the response to ensure campus_location is included
        const mappedEvents = events.map((e: any) => ({
          id: e.id,
          name: e.name,
          description: e.description,
          organization: e.organization,
          location: e.location,
          campus_location: e.campus_location,
          food: e.food || [],
          date: e.date,
          start_time: e.start_time,
          end_time: e.end_time,
          image_url: e.image_url || e.image || undefined,
        }));
        
        console.log('Mapped events:', mappedEvents.length);
        setAllEvents(mappedEvents);
      } catch (error) {
        console.error('Failed to load events:', error);
        setAllEvents([]);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, [filters.dietary]);

  const eventsPerPage = 12;

  const filteredEvents = useMemo(() => {
    // Get selected dietary tags
    const selectedDietaryTags = Object.entries(filters.dietary)
      .filter(([_, selected]) => selected)
      .map(([tag, _]) => tag);
    
    return allEvents.filter(event => {
      const matchesSearch =
        searchQuery === '' ||
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.food.some((food: string) => food.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCampusLocation =
        filters.campusLocation === '' ||
        event.campus_location === filters.campusLocation;
      
      // If no dietary tags selected, all events match
      // If dietary tags are selected, we rely on backend filtering
      // The filtering by dietary tags happens via the API call below
      const matchesDietary = true;
      
      return matchesSearch && matchesCampusLocation && matchesDietary;
    });
  }, [searchQuery, filters.campusLocation, allEvents]);

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, startIndex + eventsPerPage);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleDietaryChange = (diet: string) => {
    setFilters(prev => ({ 
      ...prev, 
      dietary: { 
        ...prev.dietary, 
        [diet]: !prev.dietary[diet as keyof typeof prev.dietary] 
      } 
    }));
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="mb-3 block font-semibold text-gray-900">Campus Location</label>
                <select
                  value={filters.campusLocation}
                  onChange={(e) => handleFilterChange('campusLocation', e.target.value)}
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
                  {Object.keys(filters.dietary).map(diet => (
                    <div key={diet} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={diet}
                        checked={filters.dietary[diet as keyof typeof filters.dietary]}
                        onChange={() => handleDietaryChange(diet)}
                        className="rounded text-blue-500 focus:ring-blue-500"
                      />
                      <label htmlFor={diet} className="cursor-pointer text-sm capitalize text-gray-900">
                        {diet.replace(/-/g, ' ')}
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
                    dietary: { 
                      vegetarian: false, 
                      vegan: false, 
                      'gluten-free': false,
                      'dairy-free': false,
                      'nut-free': false
                    }, 
                    campusLocation: '' 
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