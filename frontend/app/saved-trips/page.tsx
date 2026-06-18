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
    <section className="mx-auto max-w-6xl px-5 py-12">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-coral">Saved Trips</p>
        <h1 className="mt-3 text-3xl font-black text-ink sm:text-4xl">
          Trips returned by the backend.
        </h1>
        <p className="mt-4 text-ink/70">
          This page calls `GET /api/trips` and displays the trips currently stored in FastAPI memory.
        </p>
      </div>

      {isLoading ? <p className="font-semibold text-ink/70">Loading trips...</p> : null}

      {error ? (
        <p className="rounded-2xl bg-coral/10 px-4 py-3 text-sm font-semibold text-coral">{error}</p>
      ) : null}

      {!isLoading && !error ? (
        <div className="grid gap-5 md:grid-cols-3">
          {trips.map((trip) => (
            <article key={trip.id} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink/10">
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
    </section>
  );
}
