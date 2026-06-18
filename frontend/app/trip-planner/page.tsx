"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { generateItinerary } from "@/lib/api";

const interests = ["Food", "Nature", "Museums", "Adventure", "Shopping", "Relaxing"];

export default function TripPlannerPage() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("Balanced");
  const [travelStyle, setTravelStyle] = useState("Slow and scenic");
  const [days, setDays] = useState(3);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["Food"]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  function toggleInterest(interest: string) {
    setSelectedInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest],
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (destination.trim().length < 2) {
      setError("Please enter a destination with at least two characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      const trip = await generateItinerary({
        destination: destination.trim(),
        start_date: startDate || null,
        end_date: endDate || null,
        budget,
        travel_style: travelStyle,
        interests: selectedInterests,
        days,
      });

      window.localStorage.setItem("planpilot:lastTrip", JSON.stringify(trip));
      router.push("/results");
    } catch {
      setError("Could not reach the FastAPI backend. Make sure it is running on port 8000.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">Trip Planner</p>
        <h1 className="mt-3 text-3xl font-black text-ink sm:text-4xl">
          Generate an itinerary from the FastAPI backend.
        </h1>
        <p className="mt-4 text-ink/70">
          Enter trip details, submit the form, and the Next.js frontend will call the backend API.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 rounded-3xl bg-white p-6 shadow-soft lg:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-ink">
          Destination
          <input
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
            className="rounded-2xl border border-ink/15 px-4 py-3 font-normal outline-none transition focus:border-ocean focus:ring-4 focus:ring-ocean/10"
            placeholder="Tokyo, Japan"
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-ink">
          Start Date
          <input
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            className="rounded-2xl border border-ink/15 px-4 py-3 font-normal outline-none transition focus:border-ocean focus:ring-4 focus:ring-ocean/10"
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-ink">
          End Date
          <input
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
            className="rounded-2xl border border-ink/15 px-4 py-3 font-normal outline-none transition focus:border-ocean focus:ring-4 focus:ring-ocean/10"
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-ink">
          Budget
          <select
            value={budget}
            onChange={(event) => setBudget(event.target.value)}
            className="rounded-2xl border border-ink/15 px-4 py-3 font-normal outline-none transition focus:border-ocean focus:ring-4 focus:ring-ocean/10"
          >
            <option>Budget-friendly</option>
            <option>Balanced</option>
            <option>Premium</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-bold text-ink">
          Travel Style
          <select
            value={travelStyle}
            onChange={(event) => setTravelStyle(event.target.value)}
            className="rounded-2xl border border-ink/15 px-4 py-3 font-normal outline-none transition focus:border-ocean focus:ring-4 focus:ring-ocean/10"
          >
            <option>Slow and scenic</option>
            <option>Packed and energetic</option>
            <option>Family-friendly</option>
            <option>Remote-work friendly</option>
          </select>
        </label>
        <fieldset className="lg:col-span-2">
          <legend className="mb-3 text-sm font-bold text-ink">Interests</legend>
          <div className="flex flex-wrap gap-3">
            {interests.map((interest) => (
              <label key={interest} className="flex cursor-pointer items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={selectedInterests.includes(interest)}
                  onChange={() => toggleInterest(interest)}
                  className="h-4 w-4 accent-coral"
                />
                {interest}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="grid gap-2 text-sm font-bold text-ink lg:col-span-2">
          Number of Days
          <input
            type="number"
            min="1"
            max="14"
            value={days}
            onChange={(event) => setDays(Number(event.target.value))}
            className="max-w-40 rounded-2xl border border-ink/15 px-4 py-3 font-normal outline-none transition focus:border-ocean focus:ring-4 focus:ring-ocean/10"
          />
        </label>
        {error ? (
          <p className="rounded-2xl bg-coral/10 px-4 py-3 text-sm font-semibold text-coral lg:col-span-2">
            {error}
          </p>
        ) : null}
        <div className="lg:col-span-2">
          <button
            disabled={isSubmitting}
            className="rounded-full bg-ink px-6 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:bg-ocean disabled:cursor-not-allowed disabled:bg-ink/45"
          >
            {isSubmitting ? "Generating..." : "Generate Preview"}
          </button>
        </div>
      </form>
    </section>
  );
}
