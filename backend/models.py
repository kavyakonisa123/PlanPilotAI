from datetime import date, datetime
from enum import Enum
from uuid import UUID, uuid4

from sqlalchemy import Date, DateTime, Enum as SqlEnum, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB, UUID as PgUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from backend.database import Base


class TripStatus(str, Enum):
    DRAFT = "draft"
    PLANNED = "planned"
    ARCHIVED = "archived"


class ActivityCategory(str, Enum):
    SIGHTSEEING = "sightseeing"
    FOOD = "food"
    NATURE = "nature"
    CULTURE = "culture"
    TRANSPORT = "transport"
    HOTEL = "hotel"
    FREE_TIME = "free_time"
    OTHER = "other"


class User(Base):
    __tablename__ = "users"

    id: Mapped[UUID] = mapped_column(PgUUID(as_uuid=True), primary_key=True, default=uuid4)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    full_name: Mapped[str | None] = mapped_column(String(120))
    auth_provider: Mapped[str] = mapped_column(String(50), default="supabase", nullable=False)
    auth_user_id: Mapped[UUID | None] = mapped_column(PgUUID(as_uuid=True), unique=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    trips: Mapped[list["Trip"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    preferences: Mapped["Preference | None"] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
        uselist=False,
    )


class Trip(Base):
    __tablename__ = "trips"

    id: Mapped[UUID] = mapped_column(PgUUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    destination: Mapped[str] = mapped_column(String(160), nullable=False, index=True)
    start_date: Mapped[date | None] = mapped_column(Date)
    end_date: Mapped[date | None] = mapped_column(Date)
    budget: Mapped[str] = mapped_column(String(80), default="Balanced", nullable=False)
    travel_style: Mapped[str] = mapped_column(String(120), default="Slow and scenic", nullable=False)
    interests: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)
    status: Mapped[TripStatus] = mapped_column(
        SqlEnum(
            TripStatus,
            name="trip_status",
            values_callable=lambda enum: [item.value for item in enum],
        ),
        default=TripStatus.DRAFT,
        nullable=False,
    )
    notes: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    user: Mapped[User] = relationship(back_populates="trips")
    itineraries: Mapped[list["Itinerary"]] = relationship(
        back_populates="trip",
        cascade="all, delete-orphan",
        order_by="Itinerary.day_number",
    )


class Itinerary(Base):
    __tablename__ = "itineraries"
    __table_args__ = (UniqueConstraint("trip_id", "day_number", name="uq_itineraries_trip_day"),)

    id: Mapped[UUID] = mapped_column(PgUUID(as_uuid=True), primary_key=True, default=uuid4)
    trip_id: Mapped[UUID] = mapped_column(ForeignKey("trips.id", ondelete="CASCADE"), nullable=False, index=True)
    day_number: Mapped[int] = mapped_column(Integer, nullable=False)
    title: Mapped[str] = mapped_column(String(160), nullable=False)
    summary: Mapped[str | None] = mapped_column(Text)
    travel_tip: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    trip: Mapped[Trip] = relationship(back_populates="itineraries")
    activities: Mapped[list["Activity"]] = relationship(
        back_populates="itinerary",
        cascade="all, delete-orphan",
        order_by="Activity.sort_order",
    )


class Activity(Base):
    __tablename__ = "activities"

    id: Mapped[UUID] = mapped_column(PgUUID(as_uuid=True), primary_key=True, default=uuid4)
    itinerary_id: Mapped[UUID] = mapped_column(
        ForeignKey("itineraries.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title: Mapped[str] = mapped_column(String(180), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    category: Mapped[ActivityCategory] = mapped_column(
        SqlEnum(
            ActivityCategory,
            name="activity_category",
            values_callable=lambda enum: [item.value for item in enum],
        ),
        default=ActivityCategory.OTHER,
        nullable=False,
    )
    location_name: Mapped[str | None] = mapped_column(String(180))
    address: Mapped[str | None] = mapped_column(String(255))
    start_time: Mapped[str | None] = mapped_column(String(20))
    end_time: Mapped[str | None] = mapped_column(String(20))
    estimated_cost: Mapped[int | None] = mapped_column(Integer)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    source: Mapped[str] = mapped_column(String(50), default="ai", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    itinerary: Mapped[Itinerary] = relationship(back_populates="activities")


class Preference(Base):
    __tablename__ = "preferences"

    id: Mapped[UUID] = mapped_column(PgUUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    default_budget: Mapped[str] = mapped_column(String(80), default="Balanced", nullable=False)
    default_travel_style: Mapped[str] = mapped_column(String(120), default="Slow and scenic", nullable=False)
    interests: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)
    dietary_needs: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)
    accessibility_needs: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)
    home_airport: Mapped[str | None] = mapped_column(String(12))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    user: Mapped[User] = relationship(back_populates="preferences")
