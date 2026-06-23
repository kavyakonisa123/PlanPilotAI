# PlanPilotAI

## Project Overview

PlanPilotAI is a full-stack AI-powered web application that generates personalized travel itineraries based on a user's destination, travel dates, budget, and interests.

The goal of this project is to build a practical AI application while learning full-stack development, AI integration, API design, deployment, and technical documentation.

---

## Problem Statement

Planning a trip usually requires searching across multiple websites for places to visit, food options, hotels, transportation, weather, and budget estimates.

PlanPilotAI simplifies this process by allowing users to enter basic travel details and receive a structured day-wise itinerary generated with AI.

---

## MVP Features

- User input form for destination, dates, budget, and interests
- AI-generated day-wise travel itinerary
- Suggested places to visit
- Estimated budget breakdown
- Basic food and hotel recommendations
- Travel tips for the selected destination
- Responsive user interface
- Backend API to handle itinerary generation

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

### AI Integration

- OpenAI API or another LLM API
- Prompt engineering
- Structured AI responses

### Database

- PostgreSQL
- Supabase for hosted Postgres and future authentication

### Tools

- Git
- GitHub
- VS Code
- Postman
- Draw.io / Excalidraw
- Markdown

### Deployment

- Vercel or Netlify for frontend
- Render, Railway, or AWS for backend
- MongoDB Atlas or Supabase for database

---

## Architecture Overview

```text
User
 |
 v
Frontend Next.js App
 |
 v
Backend API using Python FastAPI
 |
 v
AI Service / LLM API
 |
 v
Database
```

## Application Flow

1. User enters travel details in the Next.js frontend.
2. Frontend sends the request to the FastAPI backend.
3. Backend prepares a structured prompt for the AI model.
4. AI model generates a personalized day-wise itinerary.
5. Backend returns the itinerary to the frontend.
6. Frontend displays the itinerary to the user.
7. User can optionally save the itinerary in the database.

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

Day 3 adds a starter FastAPI backend in the `backend/` folder.

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

## Day 5 Database Schema

Day 5 adds the first PostgreSQL schema for saved travel plans.

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
uvicorn backend.main:app --reload --port 8000
```

Open [http://localhost:8000/docs](http://localhost:8000/docs) to view the API docs.

---

## Learning Goals

By building this project, I aim to learn and practice:

- Full-stack application development
- Next.js frontend development
- TypeScript fundamentals
- Tailwind CSS styling
- Python FastAPI backend development
- REST API design
- AI API integration
- Prompt engineering
- Database design
- Git and GitHub workflow
- Deployment
- Technical blogging
- Resume-ready project development

---

## Future Improvements

- User authentication
- Save previous travel plans
- Export itinerary as PDF
- Share itinerary with friends
- Add map integration
- Add live weather data
- Add flight and hotel API integration
- Add multi-city trip planning
- Add chatbot-style travel assistant

---

## Project Status

Day 1 — Project scope and architecture defined with git setup

Current Status: Day 5 - PostgreSQL schema, SQLAlchemy models, Alembic migration, ER diagram, and database setup blogs added.
