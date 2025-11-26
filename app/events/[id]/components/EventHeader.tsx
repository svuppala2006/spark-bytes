"use client";
import Image from 'next/image';
import { Utensils, Clock, MapPin } from 'lucide-react';
import React from 'react';
import type { Event } from '@/lib/api';

export default function EventHeader({ apiEvent }: { apiEvent: Event | null }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm mb-8">
      <div className="relative h-64 w-full bg-gray-200">
        {(apiEvent as any)?.image ? (
          <Image src={(apiEvent as any).image} alt={apiEvent?.name || 'Event'} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Utensils className="h-20 w-20 text-gray-400" />
          </div>
        )}
        <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full flex items-center gap-2">
          <Clock className="h-4 w-4" />
          {apiEvent?.start_time ?? 'TBD'}
        </div>
      </div>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{apiEvent?.name}</h1>
        <p className="text-gray-600 flex items-center mb-4">
          <MapPin className="h-5 w-5 mr-2" />
          {apiEvent?.location}
        </p>
        {apiEvent?.description && <p className="text-gray-700">{apiEvent.description}</p>}
        {apiEvent && (
          <div className="mt-4 text-gray-600">
            <p>
              <strong>Date:</strong> {apiEvent.date}
            </p>
            <p>
              <strong>Time:</strong> {apiEvent.start_time} - {apiEvent.end_time}
            </p>
            <p>
              <strong>Organization:</strong> {apiEvent.organization}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
