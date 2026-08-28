import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback, type FormEvent } from "react";

import board from "@/assets/board.jpg";
import paper from "@/assets/paper.jpg";
import paperNote from "@/assets/paper-note.jpg";
import paperDoc from "@/assets/paper-doc.jpg";

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

/* -------------------------------------------------------------------------- */
/*                                EVIDENCE GRAPH                              */
/* -------------------------------------------------------------------------- */

interface EvidenceItem {
  id: string;
  title: string;
  type: "photo" | "document" | "map";
  classification: string;
  timestamp: string;
  description: string;
  notes: string[];
  image: string;
  ratio?: string;
  connectedPins: string[];
  connectedThreads: number[];
  connectedEvidenceIds: string[];
}

const EVIDENCE_DATA: Record<string, EvidenceItem> = {
  "photo-terminal": {
    id: "photo-terminal",
    title: "CARGO TERMINAL PERIMETER",
    type: "photo",
    classification: "TOP SECRET // SURVEILLANCE FEED",
    timestamp: "23:42 HRS — WEST APRON",
    description:
      "Night surveillance capture of the cargo terminal western gate. High-activity vehicle transfer observed under blackout conditions without flight plan clearances.",
    notes: [
      "Manifest registry bypassed at 23:38 UTC.",
      "Ground vehicle tail matches charter registry in Case File 07-B.",
      "Connection to Hangar 14 confirmed via transit logs.",
    ],
    image: photo3,
    ratio: "4 / 3",
    connectedPins: ["pin-hub"],
    connectedThreads: [1],
    connectedEvidenceIds: ["photo-cargo", "case-file", "photo-hangar"],
  },
  "photo-cargo": {
    id: "photo-cargo",
    title: "CHARTER CARGO FREIGHTER",
    type: "photo",
    classification: "CONFIDENTIAL // TAXIWAY CAPTURE",
    timestamp: "02:15 HRS — APRON SECTOR 4",
    description:
      "Unmarked twin-turboprop cargo transport aircraft parked on remote stand with transponders off-line. Unscheduled refueling operation recorded.",
    notes: [
      "Registration numbers covered with temporary matte coating.",
      "Flight path originating from northern grid coordinate corridor.",
      "Payload transferred directly toward secure hangar perimeter.",
    ],
    image: photo2,
    ratio: "4 / 3",
    connectedPins: ["pin-hub"],
    connectedThreads: [1, 2, 3, 4, 5],
    connectedEvidenceIds: ["photo-terminal", "photo-airliner", "photo-hangar", "case-file"],
  },
  "photo-airliner": {
    id: "photo-airliner",
    title: "COMMERCIAL AIRLINER DUSK APPROACH",
    type: "photo",
    classification: "RESTRICTED // RADAR CORRIDOR",
    timestamp: "18:50 HRS — RUNWAY 09L",
    description:
      "Commercial airliner on final approach at dusk along unauthorized vector. Secondary transponder frequency intercepted by task force receivers.",
    notes: [
      "Altitude divergence detected 14nm out.",
      "Radio communication frequency coincides with coord beacon 76.5121° E.",
      "Correlates with airfield satellite pass logs.",
    ],
    image: photo1,
    ratio: "4 / 3",
    connectedPins: ["pin-airliner"],
    connectedThreads: [4, 6],
    connectedEvidenceIds: ["photo-cargo", "photo-hangar", "coord-note"],
  },
  "photo-airfield": {
    id: "photo-airfield",
    title: "AUXILIARY AIRSTRIP RECONNAISSANCE",
    type: "photo",
    classification: "TOP SECRET // ORBITAL IMAGERY",
    timestamp: "06:30 HRS — SATELLITE PASS",
    description:
      "High-resolution reconnaissance photograph of auxiliary dirt airstrip. Recent grading and tire tracks indicate heavy transport landings.",
    notes: [
      "Length: 1,400 meters, suitable for tactical transport.",
      "Co-located within 4km of field coordinate waypoint 30.3466° N.",
      "Logistics cache spotted beneath camouflage netting.",
    ],
    image: photo4,
    ratio: "3 / 4",
    connectedPins: ["pin-airfield"],
    connectedThreads: [8, 9],
    connectedEvidenceIds: ["coord-note", "photo-hangar", "case-file"],
  },
  "photo-hangar": {
    id: "photo-hangar",
    title: "HANGAR 14 NIGHT RECON",
    type: "photo",
    classification: "CLEARANCE RED // DIRECT EVIDENCE",
    timestamp: "03:18 HRS — COMPOUND B",
    description:
      "Nighttime reconnaissance of maintenance hangar with reinforced security perimeter. High-voltage auxiliary generator operational during curfew.",
    notes: [
      "Suspected nerve center for cargo routing and decrypt operations.",
      "Armed security detail rotating on 40-minute intervals.",
      "All physical leads on the board converge to this sector.",
    ],
    image: photo3,
    ratio: "3 / 5",
    connectedPins: ["pin-hangar"],
    connectedThreads: [5, 6, 7, 8, 10],
    connectedEvidenceIds: ["photo-cargo", "photo-airliner", "photo-airfield", "case-file"],
  },
  "case-file": {
    id: "case-file",
    title: "CASE FILE 07-B — CARGO MANIFEST",
    type: "document",
    classification: "STATUS: OPEN // CLEARANCE: RED",
    timestamp: "DEPT OF INTEL X — CASE LOG",
    description:
      "Confidential logistics dossier documenting contraband freight transits and encrypted waypoint schedules between regional airfields.",
    notes: [
      "Manifest items: Coded cryptographic modules and relay components.",
      "Courier signatures cross-referenced with Patiala task force database.",
      "Status remains open pending verification of submitted citizen leads.",
    ],
    image: paper,
    connectedPins: ["pin-casefile"],
    connectedThreads: [3, 7],
    connectedEvidenceIds: ["photo-cargo", "photo-hangar", "main-doc"],
  },
  "coord-note": {
    id: "coord-note",
    title: "TACTICAL FIELD COORDINATE NOTE",
    type: "document",
    classification: "SECTOR GRID // WAYPOINT ALPHA",
    timestamp: "GPS BEACON FIX",
    description:
      "Handwritten field coordinates: 30.3466° N, 76.5121° E located in the Patiala sector near Thapar Institute of Engineering.",
    notes: [
      "Exact rendezvous coordinates for task force contact.",
      "Direct line of sight to regional approach corridor.",
      "Physical drop point active between 20:00 and 04:00 HRS.",
    ],
    image: paper,
    connectedPins: ["pin-airfield"],
    connectedThreads: [9],
    connectedEvidenceIds: ["photo-airfield", "main-doc"],
  },
  "contact-note": {
    id: "contact-note",
    title: "CALL FOR LEADS // TASK FORCE MEMO",
    type: "document",
    classification: "PUBLIC BULLETIN // INTEL X",
    timestamp: "DIRECTIVE 01-A",
    description:
      "Official task force memo soliciting confidential whistleblower information, citizen surveillance captures, and anomalous flight sightings.",
    notes: [
      "Secure encrypted channel available via the right document dispatch box.",
      "Whistleblowers granted automatic anonymity.",
      "All transmissions routed through encrypted server relays.",
    ],
    image: paperNote,
    connectedPins: ["pin-hub"],
    connectedThreads: [0],
    connectedEvidenceIds: ["photo-terminal", "main-doc"],
  },
  "map-evidence": {
    id: "map-evidence",
    title: "TACTICAL SECTOR MAP",
    type: "map",
    classification: "REGIONAL FLIGHT CORRIDOR",
    timestamp: "TOPOGRAPHIC AIRWAYS MAP",
    description:
      "Weathered flight chart mapping low-altitude radar shadow corridors, non-towered landing zones, and coordinate drop zones across the sector.",
    notes: [
      "Vector routes highlight active courier corridors.",
      "Red boundary markers denote restricted government airspace.",
      "Correlates with intercepted airfield frequencies.",
    ],
    image: mapImg,
    connectedPins: ["pin-hub", "pin-casefile"],
    connectedThreads: [1, 2],
    connectedEvidenceIds: ["photo-terminal", "photo-cargo", "coord-note"],
  },
  "main-doc": {
    id: "main-doc",
    title: "TASK FORCE DISPATCH & CONTACT DOSSIER",
    type: "document",
    classification: "SECURE INTAKE PORTAL",
    timestamp: "ACTIVE STATION RELAY",
    description:
      "Secure submission terminal allowing undercover operatives and confidential informants to submit leads directly to Intel X investigators.",
    notes: [
      "PGP encrypted transmission channel.",
      "Direct telephone & dispatch office in Patiala.",
      "Leads logged with unique encrypted case reference codes.",
    ],
    image: paperDoc,
    connectedPins: ["pin-hub"],
    connectedThreads: [2],
    connectedEvidenceIds: ["contact-note", "case-file", "coord-note"],
  },
};

