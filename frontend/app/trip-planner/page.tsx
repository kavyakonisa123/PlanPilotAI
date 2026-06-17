const interests = ["Food", "Nature", "Museums", "Adventure", "Shopping", "Relaxing"];

export default function TripPlannerPage() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">Trip Planner</p>
        <h1 className="mt-3 text-3xl font-black text-ink sm:text-4xl">
          Collect the details for an AI itinerary.
        </h1>
        <p className="mt-4 text-ink/70">
          This starter form is the future handoff point between the frontend and the FastAPI backend.
        </p>
      </div>

      <form className="grid gap-6 rounded-3xl bg-white p-6 shadow-soft lg:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-ink">
          Destination
          <input className="rounded-2xl border border-ink/15 px-4 py-3 font-normal outline-none transition focus:border-ocean focus:ring-4 focus:ring-ocean/10" placeholder="Tokyo, Japan" />
        </label>
        <label className="grid gap-2 text-sm font-bold text-ink">
          Travel Dates
          <input className="rounded-2xl border border-ink/15 px-4 py-3 font-normal outline-none transition focus:border-ocean focus:ring-4 focus:ring-ocean/10" placeholder="June 20 - June 26" />
        </label>
        <label className="grid gap-2 text-sm font-bold text-ink">
          Budget
          <select className="rounded-2xl border border-ink/15 px-4 py-3 font-normal outline-none transition focus:border-ocean focus:ring-4 focus:ring-ocean/10">
            <option>Budget-friendly</option>
            <option>Balanced</option>
            <option>Premium</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-bold text-ink">
          Travel Style
          <select className="rounded-2xl border border-ink/15 px-4 py-3 font-normal outline-none transition focus:border-ocean focus:ring-4 focus:ring-ocean/10">
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
                <input type="checkbox" className="h-4 w-4 accent-coral" />
                {interest}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="lg:col-span-2">
          <button className="rounded-full bg-ink px-6 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:bg-ocean">
            Generate Preview
          </button>
        </div>
      </form>
    </section>
  );
}
