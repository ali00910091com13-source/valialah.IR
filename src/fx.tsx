import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { faNum } from "./data";

export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

/* ─────────────── scroll reveal ─────────────── */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li" | "span";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();
  const [inView, setInView] = useState(reduced);

  useEffect(() => {
    if (reduced) {
      setInView(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${inView ? "in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

/* ─────────────── count-up ─────────────── */
export function CountUp({ to, duration = 1400 }: { to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const [val, setVal] = useState(reduced ? to : 0);
  const started = useRef(false);

  useEffect(() => {
    if (reduced) {
      setVal(to);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            const t0 = performance.now();
            const tick = (t: number) => {
              const p = Math.min(1, (t - t0) / duration);
              const eased = 1 - Math.pow(1 - p, 3);
              setVal(Math.round(eased * to));
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration, reduced]);

  return <span ref={ref}>{faNum(val)}</span>;
}

/* ─────────────── ECG heartbeat line ─────────────── */
export function EcgLine({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  const d =
    "M0 30 H70 l10-14 10 28 8-20 6 6 H150 l10-14 10 28 8-20 6 6 H240 l10-14 10 28 8-20 6 6 H340 l10-14 10 28 8-20 6 6 H440 l10-14 10 28 8-20 6 6 H600";
  return (
    <svg viewBox="0 0 600 60" preserveAspectRatio="none" className={className} aria-hidden="true">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25" />
      {!reduced && (
        <path
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          className="ecg-path"
        />
      )}
    </svg>
  );
}

/* ─────────────── rotating stamp ─────────────── */
export function Stamp({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  return (
    <svg viewBox="0 0 120 120" className={`${reduced ? "" : "stamp-spin"} ${className}`} aria-hidden="true">
      <defs>
        <path id="stampcircle" d="M60 12a48 48 0 1 1 0 96 48 48 0 1 1 0-96" fill="none" />
      </defs>
      <circle cx="60" cy="60" r="57" fill="var(--color-pine)" />
      <circle cx="60" cy="60" r="53" fill="none" stroke="var(--color-gold)" strokeWidth="1.4" strokeDasharray="3 4" />
      <circle cx="60" cy="60" r="34" fill="none" stroke="var(--color-gold)" strokeWidth="1" opacity="0.55" />
      <text fill="var(--color-goldsoft)" fontSize="10.6" fontWeight="700" letterSpacing="2.6">
        <textPath href="#stampcircle">
          آوای مهر ولی‌الله • ۲۷ سال خدمت • صدای سلامت •
        </textPath>
      </text>
      <path
        d="M60 76c-8.6-7-13.4-11.4-13.4-17 0-3.7 2.8-6.4 6.2-6.4 2.6 0 5 1.5 6.2 3.8.2.4.8.4 1 0 1.2-2.3 3.6-3.8 6.2-3.8 3.4 0 6.2 2.7 6.2 6.4 0 5.6-4.8 10-13.4 17z"
        fill="var(--color-gold)"
      />
    </svg>
  );
}

/* ─────────────── hand-drawn squiggle ─────────────── */
export function Squiggle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 14" className={className} preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M3 10 C 30 2, 55 13, 85 8 S 140 2, 165 9 S 205 12, 217 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─────────────── live open/closed status (Tehran time) ─────────────── */
export function useOpenStatus() {
  const compute = () => {
    try {
      const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tehran" }));
      const h = now.getHours() + now.getMinutes() / 60;
      return h >= 7 && h < 23;
    } catch {
      const h = new Date().getHours() + new Date().getMinutes() / 60;
      return h >= 7 && h < 23;
    }
  };
  const [open, setOpen] = useState(compute);
  useEffect(() => {
    const id = window.setInterval(() => setOpen(compute()), 60_000);
    return () => window.clearInterval(id);
  }, []);
  return open;
}
