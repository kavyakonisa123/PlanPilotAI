# PlanPilotAI Backend

The backend is a FastAPI API for generating and saving travel itineraries.
It validates trip requests, builds itinerary previews, and saves trips in PostgreSQL with SQLAlchemy.

## Setup

From the project root:

```bash
python3 -m venv backend/.venv
source backend/.venv/bin/activate
pip install -r backend/requirements.txt
```

## Run

```bash
source backend/.venv/bin/activate
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

`POST /api/generate-itinerary` returns a structured itinerary preview and saves the request, itinerary days, and activities to the database.

## Database

Recommended hosted database: Supabase Postgres.

Set the database URL:

```bash
export DATABASE_URL="postgresql+psycopg://postgres:YOUR_PASSWORD@YOUR_HOST:5432/postgres"
```

Configure CORS for deployed frontends with a comma-separated list:

```bash
export BACKEND_CORS_ORIGINS="https://YOUR_FRONTEND_DOMAIN.com"
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
