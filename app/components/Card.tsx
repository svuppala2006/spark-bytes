//This file shows the content of a single event
// Including the picture, name, introduction and the button

"use client";

import { useState } from "react";
import { ReserveModal } from "./ReserveModal";

export function Card({ event }) {
  const [open, setOpen] = useState(false);

  const imageSrc =
    event.image_url ||
    event.image ||
    "https://via.placeholder.com/400x250?text=No+Image";

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="cursor-pointer border rounded-2xl shadow-sm hover:shadow-md bg-white p-4 transition-all flex flex-col"
      >
        <img
          src={imageSrc}
          alt={event.name}
          loading="lazy"
          className="rounded-xl w-full h-48 object-cover mb-3"
        />

        <h2 className="text-lg font-semibold">{event.name}</h2>
        <p className="text-gray-600 text-sm">{event.location}</p>
        <p className="text-gray-500 text-sm mt-1">
          Food Type:{" "}
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
