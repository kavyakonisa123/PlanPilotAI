# Day 6: Saving User Trip Requests with PostgreSQL and SQLAlchemy

On Day 6, PlanPilotAI moves from temporary backend memory to real database persistence.

Before this step, the FastAPI backend could generate a mock itinerary and return it to the frontend. That was useful for proving the frontend and backend could talk to each other, but the data only lived inside the running Python process. If the backend restarted, the saved trips disappeared.

Now each trip request is saved in PostgreSQL using SQLAlchemy.

## What Changed

The app now saves:

- the trip destination
- optional start and end dates
- budget
- travel style
- interests
- generated itinerary days
- activities and food recommendations

This means `POST /api/generate-itinerary` does two jobs:

1. It builds the preview itinerary response.
2. It stores that trip in the database.

The frontend can still call the same API route as before, but the backend now keeps the result instead of losing it after a restart.

## Why We Need an ORM

ORM stands for Object Relational Mapper.

PostgreSQL stores data in tables. Python code works with objects. SQLAlchemy sits between those two worlds.

Instead of writing raw SQL like this:

```sql
INSERT INTO trips (destination, budget)
VALUES ('Tokyo, Japan', 'Balanced');
```

we can create a Python object:

```python
trip = DbTrip(
    destination="Tokyo, Japan",
    budget="Balanced",
)
```

SQLAlchemy knows how to turn that Python object into the correct database insert.

## The Database Session

A database session is the active conversation between FastAPI and PostgreSQL.

In this project, `backend/database.py` creates a `SessionLocal` factory and a `get_db` dependency. FastAPI injects that session into routes like this:

```python
def create_trip(request: TripCreate, db: Session = Depends(get_db)):
    ...
```

That `db` object is what the route uses to query, insert, commit, and load data.

At the end of the request, FastAPI closes the session so the database connection is not left hanging.

## Creating a Trip

The create flow is:

```text
Frontend form
-> POST /api/generate-itinerary
-> FastAPI validates the request
-> SQLAlchemy creates rows
-> PostgreSQL stores the trip
-> FastAPI returns the saved trip
```

The backend creates a trip row first. Then it creates related itinerary rows. Then each itinerary day gets activity rows.

That gives us this relationship:

```text
trip
  itinerary day 1
    activity
    food recommendation
  itinerary day 2
    activity
    food recommendation
```

The database can now remember the full saved plan.

## Fetching Saved Trips

The saved trips page calls:

```text
GET /api/trips
```

FastAPI queries PostgreSQL, loads each trip with its itinerary days and activities, then converts the SQLAlchemy objects back into the simple JSON shape the frontend already expects.

That is important because the frontend does not need to know how many database tables are involved. It just receives a clean trip response.

## CRUD Operations

CRUD means:

- Create
- Read
- Update
- Delete

For Day 6, PlanPilotAI now supports the first two:

- Create: `POST /api/trips` and `POST /api/generate-itinerary`
- Read: `GET /api/trips` and `GET /api/trips/{trip_id}`

Update and delete can come later, once the app needs editing or removing saved trips.

## Why This Matters

This is the point where PlanPilotAI starts behaving more like a real product.

The frontend is no longer just showing temporary data. The backend is no longer just returning mock responses from memory. PostgreSQL becomes the source of truth for saved trip requests.

The next time the app needs a saved trips dashboard, trip editing page, user history, or authentication, the foundation is already there.

Day 6 is not flashy, but it is a big architecture step: user actions now create permanent backend data.
