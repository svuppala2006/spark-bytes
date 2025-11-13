//This file shows the content of a single event
// Including the picture, name, introduction and the button
"use client";

import { useState } from "react";
import { ReserveModal } from "./ReserveModal";

interface CardProps {
  event: {
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
  };
}

export function Card({ event }: CardProps) {
  const [open, setOpen] = useState(false);

  const imageSrc =
    event.image_url ||
    event.image ||
    "https://via.placeholder.com/400x250?text=No+Image";

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="
          cursor-pointer border rounded-2xl shadow-sm bg-white p-4 flex flex-col 
          transition-all duration-300 transform
          hover:scale-105 hover:shadow-xl hover:-translate-y-1 hover:bg-gray-50
        "
      >
        <img
          src={imageSrc}
          alt={event.name}
          loading="lazy"
          className="rounded-xl w-full h-48 object-cover mb-3 transition-all duration-300 hover:brightness-105"
        />

        <h2 className="text-lg font-semibold line-clamp-1">{event.name}</h2>
        <p className="text-gray-600 text-sm line-clamp-1">{event.location}</p>
        <p className="text-gray-500 text-sm mt-1">
          Food:{" "}
          {Array.isArray(event.food)
            ? event.food.join(", ")
            : event.foodType || "Various"}
          <br />
          Date: {event.date || "Date TBD"}
        </p>
      </div>

      {open && <ReserveModal event={event} onClose={() => setOpen(false)} />}
    </>
  );
}