import Link from "next/link";

const highlights = [
  {
    title: "Personalized itinerary planning",
    body: "Generate day-by-day plans from destination, dates, budget, style, and interests.",
  },
  {
    title: "Budget-aware recommendations",
    body: "Keep trip preferences attached to every generated itinerary response.",
  },
  {
    title: "Saved trip history",
    body: "Persist generated trip requests in PostgreSQL through the FastAPI backend.",
  },
];

export default function Home() {
  return (
    <section className="bg-[#fbf8f2]">
      <div className="mx-auto grid min-h-[calc(100vh-88px)] max-w-6xl items-center gap-10 px-5 py-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-ocean shadow-sm">
            30-day AI travel planner build
          </p>
          <h1 className="text-4xl font-black leading-tight text-ink sm:text-5xl lg:text-6xl">
            PlanPilot AI turns a travel idea into a clear trip plan.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/70">
            A clean Next.js frontend for collecting trip details, previewing generated itineraries,
            and saving plans as the full-stack app grows.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/trip-planner" className="accent-button justify-center px-6">
              Start Planning
            </Link>
            <Link href="/about" className="secondary-button justify-center px-6">
              Learn the Project
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] bg-ink p-5 text-white shadow-soft">
          <div className="rounded-[1.5rem] bg-white p-5 text-ink">
            <div className="flex items-center justify-between border-b border-ink/10 pb-4">
              <div>
                <p className="text-sm font-semibold text-coral">Generated itinerary</p>
                <h2 className="text-2xl font-black">Kyoto in 3 days</h2>
              </div>
              <span className="rounded-full bg-skywash px-3 py-1 text-sm font-bold text-ocean">
                Saved
              </span>
            </div>
            <div className="mt-5 space-y-4">
              {highlights.map((highlight, index) => (
                <div key={highlight.title} className="flex gap-4 rounded-2xl bg-[#f5efe4] p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-moss font-black text-white">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-bold">{highlight.title}</h3>
                    <p className="text-sm leading-6 text-ink/65">{highlight.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
