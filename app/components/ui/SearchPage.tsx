// SearchPage.tsx
"use client";

import { useState, useMemo } from 'react';
import { EventCard } from './EventCard';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Search, SlidersHorizontal, MapPin, Utensils } from 'lucide-react';

// Mock event data
const mockEvents = [
  {
    id: 1,
    name: "CS Department Social",
    description: "Join us for a networking event with professors and students. Leftover pizza, drinks, and snacks available!",
    location: "Computer Science Building, Room 101",
    foodItems: ["Pizza", "Soda", "Chips"],
    image: "https://images.unsplash.com/photo-1606066889831-35faf6fa6ff6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMHBhcnR5fGVufDF8fHx8MTc2MTY2OTMzMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    distance: "0.3 mi",
    diet: ["vegetarian"]
  },
  {
    id: 2,
    name: "Business Conference",
    description: "Annual BU business conference with keynote speakers. Catered lunch leftovers available for pickup.",
    location: "Questrom School of Business",
    foodItems: ["Sandwiches", "Salad", "Fruit", "Cookies"],
    image: "https://images.unsplash.com/photo-1746364062975-7dd2509212fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWZmZXQlMjBjYXRlcmluZ3xlbnwxfHx8fDE3NjE3NzM3MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    distance: "0.5 mi",
    diet: ["vegetarian", "vegan"]
  },
  {
    id: 3,
    name: "Student Networking Mixer",
    description: "Meet fellow students and alumni at this networking event. Appetizers and refreshments provided.",
    location: "George Sherman Union",
    foodItems: ["Appetizers", "Wine", "Cheese"],
    image: "https://images.unsplash.com/photo-1550305080-4e029753abcf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwbmV0d29ya2luZ3xlbnwxfHx8fDE3NjE3NzM3MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    distance: "0.2 mi",
    diet: ["vegetarian"]
  },
];

function Pagination({ currentPage, totalPages, onPageChange }: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
}

export function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    distance: '',
    foodType: '',
    dietary: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
    },
    location: '',
  });

  const eventsPerPage = 12;

  // filter
  const filteredEvents = useMemo(() => {
    return mockEvents.filter(event => {
      const matchesSearch = 
        searchQuery === '' ||
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.foodItems.some(food => food.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesDistance = 
        filters.distance === '' || 
        parseFloat(event.distance) <= parseFloat(filters.distance);

      const matchesFoodType = 
        filters.foodType === '' ||
        event.foodItems.some(food => 
          food.toLowerCase().includes(filters.foodType.toLowerCase())
        );

      const matchesDietary = 
        (!filters.dietary.vegetarian || event.diet.includes('vegetarian')) &&
        (!filters.dietary.vegan || event.diet.includes('vegan')) &&
        (!filters.dietary.glutenFree || event.diet.includes('gluten-free'));


      const matchesLocation = 
        filters.location === '' ||
        event.location.toLowerCase().includes(filters.location.toLowerCase());

      return matchesSearch && matchesDistance && matchesFoodType && matchesDietary && matchesLocation;
    });
  }, [searchQuery, filters]);


  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, startIndex + eventsPerPage);


  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1); 
  };

  const handleDietaryChange = (diet: keyof typeof filters.dietary) => {
    setFilters(prev => ({
      ...prev,
      dietary: {
        ...prev.dietary,
        [diet]: !prev.dietary[diet]
      }
    }));
    setCurrentPage(1);
  };

  return (
    <main className="max-w-[1920px] mx-auto px-8 py-8">
      <div className="mb-8">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for events by name, food, location..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 h-12 text-lg"
            />
          </div>
          <Button
            variant="outline"
            className="h-12 px-6"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-5 h-5 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <Label className="mb-3 block font-semibold">Distance</Label>
              <Select value={filters.distance} onValueChange={(value) => handleFilterChange('distance', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Any distance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any distance</SelectItem>
                  <SelectItem value="0.5">Within 0.5 mi</SelectItem>
                  <SelectItem value="1">Within 1 mi</SelectItem>
                  <SelectItem value="2">Within 2 mi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-3 block font-semibold">Food Type</Label>
              <Select value={filters.foodType} onValueChange={(value) => handleFilterChange('foodType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All food types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All food types</SelectItem>
                  <SelectItem value="pizza">Pizza</SelectItem>
                  <SelectItem value="sandwich">Sandwiches</SelectItem>
                  <SelectItem value="salad">Salad</SelectItem>
                  <SelectItem value="dessert">Desserts</SelectItem>
                  <SelectItem value="beverage">Beverages</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-3 block font-semibold">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search location..."
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label className="mb-3 block font-semibold">Dietary Preferences</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="vegetarian" 
                    checked={filters.dietary.vegetarian}
                    onCheckedChange={() => handleDietaryChange('vegetarian')}
                  />
                  <Label htmlFor="vegetarian" className="cursor-pointer text-sm">
                    Vegetarian
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="vegan" 
                    checked={filters.dietary.vegan}
                    onCheckedChange={() => handleDietaryChange('vegan')}
                  />
                  <Label htmlFor="vegan" className="cursor-pointer text-sm">
                    Vegan
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="glutenFree" 
                    checked={filters.dietary.glutenFree}
                    onCheckedChange={() => handleDietaryChange('glutenFree')}
                  />
                  <Label htmlFor="glutenFree" className="cursor-pointer text-sm">
                    Gluten-Free
                  </Label>
                </div>
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
                  location: '',
                });
              }}
            >
              Clear All Filters
            </Button>
          </div>
        </div>
      )}

      <div className="mb-6">
        <p className="text-gray-600">
          Found {filteredEvents.length} events
          {searchQuery && ` for "${searchQuery}"`}
        </p>
      </div>

      {currentEvents.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {currentEvents.map((event) => (
              <EventCard
                key={event.id}
                name={event.name}
                description={event.description}
                location={event.location}
                foodItems={event.foodItems}
                image={event.image}
                distance={event.distance}
                diet={event.diet}
              />
            ))}
          </div>

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
          <Utensils className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or filters to find more events.
          </p>
        </div>
      )}
    </main>
  );
}