//This file is for card components
//There are 12 events shown in one page


"use client";

import { useState } from "react";
import { Card } from "./Card";

interface CardGridProps {
  allEvents: Array<{
    id: string | number;  
    name: string;
    location: string;
    date: string;
    description?: string;
    image_url?: string;
    image?: string;
    food?: string[];
    foodType?: string;
    allergens?: string[];
    organization?: string;
    start_time?: string;
    end_time?: string;
  }>;
}

export function CardGrid({ allEvents }: CardGridProps) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const events = allEvents.slice(start, end);
  const totalPages = Math.ceil(allEvents.length / itemsPerPage);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6 w-full max-w-7xl mx-auto">
        {events.map((event) => (
          <Card key={event.id} event={event} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>

          <span className="font-medium">
            Page {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}