
# Spark Bytes

A Next.js + FastAPI app for sharing leftover food at events. Frontend uses Next.js (App Router) with Tailwind and shadcn UI. Backend is a FastAPI server using Supabase for auth, Postgres, and Storage.

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- A Supabase project with:
	- `.env.local` configured for both frontend and backend
	- Public Storage bucket named `event_images`
	- Tables: `Events`, `Food`, `profiles`

### Environment Variables
Create `.env.local` in the repo root with:

```
NEXT_PUBLIC_SUPABASE_URL=https://<your-supabase-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_KEY=<your-anon-key>
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Run the App

### Frontend (Next.js)
```cmd
npm install
npm run dev
```

Open `http://localhost:3000`.

### Backend (FastAPI)
Use your Python environment (e.g. `my_env` already present) and install requirements:

```cmd
python -m venv my_env
my_env\Scripts\activate
pip install -r requirements.txt
python server.py
```

This starts FastAPI on `http://localhost:8000`.

## Image Loading (Next.js)
Next Image is configured to allow Supabase Storage:
- `next.config.ts` includes remote pattern for `*.supabase.co` on `/storage/v1/object/public/**`.
- Event images use `image_url` stored in `Events` rows. If the image fails to load, the UI falls back to a default icon.

## Event Creation Flow
1. Fill out the form in `CreateEventForm`.
2. The form posts `multipart/form-data` to `POST /event/` (FastAPI):
	 - Uploads optional image to `event_images` bucket
	 - Stores public URL in `Events.image_url`
3. After the event is created, the form posts food items to `POST /food/` with the new `event_id`.

## Key Files
- Frontend
	- `app/components/CreateEventForm.tsx`: Multipart submit, image upload, and food posting
	- `app/events/[id]/components/EventHeader.tsx`: Renders `image_url` with fallback
	- `lib/api.ts`: API utilities and types (`Event` includes `image_url`)
- Backend
	- `server.py`: FastAPI routes
		- `POST /event/` — create event + image upload
		- `POST /food/` — bulk insert food items
		- `GET /events/{id}/food` — list food for an event
		- `PUT /reserve/` — reserve food
		- `POST /reserve/cancel` — cancel reservation
		- `GET /profiles/{id}/reservations` — get profile reservations

## Supabase Setup Notes
- Storage: create public bucket `event_images`
- Database columns for `Events` should include: `name`, `description`, `organization`, `location`, `food[]`, `date`, `start_time`, `end_time`, `image_url`
- `Food` rows typically include: `name`, `event_id`, optional `quantity`, `stockLevel`, `dietaryTags`, `description`, `pickup_instructions`

## Troubleshooting
- Invalid Next Image src for Supabase: ensure `next.config.ts` includes the `*.supabase.co` remote pattern.
- 500s on image upload: verify bucket exists and is public; check `.env.local` values.
- No food showing for event: confirm the `POST /food/` call ran after event creation and rows exist for the `event_id`.

