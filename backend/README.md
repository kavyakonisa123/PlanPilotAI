# PlanPilotAI FastAPI Backend

The backend is a FastAPI API for generating and saving travel itineraries.

Day 3 added the starter API routes and mock itinerary generator.

Day 5 adds PostgreSQL database support with SQLAlchemy and Alembic.

Day 6 saves trip requests, generated itinerary days, and activities in PostgreSQL.

## Setup

From the project root:

```bash
python3 -m venv backend/.venv
source backend/.venv/bin/activate
pip install -r backend/requirements.txt
```

## Run

```bash
uvicorn backend.main:app --reload --port 8000
```

Open the API docs at [http://localhost:8000/docs](http://localhost:8000/docs).

## Routes

- `GET /health`
- `GET /api/trips`
- `POST /api/trips`
- `GET /api/trips/{trip_id}`
- `POST /api/generate-itinerary`
- `GET /api/destinations`
- `GET /api/travel-styles`

The itinerary generator currently returns structured mock data and saves each request to the database. Later it can call an AI provider before saving the generated plan.

## Database

Recommended hosted database: Supabase Postgres.

Set the database URL:

```bash
export DATABASE_URL="postgresql+psycopg://postgres:YOUR_PASSWORD@YOUR_HOST:5432/postgres"
```

Run migrations:

```bash
alembic upgrade head
```

Create a new migration after editing models:

```bash
alembic revision --autogenerate -m "describe the schema change"
```

## Schema

Main tables:

- `users`
- `trips`
- `itineraries`
- `activities`
- `preferences`

The schema is defined in [models.py](/Users/kavyakonisa/Desktop/TravelPlanner/PlanPilotAI/backend/models.py).

The initial migration is in [20260618_0001_create_travel_planning_schema.py](/Users/kavyakonisa/Desktop/TravelPlanner/PlanPilotAI/backend/alembic/versions/20260618_0001_create_travel_planning_schema.py).

Day 6 adds the trip-level `interests` column in [20260623_0002_add_trip_interests.py](/Users/kavyakonisa/Desktop/TravelPlanner/PlanPilotAI/backend/alembic/versions/20260623_0002_add_trip_interests.py).
