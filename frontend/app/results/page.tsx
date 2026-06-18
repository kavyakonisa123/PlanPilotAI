"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Trip } from "@/lib/api";

export default function ResultsPage() {
  const [trip, setTrip] = useState<Trip | null>(null);

  useEffect(() => {
    const storedTrip = window.localStorage.getItem("planpilot:lastTrip");

    if (storedTrip) {
      setTrip(JSON.parse(storedTrip) as Trip);
    }
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-moss">Results</p>
          <h1 className="mt-3 text-3xl font-black text-ink sm:text-4xl">
            {trip ? `${trip.destination} itinerary preview` : "AI itinerary preview"}
          </h1>
          {trip ? (
            <p className="mt-3 text-ink/70">
              {trip.budget} budget - {trip.travel_style} - {trip.interests.join(", ") || "Local highlights"}
            </p>
          ) : null}
        </div>
        <Link href="/trip-planner" className="w-fit rounded-full bg-coral px-5 py-3 font-bold text-white shadow-sm">
          Plan Another Trip
        </Link>
      </div>

      {trip ? (
        <div className="grid gap-5">
          {trip.itinerary.map((item) => (
            <article key={item.day} className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
              <p className="text-sm font-black text-ocean">Day {item.day}</p>
              <h2 className="mt-2 text-2xl font-black text-ink">{item.title}</h2>
              <p className="mt-3 max-w-3xl leading-7 text-ink/70">{item.summary}</p>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-[0.16em] text-ink/55">Activities</h3>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-ink/70">
                    {item.activities.map((activity) => (
                      <li key={activity}>{activity}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-[0.16em] text-ink/55">Food</h3>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-ink/70">
                    {item.food_recommendations.map((food) => (
                      <li key={food}>{food}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-[0.16em] text-ink/55">Travel Tip</h3>
                  <p className="mt-3 text-sm leading-6 text-ink/70">{item.travel_tip}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-ink">No generated trip yet.</h2>
          <p className="mt-3 max-w-2xl leading-7 text-ink/70">
            Go to the trip planner, submit the form, and this page will show the itinerary returned by FastAPI.
          </p>
          <Link
            href="/trip-planner"
            className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 font-bold text-white"
          >
            Open Trip Planner
          </Link>
        </div>
      )}
    </section>
  );
}
