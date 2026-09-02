import { useEffect, useState } from "react";
import { TABS, CONTACT, faNum, type TabId } from "./data";
import { useOpenStatus } from "./fx";
import { ICONS, IconPhone, IconClose, LogoMark } from "./Icons";
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
  const open = useOpenStatus();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min(1, y / h) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenu(false), [active]);

  const go = (id: TabId) => {
    onNavigate(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* ── نوار بالایی ── */}
      <div className="hidden bg-pine text-foam/85 sm:block">
        <div className="wrap flex items-center justify-between py-2 text-[0.74rem] font-semibold">
          <span className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${open ? "bg-teal pulse-ring" : "bg-clay"}`} />
              {open ? "هم‌اکنون باز هستیم" : "هم‌اکنون بسته‌ایم"} • هر روز ۷ تا ۲۳
            </span>
            <a dir="ltr" href={`tel:${CONTACT.phone}`} className="transition-colors hover:text-gold">
              {CONTACT.phoneDisplay}
            </a>
          </span>
          <span className="text-foam/60">بزرگراه شهید محلاتی، پلاک {faNum(312)}</span>
        </div>
      </div>

      {/* ── هدر اصلی ── */}
      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? "border-sea/15 bg-paper/95 shadow-[0_10px_36px_-18px_rgba(11,59,56,0.35)] backdrop-blur"
            : "border-transparent bg-paper/80 backdrop-blur-sm"
        }`}
      >
        <div className="wrap flex items-center justify-between gap-4 py-3">
          <button onClick={() => go("home")} className="group flex items-center gap-3 text-start">
            <span className="arch-ring grid h-12 w-12 shrink-0 place-items-center bg-pine text-gold transition-transform duration-300 group-hover:rotate-3">
              <LogoMark className="h-8 w-8" />
            </span>
            <span className="leading-tight">
              <span className="font-display block text-lg text-pine sm:text-xl">آوای مهر ولی‌الله</span>
              <span className="block text-[0.62rem] font-bold text-sea sm:text-[0.68rem]">
                درمانگاه خیریه • {faNum(27)} سال خدمت
              </span>
            </span>
          </button>

          {/* تب‌های دسکتاپ */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="منوی اصلی">
            {TABS.map((t) => {
              const Ic = ICONS[t.icon];
              const isActive = active === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => go(t.id)}
                  className={`relative flex items-center gap-1.5 rounded-[11px] px-3.5 py-2.5 text-sm font-bold transition-all duration-200 ${
                    isActive ? "bg-sea text-foam shadow-[0_10px_24px_-10px_rgba(10,90,84,0.6)]" : "text-pine hover:bg-sea/10"
                  }`}
                >
                  {Ic && <Ic className="h-4 w-4" />}
                  {t.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <BookingMenu label="رزرو نوبت" className="hidden sm:block" />
            <button
              onClick={() => setMenu((m) => !m)}
              aria-label="منو"
              className="grid h-11 w-11 place-items-center rounded-[12px] border border-sea/25 text-seadeep transition-colors hover:bg-sea/10 lg:hidden"
            >
              {menu ? (
                <IconClose className="h-5 w-5" />
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M4 7h16M4 12h10M4 17h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
        {/* نوار پیشرفت اسکرول */}
        <div className="absolute bottom-0 right-0 h-[3px] w-full bg-transparent">
          <div
            className="h-full bg-gold transition-[width] duration-150"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </header>

      {/* ── منوی موبایل ── */}
      {menu && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            aria-label="بستن منو"
            onClick={() => setMenu(false)}
            className="absolute inset-0 bg-pine/50 backdrop-blur-sm"
          />
          <div className="fadeup absolute inset-x-3 top-3 overflow-hidden rounded-[18px] border border-sea/20 bg-paper shadow-2xl">
            <div className="flex items-center justify-between border-b border-sea/10 bg-card px-4 py-3">
              <span className="font-display text-lg text-pine">منوی درمانگاه</span>
              <button
                onClick={() => setMenu(false)}
                aria-label="بستن"
                className="grid h-9 w-9 place-items-center rounded-full text-inksoft transition-colors hover:bg-mist"
              >
                <IconClose className="h-5 w-5" />
              </button>
            </div>
            <nav className="grid gap-1 p-3" aria-label="منوی موبایل">
              {TABS.map((t, i) => {
                const Ic = ICONS[t.icon];
                const isActive = active === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      go(t.id);
                      setMenu(false);
                    }}
                    style={{ animationDelay: `${i * 45}ms` }}
                    className={`fadeup flex items-center gap-3 rounded-[13px] px-4 py-3.5 text-start text-[0.95rem] font-extrabold transition-colors ${
                      isActive ? "bg-sea text-foam" : "text-pine hover:bg-mist"
                    }`}
                  >
                    {Ic && <Ic className="h-5 w-5 shrink-0" />}
                    {t.label}
                  </button>
                );
              })}
            </nav>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-sea/10 bg-card px-4 py-3.5">
              <a dir="ltr" href={`tel:${CONTACT.phone}`} className="flex items-center gap-2 text-sm font-extrabold text-seadeep">
                <IconPhone className="h-4.5 w-4.5" />
                {CONTACT.phoneDisplay}
              </a>
              <span className={`flex items-center gap-1.5 text-[0.7rem] font-bold ${open ? "text-seadeep" : "text-clay"}`}>
                <span className={`h-2 w-2 rounded-full ${open ? "bg-teal" : "bg-clay"}`} />
                {open ? "باز • ۷ تا ۲۳" : "بسته • ۷ تا ۲۳"}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
