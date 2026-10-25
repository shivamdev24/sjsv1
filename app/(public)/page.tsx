// app/page.tsx
// Astrology landing page — Next.js (App Router) + Tailwind CSS
// Fonts: Fraunces (display serif) + Space Grotesk (sans). See layout.tsx for font loading.

import Link from "next/link";

const SIGNS = [
  { name: "Aries", range: "Mar 21 – Apr 19", glyph: "♈" },
  { name: "Taurus", range: "Apr 20 – May 20", glyph: "♉" },
  { name: "Gemini", range: "May 21 – Jun 20", glyph: "♊" },
  { name: "Cancer", range: "Jun 21 – Jul 22", glyph: "♋" },
  { name: "Leo", range: "Jul 23 – Aug 22", glyph: "♌" },
  { name: "Virgo", range: "Aug 23 – Sep 22", glyph: "♍" },
  { name: "Libra", range: "Sep 23 – Oct 22", glyph: "♎" },
  { name: "Scorpio", range: "Oct 23 – Nov 21", glyph: "♏" },
  { name: "Sagittarius", range: "Nov 22 – Dec 21", glyph: "♐" },
  { name: "Capricorn", range: "Dec 22 – Jan 19", glyph: "♑" },
  { name: "Aquarius", range: "Jan 20 – Feb 18", glyph: "♒" },
  { name: "Pisces", range: "Feb 19 – Mar 20", glyph: "♓" },
];

