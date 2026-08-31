import { useEffect, useRef, useState } from "react";
import { CONTACT, TABS, faNum, type TabId } from "./data";
import { ICONS, IconClose, LogoMark } from "./Icons";
import { useOpenStatus } from "./fx";
import BookingMenu from "./Booking";

export default function Nav({
  active,
  onNavigate,
}: {
  active: TabId;
  onNavigate: (id: TabId) => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [progress, setProgress] = useState(0);
  const topRef = useRef<HTMLDivElement>(null);
  const open = useOpenStatus();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 14);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu]);

  const go = (id: TabId) => {
    onNavigate(id);
    setMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* ── نوار وضعیت بالای صفحه ── */}
      <div ref={topRef} className="relative z-40 bg-pine text-foam">
        <div className="girih-light absolute inset-0" aria-hidden="true" />
        <div className="wrap relative flex h-10 items-center justify-between gap-3 text-[0.72rem] font-bold sm:text-[0.78rem]">
          <span className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${open ? "bg-teal pulse-ring" : "bg-clay"}`}
            />
            {open ? "اکنون باز هستیم — تا ساعت ۲۳" : "اکنون بسته‌ایم — از ساعت ۷ صبح باز می‌شویم"}
          </span>
          <span className="hidden items-center gap-4 sm:flex">
            <span className="flex items-center gap-1.5 text-foam/75">
              هر روز: ۷ صبح تا ۲۳
            </span>
            <a dir="ltr" href={`tel:${CONTACT.phone}`} className="flex items-center gap-1.5 text-gold transition-colors hover:text-goldsoft">
              {CONTACT.phoneDisplay}
            </a>
          </span>
          <a dir="ltr" href={`tel:${CONTACT.phone}`} className="text-gold sm:hidden">
            {CONTACT.phoneDisplay}
          </a>
        </div>
      </div>

      {/* ── نوار اصلی چسبان ── */}
      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? "border-sea/15 bg-card/95 shadow-[0_10px_30px_-18px_rgba(11,59,56,0.4)] backdrop-blur"
            : "border-transparent bg-card/80 backdrop-blur"
        }`}
      >
        {/* نوار پیشرفت اسکرول */}
        <div
          className="absolute inset-x-0 top-0 h-[3px] origin-right bg-gradient-to-l from-gold to-teal transition-transform duration-150"
          style={{ transform: `scaleX(${progress})` }}
          aria-hidden="true"
        />
        <div className="wrap flex h-16 items-center justify-between gap-3 sm:h-[4.5rem]">
          <button onClick={() => go("home")} className="group flex items-center gap-3 text-start">
            <span className="arch-ring grid h-11 w-11 shrink-0 place-items-center bg-pine text-gold transition-transform duration-300 group-hover:rotate-3 sm:h-12 sm:w-12">
              <LogoMark className="h-7 w-7 sm:h-8 sm:w-8" />
            </span>
            <span>
              <span className="font-display block text-lg leading-5 text-pine sm:text-xl">
                آوای مهر ولی‌الله
              </span>
              <span className="block text-[0.62rem] font-bold text-inksoft sm:text-[0.68rem]">
                درمانگاه خیریه • {faNum(27)} سال خدمت
              </span>
            </span>
          </button>

          {/* تب‌های دسکتاپ */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="تب‌های اصلی">
            {TABS.map((t) => {
              const Ic = ICONS[t.icon];
              const isActive = active === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => go(t.id)}
                  className={`relative rounded-[11px] px-3.5 py-2.5 text-sm font-extrabold transition-all duration-200 ${
                    isActive
                      ? "bg-pine text-gold shadow-[0_10px_24px_-12px_rgba(11,59,56,0.6)]"
                      : "text-ink hover:bg-mist hover:text-seadeep"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Ic className="h-4 w-4" />
                    {t.label}
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <BookingMenu label="رزرو نوبت" className="hidden sm:block" />
            {/* همبرگری */}
            <button
              onClick={() => setMenu(true)}
              aria-label="باز کردن منو"
              className="grid h-11 w-11 place-items-center rounded-[12px] border border-sea/25 bg-card text-pine transition-colors hover:bg-mist lg:hidden"
            >
              <svg viewBox="0 0 24 24" className="h-5.5 w-5.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M4 7h16M4 12h11M4 17h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* تب‌های افقی موبایل و تبلت */}
        <div className="no-scrollbar fade-x flex gap-1.5 overflow-x-auto border-t border-sea/10 px-3 py-2 lg:hidden">
          {TABS.map((t) => {
            const Ic = ICONS[t.icon];
            const isActive = active === t.id;
            return (
              <button
                key={t.id}
                onClick={() => go(t.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-[0.78rem] font-extrabold transition-all ${
                  isActive
                    ? "border-pine bg-pine text-gold"
                    : "border-sea/20 bg-card text-ink hover:border-sea/50"
                }`}
              >
                <Ic className="h-3.5 w-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* ── منوی تمام‌صفحه موبایل ── */}
      {menu && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div className="absolute inset-0 bg-pine/60 backdrop-blur-sm" onClick={() => setMenu(false)} />
          <div className="view-enter absolute inset-y-0 start-0 flex w-[19rem] max-w-[88vw] flex-col overflow-y-auto bg-pine text-foam shadow-2xl">
            <div className="girih-light pointer-events-none absolute inset-0" aria-hidden="true" />
            <div className="relative flex items-center justify-between border-b border-foam/10 p-5">
              <span className="flex items-center gap-3">
                <span className="arch-ring grid h-11 w-11 place-items-center bg-gold text-pine">
                  <LogoMark className="h-7 w-7" />
                </span>
                <span className="font-display text-lg">آوای مهر ولی‌الله</span>
              </span>
              <button
                onClick={() => setMenu(false)}
                aria-label="بستن منو"
                className="grid h-10 w-10 place-items-center rounded-full border border-foam/20 text-foam/80 transition-colors hover:bg-foam/10"
              >
                <IconClose className="h-5 w-5" />
              </button>
            </div>
            <nav className="relative flex flex-col gap-1 p-4" aria-label="منوی موبایل">
              {TABS.map((t, i) => {
                const Ic = ICONS[t.icon];
                const isActive = active === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => go(t.id)}
                    className={`fadeup flex items-center gap-3.5 rounded-[13px] px-4 py-3.5 text-start text-base font-extrabold transition-colors ${
                      isActive ? "bg-gold text-pine" : "text-foam/85 hover:bg-foam/10"
                    }`}
                    style={{ animationDelay: `${i * 55}ms` }}
                  >
                    <Ic className="h-5 w-5" />
                    {t.label}
                  </button>
                );
              })}
            </nav>
            <div className="relative mt-auto space-y-3 border-t border-foam/10 p-5">
              <div className="flex items-center gap-2 text-[0.78rem] font-bold">
                <span className={`h-2 w-2 rounded-full ${open ? "bg-teal pulse-ring" : "bg-clay"}`} />
                {open ? "اکنون باز هستیم" : "اکنون بسته‌ایم"}
                <span className="text-foam/50">• هر روز ۷ تا ۲۳</span>
              </div>
              <a dir="ltr" href={`tel:${CONTACT.phone}`} className="btn btn-gold w-full">
                {CONTACT.phoneDisplay}
              </a>
              <a dir="ltr" href={`tel:${CONTACT.bookingPhone}`} className="btn w-full border border-foam/25 text-foam hover:bg-foam/10">
                نوبت‌دهی: {CONTACT.bookingPhoneDisplay}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
