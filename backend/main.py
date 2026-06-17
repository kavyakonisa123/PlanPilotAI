from datetime import UTC, datetime
from uuid import uuid4

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


app = FastAPI(
    title="PlanPilotAI API",
    description="FastAPI backend for generating and saving travel itineraries.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ItineraryDay(BaseModel):
    day: int
    title: str
    summary: str
    activities: list[str]
    food_recommendations: list[str]
    travel_tip: str


class Trip(BaseModel):
    id: str
    destination: str
    start_date: str | None = None
    end_date: str | None = None
    budget: str
    travel_style: str
    interests: list[str]
    itinerary: list[ItineraryDay]
    created_at: datetime


class TripCreate(BaseModel):
    destination: str = Field(..., min_length=2, examples=["Tokyo, Japan"])
    start_date: str | None = Field(default=None, examples=["2026-06-20"])
    end_date: str | None = Field(default=None, examples=["2026-06-26"])
    budget: str = Field(default="Balanced", examples=["Balanced"])
    travel_style: str = Field(default="Slow and scenic", examples=["Slow and scenic"])
    interests: list[str] = Field(default_factory=list, examples=[["Food", "Nature"]])


class ItineraryRequest(TripCreate):
    days: int = Field(default=3, ge=1, le=14)


class HealthResponse(BaseModel):
    status: str
    service: str
    timestamp: datetime


class MessageResponse(BaseModel):
    message: str


def build_preview_itinerary(request: ItineraryRequest) -> list[ItineraryDay]:
    interests = request.interests or ["local highlights"]
    primary_interest = interests[0]

    day_templates = [
        (
            "Arrival and neighborhood walk",
            "Settle in, get oriented, and keep the first day flexible.",
            ["Check in and unpack", "Walk through a central neighborhood", "Find an easy local dinner"],
            ["Casual local cafe", "Popular neighborhood dinner spot"],
            "Keep the schedule light so travel delays do not break the plan.",
        ),
        (
            f"{primary_interest} and local culture",
            f"Build the day around {primary_interest.lower()} with time for food and photos.",
            ["Visit a landmark", f"Add a {primary_interest.lower()} stop", "Watch sunset from a scenic area"],
            ["Street food or market snacks", "Dinner near the evening viewpoint"],
            "Book timed attractions ahead when possible.",
        ),
        (
            "Nature and flexible discoveries",
            "Balance a planned morning with an open afternoon.",
            ["Start with a park, garden, or trail", "Try a local lunch", "Leave time for shopping or a museum"],
            ["Local lunch special", "Relaxed final-night restaurant"],
            "Save a few flexible hours for places you discover during the trip.",
        ),
    ]

    itinerary: list[ItineraryDay] = []
    for index in range(request.days):
        title, summary, activities, food, tip = day_templates[index % len(day_templates)]
        itinerary.append(
            ItineraryDay(
                day=index + 1,
                title=title,
                summary=f"{summary} Destination focus: {request.destination}.",
                activities=activities,
                food_recommendations=food,
                travel_tip=tip,
            )
        )

    return itinerary


trips: dict[str, Trip] = {}

seed_trip = Trip(
    id="trip_lisbon_preview",
    destination="Lisbon, Portugal",
    start_date="2026-06-20",
    end_date="2026-06-24",
    budget="Balanced",
    travel_style="Slow and scenic",
    interests=["Food", "Museums", "Nature"],
    itinerary=build_preview_itinerary(
        ItineraryRequest(
            destination="Lisbon, Portugal",
            start_date="2026-06-20",
            end_date="2026-06-24",
            budget="Balanced",
            travel_style="Slow and scenic",
            interests=["Food", "Museums", "Nature"],
            days=3,
        )
    ),
    created_at=datetime.now(UTC),
)
trips[seed_trip.id] = seed_trip


@app.get("/", response_model=MessageResponse)
def root() -> MessageResponse:
    return MessageResponse(message="Welcome to the PlanPilotAI API.")


@app.get("/health", response_model=HealthResponse)
def health_check() -> HealthResponse:
    return HealthResponse(
        status="ok",
        service="planpilot-api",
        timestamp=datetime.now(UTC),
    )


@app.get("/api/trips", response_model=list[Trip])
def list_trips() -> list[Trip]:
    return list(trips.values())


@app.post("/api/trips", response_model=Trip, status_code=status.HTTP_201_CREATED)
def create_trip(request: TripCreate) -> Trip:
    itinerary_request = ItineraryRequest(**request.model_dump(), days=3)
    trip = Trip(
        id=f"trip_{uuid4().hex[:8]}",
        itinerary=build_preview_itinerary(itinerary_request),
        created_at=datetime.now(UTC),
        **request.model_dump(),
    )
    trips[trip.id] = trip
    return trip


@app.get("/api/trips/{trip_id}", response_model=Trip)
def get_trip(trip_id: str) -> Trip:
    trip = trips.get(trip_id)
    if trip is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trip '{trip_id}' was not found.",
        )

    return trip


@app.post("/api/generate-itinerary", response_model=Trip)
def generate_itinerary(request: ItineraryRequest) -> Trip:
    trip = Trip(
        id=f"trip_{uuid4().hex[:8]}",
        destination=request.destination,
        start_date=request.start_date,
        end_date=request.end_date,
        budget=request.budget,
        travel_style=request.travel_style,
        interests=request.interests,
        itinerary=build_preview_itinerary(request),
        created_at=datetime.now(UTC),
    )
    trips[trip.id] = trip
    return trip


@app.get("/api/destinations")
def list_destination_examples() -> dict[str, list[str]]:
    return {
        "destinations": [
            "Lisbon, Portugal",
            "Tokyo, Japan",
            "Banff, Canada",
            "Seoul, South Korea",
            "Mexico City, Mexico",
        ]
    }


@app.get("/api/travel-styles")
def list_travel_styles() -> dict[str, list[str]]:
    return {
        "travel_styles": [
            "Slow and scenic",
            "Packed and energetic",
            "Family-friendly",
            "Remote-work friendly",
        ],
        "budgets": [
            "Budget-friendly",
            "Balanced",
            "Premium",
        ],
        "interests": [
            "Food",
            "Nature",
            "Museums",
            "Adventure",
            "Shopping",
            "Relaxing",
        ],
    }
