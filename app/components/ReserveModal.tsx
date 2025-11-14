// NOTE: This component is now deprecated in favor of the full event detail page
// at /events/[id]/page.tsx which provides better reservation functionality.
// This modal can be removed once all references are updated to navigate to the detail page.

//This file is for the pop-up reserve items

"use client";

interface ReserveModalProps {
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
  onClose: () => void;
}

export function ReserveModal({ event, onClose }: ReserveModalProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-[90%] max-w-[750px] p-8 relative transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-5 text-gray-400 hover:text-gray-600 text-2xl"
          onClick={onClose}
        >
          ×
        </button>

        {event.image_url && (
          <img
            src={event.image_url}
            alt={event.name}
            className="w-full h-64 object-cover rounded-2xl mb-6"
          />
        )}

        <div className="space-y-3">
          <h2 className="text-3xl font-semibold">{event.name}</h2>
          <p className="text-gray-600 text-lg">{event.location}</p>

          <p className="text-gray-500 text-base">
            <strong>Food:</strong>{" "}
            {Array.isArray(event.food)
              ? event.food.join(", ")
              : event.foodType || "Various"}
            <br />
            <strong>Date:</strong> {event.date || "Date TBD"}
          </p>

          {event.description && (
            <p className="text-gray-700 text-base leading-relaxed mt-2">
              {event.description}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors"
            onClick={() => alert(`Reserved for ${event.name}!`)}
          >
            Reserve
          </button>
        </div>
      </div>
    </div>
  );
}