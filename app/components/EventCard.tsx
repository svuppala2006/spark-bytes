// app/components/EventCard.tsx
"use client";

import { useRouter } from 'next/navigation';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ImageWithFallback } from './ImageWithFallback';
import { MapPin, Clock, Utensils } from 'lucide-react';

interface EventCardProps {
  id: number;
  name: string;
  description: string;
  location: string;
  foodItems: string[];
  image: string;
  distance: string;
  diet?: string[];
}

export function EventCard({ 
  id, 
  name, 
  description, 
  location, 
  foodItems, 
  image, 
  distance,
  diet = [] 
}: EventCardProps) {
  const router = useRouter();

  const handleReserve = () => {
    router.push(`/reserve/${id}`);
  };

  return (
    <Card className="overflow-hidden border-gray-300 hover:shadow-lg transition-shadow duration-300">
      {/* Event Image */}
      <div className="relative h-48">
        <ImageWithFallback
          src={image}
          alt={name}
          fill
          className="object-cover"
          fallback="/next.svg"
        />
      </div>

      {/* Event Content */}
      <div className="p-4">
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-black mb-2 line-clamp-2">
            {name}
          </h3>
          <p className="text-black text-sm line-clamp-2">
            {description}
          </p>
        </div>

        {/* Location and Distance */}
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-gray-600" />
          <span className="text-black text-sm flex-1">{location}</span>
          <span className="text-black text-sm font-semibold bg-gray-100 px-2 py-1 rounded">
            {distance}
          </span>
        </div>

        {/* Food Items */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Utensils className="w-4 h-4 text-gray-600" />
            <span className="text-black text-sm font-semibold">Available Food:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {foodItems.slice(0, 3).map((item, index) => (
              <span
                key={index}
                className="bg-red-100 text-red-900 text-xs px-2 py-1 rounded-full font-medium"
              >
                {item}
              </span>
            ))}
            {foodItems.length > 3 && (
              <span className="text-black text-xs px-2 py-1">
                +{foodItems.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Dietary Tags */}
        {diet.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {diet.map((dietType, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-900 text-xs px-2 py-1 rounded-full font-medium"
                >
                  {dietType}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Reserve Button */}
        <Button
          onClick={handleReserve}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold"
        >
          Reserve Food
        </Button>
      </div>
    </Card>
  );
}