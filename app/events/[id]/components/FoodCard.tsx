"use client";
import React from 'react';
import Image from 'next/image';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import dietaryTagInfo from './dietaryTagInfo';
import type { FoodItem } from '@/app/types';

export default function FoodCard({
  item,
  currentQuantity,
  isReserved,
  onToggleReserve,
  persistedReserved,
  onCancelReserve,
}: {
  item: FoodItem;
  currentQuantity: number;
  isReserved: boolean;
  onToggleReserve: (id: string) => void;
  persistedReserved: boolean;
  onCancelReserve: (id: string) => void;
}) {
  const isSoldOut = item.quantity !== undefined && currentQuantity === 0;

  return (
    <Card className="p-6">
      <div className="flex gap-4 mb-4">
        {/* Food Thumbnail */}
        {item.image && (
          <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
            <Image src={item.image} alt={item.name} fill className="object-cover" />
          </div>
        )}

        <div className="flex-1 flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
            {item.description && <p className="text-sm text-gray-600 mt-1">{item.description}</p>}
          </div>
          {(currentQuantity !== undefined && currentQuantity !== null) ? (
            isSoldOut ? (
              <span className="text-sm font-medium text-red-700 bg-red-100 px-3 py-1 rounded-full">Sold Out</span>
            ) : (
              <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">{currentQuantity} left</span>
            )
          ) : item.stockLevel ? (
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
          ) : (
            <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">Quantity unavailable</span>
          )}
        </div>
      </div>

      {/* Dietary Tags */}
      {item.dietaryTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {item.dietaryTags.map((tag) => (
            <span key={tag} className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${dietaryTagInfo[tag].color}`}>
              {dietaryTagInfo[tag].icon}
              {dietaryTagInfo[tag].label}
            </span>
          ))}
        </div>
      )}

      {persistedReserved ? (
        <div className="flex flex-col gap-2">
          <Button className="w-full bg-gray-300 cursor-default" disabled>
            Reserved ✓
          </Button>
          <Button onClick={() => onCancelReserve(item.id)} variant="outline" className="w-full">
            Cancel Reservation
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => onToggleReserve(item.id)}
          disabled={isSoldOut}
          className={`w-full ${
            isSoldOut ? 'bg-gray-400 cursor-not-allowed' : isReserved ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {isSoldOut ? 'Sold Out' : isReserved ? 'Reserved ✓' : 'Reserve Item'}
        </Button>
      )}
    </Card>
  );
}
