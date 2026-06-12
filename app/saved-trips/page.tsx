const savedTrips = [
  { destination: "Lisbon", length: "5 days", status: "Draft" },
  { destination: "Banff", length: "4 days", status: "Saved" },
  { destination: "Seoul", length: "7 days", status: "Idea" },
];

export default function SavedTripsPage() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-coral">Saved Trips</p>
        <h1 className="mt-3 text-3xl font-black text-ink sm:text-4xl">
          Keep favorite itineraries in one place.
        </h1>
        <p className="mt-4 text-ink/70">
          Later this page can read from a database after user accounts and persistence are added.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {savedTrips.map((trip) => (
          <article key={trip.destination} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink/10">
            <div className="mb-8 flex items-center justify-between">
              <span className="rounded-full bg-skywash px-3 py-1 text-sm font-bold text-ocean">
                {trip.status}
              </span>
              <span className="text-sm font-semibold text-ink/55">{trip.length}</span>
            </div>
            <h2 className="text-2xl font-black text-ink">{trip.destination}</h2>
            <p className="mt-3 text-sm leading-6 text-ink/65">
              Placeholder saved trip card for practicing reusable UI patterns.
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
