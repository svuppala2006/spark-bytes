// app/components/ReserveFoodForm.tsx
"use client";

import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { MapPin, Utensils } from 'lucide-react';

interface ReserveFoodFormProps {
  event: {
    id: number;
    name: string;
    location: string;
    foodItems: string[];
    availablePortions: number;
  };
}

export function ReserveFoodForm({ event }: ReserveFoodFormProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [portions, setPortions] = useState(1);

  const handleItemToggle = (item: string) => {
    setSelectedItems(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const handleReserve = async () => {
    // TODO: 集成后端API
    console.log('Reserving food:', { 
      eventId: event.id, 
      selectedItems, 
      portions 
    });
    alert(`Successfully reserved ${portions} portion(s) of ${selectedItems.join(', ')}!`);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-6 border-gray-300">
        <h2 className="text-2xl font-bold text-black mb-6 text-center">
          Reserve Food
        </h2>
        
        <div className="space-y-6">
          {/* Event Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-bold text-black mb-2">{event.name}</h3>
            <div className="flex items-center gap-2 text-black">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
          </div>

          {/* Food Selection */}
          <div>
            <Label className="font-bold text-black mb-3 block text-lg">
              Select Food Items
            </Label>
            <div className="space-y-3">
              {event.foodItems.map((item) => (
                <div key={item} className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    id={`food-${item}`}
                    checked={selectedItems.includes(item)}
                    onChange={() => handleItemToggle(item)}
                    className="h-5 w-5 text-red-600 focus:ring-red-500 rounded"
                  />
                  <Label 
                    htmlFor={`food-${item}`} 
                    className="text-black font-semibold cursor-pointer flex-1"
                  >
                    {item}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Portions Selection */}
          <div>
            <Label htmlFor="portions" className="font-bold text-black mb-2 block text-lg">
              Number of Portions
            </Label>
            <div className="flex items-center gap-4">
              <Input
                id="portions"
                type="number"
                min="1"
                max={event.availablePortions}
                value={portions}
                onChange={(e) => setPortions(Number(e.target.value))}
                className="text-black border-gray-400 w-24 text-center"
              />
              <span className="text-black font-semibold">
                Maximum {event.availablePortions} portions available
              </span>
            </div>
          </div>

          {/* Reserve Button */}
          <Button
            onClick={handleReserve}
            disabled={selectedItems.length === 0 || portions < 1}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 text-lg"
          >
            Confirm Reservation
          </Button>
        </div>
      </Card>
    </div>
  );
}