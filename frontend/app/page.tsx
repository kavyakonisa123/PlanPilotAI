import Link from "next/link";

const highlights = [
  "Personalized itinerary planning",
  "Budget-aware recommendations",
  "Saved trips for later",
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
            <Link
              href="/trip-planner"
              className="rounded-full bg-coral px-6 py-3 text-center font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-[#dd5d4d]"
            >
              Start Planning
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-ink/15 bg-white px-6 py-3 text-center font-bold text-ink transition hover:-translate-y-0.5 hover:shadow-sm"
            >
              Learn the Project
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] bg-ink p-5 text-white shadow-soft">
          <div className="rounded-[1.5rem] bg-white p-5 text-ink">
            <div className="flex items-center justify-between border-b border-ink/10 pb-4">
              <div>
                <p className="text-sm font-semibold text-coral">Sample itinerary</p>
                <h2 className="text-2xl font-black">Kyoto in 3 days</h2>
              </div>
              <span className="rounded-full bg-skywash px-3 py-1 text-sm font-bold text-ocean">
                AI Draft
              </span>
            </div>
            <div className="mt-5 space-y-4">
              {highlights.map((highlight, index) => (
                <div key={highlight} className="flex gap-4 rounded-2xl bg-[#f5efe4] p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-moss font-black text-white">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-bold">{highlight}</h3>
                    <p className="text-sm leading-6 text-ink/65">
                      This placeholder will connect to real AI responses in later project days.
                    </p>
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
