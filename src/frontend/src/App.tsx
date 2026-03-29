import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Calendar,
  Check,
  Clock,
  Download,
  MapPin,
  Menu,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { SiInstagram } from "react-icons/si";
import { useActor } from "./hooks/useActor";
import { useGetAllOpenRSVPs, useSubmitOpenRSVP } from "./hooks/useQueries";

const queryClient = new QueryClient();

// ─── Decorative SVG Components ───────────────────────────────────────────────

function PaisleySVG({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M60 10 C80 10, 100 30, 95 55 C90 80, 70 95, 55 90 C40 85, 25 70, 30 50 C35 30, 50 15, 60 10Z"
        fill="oklch(0 0 0 / 0.08)"
      />
      <path
        d="M60 20 C75 20, 90 35, 86 55 C82 75, 65 88, 52 84 C39 80, 28 67, 32 50 C36 33, 50 22, 60 20Z"
        stroke="oklch(0 0 0 / 0.25)"
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="60" cy="45" r="8" fill="oklch(0 0 0 / 0.12)" />
      <circle cx="60" cy="45" r="4" fill="oklch(0 0 0 / 0.20)" />
      <path
        d="M55 72 Q60 85, 65 72"
        stroke="oklch(0 0 0 / 0.25)"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="48" cy="58" r="2" fill="oklch(0 0 0 / 0.18)" />
      <circle cx="72" cy="58" r="2" fill="oklch(0 0 0 / 0.18)" />
      <circle cx="54" cy="32" r="1.5" fill="oklch(0 0 0 / 0.22)" />
    </svg>
  );
}

function MandalaSVG({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        cx="100"
        cy="100"
        r="90"
        stroke="oklch(0 0 0 / 0.15)"
        strokeWidth="1"
      />
      <circle
        cx="100"
        cy="100"
        r="70"
        stroke="oklch(0 0 0 / 0.12)"
        strokeWidth="1"
      />
      <circle
        cx="100"
        cy="100"
        r="50"
        stroke="oklch(0 0 0 / 0.15)"
        strokeWidth="1.5"
      />
      <circle
        cx="100"
        cy="100"
        r="30"
        stroke="oklch(0 0 0 / 0.20)"
        strokeWidth="1.5"
      />
      <circle cx="100" cy="100" r="12" fill="oklch(0 0 0 / 0.10)" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 100 + 30 * Math.cos(rad);
        const y1 = 100 + 30 * Math.sin(rad);
        const x2 = 100 + 88 * Math.cos(rad);
        const y2 = 100 + 88 * Math.sin(rad);
        const mx = 100 + 60 * Math.cos(rad);
        const my = 100 + 60 * Math.sin(rad);
        return (
          <g key={angle}>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="oklch(0 0 0 / 0.12)"
              strokeWidth="1"
            />
            <circle cx={mx} cy={my} r="4" fill="oklch(0 0 0 / 0.15)" />
          </g>
        );
      })}
      {[
        0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270,
        292.5, 315, 337.5,
      ].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x = 100 + 70 * Math.cos(rad);
        const y = 100 + 70 * Math.sin(rad);
        return (
          <circle
            key={`dot-${angle}`}
            cx={x}
            cy={y}
            r="2"
            fill="oklch(0 0 0 / 0.18)"
          />
        );
      })}
    </svg>
  );
}

function BlackDivider() {
  return (
    <div className="flex items-center gap-3 my-6 justify-center">
      <div
        className="h-px flex-1 max-w-16"
        style={{
          background:
            "linear-gradient(to right, transparent, oklch(0 0 0 / 0.4))",
        }}
      />
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12 2 L14 9 L21 9 L15.5 14 L17.5 21 L12 17 L6.5 21 L8.5 14 L3 9 L10 9 Z"
          fill="oklch(0 0 0)"
        />
      </svg>
      <div
        className="h-px flex-1 max-w-16"
        style={{
          background:
            "linear-gradient(to left, transparent, oklch(0 0 0 / 0.4))",
        }}
      />
    </div>
  );
}

