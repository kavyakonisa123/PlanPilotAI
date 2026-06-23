"use client";

import { useEffect, useState } from "react";
import { listTrips, type Trip } from "@/lib/api";

export default function SavedTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTrips() {
      try {
        const data = await listTrips();
        setTrips(data);
      } catch {
        setError("Could not load trips from the FastAPI backend.");
      } finally {
        setIsLoading(false);
      }
    }

    loadTrips();
  }, []);

  return (
    <section className="page-section">
      <div className="mb-8 max-w-3xl">
        <p className="section-kicker text-coral">Saved Trips</p>
        <h1 className="section-title">Trips saved by the backend.</h1>
        <p className="section-copy">
          This page calls `GET /api/trips` and displays the trips saved in PostgreSQL.
        </p>
      </div>

      {isLoading ? <p className="font-semibold text-ink/70">Loading trips...</p> : null}

      {error ? (
        <p className="status-error">{error}</p>
      ) : null}

      {!isLoading && !error && trips.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-3">
          {trips.map((trip) => (
            <article key={trip.id} className="soft-card">
              <div className="mb-8 flex items-center justify-between gap-4">
                <span className="rounded-full bg-skywash px-3 py-1 text-sm font-bold text-ocean">
                  {trip.budget}
                </span>
                <span className="text-sm font-semibold text-ink/55">
                  {trip.itinerary.length} days
                </span>
              </div>
              <h2 className="text-2xl font-black text-ink">{trip.destination}</h2>
              <p className="mt-3 text-sm leading-6 text-ink/65">{trip.travel_style}</p>
              <p className="mt-4 text-sm font-semibold text-ink/55">
                {trip.interests.join(", ") || "Local highlights"}
              </p>
            </article>
          ))}
        </div>
      ) : null}

      {!isLoading && !error && trips.length === 0 ? (
        <div className="surface-card">
          <h2 className="text-2xl font-black text-ink">No saved trips yet.</h2>
          <p className="mt-3 max-w-2xl leading-7 text-ink/70">
            Generate an itinerary from the trip planner, and it will appear here after the backend saves it.
          </p>
        </div>
      ) : null}
    </section>
  );
}
