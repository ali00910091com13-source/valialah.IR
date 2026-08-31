import { useEffect, useState } from "react";
import { TABS, CONTACT, faNum, type TabId } from "./data";
import { useOpenStatus } from "./fx";
import {
  IconPhone,
  IconPin,
  IconClock,
  IconHeartPulse,
  IconInstagram,
  ICONS,
} from "./Icons";

function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-3 text-start"
      aria-label="بازگشت به خانه"
    >
      <span className="arch-ring grid h-11 w-11 shrink-0 place-items-center bg-sea text-foam transition-transform duration-300 group-hover:-translate-y-0.5">
        <IconHeartPulse className="heartbeat h-6 w-6" strokeWidth={2} />
      </span>
      <span className="leading-none">
        <span className="font-display block text-[1.25rem] leading-[1.15] text-pine sm:text-[1.35rem]">
          آوای مهر ولی‌الله
        </span>
        <span className="mt-0.5 block text-[0.66rem] font-semibold tracking-wide text-inksoft sm:text-[0.68rem]">
          درمانگاه خیریه • بیش از ۲۷ سال خدمت
        </span>
      </span>
    </button>
  );
}

export default function Nav({
  active,
  onNavigate,
}: {
  active: TabId;
  onNavigate: (id: TabId) => void;
}) {
  const open = useOpenStatus();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: TabId) => {
    onNavigate(id);
    window.scrollTo({ top: 0 });
  };

  return (
    <>
      {/* ── نوار وضعیت بالایی ── */}
      <div className="relative z-40 bg-pine text-foam/90">
        <div className="wrap flex items-center justify-between gap-3 px-4 py-2 text-[0.74rem] sm:px-6 sm:text-[0.78rem]">
          <div className="flex min-w-0 items-center gap-4">
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
            <a
              href={CONTACT.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="اینستاگرام"
              className="hidden items-center gap-1.5 text-foam/70 transition-colors hover:text-gold sm:flex"
            >
              <IconInstagram className="h-3.5 w-3.5" />
            </a>
            <span
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-bold ${
                open ? "bg-sea/25 text-[#7fd6cb]" : "bg-clay/25 text-[#f0b3a3]"
              }`}
            >
              <span
                className={`pulse-ring h-1.5 w-1.5 rounded-full ${
                  open ? "bg-[#5fc9bc]" : "bg-clay"
                }`}
              />
              {open ? "باز" : "بسته"}
            </span>
          </div>
        </div>
      </div>

      {/* ── هدر اصلی با تب‌ها ── */}
      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? "border-sea/15 bg-card/95 shadow-[0_10px_36px_-18px_rgba(7,39,42,0.35)] backdrop-blur-sm"
            : "border-sea/10 bg-paper"
        }`}
      >
        <div className="wrap flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Logo onClick={() => go("home")} />

          {/* تب‌های دسکتاپ */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="منوی اصلی">
            {TABS.map((t) => {
              const Icon = ICONS[t.icon];
              const isActive = active === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => go(t.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`tab-pill ${isActive ? "active" : ""}`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {t.label}
                </button>
              );
            })}
          </nav>

          {/* دکمه تماس دسکتاپ */}
          <a
            href={`tel:${CONTACT.bookingPhone}`}
            className="btn btn-gold hidden py-2.5! text-sm sm:inline-flex"
          >
            <IconPhone className="h-4 w-4" />
            نوبت‌دهی <span dir="ltr">{faNum("33559068")}</span>
          </a>
        </div>

        {/* ── نوار تب‌های موبایل (قابل اسکرول) ── */}
        <nav
          className="no-scrollbar fade-x flex items-center gap-1.5 overflow-x-auto border-t border-sea/10 px-3 py-2 lg:hidden"
          aria-label="منوی موبایل"
        >
          {TABS.map((t) => {
            const Icon = ICONS[t.icon];
            const isActive = active === t.id;
            return (
              <button
                key={t.id}
                onClick={() => go(t.id)}
                aria-current={isActive ? "page" : undefined}
                className={`tab-pill shrink-0 ${isActive ? "active" : ""}`}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {t.label}
              </button>
            );
          })}
        </nav>
      </header>

      {/* ── دکمه شناور تماس (موبایل) ── */}
      <a
        href={`tel:${CONTACT.phone}`}
        aria-label="تماس فوری با درمانگاه"
        className="fixed bottom-5 start-5 z-[60] grid h-14 w-14 place-items-center rounded-full bg-gold text-pine shadow-xl shadow-gold/40 transition-all duration-300 hover:scale-110 active:scale-95 sm:bottom-6 sm:start-6 lg:hidden"
      >
        <IconPhone className="h-6 w-6" strokeWidth={2} />
      </a>
    </>
  );
}