function OrnateCornerBorder({
  children,
  className = "",
}: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg
        className="absolute top-0 left-0"
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M2 38 L2 2 L38 2"
          stroke="oklch(0 0 0)"
          strokeWidth="2"
          fill="none"
        />
        <circle cx="2" cy="2" r="3" fill="oklch(0 0 0)" />
      </svg>
      <svg
        className="absolute top-0 right-0"
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M38 38 L38 2 L2 2"
          stroke="oklch(0 0 0)"
          strokeWidth="2"
          fill="none"
        />
        <circle cx="38" cy="2" r="3" fill="oklch(0 0 0)" />
      </svg>
      <svg
        className="absolute bottom-0 left-0"
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M2 2 L2 38 L38 38"
          stroke="oklch(0 0 0)"
          strokeWidth="2"
          fill="none"
        />
        <circle cx="2" cy="38" r="3" fill="oklch(0 0 0)" />
      </svg>
      <svg
        className="absolute bottom-0 right-0"
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M38 2 L38 38 L2 38"
          stroke="oklch(0 0 0)"
          strokeWidth="2"
          fill="none"
        />
        <circle cx="38" cy="38" r="3" fill="oklch(0 0 0)" />
      </svg>
      {children}
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "What is SOF", href: "#about" },
  { label: "Theme", href: "#theme" },
  { label: "Event Details", href: "#details" },
  { label: "Schedule", href: "#schedule" },
  { label: "RSVP", href: "#rsvp" },
];

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = useCallback((href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: "#ffffff",
        borderBottom: "1.5px solid oklch(0 0 0)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          onClick={() => handleNavClick("#home")}
          className="font-display font-bold text-lg leading-none"
          style={{
            color: "oklch(0 0 0)",
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
          data-ocid="nav.link"
        >
          <span style={{ color: "oklch(0 0 0)" }}>SOF</span> <span>2026</span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
              className="text-sm font-medium transition-opacity hover:opacity-60"
              style={{ color: "oklch(0 0 0)" }}
              data-ocid="nav.link"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://www.instagram.com/_stateoffashion_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full transition-opacity hover:opacity-60"
            style={{ color: "oklch(0 0 0)" }}
            aria-label="Instagram"
            data-ocid="nav.link"
          >
            <SiInstagram size={18} />
          </a>
          <button
            type="button"
            onClick={() => handleNavClick("#rsvp")}
            className="px-4 py-2 rounded-full text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ backgroundColor: "oklch(0 0 0)", color: "#ffffff" }}
            data-ocid="rsvp.primary_button"
          >
            RSVP Now
          </button>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden p-2"
          style={{ color: "oklch(0 0 0)" }}
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
          data-ocid="nav.toggle"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="md:hidden px-4 pb-4 flex flex-col gap-3"
          style={{
            backgroundColor: "#ffffff",
            borderTop: "1px solid oklch(0 0 0 / 0.15)",
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
              className="text-sm font-medium py-1"
              style={{ color: "oklch(0 0 0)" }}
              data-ocid="nav.link"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://www.instagram.com/_stateoffashion_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm py-1"
            style={{ color: "oklch(0 0 0)" }}
            data-ocid="nav.link"
          >
            <SiInstagram size={16} /> Instagram
          </a>
        </div>
      )}
    </header>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

function HeroSection() {
  const handleRSVP = useCallback(() => {
    document.querySelector("#rsvp")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <section
      id="home"
      className="w-full"
      style={{
        paddingTop: "64px",
      }}
    >
      {/* Banner image */}
      <div className="w-full sm:h-[calc(100svh-64px)]">
        <img
          src="/assets/uploads/2-019d24a1-7483-7332-8e61-a339de638d1c-1.jpg"
          alt="State of Fashion 2026 — SOF is Back"
          className="block w-full h-auto sm:h-full sm:object-contain"
        />
      </div>
      {/* RSVP button — below hero image */}
      <div className="flex items-center justify-center py-6 px-4">
        <button
          type="button"
          onClick={handleRSVP}
          className="px-8 sm:px-10 py-3 sm:py-4 rounded-full font-display font-bold text-sm sm:text-base tracking-widest uppercase transition-all hover:scale-105 shadow-lg"
          style={{
            backgroundColor: "oklch(0 0 0)",
            color: "#ffffff",
            letterSpacing: "0.15em",
          }}
          data-ocid="hero.primary_button"
        >
          RSVP Now
        </button>
      </div>
    </section>
  );
}

// ─── What is SOF Section ──────────────────────────────────────────────────────

function WhatIsSOFSection() {
  return (
    <section
      id="about"
      className="relative py-16 sm:py-24 overflow-hidden"
      style={{ backgroundColor: "oklch(0.96 0 0)" }}
    >
      {/* Side curtain decors */}
      <div
        className="absolute top-0 left-0 w-16 sm:w-24 h-full pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, oklch(0 0 0 / 0.08), transparent)",
        }}
        aria-hidden="true"
      >
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full"
          style={{ backgroundColor: "oklch(0 0 0 / 0.3)" }}
        />
        <div
          className="absolute top-1/3 left-1/2 mt-3 -translate-x-1/2 w-1.5 h-16"
          style={{ backgroundColor: "oklch(0 0 0 / 0.15)" }}
        />
      </div>
      <div
        className="absolute top-0 right-0 w-16 sm:w-24 h-full pointer-events-none"
        style={{
          background:
            "linear-gradient(to left, oklch(0 0 0 / 0.08), transparent)",
        }}
        aria-hidden="true"
      >
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full"
          style={{ backgroundColor: "oklch(0 0 0 / 0.3)" }}
        />
        <div
          className="absolute top-1/3 left-1/2 mt-3 -translate-x-1/2 w-1.5 h-16"
          style={{ backgroundColor: "oklch(0 0 0 / 0.15)" }}
        />
      </div>

      {/* Reduced horizontal padding on mobile: px-4 instead of px-8 */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-12">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left: heading + divider */}
          <div className="flex flex-col items-start">
            <div className="flex justify-start mb-4">
              <PaisleySVG className="w-16 h-16 opacity-50" />
            </div>
            <h2
              className="font-display text-4xl sm:text-5xl font-bold mb-4"
              style={{ color: "oklch(0 0 0)" }}
            >
              What is <span style={{ color: "#a855f7" }}>SOF</span>?
            </h2>
            <BlackDivider />
          </div>

          {/* Right: paragraph text */}
          <div>
            <p
              className="font-body text-base sm:text-lg leading-relaxed"
              style={{ color: "oklch(0.20 0 0)" }}
            >
              State of Fashion (SOF) is a student-led fashion event organised by
              the students of FAD International, Mumbai, created to spotlight
              the coolest brands on the block! It was born from a deep love for
              creativity and the belief that fashion should be accessible,
              expressive and unapologetically diverse.
            </p>
            <p
              className="font-body text-base sm:text-lg leading-relaxed mt-4"
              style={{ color: "oklch(0.20 0 0)" }}
            >
              This year, we go a step further. SOF celebrates the rise of
              customisation, the emergence of India on global fashion platforms
              and the fearless fusion of heritage with modernity.
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <MandalaSVG className="w-24 h-24 opacity-20" />
        </div>
      </div>
    </section>
  );
}

// ─── Theme Curtain Reveal ─────────────────────────────────────────────────────

const VELVET_LEFT = `linear-gradient(
  to right,
  #3d0000 0%,
  #6b0000 4%,
  #8b0000 8%,
  #c0392b 14%,
  #e04040 19%,
  #c0392b 24%,
  #8b1a1a 30%,
  #6b0000 36%,
  #4a0000 40%,
  #6b0000 44%,
  #8b0000 48%,
  #c0392b 54%,
  #e04040 59%,
  #c0392b 64%,
  #8b1a1a 70%,
  #6b0000 76%,
  #4a0000 80%,
  #6b0000 84%,
  #9b2020 90%,
  #c0392b 94%,
  #8b0000 100%
)`;

const VELVET_RIGHT = `linear-gradient(
  to left,
  #3d0000 0%,
  #6b0000 4%,
  #8b0000 8%,
  #c0392b 14%,
  #e04040 19%,
  #c0392b 24%,
  #8b1a1a 30%,
  #6b0000 36%,
  #4a0000 40%,
  #6b0000 44%,
  #8b0000 48%,
  #c0392b 54%,
  #e04040 59%,
  #c0392b 64%,
  #8b1a1a 70%,
  #6b0000 76%,
  #4a0000 80%,
  #6b0000 84%,
  #9b2020 90%,
  #c0392b 94%,
  #8b0000 100%
)`;

function ThemeRevealSection() {
  const [phase, setPhase] = useState<"idle" | "drawing" | "open">("idle");

  const handleClick = () => {
    if (phase !== "idle") return;
    setPhase("drawing");
    setTimeout(() => setPhase("open"), 1300);
  };

  return (
    <section
      id="theme"
      className="relative py-16 sm:py-20 overflow-hidden"
      style={{ backgroundColor: "#ffffff" }}
    >
      <MandalaSVG className="absolute top-4 right-4 w-32 h-32 opacity-10 pointer-events-none" />
      <MandalaSVG className="absolute bottom-4 left-4 w-32 h-32 opacity-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2
          className="font-display text-3xl sm:text-4xl font-bold mb-3"
          style={{ color: "oklch(0 0 0)" }}
        >
          2026 Theme
        </h2>
        <BlackDivider />
        <p
          className="font-body text-sm mb-8 sm:mb-10 mt-2"
          style={{ color: "oklch(0 0 0 / 0.5)" }}
        >
          Something special awaits...
        </p>

        {/* Curtain stage — responsive height */}
        <button
          type="button"
          className="relative mx-auto overflow-hidden block w-full"
          onClick={handleClick}
          aria-label="Draw mudra to open curtains"
          data-ocid="theme.open_modal_button"
          style={{
            maxWidth: 720,
            /* On mobile ~56vw tall, on desktop fixed 420px min */
            minHeight: "clamp(240px, 56vw, 420px)",
            backgroundColor: "#0d0000",
            border: "3px solid #3d1a00",
            borderRadius: "4px",
            boxShadow:
              "0 24px 80px rgba(0,0,0,0.45), inset 0 0 60px rgba(0,0,0,0.3)",
            cursor: phase === "idle" ? "pointer" : "default",
            padding: 0,
          }}
        >
          {/* Revealed content — image filling the stage completely */}
          <div className="absolute inset-0">
            <img
              src="/assets/uploads/1-019d1c4e-7a2e-749e-abeb-6adb7645be03-1.jpg"
              alt="State of Fashion 2026 Theme"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
              }}
            />
          </div>

          {/* Valance / pelmet bar at top */}
          <div
            className="absolute top-0 left-0 right-0"
            style={{
              height: 28,
              background:
                "linear-gradient(to bottom, #1a0800, #3d1a00 60%, #6b3000)",
              zIndex: 30,
              boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
            }}
            aria-hidden="true"
          />

          {/* Left curtain panel */}
          <div
            className="absolute top-0 left-0 w-1/2 h-full"
            style={{
              transformOrigin: "left center",
              transform:
                phase === "open" ? "translateX(-100%)" : "translateX(0)",
              transition:
                phase === "open"
                  ? "transform 0.9s cubic-bezier(0.4, 0, 0.2, 1)"
                  : "none",
              zIndex: 10,
              background: VELVET_LEFT,
              boxShadow:
                phase === "open"
                  ? "none"
                  : "6px 0 32px rgba(0,0,0,0.6), inset -4px 0 16px rgba(0,0,0,0.4)",
            }}
            aria-hidden="true"
          />

          {/* Right curtain panel */}
          <div
            className="absolute top-0 right-0 w-1/2 h-full"
            style={{
              transformOrigin: "right center",
              transform:
                phase === "open" ? "translateX(100%)" : "translateX(0)",
              transition:
                phase === "open"
                  ? "transform 0.9s cubic-bezier(0.4, 0, 0.2, 1)"
                  : "none",
              zIndex: 10,
              background: VELVET_RIGHT,
              boxShadow:
                phase === "open"
                  ? "none"
                  : "-6px 0 32px rgba(0,0,0,0.6), inset 4px 0 16px rgba(0,0,0,0.4)",
            }}
            aria-hidden="true"
          />

          {/* Mudra drawing overlay — centered on curtain seam, responsive size */}
          <div
            className="absolute"
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 20,
              pointerEvents: "none",
              opacity: phase === "open" ? 0 : phase === "drawing" ? 1 : 0,
              transition: phase === "open" ? "opacity 0.5s ease" : "none",
              /* Mudra visible on idle too so user knows to click */
            }}
            aria-hidden="true"
          >
            <img
              src="/assets/uploads/mudra-019d1c49-97a0-771e-abbe-ac051bb3b1d0-1.png"
              alt=""
              style={{
                /* Responsive: 60vw on mobile, capped at 280px on desktop */
                width: "min(60vw, 280px)",
                height: "auto",
                display: "block",
                clipPath:
                  phase === "drawing" ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
                transition:
                  phase === "drawing" ? "clip-path 1.2s ease-in-out" : "none",
              }}
            />
          </div>
        </button>

        {/* Hint text */}
        <p
          className="font-body text-xs mt-4"
          style={{
            color: "oklch(0 0 0 / 0.4)",
            opacity: phase === "idle" ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        >
          Click to draw
        </p>
      </div>
    </section>
  );
}

// ─── Event Details Section ────────────────────────────────────────────────────

function EventDetailsSection() {
  return (
    <section
      id="details"
      className="relative py-16 sm:py-24 overflow-hidden"
      style={{ backgroundColor: "oklch(0.96 0 0)" }}
    >
      <PaisleySVG className="absolute top-6 right-8 w-28 h-28 opacity-15 pointer-events-none" />
      <PaisleySVG className="absolute bottom-6 left-8 w-28 h-28 opacity-15 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2
          className="font-display text-4xl sm:text-5xl font-bold mb-4"
          style={{ color: "oklch(0 0 0)" }}
        >
          Event Details
        </h2>
        <BlackDivider />

        <div className="mt-10 sm:mt-12 grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {/* Date card — reduced padding on mobile */}
          <OrnateCornerBorder className="p-4 sm:p-8">
            <div
              className="rounded-xl p-5 sm:p-6 text-center"
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid oklch(0 0 0 / 0.12)",
              }}
            >
              <Calendar
                className="mx-auto mb-4"
                style={{ color: "#22c55e" }}
                size={40}
              />
              <p
                className="font-body text-xs font-semibold tracking-[0.2em] uppercase mb-1"
                style={{ color: "oklch(0 0 0 / 0.5)" }}
              >
                Mark Your Calendar
              </p>
              <h3
                className="font-display text-2xl font-bold"
                style={{ color: "oklch(0 0 0)" }}
              >
                25th April, 2026
              </h3>
              <p
                className="font-body text-sm mt-2"
                style={{ color: "oklch(0.35 0 0)" }}
              >
                Saturday
              </p>
            </div>
          </OrnateCornerBorder>

          {/* Venue card — reduced padding on mobile */}
          <OrnateCornerBorder className="p-4 sm:p-8">
            <div
              className="rounded-xl p-5 sm:p-6 text-center"
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid oklch(0 0 0 / 0.12)",
              }}
            >
              <MapPin
                className="mx-auto mb-4"
                style={{ color: "#eab308" }}
                size={40}
              />
              <p
                className="font-body text-xs font-semibold tracking-[0.2em] uppercase mb-1"
                style={{ color: "oklch(0 0 0 / 0.5)" }}
              >
                Venue
              </p>
              <h3
                className="font-display text-2xl font-bold"
                style={{ color: "oklch(0 0 0)" }}
              >
                FAD International
              </h3>
              <p
                className="font-body text-sm mt-2"
                style={{ color: "oklch(0.35 0 0)" }}
              >
                Pali Hill, Bandra, Mumbai
              </p>
            </div>
          </OrnateCornerBorder>
          {/* Time card */}
          <OrnateCornerBorder className="p-4 sm:p-8">
            <div
              className="rounded-xl p-5 sm:p-6 text-center"
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid oklch(0 0 0 / 0.12)",
              }}
            >
              <Clock
                className="mx-auto mb-4"
                style={{ color: "#a855f7" }}
                size={40}
              />
              <p
                className="font-body text-xs font-semibold tracking-[0.2em] uppercase mb-1"
                style={{ color: "oklch(0 0 0 / 0.5)" }}
              >
                Time
              </p>
              <h3
                className="font-display text-lg font-bold"
                style={{ color: "oklch(0 0 0)" }}
              >
                2–7 PM
              </h3>
              <p
                className="font-body text-sm mt-1"
                style={{ color: "oklch(0.35 0 0)" }}
              >
                SOF Event
              </p>
              <p
                className="font-body text-sm mt-2 pt-2 border-t"
                style={{
                  color: "oklch(0.35 0 0)",
                  borderColor: "oklch(0 0 0 / 0.1)",
                }}
              >
                8–10 PM – Live DJ
              </p>
            </div>
          </OrnateCornerBorder>
        </div>
      </div>
    </section>
  );
}

