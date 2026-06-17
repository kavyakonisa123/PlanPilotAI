# PlanPilotAI FastAPI Backend

Day 3 adds a starter FastAPI backend for the travel planner.

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

The itinerary generator currently returns structured mock data. Later it can call an AI provider and save trips to a real database.
