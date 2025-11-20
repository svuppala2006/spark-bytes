"use client";
import React from 'react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import type { Event } from '@/lib/api';

export default function ReservationsSummary({
  count,
  apiEvent,
  onConfirm,
}: {
  count: number;
  apiEvent: Event | null;
  onConfirm: () => void;
}) {
  if (count === 0) return null;
  return (
    <Card className="p-6 bg-green-50 border-green-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Reservations ({count} items)</h3>
      <p className="text-gray-700 mb-4">Please pick up your reserved items at {apiEvent?.location} at {apiEvent?.start_time}</p>
      <Button onClick={onConfirm} className="bg-green-600 hover:bg-green-700">Confirm All Reservations</Button>
    </Card>
  );
}
