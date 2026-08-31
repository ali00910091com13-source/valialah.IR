import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";
import { faNum } from "./data";

/* reveal-on-scroll wrapper */
export function Reveal({
  children,
  delay = 0,
  className = "",
  style,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("on");
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </div>
  );
}

/* animated counter in Persian digits */
export function CountUp({
  to,
  duration = 1500,
  prefix = "",
  suffix = "",
}: {
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        if (reduced) {
          setVal(to);
          return;
        }
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / duration);
          setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration]);
  return (
    <span ref={ref}>
      {prefix}
      {faNum(val)}
      {suffix}
    </span>
  );
}

/* live open/closed status based on Tehran time (07:00–23:00 daily) */
export function useOpenStatus(): boolean {
  const calc = () => {
    try {
      const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Tehran",
        hour: "2-digit",
        hour12: false,
      }).formatToParts(new Date());
      const h = Number(parts.find((p) => p.type === "hour")?.value ?? "12");
      return h >= 7 && h < 23;
    } catch {
      const h = new Date().getHours();
      return h >= 7 && h < 23;
    }
  };
  const [open, setOpen] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setOpen(calc()), 60_000);
    return () => clearInterval(id);
  }, []);
  return open;
}

/* animated electrocardiogram strip */
export function EcgLine({
  className = "",
  stroke = "#0e7c74",
}: {
  className?: string;
  stroke?: string;
}) {
  const d =
    "M0 60 H110 l10 0 7-14 9 26 10-46 12 68 10-48 8 20 5-6 H360 " +
    "l10 0 7-14 9 26 10-46 12 68 10-48 8 20 5-6 H720 " +
    "l10 0 7-14 9 26 10-46 12 68 10-48 8 20 5-6 H1080 l10 0 7-14 9 26 10-46 12 68 10-48 8 20 5-6 H1200";
  return (
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <path d={d} fill="none" stroke={stroke} strokeOpacity="0.18" strokeWidth="2" />
      <path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth="2.6"
        strokeLinecap="round"
        pathLength={1000}
        className="ecg-run"
      />
    </svg>
  );
}

/* rotating circular stamp with the clinic name */
export function Stamp({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg viewBox="0 0 130 130" className="spin-slow h-full w-full">
        <defs>
          <path
            id="stamp-circ"
            d="M65 65 m-46 0 a46 46 0 1 1 92 0 a46 46 0 1 1 -92 0"
            fill="none"
          />
        </defs>
        <circle cx="65" cy="65" r="63" fill="rgba(247,232,198,0.92)" />
        <circle cx="65" cy="65" r="63" fill="none" stroke="#d69a25" strokeWidth="1.6" strokeDasharray="3 5" />
        <circle cx="65" cy="65" r="30" fill="#0e7c74" />
        <path
          d="M65 80c-6.5-4.6-11.5-8.9-11.5-14.3 0-3.8 3-6.7 6.7-6.7 2 0 3.8 1 4.8 2.5 1-1.5 2.8-2.5 4.8-2.5 3.7 0 6.7 2.9 6.7 6.7 0 5.4-5 9.7-11.5 14.3z"
          fill="#f7e8c6"
        />
        <text fontSize="10" fontWeight="700" fill="#0a5a54" fontFamily="Vazirmatn, sans-serif">
          <textPath href="#stamp-circ" startOffset="0">
            درمانگاه خیریه آوای مهر ولی‌الله • ۲۷ سال خدمت • سلامت شما اولویت ماست •
          </textPath>
        </text>
      </svg>
    </div>
  );
}

/* hand-drawn saffron underline */
export function Squiggle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 16"
      className={className}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M4 11 C 42 3, 84 13, 124 8 S 196 4, 216 10"
        fill="none"
        stroke="#d69a25"
        strokeWidth="5.5"
        strokeLinecap="round"
        className="draw-line"
      />
    </svg>
  );
}
