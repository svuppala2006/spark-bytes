// app/components/CreateEventForm.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
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
  foodItems: string[];
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
    if (newFoodItem.trim() && !formData.foodItems.includes(newFoodItem.trim())) {
      setFormData(prev => ({
        ...prev,
        foodItems: [...prev.foodItems, newFoodItem.trim()]
      }));
      setNewFoodItem('');
    }
  };

  const handleRemoveFoodItem = (itemToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      foodItems: prev.foodItems.filter(item => item !== itemToRemove)
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

    // TODO: Integrate with actual API endpoint
    try {
      console.log('Submitting event data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to events page or show success message
      alert('Event created successfully!');
      router.push('/search');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Create New Event</h1>
        <p className="text-gray-600 text-lg">
          Share your leftover food with the BU community and help reduce waste
        </p>
      </div>

      <Card className="border-gray-200 shadow-sm">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Basic Information Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Event Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Event Name */}
              <div className="md:col-span-2">
                <Label htmlFor="name" className="mb-2 block font-medium">
                  Event Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., CS Department Social, Business Conference"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <Label htmlFor="description" className="mb-2 block font-medium">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your event and the available food..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                  rows={4}
                />
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="location" className="mb-2 block font-medium">
                  Location *
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="location"
                    type="text"
                    placeholder="e.g., Computer Science Building, Room 101"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Date */}
              <div>
                <Label htmlFor="date" className="mb-2 block font-medium">
                  Event Date *
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Time */}
              <div>
                <Label htmlFor="startTime" className="mb-2 block font-medium">
                  Start Time *
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="endTime" className="mb-2 block font-medium">
                  End Time *
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Food Information Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Food Details</h2>
            
            {/* Food Items */}
            <div className="mb-6">
              <Label className="mb-3 block font-medium">Available Food Items *</Label>
              <div className="flex gap-3 mb-3">
                <Input
                  type="text"
                  placeholder="Add food item (e.g., Pizza, Sandwiches)"
                  value={newFoodItem}
                  onChange={(e) => setNewFoodItem(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFoodItem())}
                  className="flex-1"
                />
                <Button type="button" onClick={handleAddFoodItem} variant="outline">
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
                      className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFoodItem(item)}
                        className="hover:text-red-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Dietary Tags */}
            <div className="mb-6">
              <Label className="mb-3 block font-medium">Dietary Information</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {dietaryOptions.map((diet) => (
                  <div key={diet.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={diet.id}
                      checked={formData.dietaryTags.includes(diet.id)}
                      onCheckedChange={(checked) => 
                        handleDietaryTagChange(diet.id, checked as boolean)
                      }
                    />
                    <Label htmlFor={diet.id} className="cursor-pointer text-sm">
                      {diet.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Portions */}
            <div>
              <Label htmlFor="portions" className="mb-2 block font-medium">
                Estimated Total Portions
              </Label>
              <Select
                value={formData.totalPortions.toString()}
                onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, totalPortions: parseInt(value) }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select portion count" />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 15, 20, 25, 30, 40, 50].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} portions
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Image Upload Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Event Image</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <Label htmlFor="image" className="cursor-pointer">
                <span className="text-red-600 font-semibold hover:text-red-700">
                  Click to upload
                </span>
                <span className="text-gray-600"> or drag and drop</span>
              </Label>
              <p className="text-gray-500 text-sm mt-2">
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
                <p className="text-green-600 text-sm mt-2">
                  Selected: {formData.image.name}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-32"
            >
              {isSubmitting ? 'Creating Event...' : 'Create Event'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}