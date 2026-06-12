const days = [
  {
    day: "Day 1",
    title: "Arrival and neighborhood walk",
    details: "Check in, explore a nearby market, and keep dinner simple after travel.",
  },
  {
    day: "Day 2",
    title: "Culture and local food",
    details: "Visit the main historic district, try a guided food stop, and save sunset for a viewpoint.",
  },
  {
    day: "Day 3",
    title: "Nature and flexible time",
    details: "Start with a park or trail, then leave the afternoon open for discoveries.",
  },
];

export default function ResultsPage() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-moss">Results</p>
          <h1 className="mt-3 text-3xl font-black text-ink sm:text-4xl">AI itinerary preview</h1>
        </div>
        <button className="w-fit rounded-full bg-coral px-5 py-3 font-bold text-white shadow-sm">
          Save Trip
        </button>
      </div>

      <div className="grid gap-5">
        {days.map((item) => (
          <article key={item.day} className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
            <p className="text-sm font-black text-ocean">{item.day}</p>
            <h2 className="mt-2 text-2xl font-black text-ink">{item.title}</h2>
            <p className="mt-3 max-w-3xl leading-7 text-ink/70">{item.details}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