/* -------------------------------------------------------------------------- */
/*                          DESKTOP THREAD SEGMENTS                           */
/* -------------------------------------------------------------------------- */

interface ThreadSegment {
  d: string;
  duration: number;
  delay: number;
  pulseDuration: number;
  pulseDelay: number;
  pins: [string, string];
  evidenceIds: string[];
}

const THREAD_SEGMENTS: ThreadSegment[] = [
  {
    d: "M180 130 L330 185",
    duration: 11.8,
    delay: -2.4,
    pulseDuration: 5.2,
    pulseDelay: -1.1,
    pins: ["pin-contact", "pin-hub"],
    evidenceIds: ["contact-note", "photo-terminal"],
  },
  {
    d: "M330 185 L430 120",
    duration: 9.6,
    delay: -6.1,
    pulseDuration: 4.4,
    pulseDelay: -3.2,
    pins: ["pin-hub", "pin-terminal"],
    evidenceIds: ["photo-terminal", "photo-cargo"],
  },
  {
    d: "M330 185 L500 165",
    duration: 13.5,
    delay: -4.3,
    pulseDuration: 6.0,
    pulseDelay: -4.8,
    pins: ["pin-hub", "pin-doc"],
    evidenceIds: ["photo-cargo", "main-doc"],
  },
  {
    d: "M330 185 L470 300",
    duration: 11.0,
    delay: -8.2,
    pulseDuration: 4.9,
    pulseDelay: -2.3,
    pins: ["pin-hub", "pin-casefile"],
    evidenceIds: ["photo-cargo", "case-file"],
  },
  {
    d: "M330 185 L190 320",
    duration: 14.2,
    delay: -3.9,
    pulseDuration: 6.5,
    pulseDelay: -5.5,
    pins: ["pin-hub", "pin-airliner"],
    evidenceIds: ["photo-cargo", "photo-airliner"],
  },
  {
    d: "M330 185 L385 330",
    duration: 9.2,
    delay: -0.8,
    pulseDuration: 4.2,
    pulseDelay: -0.4,
    pins: ["pin-hub", "pin-hangar"],
    evidenceIds: ["photo-cargo", "photo-hangar"],
  },
  {
    d: "M385 330 L190 320",
    duration: 15.0,
    delay: -9.5,
    pulseDuration: 6.8,
    pulseDelay: -4.1,
    pins: ["pin-hangar", "pin-airliner"],
    evidenceIds: ["photo-hangar", "photo-airliner"],
  },
  {
    d: "M385 330 L470 300",
    duration: 10.4,
    delay: -3.1,
    pulseDuration: 4.7,
    pulseDelay: -2.6,
    pins: ["pin-hangar", "pin-casefile"],
    evidenceIds: ["photo-hangar", "case-file"],
  },
  {
    d: "M385 330 L255 430",
    duration: 12.6,
    delay: -5.7,
    pulseDuration: 5.6,
    pulseDelay: -4.5,
    pins: ["pin-hangar", "pin-airfield"],
    evidenceIds: ["photo-hangar", "photo-airfield"],
  },
  {
    d: "M255 430 L135 470",
    duration: 11.4,
    delay: -2.8,
    pulseDuration: 5.1,
    pulseDelay: -1.5,
    pins: ["pin-airfield", "pin-coord"],
    evidenceIds: ["photo-airfield", "coord-note"],
  },
  {
    d: "M385 330 L400 445",
    duration: 9.8,
    delay: -7.2,
    pulseDuration: 4.5,
    pulseDelay: -3.8,
    pins: ["pin-hangar", "pin-hangar-bot"],
    evidenceIds: ["photo-hangar"],
  },
];

/* -------------------------------------------------------------------------- */
/*                           MOBILE THREAD SEGMENTS                           */
/* -------------------------------------------------------------------------- */

const MOBILE_THREAD_SEGMENTS: ThreadSegment[] = [
  {
    d: "M 25 15 Q 50 25, 75 15",
    duration: 10.5,
    delay: -2.1,
    pulseDuration: 4.8,
    pulseDelay: -1.0,
    pins: ["pin-terminal", "pin-cargo"],
    evidenceIds: ["photo-terminal", "photo-cargo"],
  },
  {
    d: "M 75 15 Q 50 30, 25 40",
    duration: 12.0,
    delay: -4.5,
    pulseDuration: 5.5,
    pulseDelay: -2.2,
    pins: ["pin-cargo", "pin-airliner"],
    evidenceIds: ["photo-cargo", "photo-airliner"],
  },
  {
    d: "M 25 40 Q 50 45, 75 40",
    duration: 9.8,
    delay: -6.0,
    pulseDuration: 4.5,
    pulseDelay: -3.0,
    pins: ["pin-airliner", "pin-airfield"],
    evidenceIds: ["photo-airliner", "photo-airfield"],
  },
  {
    d: "M 75 40 Q 50 55, 25 65",
    duration: 13.2,
    delay: -3.2,
    pulseDuration: 6.0,
    pulseDelay: -1.8,
    pins: ["pin-airfield", "pin-hangar"],
    evidenceIds: ["photo-airfield", "photo-hangar"],
  },
  {
    d: "M 25 65 Q 50 70, 75 65",
    duration: 11.0,
    delay: -1.5,
    pulseDuration: 5.0,
    pulseDelay: -0.5,
    pins: ["pin-hangar", "pin-casefile"],
    evidenceIds: ["photo-hangar", "case-file"],
  },
  {
    d: "M 75 65 Q 50 80, 25 90",
    duration: 12.5,
    delay: -5.0,
    pulseDuration: 5.6,
    pulseDelay: -2.8,
    pins: ["pin-casefile", "pin-coord"],
    evidenceIds: ["case-file", "coord-note"],
  },
  {
    d: "M 25 90 Q 50 95, 75 90",
    duration: 10.0,
    delay: -3.8,
    pulseDuration: 4.6,
    pulseDelay: -1.4,
    pins: ["pin-coord", "pin-map"],
    evidenceIds: ["coord-note", "map-evidence"],
  },
];

interface PinData {
  id: string;
  label: string;
  className: string;
  connectedThreads: number[];
  connectedEvidenceIds: string[];
}

