"""create travel planning schema

Revision ID: 20260618_0001
Revises:
Create Date: 2026-06-18
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = "20260618_0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


trip_status = postgresql.ENUM(
    "draft",
    "planned",
    "archived",
    name="trip_status",
    create_type=False,
)
activity_category = postgresql.ENUM(
    "sightseeing",
    "food",
    "nature",
    "culture",
    "transport",
    "hotel",
    "free_time",
    "other",
    name="activity_category",
    create_type=False,
)


def upgrade() -> None:
    postgresql.ENUM("draft", "planned", "archived", name="trip_status").create(op.get_bind(), checkfirst=True)
    postgresql.ENUM(
        "sightseeing",
        "food",
        "nature",
        "culture",
        "transport",
        "hotel",
        "free_time",
        "other",
        name="activity_category",
    ).create(op.get_bind(), checkfirst=True)

    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("full_name", sa.String(length=120), nullable=True),
        sa.Column("auth_provider", sa.String(length=50), nullable=False, server_default="supabase"),
        sa.Column("auth_user_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("auth_user_id"),
        sa.UniqueConstraint("email"),
    )
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=False)

    op.create_table(
        "trips",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("destination", sa.String(length=160), nullable=False),
        sa.Column("start_date", sa.Date(), nullable=True),
        sa.Column("end_date", sa.Date(), nullable=True),
        sa.Column("budget", sa.String(length=80), nullable=False, server_default="Balanced"),
        sa.Column("travel_style", sa.String(length=120), nullable=False, server_default="Slow and scenic"),
        sa.Column("status", trip_status, nullable=False, server_default="draft"),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_trips_destination"), "trips", ["destination"], unique=False)
    op.create_index(op.f("ix_trips_user_id"), "trips", ["user_id"], unique=False)

    op.create_table(
        "preferences",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("default_budget", sa.String(length=80), nullable=False, server_default="Balanced"),
        sa.Column("default_travel_style", sa.String(length=120), nullable=False, server_default="Slow and scenic"),
        sa.Column(
            "interests",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=False,
            server_default=sa.text("'[]'::jsonb"),
        ),
        sa.Column(
            "dietary_needs",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=False,
            server_default=sa.text("'[]'::jsonb"),
        ),
        sa.Column(
            "accessibility_needs",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=False,
            server_default=sa.text("'[]'::jsonb"),
        ),
        sa.Column("home_airport", sa.String(length=12), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id"),
    )

    op.create_table(
        "itineraries",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("trip_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("day_number", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=160), nullable=False),
        sa.Column("summary", sa.Text(), nullable=True),
        sa.Column("travel_tip", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["trip_id"], ["trips.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("trip_id", "day_number", name="uq_itineraries_trip_day"),
    )
    op.create_index(op.f("ix_itineraries_trip_id"), "itineraries", ["trip_id"], unique=False)

    op.create_table(
        "activities",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("itinerary_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("title", sa.String(length=180), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("category", activity_category, nullable=False, server_default="other"),
        sa.Column("location_name", sa.String(length=180), nullable=True),
        sa.Column("address", sa.String(length=255), nullable=True),
        sa.Column("start_time", sa.String(length=20), nullable=True),
        sa.Column("end_time", sa.String(length=20), nullable=True),
        sa.Column("estimated_cost", sa.Integer(), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("source", sa.String(length=50), nullable=False, server_default="ai"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["itinerary_id"], ["itineraries.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_activities_itinerary_id"), "activities", ["itinerary_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_activities_itinerary_id"), table_name="activities")
    op.drop_table("activities")
    op.drop_index(op.f("ix_itineraries_trip_id"), table_name="itineraries")
    op.drop_table("itineraries")
    op.drop_table("preferences")
    op.drop_index(op.f("ix_trips_user_id"), table_name="trips")
    op.drop_index(op.f("ix_trips_destination"), table_name="trips")
    op.drop_table("trips")
    op.drop_index(op.f("ix_users_email"), table_name="users")
    op.drop_table("users")
    activity_category.drop(op.get_bind(), checkfirst=True)
    trip_status.drop(op.get_bind(), checkfirst=True)
