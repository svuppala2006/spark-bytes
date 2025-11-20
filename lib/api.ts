// API utility functions for interacting with the FastAPI backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Event {
    id: number;
    name: string;
    description: string;
    organization: string;
    location: string;
    food: string[];
    date: string; // YYYY-MM-DD
    start_time: string; // HH:MM
    end_time: string; // HH:MM
}

export interface FoodItem {
    id: number;
    name: string;
    quantity: number | null;
    stockLevel: 'low' | 'medium' | 'high';
    dietaryTags: string[];
    description: string;
    event_id: number;
}

export interface ReserveRequest {
    food_id: number;
    quantity: number;
    profile_id?: string;
}

/**
 * Fetch all events from the API
 */
export async function getAllEvents(): Promise<Event[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/`);
        if (!response.ok) {
            throw new Error(`Failed to fetch events: ${response.statusText}`);
        }
        const result = await response.json();
        // Supabase response structure: { data: [...], count: ... }
        return result.data || [];
    } catch (error) {
        console.error('Error fetching events:', error);
        return [];
    }
}

/**
 * Search events by name
 */
export async function searchEventsByName(name: string): Promise<Event[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/search/name/${encodeURIComponent(name)}`);
        if (!response.ok) {
            throw new Error(`Failed to search events: ${response.statusText}`);
        }
        const result = await response.json();
        return result.data || [];
    } catch (error) {
        console.error('Error searching events by name:', error);
        return [];
    }
}

/**
 * Search events by food type
 */
export async function searchEventsByFood(food: string): Promise<Event[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/search/food/${encodeURIComponent(food)}`);
        if (!response.ok) {
            throw new Error(`Failed to search events by food: ${response.statusText}`);
        }
        const result = await response.json();
        return result.data || [];
    } catch (error) {
        console.error('Error searching events by food:', error);
        return [];
    }
}

/**
 * Create a new event
 */
export async function createEvent(event: Omit<Event, 'id'>): Promise<Event | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/event/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to create event: ${errorData.detail || response.statusText}`);
        }
        const result = await response.json();
        return result.data?.[0] || null;
    } catch (error) {
        console.error('Error creating event:', error);
        throw error;
    }
}

/**
 * Reserve food items
 */
export async function reserveFood(request: ReserveRequest): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/reserve/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to reserve food: ${errorData.detail || response.statusText}`);
        }
        return true;
    } catch (error) {
        console.error('Error reserving food:', error);
        throw error;
    }
}

export async function cancelReservation(request: ReserveRequest): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/reserve/cancel`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to cancel reservation: ${errorData.detail || response.statusText}`);
        }
        return true;
    } catch (error) {
        console.error('Error cancelling reservation:', error);
        throw error;
    }
}

export async function getProfileReservations(profileId: string): Promise<{ reserved_items: any[]; food_rows: any[] }>{
    try{
        const response = await fetch(`${API_BASE_URL}/profiles/${encodeURIComponent(profileId)}/reservations`);
        if(!response.ok){
            throw new Error(`Failed to fetch profile reservations: ${response.statusText}`);
        }
        return await response.json();
    }catch(err){
        console.error('Error fetching profile reservations', err);
        return { reserved_items: [], food_rows: [] };
    }
}

/**
 * Fetch food items for a specific event
 */
export async function getFoodByEvent(eventId: number | string): Promise<FoodItem[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/events/${eventId}/food`);
        if (!response.ok) {
            throw new Error(`Failed to fetch food for event ${eventId}: ${response.statusText}`);
        }
        const result = await response.json();
        const rows = result.data || [];
        // Normalize shape to our frontend FoodItem type
        return rows.map((r: any) => ({
            id: typeof r.id === 'string' ? r.id : String(r.id),
            name: r.name,
            // Preserve null/undefined as null so UI falls back to stockLevel when quantity unknown
            quantity: (r.quantity !== undefined && r.quantity !== null) ? Number(r.quantity) : null,
            stockLevel: r.stockLevel,
            dietaryTags: r.dietaryTags || [],
            description: r.description || '',
            event_id: r.event_id,
        }));
    } catch (error) {
        console.error('Error fetching food by event:', error);
        return [];
    }
}