// ─── Schedule Section ─────────────────────────────────────────────────────────

function ScheduleSection() {
  return (
    <section
      id="schedule"
      className="relative py-16 sm:py-24 overflow-hidden"
      style={{ backgroundColor: "#ffffff" }}
    >
      <MandalaSVG className="absolute top-8 right-8 w-32 h-32 opacity-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center">
          <h2
            className="font-display text-4xl sm:text-5xl font-bold mb-4"
            style={{ color: "oklch(0 0 0)" }}
          >
            Schedule
          </h2>
          <BlackDivider />
          <p
            className="font-body text-sm mt-2 mb-10 sm:mb-12"
            style={{ color: "oklch(0 0 0 / 0.5)" }}
          >
            25th April, 2026 · FAD International, Bandra
          </p>
        </div>

        {/* Two stamp boxes — stacks on mobile, side-by-side on sm+ */}
        <div className="grid sm:grid-cols-2 gap-8 sm:gap-10">
          {/* Box 1 */}
          <div
            className="flex flex-col items-center gap-4 sm:gap-5"
            data-ocid="schedule.item.1"
          >
            <div className="w-full max-w-xs sm:max-w-none mx-auto">
              <img
                src="/assets/uploads/screenshot_2026-03-24_at_01.16.14-019d1c46-169a-72e5-8c77-8761019f9065-1.png"
                alt="The Hottest Fashion Event"
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </div>
            <p
              className="font-display text-center text-base sm:text-lg font-bold"
              style={{ color: "oklch(0 0 0)" }}
            >
              The Hottest Fashion Event Live from 2-7PM
            </p>
          </div>

          {/* Box 2 */}
          <div
            className="flex flex-col items-center gap-4 sm:gap-5"
            data-ocid="schedule.item.2"
          >
            <div className="w-full max-w-xs sm:max-w-none mx-auto">
              <img
                src="/assets/uploads/screenshot_2026-03-24_at_01.16.24-019d1c46-16d3-76dc-92ee-654977523600-2.png"
                alt="Mirchi Madness AfterParty"
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </div>
            <p
              className="font-display text-center text-base sm:text-lg font-bold"
              style={{ color: "oklch(0 0 0)" }}
            >
              Mirchi Madness : The AfterParty from 8-10PM
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── RSVP Section ─────────────────────────────────────────────────────────────

function RSVPSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const tripleClickCount = useRef(0);
  const tripleClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const submitOpenRSVPMutation = useSubmitOpenRSVP();
  const { actor, isFetching: isActorLoading } = useActor();
  const {
    data: rsvpEntries = [],
    refetch: refetchRSVPs,
    isLoading: isRSVPLoading,
    error: rsvpError,
  } = useGetAllOpenRSVPs();

  useEffect(() => {
    if (showAdmin) {
      refetchRSVPs();
    }
  }, [showAdmin, refetchRSVPs]);

  const handleLimitedSeatsClick = () => {
    tripleClickCount.current += 1;
    if (tripleClickCount.current >= 3) {
      tripleClickCount.current = 0;
      setShowAdmin((prev) => {
        if (!prev) {
          setTimeout(() => refetchRSVPs(), 0);
        }
        return !prev;
      });
      if (tripleClickTimer.current) clearTimeout(tripleClickTimer.current);
      return;
    }
    if (tripleClickTimer.current) clearTimeout(tripleClickTimer.current);
    tripleClickTimer.current = setTimeout(() => {
      tripleClickCount.current = 0;
    }, 600);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    try {
      await submitOpenRSVPMutation.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });
      setSubmitted(true);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setSubmitError(message);
    }
  };

  const handleExportCSV = async () => {
    const result = await refetchRSVPs();
    const entries = result.data ?? rsvpEntries;
    const header = "Name,Email,Phone,Timestamp";
    const rows = entries.map(
      (r) =>
        `"${r.name.replace(/"/g, '""')}","${r.email.replace(/"/g, '""')}","${r.phone.replace(/"/g, '""')}","${new Date(Number(r.timestamp / 1000000n)).toISOString()}"`,
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sof2026_rsvp.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const entryCount = rsvpEntries.length;

  const inputStyle = {
    width: "100%",
    backgroundColor: "#ffffff",
    border: "1.5px solid oklch(0 0 0)",
    borderRadius: "6px",
    padding: "12px 14px",
    fontSize: "15px",
    fontFamily: "inherit",
    outline: "none",
    color: "oklch(0 0 0)",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "11px",
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
    color: "oklch(0 0 0 / 0.6)",
    marginBottom: "6px",
    fontFamily: "inherit",
  };

  return (
    <section
      id="rsvp"
      className="relative py-16 sm:py-24 overflow-hidden"
      style={{ backgroundColor: "oklch(0.96 0 0)" }}
    >
      {/* Dot grid overlay */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, oklch(0 0 0) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />

      <PaisleySVG className="absolute top-8 left-8 w-20 h-20 opacity-20 pointer-events-none" />
      <PaisleySVG className="absolute bottom-8 right-8 w-24 h-24 opacity-15 pointer-events-none" />

      <div className="relative z-10 max-w-lg mx-auto px-4 text-center">
        <h2
          className="font-display text-4xl sm:text-5xl font-bold mb-2"
          style={{ color: "oklch(0 0 0)" }}
        >
          Secure Your Spot
        </h2>

        {/* Triple-click to reveal admin panel */}
        <button
          type="button"
          onClick={handleLimitedSeatsClick}
          className="font-display text-sm mb-3 bg-transparent border-none cursor-pointer p-0"
          style={{ color: "oklch(0.5 0 0)" }}
          data-ocid="rsvp.toggle"
        >
          Limited seats
        </button>

        {/* Hidden admin panel */}
        {showAdmin && (
          <div
            className="mb-4 rounded-lg p-4 text-left"
            style={{
              border: "1.5px solid oklch(0 0 0)",
              backgroundColor: "#fff",
            }}
            data-ocid="rsvp.panel"
          >
            <div className="flex items-center justify-between mb-3">
              <p
                className="font-display text-sm"
                style={{ color: "oklch(0 0 0)" }}
              >
                {isRSVPLoading
                  ? "Loading..."
                  : `${entryCount} response${entryCount !== 1 ? "s" : ""} registered`}
              </p>
              <button
                type="button"
                onClick={() => refetchRSVPs()}
                className="text-xs px-3 py-1 rounded-full font-display tracking-widest uppercase transition-opacity hover:opacity-70 border"
                style={{
                  borderColor: "oklch(0 0 0)",
                  color: "oklch(0 0 0)",
                  backgroundColor: "transparent",
                }}
                data-ocid="rsvp.secondary_button"
              >
                Refresh
              </button>
            </div>
            {rsvpError && (
              <p
                className="text-xs mb-3"
                style={{ color: "oklch(0.5 0.2 27)" }}
                data-ocid="rsvp.error_state"
              >
                Error loading data:{" "}
                {rsvpError instanceof Error
                  ? rsvpError.message
                  : "Unknown error"}
              </p>
            )}
            {isRSVPLoading ? (
              <p
                className="text-xs mb-3"
                style={{ color: "oklch(0.5 0 0)" }}
                data-ocid="rsvp.loading_state"
              >
                Fetching submissions from backend...
              </p>
            ) : rsvpEntries.length === 0 ? (
              <p
                className="text-xs mb-3"
                style={{ color: "oklch(0.5 0 0)" }}
                data-ocid="rsvp.empty_state"
              >
                No submissions yet.
              </p>
            ) : (
              <div
                className="mb-3 rounded border overflow-y-auto"
                style={{ maxHeight: 300, borderColor: "oklch(0 0 0 / 0.15)" }}
                data-ocid="rsvp.list"
              >
                {rsvpEntries.map((r, i) => (
                  <div
                    key={`${r.email}-${i}`}
                    className="px-3 py-2 text-xs border-b last:border-b-0"
                    style={{
                      borderColor: "oklch(0 0 0 / 0.08)",
                      color: "oklch(0.15 0 0)",
                    }}
                    data-ocid={`rsvp.item.${i + 1}`}
                  >
                    <span className="font-semibold">{r.name}</span>
                    <span className="mx-2" style={{ color: "oklch(0.5 0 0)" }}>
                      ·
                    </span>
                    <span>{r.email}</span>
                    <span className="mx-2" style={{ color: "oklch(0.5 0 0)" }}>
                      ·
                    </span>
                    <span>{r.phone}</span>
                    <span
                      className="ml-2 block mt-0.5"
                      style={{ color: "oklch(0.6 0 0)", fontSize: "10px" }}
                    >
                      {new Date(
                        Number(r.timestamp / 1000000n),
                      ).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-display tracking-widest uppercase transition-opacity hover:opacity-80"
              style={{ backgroundColor: "oklch(0 0 0)", color: "#fff" }}
              data-ocid="rsvp.secondary_button"
            >
              <Download size={14} />
              Export CSV
            </button>
          </div>
        )}

        <p
          className="font-body text-base mb-6"
          style={{ color: "oklch(0.25 0 0)" }}
        >
          Join us for a day filled with fashion, fun and culture!
        </p>
        <BlackDivider />

        <div className="mt-8" data-ocid="rsvp.panel">
          {submitted ? (
            /* ── Success state ── */
            <div
              className="rounded-2xl p-8 sm:p-10 text-center"
              style={{
                backgroundColor: "#ffffff",
                border: "1.5px solid oklch(0 0 0)",
              }}
              data-ocid="rsvp.success_state"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ backgroundColor: "oklch(0 0 0)" }}
              >
                <Check size={28} color="#ffffff" strokeWidth={2.5} />
              </div>
              <h3
                className="font-display text-xl sm:text-2xl font-bold mb-2"
                style={{ color: "oklch(0 0 0)" }}
              >
                Interest Registered!
              </h3>
              <p
                className="font-body text-base"
                style={{ color: "oklch(0.25 0 0)" }}
              >
                Thanks {name.split(" ")[0]}, we'll be in touch. See you on April
                25th!
              </p>
            </div>
          ) : (
            /* ── Form ── */
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl p-6 sm:p-8 text-left"
              style={{
                backgroundColor: "#ffffff",
                border: "1.5px solid oklch(0 0 0)",
              }}
            >
              {/* Name */}
              <div className="mb-5">
                <label htmlFor="rsvp-name" style={labelStyle}>
                  Name
                </label>
                <input
                  id="rsvp-name"
                  type="text"
                  required
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={inputStyle}
                  data-ocid="rsvp.input"
                />
              </div>

              {/* Email */}
              <div className="mb-5">
                <label htmlFor="rsvp-email" style={labelStyle}>
                  Email
                </label>
                <input
                  id="rsvp-email"
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                  data-ocid="rsvp.input"
                />
              </div>

              {/* Phone */}
              <div className="mb-7">
                <label htmlFor="rsvp-phone" style={labelStyle}>
                  Phone Number
                </label>
                <input
                  id="rsvp-phone"
                  type="tel"
                  required
                  placeholder="+91 XXXXX XXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={inputStyle}
                  data-ocid="rsvp.input"
                />
              </div>

              <button
                type="submit"
                disabled={
                  isActorLoading || submitOpenRSVPMutation.isPending || !actor
                }
                className="w-full py-3 rounded-full font-display font-bold text-sm tracking-widest uppercase transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "oklch(0 0 0)", color: "#ffffff" }}
                data-ocid="rsvp.submit_button"
              >
                {isActorLoading
                  ? "Connecting..."
                  : submitOpenRSVPMutation.isPending
                    ? "Registering..."
                    : "Register Your Interest"}
              </button>
              {submitError && (
                <p
                  className="mt-3 text-sm text-center"
                  style={{ color: "oklch(0.5 0.2 27)" }}
                >
                  {submitError}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "",
  );

  return (
    <footer
      className="relative overflow-hidden"
      style={{ backgroundColor: "oklch(0 0 0)" }}
    >
      {/* Top border pattern */}
      <div
        className="h-4 w-full"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, oklch(1 0 0 / 0) 0px, oklch(1 0 0 / 0) 10px, oklch(1 0 0 / 0.4) 10px, oklch(1 0 0 / 0.4) 12px)",
        }}
      />

      <div className="max-w-4xl mx-auto px-4 py-10 text-center">
        <MandalaSVG className="w-16 h-16 mx-auto mb-4 opacity-20 invert" />

        <h3
          className="font-display text-2xl sm:text-3xl font-bold mb-2"
          style={{ color: "#ffffff" }}
        >
          State of Fashion 2026
        </h3>
        <p
          className="font-body text-sm mb-6"
          style={{ color: "oklch(1 0 0 / 0.7)" }}
        >
          Let SOF cook, we've got extra masala this year 🌶️
        </p>

        <div className="flex items-center justify-center gap-4 mb-8">
          <a
            href="https://www.instagram.com/_stateoffashion_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-body font-medium px-4 py-2 rounded-full transition-opacity hover:opacity-80"
            style={{ border: "1px solid oklch(1 0 0 / 0.4)", color: "#ffffff" }}
            data-ocid="footer.link"
          >
            <SiInstagram size={16} />
            @_stateoffashion_
          </a>
        </div>

        <div
          className="h-px w-48 mx-auto mb-6"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(1 0 0 / 0.3), transparent)",
          }}
        />

        <p
          className="font-body text-xs"
          style={{ color: "oklch(1 0 0 / 0.45)" }}
        >
          © {year}. Built with <span style={{ color: "#ffffff" }}>♥</span> using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
            style={{ color: "oklch(1 0 0 / 0.7)" }}
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────

function AppContent() {
  return (
    <div className="min-h-screen overflow-x-hidden w-full">
      <Navbar />
      <main className="w-full overflow-x-hidden">
        <HeroSection />
        <WhatIsSOFSection />
        <ThemeRevealSection />
        <EventDetailsSection />
        <ScheduleSection />
        <RSVPSection />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
