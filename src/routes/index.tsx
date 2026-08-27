import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

import board from "@/assets/board.jpg";
import paper from "@/assets/paper.jpg";
import mapImg from "@/assets/map.jpg";
import photo1 from "@/assets/photo1.jpg";
import photo2 from "@/assets/photo2.jpg";
import photo3 from "@/assets/photo3.jpg";
import photo4 from "@/assets/photo4.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Contact Intel X — Uncover the Network" },
      {
        name: "description",
        content:
          "Have a lead? Contact the Intel X task force. Send a message to our investigation team or reach us by email and phone.",
      },
      { property: "og:title", content: "Contact Intel X — Uncover the Network" },
      {
        property: "og:description",
        content:
          "Have a lead? Contact the Intel X task force. Send a message to our investigation team or reach us by email and phone.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const NAV = ["HOME", "STORY", "CLUES", "LEADERBOARD", "RULEBOOK", "CONTACT US"];

function Pin({ className = "" }: { className?: string }) {
  return (
    <span className={`absolute z-30 h-4 w-4 ${className}`} aria-hidden="true">
      <span className="block h-4 w-4 rounded-full bg-[oklch(0.45_0.19_27)] shadow-[inset_-1px_-2px_3px_rgba(0,0,0,0.55),inset_2px_2px_3px_rgba(255,255,255,0.35),0_4px_6px_rgba(0,0,0,0.7)]" />
    </span>
  );
}

function Photo({
  src,
  alt,
  className,
  rotate,
  ratio = "4 / 3",
}: {
  src: string;
  alt: string;
  className: string;
  rotate: string;
  ratio?: string;
}) {
  return (
    <figure
      className={`absolute photo-shadow bg-[oklch(0.84_0.03_85)] p-[6px] pb-[18px] ${className}`}
      style={{ transform: `rotate(${rotate})` }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ aspectRatio: ratio }}
        className="w-full object-cover contrast-[0.95] saturate-[0.4] brightness-[0.75]"
      />
      <span className="pointer-events-none absolute inset-0 bg-[oklch(0.2_0.03_60)]/25 mix-blend-multiply" />
    </figure>
  );
}


