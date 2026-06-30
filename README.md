# PlanPilotAI

## Project Overview

PlanPilotAI is a full-stack travel planning app that generates itinerary previews from a user's destination, travel dates, budget, style, and interests.

The goal of this project is to build a practical AI application while learning full-stack development, AI integration, API design, deployment, and technical documentation.

---

## Problem Statement

Planning a trip usually requires searching across multiple websites for places to visit, food options, hotels, transportation, weather, and budget estimates.

PlanPilotAI simplifies this process by allowing users to enter basic travel details, receive a structured day-wise itinerary preview, and save the trip request for later.

---

## MVP Features

- User input form for destination, dates, budget, and interests
- Generated day-wise travel itinerary preview
- Suggested places to visit
- Basic food recommendations
- Travel tips for the selected destination
- Responsive user interface
- Backend API to handle itinerary generation
- PostgreSQL persistence for saved trip requests

---

## Tech Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS

### Backend

- Python
- FastAPI
- Uvicorn
- SQLAlchemy
- Alembic

### Database

- PostgreSQL
- Supabase for hosted Postgres and future authentication

### Tools

- Git
- GitHub
- GitHub Actions
- VS Code
- Postman
- Markdown

### Deployment

- Vercel for frontend
- Railway for backend
- Supabase for hosted PostgreSQL

---

## Architecture Overview

```text
User
 |
 v
Frontend Next.js App
 |
 v
Backend API using FastAPI
 |
 v
PostgreSQL
 |
 v
Saved trip data
```

## Application Flow

1. User enters travel details in the Next.js frontend.
2. Frontend sends the request to the FastAPI backend.
3. Backend validates the request and creates a structured itinerary preview.
4. SQLAlchemy saves the trip, itinerary days, and activities in PostgreSQL.
5. Backend returns the saved trip response to the frontend.
6. Frontend displays the latest trip and can fetch saved trips later.

---

## Day 2 Frontend Setup

Day 2 adds a working frontend foundation in the `frontend/` folder using Next.js, TypeScript, and Tailwind CSS.

Included pages:

- Home
- Trip Planner
- Results
- Saved Trips
- About

Included concepts:

- Next.js App Router
- File-based routing
- Shared root layout
- Navigation bar
- Reusable page structure
- Tailwind utility styling
- TypeScript configuration

---

## Day 3 Backend Setup

Day 3 adds a starter FastAPI backend in the `backend/` folder. Day 6 now persists trip requests in PostgreSQL through the same routes.

Included routes:

- `GET /health`
- `GET /api/trips`
- `POST /api/trips`
- `GET /api/trips/{trip_id}`
- `POST /api/generate-itinerary`
- `GET /api/destinations`
- `GET /api/travel-styles`

Run the backend:

```bash
python3 -m venv backend/.venv
source backend/.venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload --port 8000
```

Open [http://localhost:8000/docs](http://localhost:8000/docs) to test the API.

---

## Day 5 and Day 6 Database Work

Day 5 adds the first PostgreSQL schema for saved travel plans. Day 6 connects the trip API to that database.

Included tables:

- `users`
- `trips`
- `itineraries`
- `activities`
- `preferences`

Included database tooling:

- SQLAlchemy models in [backend/models.py](/Users/kavyakonisa/Desktop/TravelPlanner/PlanPilotAI/backend/models.py)
- Database session setup in [backend/database.py](/Users/kavyakonisa/Desktop/TravelPlanner/PlanPilotAI/backend/database.py)
- Alembic configuration in [alembic.ini](/Users/kavyakonisa/Desktop/TravelPlanner/PlanPilotAI/alembic.ini)
- Initial migration in [20260618_0001_create_travel_planning_schema.py](/Users/kavyakonisa/Desktop/TravelPlanner/PlanPilotAI/backend/alembic/versions/20260618_0001_create_travel_planning_schema.py)
- Day 6 migration in [20260623_0002_add_trip_interests.py](/Users/kavyakonisa/Desktop/TravelPlanner/PlanPilotAI/backend/alembic/versions/20260623_0002_add_trip_interests.py)
- ER diagram in [day-5-er-diagram.mmd](/Users/kavyakonisa/Desktop/TravelPlanner/PlanPilotAI/docs/day-5-er-diagram.mmd)
- Schema notes in [day-5-database-schema.md](/Users/kavyakonisa/Desktop/TravelPlanner/PlanPilotAI/docs/day-5-database-schema.md)

Run migrations:

```bash
source backend/.venv/bin/activate
export DATABASE_URL="postgresql+psycopg://postgres:YOUR_PASSWORD@YOUR_HOST:5432/postgres"
alembic upgrade head
```

---

## Running Locally

Install dependencies:

```bash
cd frontend
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:2000](http://localhost:2000) to view the app.

In a second terminal, start the backend from the project root:

```bash
source backend/.venv/bin/activate
uvicorn backend.main:app --reload --port 8000
```

Open [http://localhost:8000/docs](http://localhost:8000/docs) to view the API docs.

---

## Day 7 Deployment Workflow

Day 7 adds the first deployment setup for the full-stack app.

Included deployment files:

- GitHub Actions workflow in [.github/workflows/ci.yml](/Users/kavyakonisa/Desktop/TravelPlanner/PlanPilotAI/.github/workflows/ci.yml)
- Vercel project config in [frontend/vercel.json](/Users/kavyakonisa/Desktop/TravelPlanner/PlanPilotAI/frontend/vercel.json)
- Railway config in [railway.json](/Users/kavyakonisa/Desktop/TravelPlanner/PlanPilotAI/railway.json)
- Root Python dependency pointer in [requirements.txt](/Users/kavyakonisa/Desktop/TravelPlanner/PlanPilotAI/requirements.txt)
- Deployment checklist in [docs/deployment.md](/Users/kavyakonisa/Desktop/TravelPlanner/PlanPilotAI/docs/deployment.md)

GitHub Actions runs frontend lint/build checks and backend compile checks on pull requests and pushes to `main`.

Production environment variables:

- `NEXT_PUBLIC_API_URL` in Vercel should point to the deployed Railway backend URL.
- `DATABASE_URL` in Railway should point to the Supabase PostgreSQL database.
- `BACKEND_CORS_ORIGINS` in Railway should include the deployed Vercel frontend URL.

Optional GitHub Actions deployment secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Public project links:

- Frontend: `https://your-vercel-app.vercel.app`
- Backend health check: `https://your-railway-backend.up.railway.app/health`

---

## Learning Goals

By building this project, I aim to learn and practice:

- Full-stack application development
- Next.js frontend development
- TypeScript fundamentals
- Tailwind CSS styling
- Python FastAPI backend development
- REST API design
- Database design
- ORM and CRUD persistence
- Git and GitHub workflow
- Deployment
- Technical blogging
- Resume-ready project development

---

## Future Improvements

- User authentication
- AI-powered itinerary generation
- Export itinerary as PDF
- Share itinerary with friends
- Add map integration
- Add live weather data
- Add flight and hotel API integration
- Add multi-city trip planning
- Add chatbot-style travel assistant

---

## Project Status

Current status: Day 7 - deployment config and GitHub Actions workflow are ready for Vercel, Railway, and Supabase.
