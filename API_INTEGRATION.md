# API Integration Changes

## Summary of Changes

This document outlines the changes made to integrate the FastAPI backend with the Next.js frontend, consolidate functionality, and improve UI/UX.

## 1. API Integration

### Created `lib/api.ts`
- Central API utility file for all backend communication
- Functions:
  - `getAllEvents()` - Fetch all events
  - `searchEventsByName(name)` - Search events by name
  - `searchEventsByFood(food)` - Search events by food type
  - `createEvent(event)` - Create a new event
  - `reserveFood(request)` - Reserve food items
- Uses environment variable `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8000`)

### Updated Components to Use API

#### `app/page.tsx` (Homepage)
- Removed mock data
- Added `useEffect` to fetch events from API
- Shows first 3 events as featured
- Added loading states
- Uses placeholder icon when no images available

#### `app/search/page.tsx` (Search Page)
- Removed mock data
- Added `useEffect` to fetch all events from API
- Updated filtering logic to work with API Event structure
- **Improved text visibility** with darker, more prominent colors:
  - Headings now use `text-gray-900` and larger `text-lg/text-xl`
  - Filter labels use `font-semibold text-gray-900`
  - Results count uses `font-medium text-lg`
- Added loading state
- Maintains all existing filter functionality

#### `app/components/Card.tsx`
- Removed `ReserveModal` integration
- Now navigates to event detail page (`/events/[id]`) on click
- Updated interface to accept API Event structure

#### `app/components/CardGrid.tsx`
- Updated interface to accept flexible event structure
- Works with both API and extended event types

#### `app/events/[id]/page.tsx` (Event Detail)
- Added API integration to fetch real event data
- Falls back to mock data for food items (until Food API endpoint is created)
- Shows API event information when available
- Added loading state
- Displays organization, date, and time from API

## 2. Navbar Active State

### Updated `app/components/Navbar.tsx`
- Added `"use client"` directive
- Added `usePathname` hook to track current route
- Created `isActive(path)` helper function
- **Active links now display in red** (`text-red-600`) to match branding
- Inactive links remain gray with red hover state

## 3. Component Consolidation

### Deprecated `ReserveModal`
- Added deprecation notice at top of `app/components/ReserveModal.tsx`
- Event detail page (`/events/[id]/page.tsx`) is now the primary reservation interface
- Benefits of detail page over modal:
  - More space for information
  - Better food item display with images
  - Full reservation workflow
  - Dedicated URL for sharing
  - Better mobile experience

## 4. Environment Configuration

### Created `.env.example`
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Supabase Configuration (for backend server.py)
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_key_here
```

## Setup Instructions

### 1. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
copy .env.example .env.local
```

Update the values:
- `NEXT_PUBLIC_API_URL` - Your FastAPI backend URL (default: http://localhost:8000)
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_KEY` - Your Supabase anon/public key

### 2. Start the Backend
```bash
# Activate virtual environment
my_env\Scripts\activate

# Run FastAPI server
python server.py
```

The API will be available at `http://localhost:8000`

### 3. Start the Frontend
```bash
# Install dependencies (if needed)
npm install

# Run development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 4. Verify API Connection
1. Open browser to `http://localhost:3000`
2. Homepage should load events from API
3. Navigate to Search page - should show all events
4. Click on an event - should show detail page

## API Endpoints Used

- `GET /` - Fetch all events
- `GET /search/name/{name}` - Search events by name
- `GET /search/food/{food}` - Search events by food
- `POST /event/` - Create new event
- `PUT /reserve/` - Reserve food items

## Next Steps (Future Improvements)

1. **Create Food API Endpoints**
   - Add endpoints to fetch food items by event_id
   - Update event detail page to use real food data
   - Implement actual reservation API calls

2. **Error Handling**
   - Add toast notifications for API errors
   - Implement retry logic
   - Better offline handling

3. **Loading States**
   - Add skeleton loaders
   - Implement optimistic UI updates

4. **Authentication**
   - Add user authentication
   - Restrict reservation actions to logged-in users
   - Track user reservations

5. **Search Optimization**
   - Implement debouncing for search input
   - Add autocomplete suggestions
   - Cache API responses

## Notes

- Mock data is still used for food items in event detail page until Food endpoints are created
- Distance and dietary filtering are currently client-side only
- Images use placeholders since API doesn't include image URLs yet
- All components are now properly typed with TypeScript interfaces
