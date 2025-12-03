// app/components/CreateEventForm.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Calendar, Clock, MapPin, Utensils, Upload, X } from 'lucide-react';

interface EventFormData {
  name: string;
  description: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  foodItems: Array<{
    name: string;
    stockLevel?: string;
    quantity?: number;
  }>;
  dietaryTags: string[];
  totalPortions: number;
  image: File | null;
}

export function CreateEventForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newFoodItem, setNewFoodItem] = useState('');
  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    description: '',
    location: '',
    date: '',
    startTime: '',
    endTime: '',
    foodItems: [],
    dietaryTags: [],
    totalPortions: 10,
    image: null,
  });

  const dietaryOptions = [
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'gluten-free', label: 'Gluten-Free' },
    { id: 'dairy-free', label: 'Dairy-Free' },
    { id: 'nut-free', label: 'Nut-Free' },
  ];

  const handleAddFoodItem = () => {
    if (newFoodItem.trim()) {
      const foodItemExists = formData.foodItems.some(item => item.name === newFoodItem.trim());
      if (!foodItemExists) {
        setFormData(prev => ({
          ...prev,
          foodItems: [...prev.foodItems, { name: newFoodItem.trim(), stockLevel: 'medium' }]
        }));
        setNewFoodItem('');
      }
    }
  };

  const handleRemoveFoodItem = (itemName: string) => {
    setFormData(prev => ({
      ...prev,
      foodItems: prev.foodItems.filter(item => item.name !== itemName)
    }));
  };

  const handleDietaryTagChange = (dietId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      dietaryTags: checked 
        ? [...prev.dietaryTags, dietId]
        : prev.dietaryTags.filter(tag => tag !== dietId)
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

      // Build FormData for multipart submission
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('organization', formData.name);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('start_time', formData.startTime);
      formDataToSend.append('end_time', formData.endTime);
      
      // Append food item names only (names will be used to create food records)
      formDataToSend.append('food', JSON.stringify(formData.foodItems.map(item => item.name)));
      
      // Append image file if selected
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      
      // Post event to backend
      const eventResponse = await fetch(`${API_BASE_URL}/event/`, {
        method: 'POST',
        body: formDataToSend,
      });
      
      if (!eventResponse.ok) {
        const errorData = await eventResponse.json();
        throw new Error(errorData.detail || 'Failed to create event');
      }
      
      const eventResult = await eventResponse.json();
      console.log('Event created successfully:', eventResult);
      
      // Extract event_id from response
      let eventId = null;
      if (eventResult.data && Array.isArray(eventResult.data) && eventResult.data.length > 0) {
        eventId = eventResult.data[0].id;
      }
      
      // If we have food items and an event_id, post the food items
      if (eventId && formData.foodItems.length > 0) {
        const foodItemsToPost = formData.foodItems.map(item => ({
          name: item.name,
          event_id: eventId,
          stockLevel: item.stockLevel || 'medium',
          quantity: item.quantity || null,
          dietaryTags: formData.dietaryTags,
        }));
        
        const foodResponse = await fetch(`${API_BASE_URL}/food/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(foodItemsToPost),
        });
        
        if (!foodResponse.ok) {
          const errorData = await foodResponse.json();
          console.error('Failed to create food items:', errorData);
          // Don't fail the whole operation if food items fail
        } else {
          console.log('Food items created successfully');
        }
      }
      
      alert('Event created successfully!');
      router.push('/search');
    } catch (error) {
      console.error('Error creating event:', error);
      alert(`Failed to create event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-black mb-4 font-sans antialiased">
          Create New Event
        </h1>
        <p className="text-black text-lg font-semibold font-sans antialiased">
          Share your leftover food with the BU community and help reduce waste
        </p>
      </div>

      <Card className="border-gray-300 shadow-sm bg-white">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Basic Information Section */}
          <div>
            <h2 className="text-xl font-bold text-black mb-6 font-sans antialiased">
              Event Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Event Name */}
              <div className="md:col-span-2">
                <Label htmlFor="name" className="mb-2 block font-bold text-black font-sans antialiased">
                  Event Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., CS Department Social, Business Conference"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full font-sans antialiased text-black text-base border-gray-400"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <Label htmlFor="description" className="mb-2 block font-bold text-black font-sans antialiased">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your event and the available food..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                  rows={4}
                  className="font-sans antialiased text-black text-base border-gray-400"
                />
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="location" className="mb-2 block font-bold text-black font-sans antialiased">
                  Campus Area *
                </Label>
                <select
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  required
                  className="w-full border border-gray-400 rounded-md px-3 py-2 font-sans antialiased text-black text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select campus area</option>
                  <option value="West">West</option>
                  <option value="East">East</option>
                  <option value="Central">Central</option>
                  <option value="South">South</option>
                  <option value="Fenway">Fenway</option>
                  <option value="Off-Campus">Off-Campus</option>
                </select>
              </div>

              {/* Date */}
              <div>
                <Label htmlFor="date" className="mb-2 block font-bold text-black font-sans antialiased">
                  Event Date *
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-4 h-4" />
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                    className="pl-10 font-sans antialiased text-black text-base border-gray-400"
                  />
                </div>
              </div>

              {/* Time */}
              <div>
                <Label htmlFor="startTime" className="mb-2 block font-bold text-black font-sans antialiased">
                  Start Time *
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-4 h-4" />
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                    required
                    className="pl-10 font-sans antialiased text-black text-base border-gray-400"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="endTime" className="mb-2 block font-bold text-black font-sans antialiased">
                  End Time *
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-4 h-4" />
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                    required
                    className="pl-10 font-sans antialiased text-black text-base border-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Food Information Section */}
          <div>
            <h2 className="text-xl font-bold text-black mb-6 font-sans antialiased">
              Food Details
            </h2>
            
            {/* Food Items */}
            <div className="mb-6">
              <Label className="mb-3 block font-bold text-black font-sans antialiased">
                Available Food Items *
              </Label>
              <div className="flex gap-3 mb-3">
                <Input
                  type="text"
                  placeholder="Add food item (e.g., Pizza, Sandwiches)"
                  value={newFoodItem}
                  onChange={(e) => setNewFoodItem(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFoodItem())}
                  className="flex-1 font-sans antialiased text-black text-base border-gray-400"
                />
                <Button type="button" onClick={handleAddFoodItem} variant="outline" className="font-sans antialiased border-gray-400 text-black hover:bg-gray-100 font-semibold">
                  <Utensils className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
              
              {/* Food Items List */}
              {formData.foodItems.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.foodItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-red-100 text-red-900 px-3 py-1 rounded-full text-sm font-sans antialiased font-semibold"
                    >
                      <span>{item.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFoodItem(item.name)}
                        className="hover:text-red-800 font-sans antialiased"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Dietary Tags - 修复复选框部分 */}
            <div className="mb-6">
              <Label className="mb-3 block font-bold text-black font-sans antialiased">
                Dietary Information
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {dietaryOptions.map((diet) => (
                  <div key={diet.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={diet.id}
                      checked={formData.dietaryTags.includes(diet.id)}
                      onChange={(checked) => {
                        console.log('Checkbox changed:', diet.id, checked);
                        handleDietaryTagChange(diet.id, checked.target.checked as boolean);
                      }}
                      className="h-4 w-4 rounded border-gray-400 text-red-600 focus:ring-red-600"
                    />
                    <Label 
                      htmlFor={diet.id} 
                      className="cursor-pointer text-black font-semibold font-sans antialiased select-none"
                      onClick={() => {
                        const newChecked = !formData.dietaryTags.includes(diet.id);
                        handleDietaryTagChange(diet.id, newChecked);
                      }}
                    >
                      {diet.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Portions */}
            <div>
              <Label htmlFor="portions" className="mb-2 block font-bold text-black font-sans antialiased">
                Estimated Total Portions
              </Label>
              <select
                id="portions"
                value={formData.totalPortions.toString()}
                onChange={(e) => setFormData(prev => ({ ...prev, totalPortions: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-400 rounded-md font-sans antialiased text-black text-base bg-white hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select portion count</option>
                {[5, 10, 15, 20, 25, 30, 40, 50].map((num) => (
                  <option key={num} value={num.toString()}>
                    {num} portions
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image Upload Section */}
          <div>
            <h2 className="text-xl font-bold text-black mb-6 font-sans antialiased">
              Event Image
            </h2>
            <div className="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center bg-gray-50">
              <Upload className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <Label htmlFor="image" className="cursor-pointer font-sans antialiased">
                <span className="text-red-600 font-bold hover:text-red-700">
                  Click to upload
                </span>
                <span className="text-black font-semibold"> or drag and drop</span>
              </Label>
              <p className="text-black text-sm mt-2 font-sans antialiased font-semibold">
                PNG, JPG, GIF up to 10MB
              </p>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {formData.image && (
                <p className="text-green-800 text-sm mt-2 font-sans antialiased font-semibold">
                  Selected: {formData.image.name}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-300">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="font-sans antialiased border-gray-400 text-black hover:bg-gray-100 font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-32 font-sans antialiased bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              {isSubmitting ? 'Creating Event...' : 'Create Event'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}