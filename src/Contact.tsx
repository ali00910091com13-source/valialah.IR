import { useState } from "react";
import { CONTACT, IMG, faNum, TABS, type TabId } from "./data";
import { Reveal, useOpenStatus } from "./fx";
import {
  IconPhone,
  IconPin,
  IconClock,
  IconInstagram,
  IconStar8,
  IconArrow,
  IconHeart,
  IconHeartPulse,
  IconCalendar,
} from "./Icons";

function MapCard() {
  const [reducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  return (
    <div className="lift relative overflow-hidden rounded-[18px] border border-sea/20 bg-pine">
      <svg viewBox="0 0 400 220" className="h-56 w-full" aria-hidden="true">
        <rect width="400" height="220" fill="#0d3b3d" />
        <g stroke="#155354" strokeWidth="14" strokeLinecap="round">
          <path d="M-10 150 H410" />
          <path d="M120 -10 V230" />
          <path d="M-10 60 C 120 40, 260 90, 410 40" fill="none" strokeWidth="9" />
        </g>
        <g stroke="#1d6b67" strokeWidth="4" strokeDasharray="2 10" strokeLinecap="round">
          <path d="M-10 150 H410" />
          <path d="M120 -10 V230" />
        </g>
        <g stroke="#237a72" strokeWidth="6" strokeLinecap="round">
          <path d="M230 150 L300 230" />
          <path d="M40 60 L120 60" />
        </g>
        <rect x="96" y="126" width="48" height="48" rx="6" fill="none" stroke="#d69a25" strokeWidth="2.5" strokeDasharray="5 5" />
        <text x="120" y="200" textAnchor="middle" fill="#7fae9f" fontSize="12" fontFamily="Vazirmatn">پل محلاتی</text>
        <text x="210" y="143" fill="#7fae9f" fontSize="12" fontFamily="Vazirmatn">بزرگراه شهید محلاتی</text>
        <g transform="translate(176,96)">
          <circle cx="0" cy="0" r="22" fill="#d69a25" opacity="0.16">
            {!reducedMotion && (
              <>
                <animate attributeName="r" values="18;30;18" dur="2.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0.05;0.3" dur="2.6s" repeatCount="indefinite" />
              </>
            )}
          </circle>
          <path d="M0 10 C -14 -2 -18 -10 -18 -17 a18 18 0 1 1 36 0 c0 7 -4 15 -18 27z" fill="#d69a25" />
          <circle cx="0" cy="-16" r="6.5" fill="#0d3b3d" />
          <path d="M-3 -16 h2 l1-2 1.6 4 1.2-2.6 h2" fill="none" stroke="#d69a25" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <text x="176" y="52" textAnchor="middle" fill="#f7e8c6" fontSize="13" fontWeight="bold" fontFamily="Vazirmatn">درمانگاه آوای مهر ولی‌الله — پلاک ۳۱۲</text>
      </svg>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-foam/10 bg-pine2/70 px-5 py-4">
        <span className="flex items-center gap-2 text-[0.8rem] font-bold text-foam">
          <IconPin className="h-4.5 w-4.5 text-gold" />
          {CONTACT.landmark}
        </span>
        <a
          href={CONTACT.mapUrl}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-1.5 text-[0.8rem] font-extrabold text-gold transition-colors hover:text-goldsoft"
        >
          مسیریابی روی نقشه
          <IconArrow className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        </a>
      </div>
    </div>
  );
}

export function ContactSection() {
  const open = useOpenStatus();
  return (
    <section className="relative overflow-hidden bg-paper px-4 pb-20 sm:px-6 sm:pb-24">
      <div className="girih absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="wrap relative mx-auto max-w-6xl">
        <Reveal>
          <div className="mx-auto max-w-2xl pt-12 text-center sm:pt-16">
            <span className="eyebrow justify-center text-seadeep!">
              <IconStar8 className="h-4 w-4 text-gold" />
              ارتباط با ما
            </span>
            <h1 className="font-display mt-4 text-4xl leading-[1.3] text-pine sm:text-5xl">
              سلامتی را به <span className="text-sea">فردا</span> نیندازید
            </h1>
            <p className="mt-4 leading-8 text-inksoft">
              برای نوبت‌دهی کافی است تماس بگیرید؛ همکاران ما هر روز از ساعت ۷
              صبح تا ۲۳ پاسخگوی شما هستند.
            </p>
          </div>
        </Reveal>

        {/* ── کارت‌های تماس سریع ── */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Reveal delay={60}>
            <a
              href={`tel:${CONTACT.phone}`}
              className="lift group flex h-full items-center gap-4 rounded-[18px] border border-sea/20 bg-card p-5 transition-colors hover:border-sea/50"
            >
              <span className="grid h-13 w-13 shrink-0 place-items-center rounded-2xl bg-sea text-foam transition-transform duration-300 group-hover:scale-110">
                <IconPhone className="h-6 w-6" />
              </span>
              <span>
                <span className="block text-[0.72rem] font-bold text-inksoft">تلفن اصلی و پذیرش</span>
                <span dir="ltr" className="font-display block text-lg text-pine">{CONTACT.phoneDisplay}</span>
              </span>
            </a>
          </Reveal>
          <Reveal delay={120}>
            <a
              href={`tel:${CONTACT.bookingPhone}`}
              className="lift group flex h-full items-center gap-4 rounded-[18px] border border-sea/20 bg-card p-5 transition-colors hover:border-sea/50"
            >
              <span className="grid h-13 w-13 shrink-0 place-items-center rounded-2xl bg-gold text-pine transition-transform duration-300 group-hover:scale-110">
                <IconCalendar className="h-6 w-6" />
              </span>
              <span>
                <span className="block text-[0.72rem] font-bold text-inksoft">نوبت‌دهی تلفنی</span>
                <span dir="ltr" className="font-display block text-lg text-pine">{CONTACT.bookingPhoneDisplay}</span>
              </span>
            </a>
          </Reveal>
          <Reveal delay={180} className="sm:col-span-2 lg:col-span-1">
            <a
              href={`tel:${CONTACT.mobile}`}
              className="lift group flex h-full items-center gap-4 rounded-[18px] border border-sea/20 bg-card p-5 transition-colors hover:border-sea/50"
            >
              <span className="grid h-13 w-13 shrink-0 place-items-center rounded-2xl bg-seadeep text-foam transition-transform duration-300 group-hover:scale-110">
                <IconPhone className="h-6 w-6" />
              </span>
              <span>
                <span className="block text-[0.72rem] font-bold text-inksoft">تلفن همراه</span>
                <span dir="ltr" className="font-display block text-lg text-pine">{CONTACT.mobileDisplay}</span>
              </span>
            </a>
          </Reveal>
        </div>

        {/* ── اطلاعات + نقشه ── */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Reveal delay={100}>
            <div className="h-full rounded-[18px] border border-sea/20 bg-card p-6 sm:p-7">
              <h3 className="font-display text-2xl text-pine">اطلاعات تماس</h3>
              <ul className="mt-5 space-y-5 text-sm">
                <li className="flex items-start gap-3.5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-mist text-sea">
                    <IconPin className="h-5 w-5" />
                  </span>
                  <span className="leading-7 text-inksoft">
                    <b className="text-pine">آدرس:</b> {CONTACT.address}
                    <span className="mt-0.5 block text-[0.78rem] text-sea">({CONTACT.landmark})</span>
                  </span>
                </li>
                <li className="flex items-start gap-3.5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-mist text-sea">
                    <IconClock className="h-5 w-5" />
                  </span>
                  <span className="leading-7 text-inksoft">
                    {CONTACT.hours.map((h) => (
                      <span key={h.days} className="block">
                        <b className="text-pine">{h.days}:</b> {h.time}
                      </span>
                    ))}
                    <span
                      className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.74rem] font-extrabold ${
                        open ? "bg-sea/12 text-seadeep" : "bg-clay/12 text-clay"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${open ? "pulse-ring bg-sea" : "bg-clay"}`} />
                      وضعیت لحظه‌ای: {open ? "باز است" : "بسته است"}
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-3.5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-mist text-sea">
                    <IconInstagram className="h-5 w-5" />
                  </span>
                  <span className="leading-7 text-inksoft">
                    <b className="text-pine">اینستاگرام:</b>{" "}
                    <a href={CONTACT.instagram} target="_blank" rel="noreferrer" className="font-extrabold text-seadeep hover:text-gold">
                      <span dir="ltr">@{CONTACT.instagramId}</span>
                    </a>
                  </span>
                </li>
              </ul>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <MapCard />
          </Reveal>
        </div>

        {/* ── بنر نمای ساختمان ── */}
        <Reveal delay={150}>
          <div className="relative mt-12 overflow-hidden rounded-[20px]">
            <img src={IMG.exterior} alt="نمای ساختمان درمانگاه آوای مهر ولی‌الله" className="h-60 w-full object-cover sm:h-80" />
            <div className="absolute inset-0 bg-gradient-to-l from-pine/90 via-pine/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-start justify-center gap-3 p-7 sm:p-12">
              <span className="font-display text-2xl leading-snug text-card sm:text-4xl">
                منتظر دیدار شما هستیم؛
              </span>
              <span className="max-w-md text-sm leading-7 text-foam/85 sm:text-base">
                بزرگراه شهید محلاتی، زیر پل محلاتی — درهای آوای مهر هر روز از ۷ صبح تا ۲۳ به روی شما باز است.
              </span>
              <a href={`tel:${CONTACT.phone}`} className="btn btn-gold mt-2 py-2.5! text-sm">
                <IconPhone className="h-4 w-4" />
                تماس فوری
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer({ onNavigate }: { onNavigate?: (id: TabId) => void }) {
  const go = (id: TabId) => {
    onNavigate?.(id);
    window.scrollTo({ top: 0 });
  };
  return (
    <footer className="relative overflow-hidden bg-pine text-foam/80">
      <div className="girih-light absolute inset-0" aria-hidden="true" />
      <div className="wrap relative grid gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <button onClick={() => go("home")} className="flex items-center gap-3 text-start">
            <span className="arch-ring grid h-11 w-11 place-items-center bg-gold text-pine">
              <IconHeartPulse className="heartbeat h-6 w-6" strokeWidth={2} />
            </span>
            <span className="font-display text-xl text-card">آوای مهر ولی‌الله</span>
          </button>
          <p className="mt-4 text-sm leading-7 text-foam/60">
            درمانگاه خیریه‌ای که {faNum(27)} سال است با مهر می‌تپد؛ برای همه‌ی
            مردم، با هر توانی.
          </p>
          <a
            href={CONTACT.instagram}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-grid h-10 w-10 place-items-center rounded-[10px] border border-foam/20 text-foam transition-all hover:border-gold hover:bg-gold hover:text-pine"
            aria-label="اینستاگرام"
          >
            <IconInstagram className="h-5 w-5" />
          </a>
        </div>

        <div>
          <h4 className="font-display text-lg text-gold">دسترسی سریع</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {TABS.filter((t) => t.id !== "home").map((t) => (
              <li key={t.id}>
                <button onClick={() => go(t.id)} className="group flex items-center gap-2 transition-colors hover:text-gold">
                  <IconArrow className="h-3.5 w-3.5 text-gold/60 transition-transform group-hover:-translate-x-1" />
                  {t.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg text-gold">بخش‌ها</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {["دندانپزشکی", "فیزیوتراپی", "رادیولوژی و سونوگرافی", "آزمایشگاه", "شنوایی‌سنجی", "داروخانه و عینک‌سازی"].map((s) => (
              <li key={s}>
                <button onClick={() => go("services")} className="transition-colors hover:text-gold">{s}</button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg text-gold">تماس</h4>
          <ul className="mt-4 space-y-3 text-sm leading-6">
            <li className="flex gap-2.5">
              <IconPin className="mt-1 h-4 w-4 shrink-0 text-gold/70" />
              {CONTACT.address}
            </li>
            <li className="flex gap-2.5">
              <IconPhone className="mt-1 h-4 w-4 shrink-0 text-gold/70" />
              <span>
                <a dir="ltr" href={`tel:${CONTACT.phone}`} className="block transition-colors hover:text-gold">{CONTACT.phoneDisplay}</a>
                <a dir="ltr" href={`tel:${CONTACT.bookingPhone}`} className="block transition-colors hover:text-gold">{CONTACT.bookingPhoneDisplay}</a>
              </span>
            </li>
            <li className="flex gap-2.5">
              <IconClock className="mt-1 h-4 w-4 shrink-0 text-gold/70" />
              همه‌روزه ۷:۰۰ تا ۲۳:۰۰
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-foam/10">
        <div className="wrap flex flex-col items-center justify-between gap-3 px-4 py-5 text-[0.78rem] text-foam/50 sm:flex-row sm:px-6">
          <span>© {faNum(1404)} درمانگاه خیریه آوای مهر ولی‌الله — تمامی حقوق محفوظ است.</span>
          <span className="flex items-center gap-1.5">
            ساخته‌شده با
            <IconHeart className="heartbeat h-4 w-4 text-gold" fill="currentColor" />
            برای سلامت مردم
          </span>
        </div>
      </div>
    </footer>
  );
}
