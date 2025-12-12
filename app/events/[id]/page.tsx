"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { FoodItem } from "@/app/types";
import { useState, useEffect } from "react";
import { getAllEvents, Event, getFoodByEvent, reserveFood, cancelReservation, getProfileReservations } from "@/lib/api";
import { supabase } from '@/lib/supabaseClient';
import EventHeader from "./components/EventHeader";
import FoodList from "./components/FoodList";
import ReservationsSummary from "./components/ReservationsSummary";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  

  // Fetch actual event data from API
  const [apiEvent, setApiEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [reservedItems, setReservedItems] = useState<Set<string>>(new Set());
  const [persistedReserved, setPersistedReserved] = useState<Set<string>>(new Set());
  const [foodQuantities, setFoodQuantities] = useState<Record<string, number>>({});
  const [foodItemsState, setFoodItemsState] = useState<FoodItem[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    async function fetchEvent() {
      try {
        console.log('Fetching event with ID:', eventId);
        const events = await getAllEvents();
        console.log('All events fetched:', events);
        const foundEvent = events.find(e => e.id.toString() === eventId);
        console.log('Found event:', foundEvent);
        setApiEvent(foundEvent || null);
        // Fetch food items for the event
        const idToUse = foundEvent ? foundEvent.id : Number(eventId);
        try {
          const foods = await getFoodByEvent(Number(idToUse));
          setFoodItemsState(foods as unknown as FoodItem[]);
          console.log('Fetched foods for event:', foods);
          // Initialize quantities from fetched foods
          const quantities: Record<string, number> = {};
          (foods || []).forEach((it: any) => {
            if (it.quantity !== undefined && it.quantity !== null) quantities[String(it.id)] = it.quantity;
          });
          setFoodQuantities(quantities);
        } catch (err) {
          console.error('Failed to fetch foods for event:', err);
          setFoodItemsState([]);
          setFoodQuantities({});
        }
        // fetch current user's reservations and mark persistedReserved set
        try {
          const { data: userData } = await supabase.auth.getUser();
          const userId = userData?.user?.id;
          if (userId) {
            const profileRes = await getProfileReservations(userId);
            const reserved = new Set<string>((profileRes.reserved_items || []).map((x: any) => String(x)));
            setPersistedReserved(reserved);
          }
        } catch (e) {
          // non-fatal
        }
      } catch (error) {
        console.error('Failed to load event:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [eventId]);

  // No realtime subscription: we'll re-fetch authoritative food rows after reservations

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Loading event...</p>
        </div>
      </div>
    );
  }

  // Use API event; do not fallback to mock data
  const eventInfo = apiEvent;

  if (!apiEvent) {
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
    // Do not allow toggling if the item is already reserved by the user (persisted)
    if (persistedReserved.has(foodItemId)) return;
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

  const handleConfirmReservations = async () => {
    if (reservedItems.size === 0) return;
    const errors: string[] = [];
    // get current user id
    let userId: string | null = null;
    try {
      const { data } = await supabase.auth.getUser();
      userId = data?.user?.id ?? null;
    } catch (e) {
      console.warn('Could not determine user id for reservation', e);
    }
    // Process each reserved item (one unit per reserved toggle)
    for (const itemId of Array.from(reservedItems)) {
      const item = foodItemsState.find(f => f.id === itemId);
      if (!item) continue;

      const reserveQty = 1;

      // Determine current available quantity (prefer live foodQuantities map)
      const currentQty = foodQuantities[item.id] ?? item.quantity ?? null;

      // If no numeric quantity, interpret stockLevel
      let allowed = null as number | null;
      let unlimited = false;
      if (currentQty === null || currentQty === undefined) {
        if (item.stockLevel === 'high') {
          unlimited = true;
        } else if (item.stockLevel === 'medium') {
          allowed = 30;
        } else if (item.stockLevel === 'low') {
          allowed = 7;
        }
      } else {
        allowed = Number(currentQty);
      }

      if (!unlimited && (allowed === null || allowed < reserveQty)) {
        errors.push(`${item.name}: not enough stock`);
        continue;
      }

      try {
        // Attempt to reserve on the backend (include profile id if available)
        await reserveFood({ food_id: Number(item.id), quantity: reserveQty, profile_id: userId ?? undefined });
        console.log('Reserved food item:', item.id, 'Quantity:', reserveQty);
        // Update local state: decrement quantities or keep unlimited
        setFoodQuantities(prev => {
          const updated = { ...prev };
          if (unlimited) {
            // do not change numeric quantities for unlimited items
          } else {
            const prevQty = updated[item.id] ?? (item.quantity ?? allowed ?? 0);
            updated[item.id] = Math.max(0, Number(prevQty) - reserveQty);
          }
          return updated;
        });

        // Update stockLevel in local item state according to new quantity
        setFoodItemsState(prev => prev.map(f => {
          if (f.id !== item.id) return f;
          const qty = (foodQuantities[item.id] ?? f.quantity) ?? (unlimited ? null : (allowed ?? 0));
          let newStock = f.stockLevel;
          const numericQty = qty === null || qty === undefined ? null : Number(qty) - reserveQty;
          if (numericQty === null) {
            // keep high as unlimited
            newStock = f.stockLevel;
          } else if (numericQty > 30) {
            newStock = 'high';
          } else if (numericQty >= 8) {
            newStock = 'medium';
          } else if (numericQty >= 1) {
            newStock = 'low';
          } else {
            newStock = 'low';
          }

          return { ...f, stockLevel: newStock, quantity: numericQty === null ? f.quantity : Math.max(0, numericQty) };
        }));

      } catch (err) {
        console.error('Reservation failed for', item.name, err);
        errors.push(`${item.name}: reservation failed`);
      }
    }

    // Clear reservations and show confirmation (or show partial error)
    setReservedItems(new Set());
    setShowConfirmation(true);

    // After making reservations, re-fetch authoritative food rows to update UI
    if (apiEvent) {
      try {
        const refreshed = await getFoodByEvent(apiEvent.id);
        setFoodItemsState(refreshed as unknown as FoodItem[]);
        const quantities: Record<string, number> = {};
        (refreshed || []).forEach((f: any) => {
          if (f.quantity !== undefined && f.quantity !== null) quantities[String(f.id)] = f.quantity;
        });
        setFoodQuantities(quantities);
        // refresh persisted reservations for the user
        try {
          const { data } = await supabase.auth.getUser();
          const userId = data?.user?.id;
          if (userId) {
            const profileRes = await getProfileReservations(userId);
            const reserved = new Set<string>((profileRes.reserved_items || []).map((x: any) => String(x)));
            setPersistedReserved(reserved);
          }
        } catch (e) {
          // ignore
        }
      } catch (e) {
        console.error('Failed to refresh food items after reservation:', e);
      }
    }

    // Hide confirmation message after 3 seconds
    setTimeout(() => {
      setShowConfirmation(false);
    }, 3000);

    if (errors.length > 0) {
      console.warn('Some reservations failed:', errors);
    }
  };

  const handleCancelReservation = async (foodId: string) => {
    try {
      const { data } = await supabase.auth.getUser();
      const userId = data?.user?.id;
      if (!userId) throw new Error('Not signed in');
      await cancelReservation({ food_id: Number(foodId), quantity: 1, profile_id: userId });
      // Refresh food rows and persisted reservations
      if (apiEvent) {
        const refreshed = await getFoodByEvent(apiEvent.id);
        setFoodItemsState(refreshed as unknown as FoodItem[]);
        const quantities: Record<string, number> = {};
        (refreshed || []).forEach((f: any) => {
          if (f.quantity !== undefined && f.quantity !== null) quantities[String(f.id)] = f.quantity;
        });
        setFoodQuantities(quantities);
        const profileRes = await getProfileReservations(userId);
        setPersistedReserved(new Set<string>((profileRes.reserved_items || []).map((x: any) => String(x))));
      }
    } catch (e) {
      console.error('Failed to cancel reservation', e);
    }
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

      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Event Header component */}
        <EventHeader apiEvent={apiEvent} />

        {/* Food list component */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Food Items</h2>
          <FoodList
            items={foodItemsState}
            quantities={foodQuantities}
            reservedItems={reservedItems}
            onToggleReserve={handleReserve}
            persistedReserved={persistedReserved}
            onCancelReserve={handleCancelReservation}
          />
        </div>

        {/* Reserved Items Summary component */}
        <ReservationsSummary count={reservedItems.size} apiEvent={apiEvent} onConfirm={handleConfirmReservations} />
      </div>
    </div>
  );
}
