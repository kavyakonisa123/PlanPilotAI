const concepts = [
  {
    title: "Next.js frontend",
    body: "Collects trip details, shows generated results, and lists saved trips through typed API helpers.",
  },
  {
    title: "FastAPI backend",
    body: "Validates requests, generates structured itinerary previews, and exposes REST endpoints for trip data.",
  },
  {
    title: "PostgreSQL persistence",
    body: "Stores trip requests, itinerary days, interests, and activities through SQLAlchemy models and Alembic migrations.",
  },
];

export default function AboutPage() {
  return (
    <section className="page-section">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="section-kicker text-ocean">About PlanPilot</p>
          <h1 className="section-title">
            A learning project with a real product shape.
          </h1>
          <p className="mt-5 leading-8 text-ink/70">
            PlanPilot AI is a full-stack travel planner that turns destination, dates, budget,
            style, and interests into saved itinerary previews. The project now includes a Next.js
            frontend, FastAPI backend, and PostgreSQL persistence.
          </p>
        </div>

        <div className="grid gap-5">
          {concepts.map((concept) => (
            <article key={concept.title} className="soft-card">
              <h2 className="text-xl font-black text-ink">{concept.title}</h2>
              <p className="mt-3 leading-7 text-ink/70">{concept.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
