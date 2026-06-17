const concepts = [
  {
    title: "Next.js",
    body: "A React framework for building full-stack web apps with file-based routing, layouts, server rendering, and API routes.",
  },
  {
    title: "TypeScript",
    body: "JavaScript with types, helping catch mistakes earlier and making code easier to understand as the app grows.",
  },
  {
    title: "Tailwind CSS",
    body: "A utility-first styling system that lets you build responsive interfaces directly in your components.",
  },
];

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">About PlanPilot</p>
          <h1 className="mt-3 text-3xl font-black text-ink sm:text-4xl">
            A learning project with a real product shape.
          </h1>
          <p className="mt-5 leading-8 text-ink/70">
            PlanPilot AI is a full-stack travel planner that will generate personalized itineraries
            from destination, dates, budget, and interests. Day 2 focuses on the frontend foundation:
            pages, routing, layout, and styling.
          </p>
        </div>

        <div className="grid gap-5">
          {concepts.map((concept) => (
            <article key={concept.title} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink/10">
              <h2 className="text-xl font-black text-ink">{concept.title}</h2>
              <p className="mt-3 leading-7 text-ink/70">{concept.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
