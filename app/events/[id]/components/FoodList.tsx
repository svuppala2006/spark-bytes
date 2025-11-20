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
          currentQuantity={quantities[item.id] ?? item.quantity ?? 0}
          isReserved={reservedItems.has(item.id)}
          onToggleReserve={onToggleReserve}
          persistedReserved={persistedReserved.has(item.id)}
          onCancelReserve={onCancelReserve}
        />
      ))}
    </div>
  );
}