const STEPS = [
  {
    title: "Enter your birth data",
    body: "Date, time and place of birth. We calculate planetary positions to the minute using Swiss Ephemeris data.",
  },
  {
    title: "Get your natal chart",
    body: "A full wheel chart — ten planets, twelve houses, every aspect — rendered and explained in plain language.",
  },
  {
    title: "Track daily transits",
    body: "See how today's sky interacts with your chart, with a forecast that updates every morning.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0E1117] text-[#F5F2EA] selection:bg-[#C9A876] selection:text-[#0E1117]">
      {/* ---------- Nav ---------- */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-7 md:px-10">
        <span className="font-serif text-xl tracking-tight text-[#F5F2EA]">
          Meridian
        </span>
        <nav className="hidden items-center gap-9 text-sm text-[#AEB9CC] md:flex">
          <a href="#chart" className="transition-colors hover:text-[#F5F2EA]">
            Your chart
          </a>
          <a href="#signs" className="transition-colors hover:text-[#F5F2EA]">
            The zodiac
          </a>
          <a href="#how" className="transition-colors hover:text-[#F5F2EA]">
            How it works
          </a>
        </nav>
        <Link
          href="#start"
          className="rounded-sm border border-[#3A4152] px-4 py-2 text-sm text-[#F5F2EA] transition-colors hover:border-[#C9A876] hover:text-[#C9A876]"
        >
          Sign in
        </Link>
      </header>

      {/* ---------- Hero ---------- */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 pb-20 pt-10 md:grid-cols-[1.1fr_0.9fr] md:px-10 md:pb-28 md:pt-16">
        <div>
          <p className="mb-5 font-mono text-sm text-[#6B7A99]">
            40.7128° N, 74.0060° W — Oct 23, 2026, 14:32
          </p>
          <h1 className="font-serif text-5xl leading-[1.05] tracking-tight text-[#F5F2EA] md:text-6xl">
            The sky at the moment
            <br />
            you were born,
            <br />
            mapped and explained.
          </h1>
          <p className="mt-7 max-w-md text-lg leading-relaxed text-[#AEB9CC]">
            Meridian calculates your natal chart from precise planetary
            ephemeris data, then translates it into a reading you can actually
            use — not a horoscope, an instrument.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-5">
            <Link
              id="start"
              href="#"
              className="rounded-sm bg-[#E8604C] px-7 py-3.5 text-sm font-medium text-[#0E1117] transition-colors hover:bg-[#f0735f]"
            >
              Calculate your chart
            </Link>
            <span className="text-sm text-[#6B7A99]">
              Free · takes about two minutes
            </span>
          </div>
        </div>

        {/* Chart wheel visual */}
        <div className="relative mx-auto aspect-square w-full max-w-md">
          <ChartWheel />
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section id="how" className="border-t border-[#1D2230]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
          <h2 className="font-serif text-3xl text-[#F5F2EA] md:text-4xl">
            From birth moment to blueprint
          </h2>
          <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.title} className="border-t border-[#2A3040] pt-6">
                <span className="font-mono text-sm text-[#6B7A99]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-serif text-xl text-[#F5F2EA]">
                  {step.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#AEB9CC]">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Sample reading ---------- */}
      <section id="chart" className="border-t border-[#1D2230] bg-[#10131B]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-20 md:grid-cols-2 md:px-10 md:py-28">
          <div>
            <h2 className="font-serif text-3xl text-[#F5F2EA] md:text-4xl">
              Written like an instrument panel, not a fortune.
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-[#AEB9CC]">
              Every placement comes with the degree, the house and the aspects
              that shape it — so you know not just what it means, but why.
            </p>
          </div>
          <div className="rounded-sm border border-[#2A3040] bg-[#0E1117] p-7">
            <div className="flex items-center justify-between border-b border-[#2A3040] pb-4">
              <span className="font-serif text-lg text-[#F5F2EA]">
                Moon in Scorpio
              </span>
              <span className="font-mono text-xs text-[#6B7A99]">
                14° 22&apos; · 8th House
              </span>
            </div>
            <p className="mt-5 text-[15px] leading-relaxed text-[#AEB9CC]">
              Your emotional responses run deep and rarely surface fully — you
              process privately, and trust is earned in layers, not given
              freely. The 8th house placement sharpens this into an instinct for
              what others are hiding, including from themselves.
            </p>
            <div className="mt-5 flex gap-2">
              <span className="rounded-sm border border-[#3A4152] px-2.5 py-1 font-mono text-xs text-[#6B7A99]">
                square Mars
              </span>
              <span className="rounded-sm border border-[#3A4152] px-2.5 py-1 font-mono text-xs text-[#6B7A99]">
                trine Neptune
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Zodiac strip ---------- */}
      <section id="signs" className="border-t border-[#1D2230]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
          <h2 className="font-serif text-3xl text-[#F5F2EA] md:text-4xl">
            Twelve signs, precisely timed
          </h2>
          <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-[#2A3040] bg-[#2A3040] sm:grid-cols-3 md:grid-cols-4">
            {SIGNS.map((sign) => (
              <div
                key={sign.name}
                className="flex flex-col gap-3 bg-[#0E1117] p-6 transition-colors hover:bg-[#10131B]"
              >
                <span className="text-2xl text-[#C9A876]">{sign.glyph}</span>
                <div>
                  <p className="font-serif text-base text-[#F5F2EA]">
                    {sign.name}
                  </p>
                  <p className="mt-1 font-mono text-xs text-[#6B7A99]">
                    {sign.range}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="border-t border-[#1D2230]">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center md:px-10 md:py-28">
          <h2 className="mx-auto max-w-xl font-serif text-3xl leading-tight text-[#F5F2EA] md:text-4xl">
            Your chart has been waiting since the moment you were born.
          </h2>
          <Link
            href="#start"
            className="mt-9 inline-block rounded-sm bg-[#E8604C] px-7 py-3.5 text-sm font-medium text-[#0E1117] transition-colors hover:bg-[#f0735f]"
          >
            Calculate your chart
          </Link>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="border-t border-[#1D2230]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-[#6B7A99] md:flex-row md:px-10">
          <span className="font-serif text-base text-[#AEB9CC]">Meridian</span>
          <p>
            Planetary positions via Swiss Ephemeris. Not a substitute for a
            decision.
          </p>
        </div>
      </footer>
    </main>
  );
}

/** Natal-chart-wheel style SVG: a ring of 12 houses with plotted "planet" points and aspect lines. */
function ChartWheel() {
  const cx = 200;
  const cy = 200;
  const rOuter = 190;
  const rInner = 150;
  const rPoints = 115;

  const houseLines = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + rInner * Math.cos(angle);
    const y1 = cy + rInner * Math.sin(angle);
    const x2 = cx + rOuter * Math.cos(angle);
    const y2 = cy + rOuter * Math.sin(angle);
    return { x1, y1, x2, y2, key: i };
  });

  // A handful of "planet" placements around the wheel
  const points = [0.05, 0.22, 0.31, 0.47, 0.58, 0.69, 0.83, 0.91].map(
    (frac, i) => {
      const angle = frac * 2 * Math.PI - Math.PI / 2;
      return {
        x: cx + rPoints * Math.cos(angle),
        y: cy + rPoints * Math.sin(angle),
        key: i,
      };
    },
  );

  // Aspect lines connecting some of the points
  const aspects = [
    [0, 3],
    [1, 5],
    [2, 6],
    [4, 7],
    [0, 6],
  ];

  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden="true">
      <circle
        cx={cx}
        cy={cy}
        r={rOuter}
        fill="none"
        stroke="#2A3040"
        strokeWidth={1}
      />
      <circle
        cx={cx}
        cy={cy}
        r={rInner}
        fill="none"
        stroke="#2A3040"
        strokeWidth={1}
      />
      <circle
        cx={cx}
        cy={cy}
        r={60}
        fill="none"
        stroke="#1D2230"
        strokeWidth={1}
      />

      {houseLines.map((l) => (
        <line
          key={l.key}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke="#1D2230"
          strokeWidth={1}
        />
      ))}

      {aspects.map(([a, b], i) => (
        <line
          key={i}
          x1={points[a].x}
          y1={points[a].y}
          x2={points[b].x}
          y2={points[b].y}
          stroke="#6B7A99"
          strokeWidth={0.75}
          strokeOpacity={0.5}
        />
      ))}

      {points.map((p) => (
        <circle key={p.key} cx={p.x} cy={p.y} r={4} fill="#C9A876" />
      ))}

      <circle cx={cx} cy={cy} r={2} fill="#E8604C" />
    </svg>
  );
}
