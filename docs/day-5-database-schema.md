# Day 5 Database Schema

Day 5 adds the first real database design for PlanPilotAI.

Recommended hosted database: Supabase Postgres.

Why Supabase:

- It is managed PostgreSQL, so the schema is standard SQL.
- It includes authentication, which we can connect later.
- It has a dashboard for inspecting tables while learning.
- It works well with a FastAPI backend through a normal database URL.

The backend code still uses SQLAlchemy and Alembic, so the same schema can also run on local PostgreSQL, Railway, Render, or any other Postgres host.

## Tables

### users

Stores one application profile per person.

Important fields:

- `id`: primary key
- `email`: unique email address
- `auth_provider`: authentication system, defaulting to `supabase`
- `auth_user_id`: optional id from Supabase Auth

This table lets the app keep user-specific trips and preferences without depending on Supabase-only SQL in the first migration.

### trips

Stores a saved travel plan.

Important fields:

- `id`: primary key
- `user_id`: foreign key to `users.id`
- `destination`: trip destination
- `start_date` and `end_date`: optional travel dates
- `budget`: saved budget preference for this trip
- `travel_style`: saved travel style for this trip
- `status`: draft, planned, or archived

A user can have many trips.

### itineraries

Stores day-by-day itinerary sections for a trip.

Important fields:

- `id`: primary key
- `trip_id`: foreign key to `trips.id`
- `day_number`: day number inside the trip
- `title`: title for the day
- `summary`: short overview
- `travel_tip`: useful note for that day

Each trip can have many itinerary days.

The pair `trip_id + day_number` is unique so a trip cannot accidentally have two Day 1 rows.

### activities

Stores individual activities inside an itinerary day.

Important fields:

- `id`: primary key
- `itinerary_id`: foreign key to `itineraries.id`
- `title`: activity name
- `description`: optional details
- `category`: sightseeing, food, nature, culture, transport, hotel, free time, or other
- `location_name` and `address`: optional location fields
- `start_time` and `end_time`: simple time labels for now
- `estimated_cost`: optional estimated cost
- `sort_order`: display order within a day

Each itinerary day can have many activities.

### preferences

Stores reusable user preferences for future trip generation.

Important fields:

- `id`: primary key
- `user_id`: unique foreign key to `users.id`
- `default_budget`: default budget choice
- `default_travel_style`: default travel style
- `interests`: JSON list of interests
- `dietary_needs`: JSON list of dietary needs
- `accessibility_needs`: JSON list of accessibility needs
- `home_airport`: optional airport code

Each user has at most one preferences row.

## Relationships

```mermaid
erDiagram
    USERS ||--o{ TRIPS : owns
    USERS ||--|| PREFERENCES : has
    TRIPS ||--o{ ITINERARIES : contains
    ITINERARIES ||--o{ ACTIVITIES : includes
```

## Running Migrations

Install backend dependencies:

```bash
python3 -m venv backend/.venv
source backend/.venv/bin/activate
pip install -r backend/requirements.txt
```

Set the database URL:

```bash
export DATABASE_URL="postgresql+psycopg://postgres:YOUR_PASSWORD@YOUR_HOST:5432/postgres"
```

Run Alembic:

```bash
alembic upgrade head
```

Check current migration:

```bash
alembic current
```

Create a future migration after changing models:

```bash
alembic revision --autogenerate -m "describe the schema change"
```
