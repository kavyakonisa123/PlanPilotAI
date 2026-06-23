from datetime import UTC, date, datetime
from os import getenv
from uuid import UUID

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from backend.database import get_db
from backend.models import (
    Activity as DbActivity,
    ActivityCategory as DbActivityCategory,
    Itinerary as DbItinerary,
    Trip as DbTrip,
    User as DbUser,
)


app = FastAPI(
    title="PlanPilotAI API",
    description="FastAPI backend for generating and saving travel itineraries.",
    version="0.1.0",
)


def get_allowed_origins() -> list[str]:
    configured_origins = getenv("BACKEND_CORS_ORIGINS")
    if configured_origins:
        return [origin.strip() for origin in configured_origins.split(",") if origin.strip()]

    return [
        "http://localhost:2000",
        "http://127.0.0.1:2000",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]


app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


DEMO_USER_EMAIL = "demo@planpilotai.local"


class ItineraryDay(BaseModel):
    day: int
    title: str
    summary: str
    activities: list[str]
    food_recommendations: list[str]
    travel_tip: str


class TripResponse(BaseModel):
    id: str
    destination: str
    start_date: date | None = None
    end_date: date | None = None
    budget: str
    travel_style: str
    interests: list[str]
    itinerary: list[ItineraryDay]
    created_at: datetime


class TripCreate(BaseModel):
    destination: str = Field(..., min_length=2, examples=["Tokyo, Japan"])
    start_date: date | None = Field(default=None, examples=["2026-06-20"])
    end_date: date | None = Field(default=None, examples=["2026-06-26"])
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


def get_or_create_demo_user(db: Session) -> DbUser:
    user = db.scalar(select(DbUser).where(DbUser.email == DEMO_USER_EMAIL))
    if user is not None:
        return user

    user = DbUser(
        email=DEMO_USER_EMAIL,
        full_name="PlanPilotAI Demo User",
        auth_provider="local",
    )
    db.add(user)
    db.flush()
    return user


def load_trip_or_404(db: Session, trip_id: str) -> DbTrip:
    try:
        trip_uuid = UUID(trip_id)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trip '{trip_id}' was not found.",
        ) from exc

    trip = db.scalar(
        select(DbTrip)
        .where(DbTrip.id == trip_uuid)
        .options(selectinload(DbTrip.itineraries).selectinload(DbItinerary.activities))
    )
    if trip is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trip '{trip_id}' was not found.",
        )

    return trip


def db_trip_to_response(trip: DbTrip) -> TripResponse:
    itinerary: list[ItineraryDay] = []

    for day in trip.itineraries:
        activities: list[str] = []
        food_recommendations: list[str] = []

        for activity in day.activities:
            if activity.category == DbActivityCategory.FOOD:
                food_recommendations.append(activity.title)
            else:
                activities.append(activity.title)

        itinerary.append(
            ItineraryDay(
                day=day.day_number,
                title=day.title,
                summary=day.summary or "",
                activities=activities,
                food_recommendations=food_recommendations,
                travel_tip=day.travel_tip or "",
            )
        )

    return TripResponse(
        id=str(trip.id),
        destination=trip.destination,
        start_date=trip.start_date,
        end_date=trip.end_date,
        budget=trip.budget,
        travel_style=trip.travel_style,
        interests=trip.interests,
        itinerary=itinerary,
        created_at=trip.created_at,
    )


def create_trip_record(db: Session, request: TripCreate, days: int) -> DbTrip:
    user = get_or_create_demo_user(db)
    itinerary_payload = request.model_dump(exclude={"days"})
    itinerary_request = ItineraryRequest(**itinerary_payload, days=days)
    preview_itinerary = build_preview_itinerary(itinerary_request)

    trip = DbTrip(
        user_id=user.id,
        destination=request.destination,
        start_date=request.start_date,
        end_date=request.end_date,
        budget=request.budget,
        travel_style=request.travel_style,
        interests=request.interests,
    )

    for day in preview_itinerary:
        itinerary_day = DbItinerary(
            day_number=day.day,
            title=day.title,
            summary=day.summary,
            travel_tip=day.travel_tip,
        )

        for sort_order, activity_title in enumerate(day.activities, start=1):
            itinerary_day.activities.append(
                DbActivity(
                    title=activity_title,
                    category=DbActivityCategory.OTHER,
                    sort_order=sort_order,
                    source="mock",
                )
            )

        for sort_order, food_title in enumerate(day.food_recommendations, start=len(day.activities) + 1):
            itinerary_day.activities.append(
                DbActivity(
                    title=food_title,
                    category=DbActivityCategory.FOOD,
                    sort_order=sort_order,
                    source="mock",
                )
            )

        trip.itineraries.append(itinerary_day)

    db.add(trip)
    db.flush()
    trip_id = trip.id
    db.commit()

    return load_trip_or_404(db, str(trip_id))


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


@app.get("/api/trips", response_model=list[TripResponse])
def list_trips(db: Session = Depends(get_db)) -> list[TripResponse]:
    trip_records = db.scalars(
        select(DbTrip)
        .options(selectinload(DbTrip.itineraries).selectinload(DbItinerary.activities))
        .order_by(DbTrip.created_at.desc())
    ).all()
    return [db_trip_to_response(trip) for trip in trip_records]


@app.post("/api/trips", response_model=TripResponse, status_code=status.HTTP_201_CREATED)
def create_trip(request: TripCreate, db: Session = Depends(get_db)) -> TripResponse:
    trip = create_trip_record(db, request, days=3)
    return db_trip_to_response(trip)


@app.get("/api/trips/{trip_id}", response_model=TripResponse)
def get_trip(trip_id: str, db: Session = Depends(get_db)) -> TripResponse:
    return db_trip_to_response(load_trip_or_404(db, trip_id))


@app.post("/api/generate-itinerary", response_model=TripResponse)
def generate_itinerary(request: ItineraryRequest, db: Session = Depends(get_db)) -> TripResponse:
    trip = create_trip_record(db, request, days=request.days)
    return db_trip_to_response(trip)


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
