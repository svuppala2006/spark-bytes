"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { MapPin, Clock, ArrowLeft, Leaf, CheckCircle2, AlertCircle, Ban, Utensils } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { FoodItem, DietaryTag, StockLevel } from "@/app/types";
import { useState, useEffect } from "react";
import { getAllEvents, Event } from "@/lib/api";

// Mock data for food items - this would come from a separate Food API endpoint
const mockEvents = {
  "1": {
    id: 1,
    name: "CS Department Symposium",
    location: "Photonics Center, 8th Floor",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
    time: "Today, 4:00 PM",
    description: "Annual computer science symposium featuring student research presentations",
    foodItems: [
      { id: "1", name: "Pepperoni Pizza", quantity: 8, dietaryTags: [] as DietaryTag[], description: "Large slices", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e" },
      { id: "2", name: "Vegetarian Pizza", quantity: 6, dietaryTags: ["vegetarian"] as DietaryTag[], description: "With assorted veggies", image: "https://images.unsplash.com/photo-1511689660979-10d2b1aada49" },
      { id: "3", name: "Caesar Salad", quantity: 12, dietaryTags: ["vegetarian"] as DietaryTag[], description: "Fresh romaine lettuce", image: "https://images.unsplash.com/photo-1546793665-c74683f339c1" },
      { id: "4", name: "Vegan Cookies", quantity: 15, dietaryTags: ["vegan", "dairy-free"] as DietaryTag[], description: "Chocolate chip", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35" },
      { id: "5", name: "Pasta with Marinara", stockLevel: "high" as StockLevel, dietaryTags: ["vegetarian", "vegan"] as DietaryTag[], description: "Buffet-style serving", image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9" },
      { id: "6", name: "Mixed Green Salad", stockLevel: "medium" as StockLevel, dietaryTags: ["vegan", "gluten-free"] as DietaryTag[], description: "Large bowl available", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd" },
    ],
  },
  "2": {
    id: 2,
    name: "Graduate Student Mixer",
    location: "GSU, 2nd Floor Lounge",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
    time: "Tomorrow, 1:00 PM",
    description: "Social gathering for graduate students across all departments",
    foodItems: [
      { id: "7", name: "Turkey Sandwiches", quantity: 10, dietaryTags: ["no-pork"] as DietaryTag[], description: "On wheat bread", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af" },
      { id: "8", name: "Halal Chicken Wraps", quantity: 8, dietaryTags: ["halal"] as DietaryTag[], description: "With vegetables", image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f" },
      { id: "9", name: "Fresh Fruit Platter", quantity: 5, dietaryTags: ["vegan", "gluten-free", "nut-free"] as DietaryTag[], description: "Assorted seasonal fruits", image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b" },
      { id: "10", name: "Potato Chips", quantity: 20, dietaryTags: ["vegan", "gluten-free"] as DietaryTag[], description: "Various flavors", image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b" },
      { id: "11", name: "Rice Bowl", stockLevel: "high" as StockLevel, dietaryTags: ["vegan", "gluten-free", "halal"] as DietaryTag[], description: "Basmati rice, buffet-style", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19" },
      { id: "12", name: "Grilled Chicken", stockLevel: "low" as StockLevel, dietaryTags: ["halal", "gluten-free"] as DietaryTag[], description: "Almost gone!", image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435" },
    ],
  },
  "3": {
    id: 3,
    name: "Engineering Seminar",
    location: "ENG Building, Room 245",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
    time: "Tomorrow, 10:00 AM",
    description: "Weekly engineering department seminar on sustainable design",
    foodItems: [
      { id: "13", name: "Plain Bagels", quantity: 12, dietaryTags: ["vegetarian"] as DietaryTag[], description: "With cream cheese", image: "https://images.unsplash.com/photo-1621504450181-5d356f61d307" },
      { id: "14", name: "Coffee", stockLevel: "high" as StockLevel, dietaryTags: ["vegan", "gluten-free"] as DietaryTag[], description: "Regular and decaf, self-serve", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93" },
      { id: "15", name: "Gluten-Free Muffins", quantity: 8, dietaryTags: ["gluten-free", "nut-free"] as DietaryTag[], description: "Blueberry and banana", image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa" },
      { id: "16", name: "Danish Pastries", quantity: 10, dietaryTags: ["vegetarian"] as DietaryTag[], description: "Assorted flavors", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff" },
      { id: "17", name: "Fresh Orange Juice", stockLevel: "medium" as StockLevel, dietaryTags: ["vegan", "gluten-free"] as DietaryTag[], description: "Pitcher available", image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba" },
    ],
  },
};

// Dietary tag icon and color mapping
const dietaryTagInfo: Record<DietaryTag, { icon: React.ReactNode; label: string; color: string }> = {
  vegetarian: { icon: <Leaf className="h-4 w-4" />, label: "Vegetarian", color: "bg-green-100 text-green-700" },
  vegan: { icon: <Leaf className="h-4 w-4" />, label: "Vegan", color: "bg-green-100 text-green-700" },
  halal: { icon: <CheckCircle2 className="h-4 w-4" />, label: "Halal", color: "bg-blue-100 text-blue-700" },
  kosher: { icon: <CheckCircle2 className="h-4 w-4" />, label: "Kosher", color: "bg-blue-100 text-blue-700" },
  "gluten-free": { icon: <AlertCircle className="h-4 w-4" />, label: "Gluten-Free", color: "bg-amber-100 text-amber-700" },
  "dairy-free": { icon: <AlertCircle className="h-4 w-4" />, label: "Dairy-Free", color: "bg-amber-100 text-amber-700" },
  "nut-free": { icon: <Ban className="h-4 w-4" />, label: "Nut-Free", color: "bg-red-100 text-red-700" },
  "peanut-free": { icon: <Ban className="h-4 w-4" />, label: "Peanut-Free", color: "bg-red-100 text-red-700" },
  "no-pork": { icon: <Ban className="h-4 w-4" />, label: "No Pork", color: "bg-purple-100 text-purple-700" },
};

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  
  // Use mock events for food items (until Food API endpoint is created)
  const mockEvent = mockEvents[eventId as keyof typeof mockEvents];
  
  // Fetch actual event data from API
  const [apiEvent, setApiEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [reservedItems, setReservedItems] = useState<Set<string>>(new Set());
  const [foodQuantities, setFoodQuantities] = useState<Record<string, number>>(() => {
    if (!mockEvent) return {};
    const quantities: Record<string, number> = {};
    mockEvent.foodItems.forEach(item => {
      if (item.quantity !== undefined) {
        quantities[item.id] = item.quantity;
      }
    });
    return quantities;
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const events = await getAllEvents();
        const foundEvent = events.find(e => e.id.toString() === eventId);
        setApiEvent(foundEvent || null);
      } catch (error) {
        console.error('Failed to load event:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Loading event...</p>
        </div>
      </div>
    );
  }

  // Use API event if available, fallback to mock for food items display
  const event = mockEvent;
  const eventInfo = apiEvent || (event ? { 
    name: event.name, 
    location: event.location, 
    description: event.description,
    date: "2024-11-15",
    start_time: event.time,
    end_time: event.time,
  } : null);

  if (!event && !apiEvent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
          <Button onClick={() => router.push("/")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const handleReserve = (foodItemId: string) => {
    setReservedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(foodItemId)) {
        newSet.delete(foodItemId);
      } else {
        newSet.add(foodItemId);
      }
      return newSet;
    });
  };

  const handleConfirmReservations = () => {
    // Decrease quantities for reserved items
    setFoodQuantities(prev => {
      const updated = { ...prev };
      reservedItems.forEach(itemId => {
        if (updated[itemId] !== undefined && updated[itemId] > 0) {
          updated[itemId] = updated[itemId] - 1;
        }
      });
      return updated;
    });

    // Clear reservations and show confirmation
    setReservedItems(new Set());
    setShowConfirmation(true);

    // Hide confirmation message after 3 seconds
    setTimeout(() => {
      setShowConfirmation(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <Button onClick={() => router.push("/")} variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
        </div>
      </div>

      {/* Success Message */}
      {showConfirmation && (
        <div className="max-w-6xl mx-auto px-8 pt-8">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
            <p className="font-semibold">Reservations Confirmed! ✓</p>
            <p className="text-sm">Your items have been reserved. Please pick them up at the event location.</p>
          </div>
        </div>
      )}

      {/* Event Info */}
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="bg-white rounded-xl overflow-hidden shadow-sm mb-8">
          <div className="relative h-64 w-full bg-gray-200">
            {event && event.image ? (
              <Image src={event.image} alt={eventInfo?.name || "Event"} fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Utensils className="h-20 w-20 text-gray-400" />
              </div>
            )}
            <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {apiEvent?.start_time || event?.time || "TBD"}
            </div>
          </div>
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{eventInfo?.name}</h1>
            <p className="text-gray-600 flex items-center mb-4">
              <MapPin className="h-5 w-5 mr-2" />
              {eventInfo?.location}
            </p>
            {eventInfo?.description && (
              <p className="text-gray-700">{eventInfo.description}</p>
            )}
            {apiEvent && (
              <div className="mt-4 text-gray-600">
                <p><strong>Date:</strong> {apiEvent.date}</p>
                <p><strong>Time:</strong> {apiEvent.start_time} - {apiEvent.end_time}</p>
                <p><strong>Organization:</strong> {apiEvent.organization}</p>
              </div>
            )}
          </div>
        </div>

        {/* Food Items */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Food Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {event.foodItems.map((item: FoodItem) => {
              const currentQuantity = foodQuantities[item.id] ?? item.quantity ?? 0;
              const isSoldOut = item.quantity !== undefined && currentQuantity === 0;

              return (
              <Card key={item.id} className="p-6">
                <div className="flex gap-4 mb-4">
                  {/* Food Thumbnail */}
                  {item.image && (
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1 flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      {item.description && (
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      )}
                    </div>
                    {item.stockLevel ? (
                      <span
                        className={`text-sm font-medium px-3 py-1 rounded-full ${
                          item.stockLevel === 'high'
                            ? 'bg-green-100 text-green-700'
                            : item.stockLevel === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {item.stockLevel === 'high' ? '🟢 High Stock' : item.stockLevel === 'medium' ? '🟡 Medium Stock' : '🟠 Low Stock'}
                      </span>
                    ) : isSoldOut ? (
                      <span className="text-sm font-medium text-red-700 bg-red-100 px-3 py-1 rounded-full">
                        Sold Out
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                        {currentQuantity} left
                      </span>
                    )}
                  </div>
                </div>

                {/* Dietary Tags */}
                {item.dietaryTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.dietaryTags.map((tag) => (
                      <span
                        key={tag}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${dietaryTagInfo[tag].color}`}
                      >
                        {dietaryTagInfo[tag].icon}
                        {dietaryTagInfo[tag].label}
                      </span>
                    ))}
                  </div>
                )}

                {/* Reserve Button */}
                <Button
                  onClick={() => handleReserve(item.id)}
                  disabled={isSoldOut}
                  className={`w-full ${
                    isSoldOut
                      ? "bg-gray-400 cursor-not-allowed"
                      : reservedItems.has(item.id)
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {isSoldOut ? "Sold Out" : reservedItems.has(item.id) ? "Reserved ✓" : "Reserve Item"}
                </Button>
              </Card>
              );
            })}
          </div>
        </div>

        {/* Reserved Items Summary */}
        {reservedItems.size > 0 && (
          <Card className="p-6 bg-green-50 border-green-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Your Reservations ({reservedItems.size} items)
            </h3>
            <p className="text-gray-700 mb-4">
              Please pick up your reserved items at {event.location} at {event.time}
            </p>
            <Button onClick={handleConfirmReservations} className="bg-green-600 hover:bg-green-700">
              Confirm All Reservations
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