const PIN_DATA: PinData[] = [
  {
    id: "pin-hub",
    label: "Nexus Node (Center)",
    className: "left-[32.4%] top-[31.4%]",
    connectedThreads: [0, 1, 2, 3, 4, 5],
    connectedEvidenceIds: [
      "contact-note",
      "photo-terminal",
      "photo-cargo",
      "main-doc",
      "case-file",
      "photo-airliner",
      "photo-hangar",
    ],
  },
  {
    id: "pin-airliner",
    label: "Approach Corridor Pin",
    className: "left-[18.4%] top-[56.4%]",
    connectedThreads: [4, 6],
    connectedEvidenceIds: ["photo-airliner", "photo-hangar", "photo-cargo"],
  },
  {
    id: "pin-casefile",
    label: "Manifest Clearance Pin",
    className: "left-[46.4%] top-[52.6%]",
    connectedThreads: [3, 7],
    connectedEvidenceIds: ["case-file", "photo-hangar", "photo-cargo"],
  },
  {
    id: "pin-airfield",
    label: "Recon Sector Pin",
    className: "left-[24.9%] top-[75.8%]",
    connectedThreads: [8, 9],
    connectedEvidenceIds: ["photo-airfield", "coord-note", "photo-hangar"],
  },
  {
    id: "pin-hangar",
    label: "Hangar Compound Pin",
    className: "left-[38%] top-[57.9%]",
    connectedThreads: [5, 6, 7, 8, 10],
    connectedEvidenceIds: [
      "photo-hangar",
      "photo-cargo",
      "photo-airliner",
      "photo-airfield",
      "case-file",
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*                               PIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

function Pin({
  className = "",
  isActive = false,
  isHighlighted = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  label = "Evidence Pin",
}: {
  className?: string;
  isActive?: boolean;
  isHighlighted?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label={label}
      aria-pressed={isActive}
      className={`group absolute z-30 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center cursor-pointer transition-transform duration-200 focus:outline-none focus-visible:scale-125 touch-manipulation ${className}`}
    >
      <span
        className={`block h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full transition-all duration-200 ${
          isActive
            ? "pin-active-ring scale-125 bg-[oklch(0.55_0.23_27)] shadow-[0_0_12px_rgba(255,40,40,0.8),inset_-1px_-2px_3px_rgba(0,0,0,0.6),inset_2px_2px_3px_rgba(255,255,255,0.6)]"
            : isHighlighted
              ? "scale-115 bg-[oklch(0.50_0.21_27)] shadow-[0_0_8px_rgba(220,30,30,0.6),inset_-1px_-2px_3px_rgba(0,0,0,0.55),inset_2px_2px_3px_rgba(255,255,255,0.45)]"
              : "bg-[oklch(0.45_0.19_27)] shadow-[inset_-1px_-2px_3px_rgba(0,0,0,0.55),inset_2px_2px_3px_rgba(255,255,255,0.35),0_4px_6px_rgba(0,0,0,0.7)] group-hover:scale-115 group-hover:bg-[oklch(0.49_0.20_27)]"
        }`}
      />
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*                            PHOTO EVIDENCE ITEM                             */
/* -------------------------------------------------------------------------- */

function Photo({
  evidence,
  className,
  rotate,
  ratio = "4 / 3",
  isDimmed = false,
  isHighlighted = false,
  isActive = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: {
  evidence: EvidenceItem;
  className: string;
  rotate: string;
  ratio?: string;
  isDimmed?: boolean;
  isHighlighted?: boolean;
  isActive?: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <figure
      tabIndex={0}
      role="button"
      aria-label={`Inspect evidence: ${evidence.title}`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`evidence-interactive absolute cursor-pointer bg-[oklch(0.84_0.03_85)] p-[5px] pb-[16px] sm:p-[6px] sm:pb-[18px] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${className} ${
        isDimmed
          ? "evidence-dimmed"
          : isHighlighted || isActive
            ? "evidence-highlighted"
            : "photo-shadow"
      }`}
      style={{
        transform: isActive
          ? `rotate(0deg) scale(1.06) translateY(-4px)`
          : isHighlighted
            ? `rotate(${parseFloat(rotate) * 0.4}deg) scale(1.04) translateY(-3px)`
            : `rotate(${rotate})`,
        zIndex: isActive ? 36 : isHighlighted ? 34 : 10,
      }}
    >
      <div className="relative overflow-hidden">
        <img
          src={evidence.image}
          alt={evidence.description}
          loading="lazy"
          style={{ aspectRatio: ratio }}
          className="w-full object-cover contrast-[0.95] saturate-[0.4] brightness-[0.75] transition-all duration-300 group-hover:brightness-[0.88]"
        />
        <span className="pointer-events-none absolute inset-0 bg-[oklch(0.2_0.03_60)]/25 mix-blend-multiply" />
        <div className="pointer-events-none absolute bottom-1 right-1 bg-black/75 px-1 py-0.5 font-typewriter text-[6px] sm:text-[7px] tracking-wider text-parchment opacity-80">
          [INSPECT]
        </div>
      </div>
      <figcaption className="mt-1 flex items-center justify-between px-0.5 font-typewriter text-[7px] sm:text-[8px] tracking-wider text-ink/75">
        <span className="truncate">{evidence.title.split("—")[0].trim()}</span>
        <span className="text-[6px] sm:text-[7px] text-ink/50">EXP.</span>
      </figcaption>
    </figure>
  );
}

/* -------------------------------------------------------------------------- */
/*                          EVIDENCE DOSSIER MODAL                            */
/* -------------------------------------------------------------------------- */

function EvidenceModal({
  evidence,
  onClose,
  onSelectEvidence,
}: {
  evidence: EvidenceItem;
  onClose: () => void;
  onSelectEvidence: (id: string) => void;
}) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={evidence.title}
      className="modal-backdrop-anim fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-4 md:p-8"
      onClick={onClose}
    >
      <div
        className="modal-content-anim relative max-h-[92vh] w-full max-w-3xl overflow-y-auto border border-[oklch(0.35_0.02_70)] bg-[oklch(0.12_0.01_60)] p-4 sm:p-6 md:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)]"
        style={{
          backgroundImage: `url(${board})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Paper Header Strip */}
        <div className="relative mb-4 sm:mb-6 border-b border-[oklch(0.35_0.02_70)] pb-3 sm:pb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="inline-block bg-[oklch(0.35_0.15_27)] px-2 py-0.5 font-condensed text-[9px] sm:text-[10px] tracking-[0.2em] text-white">
                {evidence.classification}
              </span>
              <h2 className="mt-1.5 font-typewriter text-lg sm:text-xl md:text-2xl font-bold tracking-wide text-[oklch(0.92_0.02_85)]">
                {evidence.title}
              </h2>
              <p className="mt-1 font-typewriter text-[10px] sm:text-xs text-[oklch(0.70_0.03_75)]">
                LOG TIMESTAMP: {evidence.timestamp}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dossier"
              className="shrink-0 border border-[oklch(0.4_0.02_70)] bg-[oklch(0.2_0.01_60)] px-2.5 py-1 sm:px-3 sm:py-1.5 font-typewriter text-[10px] sm:text-xs tracking-widest text-[oklch(0.85_0.02_85)] transition-colors hover:bg-[oklch(0.3_0.01_60)] hover:text-white"
            >
              [✕ CLOSE]
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          {/* Visual Evidence Plate */}
          <div className="relative border border-[oklch(0.4_0.02_70)]/60 bg-[oklch(0.84_0.03_85)] p-2.5 sm:p-3 shadow-2xl">
            <img
              src={evidence.image}
              alt={evidence.title}
              className="w-full object-cover contrast-[0.98] saturate-[0.7] brightness-[0.9]"
            />
            <div className="mt-2.5 flex items-center justify-between border-t border-ink/20 pt-1.5 font-typewriter text-[9px] sm:text-[10px] text-ink/80">
              <span>INTEL-X EVIDENCE LOG</span>
              <span>AUTHENTIC RECORD</span>
            </div>
          </div>

          {/* Intelligence Briefing */}
          <div className="space-y-3 sm:space-y-4 font-typewriter text-ink">
            <div
              className="paper-aged p-3.5 sm:p-4"
              style={{
                backgroundImage: `url(${paperDoc})`,
                backgroundSize: "cover",
              }}
            >
              <h3 className="border-b border-ink/30 pb-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                Intelligence Briefing
              </h3>
              <p className="mt-2 text-[11px] sm:text-xs leading-relaxed text-ink/90">
                {evidence.description}
              </p>

              <h4 className="mt-3.5 border-b border-ink/20 pb-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                Investigative Findings
              </h4>
              <ul className="mt-2 space-y-1.5 text-[10px] sm:text-[11px] leading-snug text-ink/85">
                {evidence.notes.map((note, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-[oklch(0.45_0.19_27)]">▶</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connected Clues Navigator */}
            {evidence.connectedEvidenceIds.length > 0 && (
              <div className="border border-[oklch(0.35_0.02_70)]/70 bg-[oklch(0.14_0.01_60)] p-3 text-[oklch(0.85_0.02_85)]">
                <div className="font-condensed text-[9px] sm:text-[10px] tracking-[0.2em] text-gold">
                  CONNECTED EVIDENCE IN NETWORK:
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2">
                  {evidence.connectedEvidenceIds.map((connectedId) => {
                    const item = EVIDENCE_DATA[connectedId];
                    if (!item) return null;
                    return (
                      <button
                        key={connectedId}
                        type="button"
                        onClick={() => onSelectEvidence(connectedId)}
                        className="border border-[oklch(0.45_0.08_35)] bg-[oklch(0.22_0.02_50)] px-2 py-1 font-typewriter text-[9px] sm:text-[10px] tracking-wide text-[oklch(0.90_0.02_85)] transition-colors hover:border-gold hover:bg-[oklch(0.30_0.05_40)]"
                      >
                        → {item.title.split("—")[0].trim()}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                MAIN PAGE                                   */
/* -------------------------------------------------------------------------- */

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeEvidenceId, setActiveEvidenceId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [modalEvidence, setModalEvidence] = useState<EvidenceItem | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Keyboard escape handler for selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeEvidenceId && !modalEvidence) {
        setActiveEvidenceId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeEvidenceId, modalEvidence]);

  const activeFocusId = activeEvidenceId || hoveredId;

  // Helper to determine if an evidence item or pin is highlighted
  const isItemHighlighted = useCallback(
    (id: string) => {
      if (!activeFocusId) return false;
      if (activeFocusId === id) return true;

      // If activeFocus is a pin
      const pin = PIN_DATA.find((p) => p.id === activeFocusId);
      if (pin && pin.connectedEvidenceIds.includes(id)) return true;

      // If activeFocus is an evidence item
      const ev = EVIDENCE_DATA[activeFocusId];
      if (ev && (ev.connectedEvidenceIds.includes(id) || ev.connectedPins.includes(id))) return true;

      return false;
    },
    [activeFocusId]
  );

  // Helper to determine if an item should be dimmed
  const isItemDimmed = useCallback(
    (id: string) => {
      if (!activeFocusId) return false;
      return !isItemHighlighted(id);
    },
    [activeFocusId, isItemHighlighted]
  );

  // Helper to determine if a thread is highlighted
  const isThreadHighlighted = useCallback(
    (idx: number) => {
      if (!activeFocusId) return false;
      const seg = THREAD_SEGMENTS[idx];
      if (!seg) return false;

      const pin = PIN_DATA.find((p) => p.id === activeFocusId);
      if (pin && pin.connectedThreads.includes(idx)) return true;

      const ev = EVIDENCE_DATA[activeFocusId];
      if (ev && ev.connectedThreads.includes(idx)) return true;

      return false;
    },
    [activeFocusId]
  );

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Callsign/Name required.";
    if (!formData.email.trim() || !formData.email.includes("@"))
      errors.email = "Valid email required.";
    if (!formData.message.trim()) errors.message = "Message cannot be empty.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
    }, 1200);
  };

  const handleResetForm = () => {
    setSent(false);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <main className="min-h-screen bg-[oklch(0.09_0.005_60)] p-1.5 sm:p-3 md:p-6 overflow-x-hidden">
      <div className="mx-auto max-w-[1500px] border border-[oklch(0.3_0.02_70)]/70 bg-board shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        {/* ---------------------------------------------------------------- */}
        {/* HEADER                                                           */}
        {/* ---------------------------------------------------------------- */}
        <header className="relative z-40 flex items-center justify-between border-b border-[oklch(0.3_0.02_70)]/50 bg-[oklch(0.11_0.008_60)] px-3 py-2.5 sm:px-6 md:px-10">
          <div>
            <div className="font-condensed text-lg font-500 tracking-[0.18em] text-[oklch(0.93_0.01_80)] sm:text-xl md:text-2xl">
              INTEL X
            </div>
            <div className="font-condensed text-[8px] tracking-[0.32em] text-[oklch(0.62_0.02_70)] sm:text-[9px] md:text-[10px]">
              UNCOVER THE NETWORK
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-5 font-condensed text-[11px] tracking-[0.16em] md:flex md:gap-9 md:text-xs">
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

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            className="flex h-9 w-9 items-center justify-center border border-[oklch(0.35_0.02_70)] bg-[oklch(0.15_0.01_60)] text-[oklch(0.85_0.02_85)] md:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-gold touch-manipulation"
          >
            <span className="font-typewriter text-sm font-bold">
              {mobileMenuOpen ? "✕" : "☰"}
            </span>
          </button>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="border-b border-[oklch(0.35_0.02_70)] bg-[oklch(0.12_0.01_60)] px-4 py-3 md:hidden">
            <nav className="flex flex-col space-y-2.5 font-condensed text-xs tracking-[0.2em]">
              {NAV.map((item) => {
                const active = item === "CONTACT US";
                return (
                  <a
                    key={item}
                    href="#"
                    onClick={() => setMobileMenuOpen(false)}
                    className={
                      active
                        ? "border-l-2 border-gold pl-2 text-gold font-bold"
                        : "pl-2 text-[oklch(0.80_0.01_80)] transition-colors hover:text-gold"
                    }
                  >
                    {item}
                  </a>
                );
              })}
            </nav>
          </div>
        )}

        {/* Active Investigation Status Bar */}
        {activeEvidenceId && (
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[oklch(0.35_0.02_70)] bg-[oklch(0.16_0.03_30)] px-3 py-1.5 text-xs text-[oklch(0.90_0.02_85)]">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-[oklch(0.55_0.22_27)] animate-ping" />
              <span className="font-condensed tracking-wider text-gold shrink-0">
                ACTIVE FOCUS:
              </span>
              <span className="truncate font-typewriter text-[10px] sm:text-[11px] text-[oklch(0.95_0.02_85)]">
                {EVIDENCE_DATA[activeEvidenceId]?.title ||
                  PIN_DATA.find((p) => p.id === activeEvidenceId)?.label ||
                  activeEvidenceId}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveEvidenceId(null)}
              className="shrink-0 border border-[oklch(0.4_0.02_70)] bg-[oklch(0.2_0.01_60)] px-2 py-0.5 font-typewriter text-[9px] sm:text-[10px] tracking-wider text-[oklch(0.85_0.02_85)] hover:bg-[oklch(0.3_0.01_60)]"
            >
              ✕ RESET [ESC]
            </button>
          </div>
        )}

        {/* ================================================================ */}
        {/* DESKTOP & TABLET EVIDENCE BOARD (>= 768px)                       */}
        {/* ================================================================ */}
        <div
          className="board-vignette relative hidden w-full overflow-hidden select-none md:block"
          style={{
            backgroundImage: `url(${board})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            aspectRatio: "1500 / 830",
            minHeight: "440px",
          }}
          onClick={() => {
            if (activeEvidenceId) setActiveEvidenceId(null);
          }}
        >
          {/* SVG RED STRINGS WITH REALISTIC VISCOUS BLOOD FLOW */}
          <svg
            className="pointer-events-none absolute inset-0 z-20 h-full w-full"
            viewBox="0 0 1000 560"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* 1. Base physical thread */}
            <g
              stroke="oklch(0.38 0.14 26)"
              strokeWidth="1.2"
              fill="none"
              opacity="0.82"
              strokeLinecap="round"
            >
              {THREAD_SEGMENTS.map((seg, i) => (
                <path
                  key={`base-${i}`}
                  d={seg.d}
                  className={
                    isThreadHighlighted(i)
                      ? "stroke-[oklch(0.48_0.18_27)] stroke-[1.7px]"
                      : activeFocusId
                        ? "thread-dimmed"
                        : ""
                  }
                />
              ))}
            </g>

            {/* 2. Capillary wall darkening & stain */}
            <g fill="none" style={{ mixBlendMode: "multiply" }}>
              {THREAD_SEGMENTS.map((seg, i) => (
                <path
                  key={`stain-${i}`}
                  d={seg.d}
                  pathLength={300}
                  stroke="oklch(0.16 0.08 24)"
                  strokeWidth="1.7"
                  strokeDasharray="65 35 45 155"
                  className={`blood-flow-viscous ${
                    isThreadHighlighted(i)
                      ? "thread-highlighted"
                      : activeFocusId
                        ? "thread-dimmed"
                        : ""
                  }`}
                  style={
                    {
                      opacity: isThreadHighlighted(i) ? 0.95 : 0.75,
                      "--flow-duration": isThreadHighlighted(i)
                        ? `${seg.duration * 0.75}s`
                        : `${seg.duration}s`,
                      "--flow-delay": `${seg.delay}s`,
                    } as React.CSSProperties
                  }
                />
              ))}
            </g>

            {/* 3. Dense viscous crimson blood core */}
            <g fill="none">
              {THREAD_SEGMENTS.map((seg, i) => (
                <path
                  key={`core-${i}`}
                  d={seg.d}
                  pathLength={300}
                  stroke="oklch(0.26 0.16 26)"
                  strokeWidth={isThreadHighlighted(i) ? 1.8 : 1.35}
                  strokeDasharray="50 50 30 170"
                  className={`blood-flow-density ${
                    isThreadHighlighted(i)
                      ? "thread-highlighted"
                      : activeFocusId
                        ? "thread-dimmed"
                        : ""
                  }`}
                  style={
                    {
                      "--flow-duration": isThreadHighlighted(i)
                        ? `${seg.duration * 0.75}s`
                        : `${seg.duration}s`,
                      "--flow-delay": `${seg.delay - 0.25}s`,
                      "--pulse-duration": `${seg.pulseDuration}s`,
                      "--pulse-delay": `${seg.pulseDelay}s`,
                    } as React.CSSProperties
                  }
                />
              ))}
            </g>

            {/* 4. Subtle wet specular micro-highlight */}
            <g fill="none">
              {THREAD_SEGMENTS.map((seg, i) => (
                <path
                  key={`specular-${i}`}
                  d={seg.d}
                  pathLength={300}
                  stroke="rgba(245, 200, 200, 0.45)"
                  strokeWidth="0.65"
                  strokeDasharray="22 78 12 188"
                  className={`blood-flow-specular ${
                    isThreadHighlighted(i)
                      ? "thread-highlighted"
                      : activeFocusId
                        ? "thread-dimmed"
                        : ""
                  }`}
                  style={
                    {
                      "--flow-duration": isThreadHighlighted(i)
                        ? `${seg.duration * 0.75}s`
                        : `${seg.duration}s`,
                      "--flow-delay": `${seg.delay - 0.2}s`,
                      "--pulse-duration": `${seg.pulseDuration}s`,
                      "--pulse-delay": `${seg.pulseDelay}s`,
                    } as React.CSSProperties
                  }
                />
              ))}
            </g>
          </svg>

          {/* MAP */}
          <div
            tabIndex={0}
            role="button"
            aria-label="Inspect Tactical Sector Map"
            onClick={(e) => {
              e.stopPropagation();
              setModalEvidence(EVIDENCE_DATA["map-evidence"]);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setModalEvidence(EVIDENCE_DATA["map-evidence"]);
              }
            }}
            onMouseEnter={() => setHoveredId("map-evidence")}
            onMouseLeave={() => setHoveredId(null)}
            className={`evidence-interactive absolute right-[0.5%] top-[6%] z-0 h-[86%] w-[18%] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
              isItemDimmed("map-evidence")
                ? "evidence-dimmed"
                : isItemHighlighted("map-evidence")
                  ? "evidence-highlighted"
                  : ""
            }`}
          >
            <img
              src={mapImg}
              alt="Weathered field map pinned to the board"
              loading="lazy"
              className="paper-shadow h-full w-full object-cover rotate-[4deg] opacity-90 brightness-[0.68] sepia-[0.4] transition-all duration-300 hover:brightness-[0.82]"
            />
          </div>

          {/* CONTACT NOTE */}
          <div
            tabIndex={0}
            role="button"
            aria-label="Read Contact Memo Note"
            onClick={(e) => {
              e.stopPropagation();
              setActiveEvidenceId(activeEvidenceId === "contact-note" ? null : "contact-note");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setActiveEvidenceId(activeEvidenceId === "contact-note" ? null : "contact-note");
              }
            }}
            onMouseEnter={() => setHoveredId("contact-note")}
            onMouseLeave={() => setHoveredId(null)}
            className={`evidence-interactive absolute left-[5%] top-[5%] z-10 w-[21%] min-w-[170px] lg:min-w-[210px] rotate-[-3deg] cursor-pointer p-4 lg:p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
              isItemDimmed("contact-note")
                ? "evidence-dimmed"
                : isItemHighlighted("contact-note") || activeEvidenceId === "contact-note"
                  ? "evidence-highlighted"
                  : ""
            }`}
          >
            <span
              className="paper-aged pointer-events-none absolute inset-0 -z-10"
              style={{
                backgroundImage: `url(${paperNote})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <Pin
              className="left-1/2 top-[-8px]"
              label="Contact Note Pin"
              isHighlighted={isItemHighlighted("contact-note")}
              isActive={activeEvidenceId === "contact-note"}
              onClick={() =>
                setActiveEvidenceId(activeEvidenceId === "contact-note" ? null : "contact-note")
              }
            />

            <h1 className="font-typewriter text-xl lg:text-2xl tracking-wide text-ink md:text-[1.7rem] lg:text-[1.9rem]">
              CONTACT US
            </h1>
            <p className="mt-2 lg:mt-4 font-typewriter text-[11px] lg:text-[12px] leading-5 lg:leading-6 text-ink/85">
              Have a lead? Want to
              <br />
              collaborate?
              <br />
              We&apos;re listening.
            </p>
          </div>

          {/* PHOTOGRAPHS */}
          <Photo
            evidence={EVIDENCE_DATA["photo-terminal"]}
            className="left-[27%] top-[3%] w-[14%]"
            rotate="2deg"
            isDimmed={isItemDimmed("photo-terminal")}
            isHighlighted={isItemHighlighted("photo-terminal")}
            isActive={activeEvidenceId === "photo-terminal"}
            onClick={() => setModalEvidence(EVIDENCE_DATA["photo-terminal"])}
            onMouseEnter={() => setHoveredId("photo-terminal")}
            onMouseLeave={() => setHoveredId(null)}
          />

          <Photo
            evidence={EVIDENCE_DATA["photo-cargo"]}
            className="left-[29%] top-[38%] w-[13%]"
            rotate="-3deg"
            isDimmed={isItemDimmed("photo-cargo")}
            isHighlighted={isItemHighlighted("photo-cargo")}
            isActive={activeEvidenceId === "photo-cargo"}
            onClick={() => setModalEvidence(EVIDENCE_DATA["photo-cargo"])}
            onMouseEnter={() => setHoveredId("photo-cargo")}
            onMouseLeave={() => setHoveredId(null)}
          />

          <Photo
            evidence={EVIDENCE_DATA["photo-airliner"]}
            className="left-[8%] top-[44%] w-[16%]"
            rotate="-2deg"
            isDimmed={isItemDimmed("photo-airliner")}
            isHighlighted={isItemHighlighted("photo-airliner")}
            isActive={activeEvidenceId === "photo-airliner"}
            onClick={() => setModalEvidence(EVIDENCE_DATA["photo-airliner"])}
            onMouseEnter={() => setHoveredId("photo-airliner")}
            onMouseLeave={() => setHoveredId(null)}
          />

          <Photo
            evidence={EVIDENCE_DATA["photo-airfield"]}
            className="left-[19%] top-[62%] w-[12%]"
            rotate="4deg"
            ratio="3 / 4"
            isDimmed={isItemDimmed("photo-airfield")}
            isHighlighted={isItemHighlighted("photo-airfield")}
            isActive={activeEvidenceId === "photo-airfield"}
            onClick={() => setModalEvidence(EVIDENCE_DATA["photo-airfield"])}
            onMouseEnter={() => setHoveredId("photo-airfield")}
            onMouseLeave={() => setHoveredId(null)}
          />

          <Photo
            evidence={EVIDENCE_DATA["photo-hangar"]}
            className="left-[36%] top-[63%] w-[7.5%]"
            rotate="-5deg"
            ratio="3 / 5"
            isDimmed={isItemDimmed("photo-hangar")}
            isHighlighted={isItemHighlighted("photo-hangar")}
            isActive={activeEvidenceId === "photo-hangar"}
            onClick={() => setModalEvidence(EVIDENCE_DATA["photo-hangar"])}
            onMouseEnter={() => setHoveredId("photo-hangar")}
            onMouseLeave={() => setHoveredId(null)}
          />

          {/* SMALL FILED DOCUMENT: CASE FILE 07-B */}
          <div
            tabIndex={0}
            role="button"
            aria-label="Inspect Case File 07-B Manifest Document"
            onClick={(e) => {
              e.stopPropagation();
              setModalEvidence(EVIDENCE_DATA["case-file"]);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setModalEvidence(EVIDENCE_DATA["case-file"]);
              }
            }}
            onMouseEnter={() => setHoveredId("case-file")}
            onMouseLeave={() => setHoveredId(null)}
            className={`evidence-interactive paper-shadow absolute left-[45%] top-[68%] z-10 w-[9%] min-w-[85px] lg:min-w-[92px] rotate-[6deg] cursor-pointer p-2 lg:px-3 lg:py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
              isItemDimmed("case-file")
                ? "evidence-dimmed"
                : isItemHighlighted("case-file") || activeEvidenceId === "case-file"
                  ? "evidence-highlighted"
                  : ""
            }`}
            style={{ backgroundImage: `url(${paper})`, backgroundSize: "cover" }}
          >
            <span className="pointer-events-none absolute inset-0 bg-[oklch(0.5_0.06_70)]/25 mix-blend-multiply" />
            <p className="font-typewriter text-[7px] lg:text-[8px] leading-[1.6] tracking-wide text-ink/75">
              CASE FILE 07-B
              <br />
              MANIFEST — CARGO
              <br />
              STATUS: OPEN
              <br />
              CLEARANCE: RED
            </p>
          </div>

          {/* PINS ON THE STRING NETWORK */}
          {PIN_DATA.map((pin) => (
            <Pin
              key={pin.id}
              className={pin.className}
              label={pin.label}
              isActive={activeEvidenceId === pin.id}
              isHighlighted={isItemHighlighted(pin.id)}
              onClick={() => {
                setActiveEvidenceId(activeEvidenceId === pin.id ? null : pin.id);
              }}
              onMouseEnter={() => setHoveredId(pin.id)}
              onMouseLeave={() => setHoveredId(null)}
            />
          ))}

          {/* COORDINATE NOTE */}
          <div
            tabIndex={0}
            role="button"
            aria-label="Inspect Coordinate Note"
            onClick={(e) => {
              e.stopPropagation();
              setModalEvidence(EVIDENCE_DATA["coord-note"]);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setModalEvidence(EVIDENCE_DATA["coord-note"]);
              }
            }}
            onMouseEnter={() => setHoveredId("coord-note")}
            onMouseLeave={() => setHoveredId(null)}
            className={`evidence-interactive paper-shadow absolute bottom-[8%] left-[4%] z-10 w-[11%] min-w-[95px] lg:min-w-[110px] rotate-[-4deg] cursor-pointer p-3 lg:px-4 lg:py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
              isItemDimmed("coord-note")
                ? "evidence-dimmed"
                : isItemHighlighted("coord-note") || activeEvidenceId === "coord-note"
                  ? "evidence-highlighted"
                  : ""
            }`}
            style={{
              backgroundImage: `url(${paper})`,
              backgroundSize: "cover",
            }}
          >
            <span className="pointer-events-none absolute inset-0 bg-[oklch(0.45_0.09_75)]/20 mix-blend-multiply" />
            <p className="font-hand text-base lg:text-lg leading-tight text-ink">
              30.3466° N
              <br />
              76.5121° E
            </p>
          </div>

          {/* MAIN DOCUMENT: CONTACT FORM */}
          <section
            className={`evidence-interactive absolute right-[6%] top-[4%] z-10 w-[38%] min-w-[260px] lg:min-w-[330px] rotate-[-0.6deg] p-5 lg:px-8 lg:py-6 ${
              isItemDimmed("main-doc") ? "evidence-dimmed" : "evidence-highlighted"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <span
              className="paper-aged pointer-events-none absolute inset-0 -z-10"
              style={{
                backgroundImage: `url(${paperDoc})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <Pin className="left-[6%] top-[-8px]" label="Top Left Document Pin" />
            <Pin className="right-[6%] top-[-8px]" label="Top Right Document Pin" />

            <h2 className="font-typewriter text-base lg:text-lg tracking-wide text-ink">
              SEND US A MESSAGE
            </h2>

            {sent ? (
              <div className="mt-3 lg:mt-4 border border-ink/30 bg-ink/5 p-3 lg:p-4 font-typewriter text-ink">
                <div className="flex items-center gap-2 text-xs font-bold text-[oklch(0.42_0.16_27)]">
                  <span>✔</span>
                  <span>TRANSMISSION DISPATCHED</span>
                </div>
                <p className="mt-2 text-[10px] lg:text-[11px] leading-5 text-ink/85">
                  Your lead has been encrypted and logged under reference <strong>#IX-8492</strong>.
                  Our task force is cross-referencing your report.
                </p>
                <div className="mt-3 lg:mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="border border-ink/40 bg-[oklch(0.22_0.01_60)] px-5 py-1.5 font-typewriter text-[10px] tracking-widest text-[oklch(0.92_0.02_85)] hover:bg-[oklch(0.28_0.01_60)]"
                  >
                    SEND ANOTHER REPORT
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="mt-3 lg:mt-4 space-y-2.5 lg:space-y-3">
                {(["name", "email", "subject"] as const).map((field) => {
                  const label = field.toUpperCase();
                  const err = formErrors[field];
                  return (
                    <div key={field}>
                      <input
                        type={field === "email" ? "email" : "text"}
                        aria-label={label}
                        placeholder={label}
                        value={formData[field]}
                        onChange={(e) => {
                          setFormData({ ...formData, [field]: e.target.value });
                          if (formErrors[field]) {
                            const updated = { ...formErrors };
                            delete updated[field];
                            setFormErrors(updated);
                          }
                        }}
                        className={`paper-field w-full px-2.5 py-1.5 lg:px-3 lg:py-2 font-typewriter text-[10px] lg:text-[11px] tracking-wide transition-all ${
                          err ? "border-red-600 bg-red-950/10" : ""
                        }`}
                      />
                      {err && (
                        <p className="mt-0.5 font-typewriter text-[8px] lg:text-[9px] text-red-800">
                          {err}
                        </p>
                      )}
                    </div>
                  );
                })}
                <div>
                  <textarea
                    rows={3}
                    aria-label="MESSAGE"
                    placeholder="MESSAGE"
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      if (formErrors.message) {
                        const updated = { ...formErrors };
                        delete updated.message;
                        setFormErrors(updated);
                      }
                    }}
                    className={`paper-field w-full resize-none px-2.5 py-1.5 lg:px-3 lg:py-2 font-typewriter text-[10px] lg:text-[11px] tracking-wide transition-all ${
                      formErrors.message ? "border-red-600 bg-red-950/10" : ""
                    }`}
                  />
                  {formErrors.message && (
                    <p className="mt-0.5 font-typewriter text-[8px] lg:text-[9px] text-red-800">
                      {formErrors.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-center pt-1">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 bg-[oklch(0.22_0.01_60)] px-8 py-1.5 lg:px-10 lg:py-2 font-typewriter text-[10px] lg:text-[11px] tracking-[0.18em] text-[oklch(0.92_0.02_85)] shadow-[0_4px_10px_rgba(0,0,0,0.5)] transition-all hover:bg-[oklch(0.28_0.01_60)] active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <span className="inline-block h-2 w-2 rounded-full bg-gold animate-ping" />
                        <span>ENCRYPTING...</span>
                      </>
                    ) : (
                      "SUBMIT"
                    )}
                  </button>
                </div>
              </form>
            )}

            <h3 className="mt-4 lg:mt-6 border-b border-ink/30 pb-1 font-typewriter text-sm lg:text-base tracking-wide text-ink">
              REACH US AT
            </h3>
            <ul className="mt-2.5 lg:mt-3 space-y-1.5 lg:space-y-2 font-typewriter text-[10px] lg:text-[11px] leading-5 text-ink/90">
              <li className="flex items-start gap-2 lg:gap-3">
                <MailIcon />
                <a href="mailto:intelx.taskforce@gmail.com" className="hover:underline">
                  intelx.taskforce@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2 lg:gap-3">
                <PhoneIcon />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-2 lg:gap-3">
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

        {/* ================================================================ */}
        {/* MOBILE DEDICATED EVIDENCE BOARD (< 768px)                        */}
        {/* ================================================================ */}
        <div
          className="board-vignette relative block w-full select-none p-3 sm:p-4 md:hidden"
          style={{
            backgroundImage: `url(${board})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Top Memo Note */}
          <div
            tabIndex={0}
            role="button"
            aria-label="Read Contact Memo Note"
            onClick={() =>
              setActiveEvidenceId(activeEvidenceId === "contact-note" ? null : "contact-note")
            }
            className={`evidence-interactive relative mx-auto mb-4 w-full max-w-sm rotate-[-1.5deg] cursor-pointer p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
              isItemDimmed("contact-note")
                ? "evidence-dimmed"
                : isItemHighlighted("contact-note")
                  ? "evidence-highlighted"
                  : ""
            }`}
          >
            <span
              className="paper-aged pointer-events-none absolute inset-0 -z-10"
              style={{
                backgroundImage: `url(${paperNote})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <Pin
              className="left-1/2 top-[-6px]"
              label="Contact Memo Pin"
              isHighlighted={isItemHighlighted("contact-note")}
              isActive={activeEvidenceId === "contact-note"}
            />

            <h1 className="font-typewriter text-xl font-bold tracking-wide text-ink">
              CONTACT US
            </h1>
            <p className="mt-2 font-typewriter text-xs leading-5 text-ink/85">
              Have a lead? Want to collaborate?
              <br />
              We&apos;re listening.
            </p>
          </div>

          {/* Section Divider & Thread Overlay Container */}
          <div className="relative mb-5">
            {/* SVG Connecting Flow Lines Across Mobile Grid */}
            <svg
              className="pointer-events-none absolute inset-0 z-20 h-full w-full opacity-70"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {MOBILE_THREAD_SEGMENTS.map((seg, i) => (
                <g key={`mob-seg-${i}`}>
                  <path
                    d={seg.d}
                    stroke="oklch(0.38 0.14 26)"
                    strokeWidth="1.2"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d={seg.d}
                    pathLength={300}
                    stroke="oklch(0.16 0.08 24)"
                    strokeWidth="1.7"
                    strokeDasharray="65 35 45 155"
                    className="blood-flow-viscous"
                    fill="none"
                    style={
                      {
                        opacity: 0.75,
                        "--flow-duration": `${seg.duration}s`,
                        "--flow-delay": `${seg.delay}s`,
                      } as React.CSSProperties
                    }
                  />
                  <path
                    d={seg.d}
                    pathLength={300}
                    stroke="oklch(0.26 0.16 26)"
                    strokeWidth="1.35"
                    strokeDasharray="50 50 30 170"
                    className="blood-flow-density"
                    fill="none"
                    style={
                      {
                        "--flow-duration": `${seg.duration}s`,
                        "--flow-delay": `${seg.delay - 0.25}s`,
                        "--pulse-duration": `${seg.pulseDuration}s`,
                        "--pulse-delay": `${seg.pulseDelay}s`,
                      } as React.CSSProperties
                    }
                  />
                </g>
              ))}
            </svg>

            {/* Mobile Evidence Collage Grid (2 Columns, organic rotation, full touchability) */}
            <div className="relative z-10 grid grid-cols-2 gap-3.5 sm:gap-4">
              {/* Evidence 1: Terminal */}
              <div
                tabIndex={0}
                role="button"
                aria-label="Inspect Cargo Terminal Perimeter"
                onClick={() => setModalEvidence(EVIDENCE_DATA["photo-terminal"])}
                className={`evidence-interactive photo-shadow relative cursor-pointer bg-[oklch(0.84_0.03_85)] p-1.5 pb-3.5 rotate-[-2deg] transition-all ${
                  isItemDimmed("photo-terminal")
                    ? "evidence-dimmed"
                    : isItemHighlighted("photo-terminal")
                      ? "evidence-highlighted scale-105"
                      : ""
                }`}
              >
                <Pin className="left-1/2 top-[-6px]" label="Terminal Photo Pin" />
                <img
                  src={photo3}
                  alt="Night surveillance of cargo terminal"
                  className="aspect-[4/3] w-full object-cover contrast-[0.95] saturate-[0.4] brightness-[0.75]"
                />
                <div className="mt-1 flex items-center justify-between px-0.5 font-typewriter text-[7px] text-ink/80">
                  <span className="truncate">CARGO TERMINAL</span>
                  <span>[INSPECT]</span>
                </div>
              </div>

              {/* Evidence 2: Cargo Aircraft */}
              <div
                tabIndex={0}
                role="button"
                aria-label="Inspect Charter Cargo Freighter"
                onClick={() => setModalEvidence(EVIDENCE_DATA["photo-cargo"])}
                className={`evidence-interactive photo-shadow relative cursor-pointer bg-[oklch(0.84_0.03_85)] p-1.5 pb-3.5 rotate-[2.5deg] transition-all ${
                  isItemDimmed("photo-cargo")
                    ? "evidence-dimmed"
                    : isItemHighlighted("photo-cargo")
                      ? "evidence-highlighted scale-105"
                      : ""
                }`}
              >
                <Pin className="left-1/2 top-[-6px]" label="Cargo Aircraft Pin" />
                <img
                  src={photo2}
                  alt="Cargo aircraft on tarmac"
                  className="aspect-[4/3] w-full object-cover contrast-[0.95] saturate-[0.4] brightness-[0.75]"
                />
                <div className="mt-1 flex items-center justify-between px-0.5 font-typewriter text-[7px] text-ink/80">
                  <span className="truncate">CARGO AIRCRAFT</span>
                  <span>[INSPECT]</span>
                </div>
              </div>

              {/* Evidence 3: Airliner */}
              <div
                tabIndex={0}
                role="button"
                aria-label="Inspect Commercial Airliner Approach"
                onClick={() => setModalEvidence(EVIDENCE_DATA["photo-airliner"])}
                className={`evidence-interactive photo-shadow relative cursor-pointer bg-[oklch(0.84_0.03_85)] p-1.5 pb-3.5 rotate-[-1.5deg] transition-all ${
                  isItemDimmed("photo-airliner")
                    ? "evidence-dimmed"
                    : isItemHighlighted("photo-airliner")
                      ? "evidence-highlighted scale-105"
                      : ""
                }`}
              >
                <Pin className="left-1/2 top-[-6px]" label="Airliner Approach Pin" />
                <img
                  src={photo1}
                  alt="Airliner on final approach"
                  className="aspect-[4/3] w-full object-cover contrast-[0.95] saturate-[0.4] brightness-[0.75]"
                />
                <div className="mt-1 flex items-center justify-between px-0.5 font-typewriter text-[7px] text-ink/80">
                  <span className="truncate">AIRLINER DUSK</span>
                  <span>[INSPECT]</span>
                </div>
              </div>

              {/* Evidence 4: Airfield */}
              <div
                tabIndex={0}
                role="button"
                aria-label="Inspect Auxiliary Airstrip Recon"
                onClick={() => setModalEvidence(EVIDENCE_DATA["photo-airfield"])}
                className={`evidence-interactive photo-shadow relative cursor-pointer bg-[oklch(0.84_0.03_85)] p-1.5 pb-3.5 rotate-[3deg] transition-all ${
                  isItemDimmed("photo-airfield")
                    ? "evidence-dimmed"
                    : isItemHighlighted("photo-airfield")
                      ? "evidence-highlighted scale-105"
                      : ""
                }`}
              >
                <Pin className="left-1/2 top-[-6px]" label="Auxiliary Airfield Pin" />
                <img
                  src={photo4}
                  alt="Aerial reconnaissance shot of airfield"
                  className="aspect-[3/4] w-full object-cover contrast-[0.95] saturate-[0.4] brightness-[0.75]"
                />
                <div className="mt-1 flex items-center justify-between px-0.5 font-typewriter text-[7px] text-ink/80">
                  <span className="truncate">AIRFIELD RECON</span>
                  <span>[INSPECT]</span>
                </div>
              </div>

              {/* Evidence 5: Hangar */}
              <div
                tabIndex={0}
                role="button"
                aria-label="Inspect Hangar 14 Night Recon"
                onClick={() => setModalEvidence(EVIDENCE_DATA["photo-hangar"])}
                className={`evidence-interactive photo-shadow relative cursor-pointer bg-[oklch(0.84_0.03_85)] p-1.5 pb-3.5 rotate-[-3deg] transition-all ${
                  isItemDimmed("photo-hangar")
                    ? "evidence-dimmed"
                    : isItemHighlighted("photo-hangar")
                      ? "evidence-highlighted scale-105"
                      : ""
                }`}
              >
                <Pin className="left-1/2 top-[-6px]" label="Hangar Pin" />
                <img
                  src={photo3}
                  alt="Evidence photograph of hangar at night"
                  className="aspect-[3/5] w-full object-cover contrast-[0.95] saturate-[0.4] brightness-[0.75]"
                />
                <div className="mt-1 flex items-center justify-between px-0.5 font-typewriter text-[7px] text-ink/80">
                  <span className="truncate">HANGAR 14</span>
                  <span>[INSPECT]</span>
                </div>
              </div>

              {/* Document 6: Case File 07-B */}
              <div
                tabIndex={0}
                role="button"
                aria-label="Inspect Case File 07-B Document"
                onClick={() => setModalEvidence(EVIDENCE_DATA["case-file"])}
                className={`evidence-interactive paper-shadow relative flex flex-col justify-between cursor-pointer rotate-[2deg] p-3 transition-all ${
                  isItemDimmed("case-file")
                    ? "evidence-dimmed"
                    : isItemHighlighted("case-file")
                      ? "evidence-highlighted scale-105"
                      : ""
                }`}
                style={{ backgroundImage: `url(${paper})`, backgroundSize: "cover" }}
              >
                <Pin className="left-1/2 top-[-6px]" label="Case File Pin" />
                <span className="pointer-events-none absolute inset-0 bg-[oklch(0.5_0.06_70)]/25 mix-blend-multiply" />
                <p className="relative z-10 font-typewriter text-[8px] sm:text-[9px] leading-relaxed text-ink/85">
                  <strong>CASE FILE 07-B</strong>
                  <br />
                  MANIFEST: CARGO
                  <br />
                  CLEARANCE: RED
                  <br />
                  STATUS: OPEN
                </p>
                <span className="relative z-10 mt-2 block font-typewriter text-[7px] text-gold underline">
                  Inspect File →
                </span>
              </div>

              {/* Document 7: Coordinate Note */}
              <div
                tabIndex={0}
                role="button"
                aria-label="Inspect Coordinate Note"
                onClick={() => setModalEvidence(EVIDENCE_DATA["coord-note"])}
                className={`evidence-interactive paper-shadow relative cursor-pointer rotate-[-2deg] p-3 transition-all ${
                  isItemDimmed("coord-note")
                    ? "evidence-dimmed"
                    : isItemHighlighted("coord-note")
                      ? "evidence-highlighted scale-105"
                      : ""
                }`}
                style={{ backgroundImage: `url(${paper})`, backgroundSize: "cover" }}
              >
                <Pin className="left-1/2 top-[-6px]" label="Coordinate Note Pin" />
                <span className="pointer-events-none absolute inset-0 bg-[oklch(0.45_0.09_75)]/20 mix-blend-multiply" />
                <p className="relative z-10 font-hand text-base sm:text-lg leading-tight text-ink">
                  30.3466° N
                  <br />
                  76.5121° E
                </p>
                <span className="relative z-10 mt-1 block font-typewriter text-[7px] text-ink/60">
                  Patiala Sector
                </span>
              </div>

              {/* Map Card 8 */}
              <div
                tabIndex={0}
                role="button"
                aria-label="Inspect Tactical Sector Map"
                onClick={() => setModalEvidence(EVIDENCE_DATA["map-evidence"])}
                className={`evidence-interactive paper-shadow relative cursor-pointer rotate-[1.5deg] overflow-hidden p-1.5 transition-all ${
                  isItemDimmed("map-evidence")
                    ? "evidence-dimmed"
                    : isItemHighlighted("map-evidence")
                      ? "evidence-highlighted scale-105"
                      : ""
                }`}
                style={{ backgroundImage: `url(${paper})`, backgroundSize: "cover" }}
              >
                <Pin className="left-1/2 top-[-6px]" label="Sector Map Pin" />
                <img
                  src={mapImg}
                  alt="Tactical sector map"
                  className="aspect-[4/3] w-full object-cover opacity-90 brightness-[0.75] sepia-[0.3]"
                />
                <div className="mt-1 flex items-center justify-between px-0.5 font-typewriter text-[7px] text-ink/80">
                  <span className="truncate">SECTOR MAP</span>
                  <span>[INSPECT]</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Dispatch Document (Contact Form on Mobile) */}
          <section
            className="evidence-interactive paper-shadow relative mx-auto mt-6 w-full max-w-sm rotate-[-0.6deg] p-5 sm:p-6 text-ink"
            onClick={(e) => e.stopPropagation()}
          >
            <span
              className="paper-aged pointer-events-none absolute inset-0 -z-10"
              style={{
                backgroundImage: `url(${paperDoc})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <Pin className="left-[6%] top-[-8px]" label="Top Left Form Pin" />
            <Pin className="right-[6%] top-[-8px]" label="Top Right Form Pin" />

            <h2 className="font-typewriter text-base sm:text-lg tracking-wide text-ink">
              SEND US A MESSAGE
            </h2>

            {sent ? (
              <div className="mt-3 border border-ink/30 bg-ink/5 p-3.5 font-typewriter text-ink">
                <div className="flex items-center gap-2 text-xs font-bold text-[oklch(0.42_0.16_27)]">
                  <span>✔</span>
                  <span>TRANSMISSION DISPATCHED</span>
                </div>
                <p className="mt-2 text-[11px] leading-5 text-ink/85">
                  Your lead has been encrypted and logged under reference <strong>#IX-8492</strong>.
                  Our task force is cross-referencing your report.
                </p>
                <div className="mt-3 flex justify-center">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="border border-ink/40 bg-[oklch(0.22_0.01_60)] px-5 py-1.5 font-typewriter text-[10px] tracking-widest text-[oklch(0.92_0.02_85)] hover:bg-[oklch(0.28_0.01_60)]"
                  >
                    SEND ANOTHER REPORT
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="mt-3.5 space-y-2.5">
                {(["name", "email", "subject"] as const).map((field) => {
                  const label = field.toUpperCase();
                  const err = formErrors[field];
                  return (
                    <div key={field}>
                      <input
                        type={field === "email" ? "email" : "text"}
                        aria-label={label}
                        placeholder={label}
                        value={formData[field]}
                        onChange={(e) => {
                          setFormData({ ...formData, [field]: e.target.value });
                          if (formErrors[field]) {
                            const updated = { ...formErrors };
                            delete updated[field];
                            setFormErrors(updated);
                          }
                        }}
                        className={`paper-field w-full px-3 py-2 font-typewriter text-[11px] tracking-wide transition-all ${
                          err ? "border-red-600 bg-red-950/10" : ""
                        }`}
                      />
                      {err && (
                        <p className="mt-0.5 font-typewriter text-[8px] sm:text-[9px] text-red-800">
                          {err}
                        </p>
                      )}
                    </div>
                  );
                })}
                <div>
                  <textarea
                    rows={3}
                    aria-label="MESSAGE"
                    placeholder="MESSAGE"
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      if (formErrors.message) {
                        const updated = { ...formErrors };
                        delete updated.message;
                        setFormErrors(updated);
                      }
                    }}
                    className={`paper-field w-full resize-none px-3 py-2 font-typewriter text-[11px] tracking-wide transition-all ${
                      formErrors.message ? "border-red-600 bg-red-950/10" : ""
                    }`}
                  />
                  {formErrors.message && (
                    <p className="mt-0.5 font-typewriter text-[8px] sm:text-[9px] text-red-800">
                      {formErrors.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-center pt-1">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center justify-center gap-2 bg-[oklch(0.22_0.01_60)] w-full py-2.5 font-typewriter text-[11px] tracking-[0.18em] text-[oklch(0.92_0.02_85)] shadow-[0_4px_10px_rgba(0,0,0,0.5)] transition-all hover:bg-[oklch(0.28_0.01_60)] active:scale-[0.98] disabled:opacity-60 cursor-pointer touch-manipulation"
                  >
                    {submitting ? (
                      <>
                        <span className="inline-block h-2 w-2 rounded-full bg-gold animate-ping" />
                        <span>ENCRYPTING...</span>
                      </>
                    ) : (
                      "SUBMIT"
                    )}
                  </button>
                </div>
              </form>
            )}

            <h3 className="mt-5 border-b border-ink/30 pb-1 font-typewriter text-sm tracking-wide text-ink">
              REACH US AT
            </h3>
            <ul className="mt-2.5 space-y-1.5 font-typewriter text-[11px] leading-5 text-ink/90">
              <li className="flex items-start gap-2.5">
                <MailIcon />
                <a href="mailto:intelx.taskforce@gmail.com" className="hover:underline">
                  intelx.taskforce@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <PhoneIcon />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-2.5">
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

      {/* EVIDENCE DETAIL MODAL */}
      {modalEvidence && (
        <EvidenceModal
          evidence={modalEvidence}
          onClose={() => setModalEvidence(null)}
          onSelectEvidence={(id) => {
            const ev = EVIDENCE_DATA[id];
            if (ev) setModalEvidence(ev);
          }}
        />
      )}
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   ICONS                                    */
/* -------------------------------------------------------------------------- */

const iconClass = "mt-[2px] h-3.5 w-3.5 shrink-0 stroke-ink";

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.6"
      className={iconClass}
      aria-hidden="true"
    >
      <rect x="2.5" y="5" width="19" height="14" />
      <path d="M2.5 6l9.5 7 9.5-7" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.6"
      className={iconClass}
      aria-hidden="true"
    >
      <path d="M5 3h4l2 5-2.5 1.5a12 12 0 006 6L16 13l5 2v4a2 2 0 01-2 2A16 16 0 013 5a2 2 0 012-2z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.6"
      className={iconClass}
      aria-hidden="true"
    >
      <path d="M12 21s7-6.3 7-11a7 7 0 10-14 0c0 4.7 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}


