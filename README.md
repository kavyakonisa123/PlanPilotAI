# PlanPilotAI
## Project Overview
PlanPilotAI is a full-stack AI-powered web application that generates personalized travel itineraries based on a user’s destination, travel dates, budget, and interests.
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
- React.js
- JavaScript
- HTML
- CSS
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
- MongoDB or PostgreSQL
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
Frontend React App
 |
 v
Backend API using Python FastAPI
 |
 v
AI Service / LLM API
 |
 v
Database

Application Flow

1. User enters travel details in the frontend.
2. Frontend sends the request to the FastAPI backend.
3. Backend prepares a structured prompt for the AI model.
4. AI model generates a personalized travel itinerary.
5. Backend returns the itinerary to the frontend.
6. Frontend displays the itinerary to the user.
7. User can optionally save the itinerary in the database.



Learning Goals

By building this project, I aim to learn and practice:

* Full-stack application development
* React frontend development
* Python FastAPI backend development
* REST API design
* AI API integration
* Prompt engineering
* Database design
* Git and GitHub workflow
* Deployment
* Technical blogging
* Resume-ready project development

⸻

Future Improvements

* User authentication
* Save previous travel plans
* Export itinerary as PDF
* Share itinerary with friends
* Add map integration
* Add live weather data
* Add flight and hotel API integration
* Add multi-city trip planning
* Add chatbot-style travel assistant

⸻

Project Status

Current Status: Day 1 — Project scope and architecture defined with git setup