function ContactPage() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <main className="min-h-screen bg-[oklch(0.09_0.005_60)] p-3 md:p-6">
      <div className="mx-auto max-w-[1500px] border border-[oklch(0.3_0.02_70)]/70 bg-board">
        {/* HEADER */}
        <header className="relative z-40 flex items-center justify-between border-b border-[oklch(0.3_0.02_70)]/50 bg-[oklch(0.11_0.008_60)] px-6 py-3 md:px-10">
          <div>
            <div className="font-condensed text-xl font-500 tracking-[0.18em] text-[oklch(0.93_0.01_80)] md:text-2xl">
              INTEL X
            </div>
            <div className="font-condensed text-[9px] tracking-[0.32em] text-[oklch(0.62_0.02_70)] md:text-[10px]">
              UNCOVER THE NETWORK
            </div>
          </div>
          <nav className="flex items-center gap-5 font-condensed text-[11px] tracking-[0.16em] md:gap-9 md:text-xs">
            {NAV.map((item) => {
              const active = item === "CONTACT US";
              return (
                <a
                  key={item}
                  href="#"
                  className={
                    active
                      ? "border-b border-gold pb-1 text-gold"
                      : "pb-1 text-[oklch(0.82_0.01_80)] transition-colors hover:text-gold"
                  }
                >
                  {item}
                </a>
              );
            })}
          </nav>
        </header>

        {/* BOARD */}
        <div
          className="board-vignette relative w-full overflow-hidden"
          style={{
            backgroundImage: `url(${board})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            aspectRatio: "1500 / 830",
            minHeight: "560px",
          }}
        >
          {/* red strings */}
          <svg
            className="pointer-events-none absolute inset-0 z-20 h-full w-full"
            viewBox="0 0 1000 560"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <g
              stroke="oklch(0.42 0.16 27)"
              strokeWidth="1.3"
              fill="none"
              opacity="0.85"
              strokeLinecap="round"
            >
              <path d="M180 130 L330 185" />
              <path d="M330 185 L430 120" />
              <path d="M330 185 L500 165" />
              <path d="M330 185 L470 300" />
              <path d="M330 185 L190 320" />
              <path d="M330 185 L385 330" />
              <path d="M385 330 L190 320" />
              <path d="M385 330 L470 300" />
              <path d="M385 330 L255 430" />
              <path d="M255 430 L135 470" />
              <path d="M385 330 L400 445" />
            </g>
          </svg>

          {/* MAP */}
          <img
            src={mapImg}
            alt="Weathered field map pinned to the board"
            loading="lazy"
            className="paper-shadow absolute right-[0.5%] top-[6%] z-0 h-[86%] w-[18%] object-cover rotate-[4deg] opacity-90 brightness-[0.68] sepia-[0.4]"
          />

          {/* CONTACT NOTE */}
          <div className="absolute left-[5%] top-[5%] z-10 w-[21%] min-w-[210px] rotate-[-3deg] px-6 py-6">
            <span
              className="paper-aged pointer-events-none absolute inset-0 -z-10"
              style={{
                backgroundImage: `url(${paperNote})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <Pin className="left-1/2 top-[-8px] -translate-x-1/2" />

            <h1 className="font-typewriter text-2xl tracking-wide text-ink md:text-[1.9rem]">
              CONTACT US
            </h1>
            <p className="mt-4 font-typewriter text-[12px] leading-6 text-ink/85">
              Have a lead? Want to
              <br />
              collaborate?
              <br />
              We&apos;re listening.
            </p>
          </div>

          {/* PHOTOGRAPHS */}
          <Photo
            src={photo3}
            alt="Night surveillance of an airport cargo terminal"
            className="left-[27%] top-[3%] z-10 w-[14%]"
            rotate="2deg"
          />
          <Photo
            src={photo2}
            alt="Cargo aircraft parked on the tarmac"
            className="left-[29%] top-[38%] z-10 w-[13%]"
            rotate="-3deg"
          />
          <Photo
            src={photo1}
            alt="Airliner on final approach at dusk"
            className="left-[8%] top-[44%] z-10 w-[16%]"
            rotate="-2deg"
          />
          <Photo
            src={photo4}
            alt="Aerial reconnaissance shot of an airfield"
            className="left-[19%] top-[62%] z-10 w-[12%]"
            rotate="4deg"
            ratio="3 / 4"
          />
          <Photo
            src={photo3}
            alt="Evidence photograph of a hangar at night"
            className="left-[36%] top-[63%] z-10 w-[7.5%]"
            rotate="-5deg"
            ratio="3 / 5"
          />

          {/* SMALL FILED DOCUMENT */}
          <div
            className="paper-shadow absolute left-[45%] top-[68%] z-10 w-[9%] min-w-[92px] rotate-[6deg] px-3 py-3"
            style={{ backgroundImage: `url(${paper})`, backgroundSize: "cover" }}
          >
            <span className="pointer-events-none absolute inset-0 bg-[oklch(0.5_0.06_70)]/25 mix-blend-multiply" />
            <p className="font-typewriter text-[8px] leading-[1.7] tracking-wide text-ink/75">
              CASE FILE 07-B
              <br />
              MANIFEST — CARGO
              <br />
              STATUS: OPEN
              <br />
              CLEARANCE: RED
            </p>
          </div>


          {/* PINS on the string network */}
          <Pin className="left-[32.4%] top-[31.4%]" />
          <Pin className="left-[18.4%] top-[56.4%]" />
          <Pin className="left-[46.4%] top-[52.6%]" />
          <Pin className="left-[24.9%] top-[75.8%]" />
          <Pin className="left-[38%] top-[57.9%]" />


          {/* COORDINATE NOTE */}
          <div
            className="paper-shadow absolute bottom-[8%] left-[4%] z-10 w-[11%] min-w-[110px] rotate-[-4deg] px-4 py-3"
            style={{
              backgroundImage: `url(${paper})`,
              backgroundSize: "cover",
            }}
          >
            <span className="pointer-events-none absolute inset-0 bg-[oklch(0.45_0.09_75)]/20 mix-blend-multiply" />
            <p className="font-hand text-lg leading-tight text-ink">
              30.3466° N
              <br />
              76.5121° E
            </p>
          </div>

          {/* MAIN DOCUMENT */}
          <section className="absolute right-[6%] top-[4%] z-10 w-[38%] min-w-[330px] rotate-[-0.6deg] px-8 py-6">
            <span
              className="paper-aged pointer-events-none absolute inset-0 -z-10"
              style={{
                backgroundImage: `url(${paperDoc})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <Pin className="left-[6%] top-[-8px]" />
            <Pin className="right-[6%] top-[-8px]" />


            <h2 className="font-typewriter text-lg tracking-wide text-ink">
              SEND US A MESSAGE
            </h2>

            <form onSubmit={onSubmit} className="mt-4 space-y-3">
              {(["NAME", "EMAIL", "SUBJECT"] as const).map((label) => (
                <div key={label}>
                  <input
                    required
                    type={label === "EMAIL" ? "email" : "text"}
                    aria-label={label}
                    placeholder={label}
                    className="paper-field w-full px-3 py-2 font-typewriter text-[11px] tracking-wide"
                  />
                </div>
              ))}
              <textarea
                required
                rows={4}
                aria-label="MESSAGE"
                placeholder="MESSAGE"
                className="paper-field w-full resize-none px-3 py-2 font-typewriter text-[11px] tracking-wide"
              />
              <div className="flex justify-center pt-1">
                <button
                  type="submit"
                  className="bg-[oklch(0.22_0.01_60)] px-10 py-2 font-typewriter text-[11px] tracking-[0.18em] text-[oklch(0.92_0.02_85)] shadow-[0_4px_10px_rgba(0,0,0,0.5)] transition-colors hover:bg-[oklch(0.28_0.01_60)]"
                >
                  {sent ? "SENT" : "SUBMIT"}
                </button>
              </div>
            </form>

            <h3 className="mt-6 border-b border-ink/30 pb-1 font-typewriter text-base tracking-wide text-ink">
              REACH US AT
            </h3>
            <ul className="mt-3 space-y-2 font-typewriter text-[11px] leading-5 text-ink/90">
              <li className="flex items-start gap-3">
                <MailIcon />
                <a href="mailto:intelx.taskforce@gmail.com" className="hover:underline">
                  intelx.taskforce@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <PhoneIcon />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-3">
                <PinIcon />
                <span>
                  Thapar Institute of Engineering,
                  <br />
                  Patiala
                </span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}

const iconClass = "mt-[2px] h-3.5 w-3.5 shrink-0 stroke-ink";

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" className={iconClass} aria-hidden="true">
      <rect x="2.5" y="5" width="19" height="14" />
      <path d="M2.5 6l9.5 7 9.5-7" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" className={iconClass} aria-hidden="true">
      <path d="M5 3h4l2 5-2.5 1.5a12 12 0 006 6L16 13l5 2v4a2 2 0 01-2 2A16 16 0 013 5a2 2 0 012-2z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" className={iconClass} aria-hidden="true">
      <path d="M12 21s7-6.3 7-11a7 7 0 10-14 0c0 4.7 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
