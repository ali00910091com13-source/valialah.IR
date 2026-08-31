import { useEffect, useState } from "react";
import { NAV, CONTACT, faNum } from "./data";
import { useOpenStatus } from "./fx";
import {
  IconPhone,
  IconPin,
  IconClock,
  IconHeartPulse,
  IconMenu,
  IconClose,
  IconArrow,
} from "./Icons";

function Logo({ light = false }: { light?: boolean }) {
  return (
    <a href="#home" className="group flex items-center gap-3">
      <span
        className={`arch-ring grid h-11 w-11 place-items-center transition-transform duration-300 group-hover:-translate-y-0.5 ${
          light ? "bg-gold text-pine" : "bg-sea text-foam"
        }`}
      >
        <IconHeartPulse className="heartbeat h-6 w-6" strokeWidth={2} />
      </span>
      <span className="leading-none">
        <span
          className={`font-display block text-[1.35rem] leading-[1.15] ${
            light ? "text-card" : "text-pine"
          }`}
        >
          آوای مهر ولی‌الله
        </span>
        <span
          className={`mt-0.5 block text-[0.68rem] font-semibold tracking-wide ${
            light ? "text-foam/70" : "text-inksoft"
          }`}
        >
          درمانگاه خیریه • بیش از ۲۷ سال خدمت
        </span>
      </span>
    </a>
  );
}

export default function Nav() {
  const open = useOpenStatus();
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState("home");
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 10);
      setShowTop(y > 700);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? (y / h) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-38% 0px -55% 0px" },
    );
    NAV.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {/* progress bar */}
      <div className="fixed inset-x-0 top-0 z-[90] h-[3px] bg-transparent">
        <div
          className="h-full bg-gold transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* top utility bar */}
      <div className="relative z-40 bg-pine text-foam/90">
        <div className="wrap flex items-center justify-between gap-4 py-2 text-[0.78rem]">
          <div className="flex min-w-0 items-center gap-5">
            <a
              href={`tel:${CONTACT.phone}`}
              className="flex items-center gap-1.5 font-semibold transition-colors hover:text-gold"
            >
              <IconPhone className="h-3.5 w-3.5 shrink-0" />
              <span dir="ltr">{CONTACT.phoneDisplay}</span>
            </a>
            <span className="hidden items-center gap-1.5 truncate text-foam/70 md:flex">
              <IconPin className="h-3.5 w-3.5 shrink-0" />
              {CONTACT.addressShort}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden items-center gap-1.5 text-foam/70 sm:flex">
              <IconClock className="h-3.5 w-3.5" />
              همه‌روزه ۷ تا ۲۳
            </span>
            <span
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.72rem] font-bold ${
                open ? "bg-sea/25 text-[#7fd6cb]" : "bg-clay/25 text-[#f0b3a3]"
              }`}
            >
              <span
                className={`pulse-ring h-1.5 w-1.5 rounded-full ${
                  open ? "bg-[#5fc9bc]" : "bg-clay"
                }`}
              />
              {open ? "هم‌اکنون باز است" : "هم‌اکنون بسته است"}
            </span>
          </div>
        </div>
      </div>

      {/* main nav */}
      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? "border-sea/15 bg-card/95 shadow-[0_10px_36px_-18px_rgba(7,39,42,0.35)] backdrop-blur-sm"
            : "border-transparent bg-paper"
        }`}
      >
        <div className="wrap flex items-center justify-between gap-4 py-3">
          <Logo />
          <nav className="hidden items-center gap-6 lg:flex">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className={`nav-link ${active === n.id ? "active" : ""}`}
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a
              href={`tel:${CONTACT.bookingPhone}`}
              className="btn btn-gold hidden py-2.5! text-sm sm:inline-flex"
            >
              <IconPhone className="h-4 w-4" />
              نوبت‌دهی <span dir="ltr">{faNum("33559068")}</span>
            </a>
            <button
              onClick={() => setMenu((m) => !m)}
              className="grid h-10 w-10 place-items-center rounded-[10px] border border-sea/25 text-seadeep transition-colors hover:bg-sea hover:text-foam lg:hidden"
              aria-label="منو"
            >
              {menu ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {/* mobile menu */}
        <div
          className={`overflow-hidden border-sea/10 bg-card transition-all duration-400 lg:hidden ${
            menu ? "max-h-[420px] border-t" : "max-h-0"
          }`}
        >
          <nav className="wrap grid grid-cols-2 gap-1 py-4">
            {NAV.map((n, i) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                onClick={() => setMenu(false)}
                className={`flex items-center justify-between rounded-[10px] px-4 py-2.5 text-sm font-semibold transition-colors ${
                  active === n.id
                    ? "bg-sea text-foam"
                    : "text-inksoft hover:bg-mist hover:text-seadeep"
                }`}
              >
                {n.label}
                <IconArrow className="h-4 w-4 opacity-50" />
                <span className="sr-only">{i}</span>
              </a>
            ))}
            <a
              href={`tel:${CONTACT.bookingPhone}`}
              className="btn btn-gold col-span-2 mt-2 justify-center"
              onClick={() => setMenu(false)}
            >
              <IconPhone className="h-4 w-4" />
              نوبت‌دهی تلفنی
            </a>
          </nav>
        </div>
      </header>

      {/* back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="بازگشت به بالا"
        className={`fixed bottom-5 start-5 z-[60] grid h-11 w-11 place-items-center rounded-full bg-pine text-gold shadow-lg transition-all duration-300 hover:bg-sea hover:text-foam ${
          showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
        }`}
      >
        <IconArrow className="h-5 w-5 rotate-90" />
      </button>
    </>
  );
}
