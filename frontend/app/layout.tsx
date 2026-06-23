import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/trip-planner", label: "Trip Planner" },
  { href: "/results", label: "Results" },
  { href: "/saved-trips", label: "Saved Trips" },
  { href: "/about", label: "About" },
];

export const metadata: Metadata = {
  title: "PlanPilot AI",
  description: "Full-stack travel planning app built with Next.js, FastAPI, PostgreSQL, and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">
        <header className="sticky top-0 z-20 border-b border-ink/10 bg-[#fbf8f2]/90 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="flex items-center gap-3 text-lg font-bold tracking-wide text-ink">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-sm text-white">
                PP
              </span>
              PlanPilot AI
            </Link>
            <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-ink/75">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-3 py-2 transition hover:bg-white hover:text-ink hover:shadow-sm"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="border-t border-ink/10 bg-white/60">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-sm text-ink/65 sm:flex-row sm:items-center sm:justify-between">
            <p>PlanPilot AI - Full-stack travel planner.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
