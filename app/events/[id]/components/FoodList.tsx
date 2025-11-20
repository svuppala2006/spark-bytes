"use client";
import React from 'react';
import FoodCard from './FoodCard';
import type { FoodItem } from '@/app/types';

export default function FoodList({
  items,
  quantities,
  reservedItems,
  onToggleReserve,
  persistedReserved,
  onCancelReserve,
}: {
  items: FoodItem[];
  quantities: Record<string, number>;
  reservedItems: Set<string>;
  onToggleReserve: (id: string) => void;
  persistedReserved: Set<string>;
  onCancelReserve: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {items.map((item) => (
        <FoodCard
          key={item.id}
          item={item}
          // Prefer an explicit numeric quantity when available. If neither the live
          // `quantities` map nor the item row has a numeric `quantity`, pass `null`
          // so the card will fall back to `stockLevel` and allow reservations.
          currentQuantity={
            (quantities[item.id] !== undefined && quantities[item.id] !== null)
              ? quantities[item.id]
              : (item.quantity !== undefined && item.quantity !== null ? item.quantity : null)
          }
          isReserved={reservedItems.has(item.id)}
          onToggleReserve={onToggleReserve}
          persistedReserved={persistedReserved.has(item.id)}
          onCancelReserve={onCancelReserve}
        />
      ))}
    </div>
  );
}
