import { CONTACT, IMG, faNum, TABS, BOOKING_LINKS, type TabId } from "./data";
import { Reveal, useOpenStatus, useReducedMotion } from "./fx";
import {
  IconPhone,
  IconPin,
  IconClock,
  IconInstagram,
  IconStar8,
  IconArrow,
  IconHeart,
  IconCalendar,
  LogoMark,
} from "./Icons";

/* ─────────────── نقشه تزئینی ─────────────── */
function MapCard() {
  const reduced = useReducedMotion();
  return (
    <div className="relative h-full overflow-hidden rounded-[18px] border border-sea/20 bg-mist">
      <svg viewBox="0 0 340 200" className="h-full w-full" role="img" aria-label="نقشه محل درمانگاه">
        <rect width="340" height="200" fill="#dde9e2" />
        <path d="M0 150 C 80 140, 140 165, 340 130" stroke="#fbf7ec" strokeWidth="16" fill="none" />
        <path d="M0 150 C 80 140, 140 165, 340 130" stroke="#b9ccc2" strokeWidth="1.4" strokeDasharray="7 7" fill="none" />
        <path d="M60 0 C 70 70, 50 130, 70 200" stroke="#fbf7ec" strokeWidth="11" fill="none" />
        <path d="M250 0 C 240 60, 265 120, 245 200" stroke="#fbf7ec" strokeWidth="9" fill="none" />
        <path d="M0 60 C 120 45, 220 75, 340 50" stroke="#fbf7ec" strokeWidth="8" fill="none" />
        <rect x="95" y="80" width="48" height="34" rx="5" fill="#cfe0d6" />
        <rect x="160" y="20" width="58" height="40" rx="5" fill="#cfe0d6" />
        <rect x="280" y="80" width="40" height="30" rx="5" fill="#cfe0d6" />
        <rect x="20" y="95" width="30" height="34" rx="5" fill="#cfe0d6" />
        <text x="18" y="188" fontSize="10" fontWeight="700" fill="#566864" fontFamily="Vazirmatn, sans-serif">
          بزرگراه شهید محلاتی
        </text>
        <g transform="translate(176,96)">
          <circle cx="0" cy="0" r="22" fill="#d69a25" opacity="0.16">
            {!reduced && (
              <>
                <animate attributeName="r" values="18;30;18" dur="2.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0.05;0.3" dur="2.6s" repeatCount="indefinite" />
              </>
            )}
          </circle>
          <path
            d="M0 18 C -12 6, -14 -2, -14 -7 a14 14 0 1 1 28 0 c0 5 -2 13 -14 25z"
            fill="#0b3b38"
            stroke="#fbf7ec"
            strokeWidth="2"
            transform="translate(0,-14)"
          />
          <circle cx="0" cy="-21" r="5.5" fill="#d69a25" />
        </g>
      </svg>
      <a
        href={CONTACT.mapUrl}
        target="_blank"
        rel="noreferrer"
        className="group absolute bottom-3 start-3 flex items-center gap-2 rounded-[11px] bg-pine px-4 py-2.5 text-[0.78rem] font-extrabold text-gold shadow-lg transition-all hover:-translate-y-0.5 hover:bg-seadeep"
      >
        <IconPin className="h-4 w-4" />
        مسیریابی در گوگل‌مپ
        <IconArrow className="h-3.5 w-3.5 -rotate-45 transition-transform group-hover:-translate-x-0.5" />
      </a>
    </div>
  );
}

/* ─────────────── تب تماس ─────────────── */
export function ContactSection() {
  const open = useOpenStatus();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
      <Reveal>
        <div className="text-center">
          <span className="eyebrow justify-center text-seadeep!">
            <IconPhone className="h-4 w-4" />
            در خدمت شما
          </span>
          <h1 className="font-display mt-4 text-4xl leading-[1.25] text-pine sm:text-5xl">تماس با درمانگاه</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-inksoft sm:text-lg">
            هم آنلاین، هم تلفنی؛ همکاران ما هر روز از ساعت ۷ صبح تا ۲۳ پاسخگوی شما هستند.
          </p>
        </div>
      </Reveal>

      {/* نوبت‌دهی آنلاین */}
      <Reveal delay={60}>
        <div className="relative mt-10 overflow-hidden rounded-[20px] bg-pine p-6 sm:p-8">
          <div className="girih-light absolute inset-0" aria-hidden="true" />
          <div className="relative">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display flex items-center gap-3 text-2xl text-gold sm:text-3xl">
                <IconCalendar className="h-7 w-7" />
                نوبت‌دهی آنلاین
              </h2>
              <span className="rounded-full bg-sea/25 px-3 py-1 text-[0.72rem] font-bold text-[#7fd6cb]">
                بدون معطلی، از خانه نوبت بگیرید
              </span>
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-foam/75">
              درمانگاه آوای مهر ولی‌الله در سامانه‌های معتبر نوبت‌دهی کشور حضور دارد؛ روی هر
              سامانه بزنید تا مستقیم وارد صفحه نوبت‌دهی شوید:
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {BOOKING_LINKS.map((b, i) => (
                <a
                  key={b.name}
                  href={b.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`group flex items-center justify-between gap-3 rounded-[14px] border px-4 py-3.5 transition-all duration-300 hover:-translate-y-0.5 ${
                    i === 0
                      ? "border-gold bg-gold text-pine hover:bg-golddeep hover:text-goldsoft"
                      : "border-foam/15 bg-foam/[0.06] text-foam hover:border-gold/60 hover:bg-foam/10"
                  }`}
                >
                  <span>
                    <span className="block text-base font-extrabold">{b.name}</span>
                    <span className={`block text-[0.72rem] font-semibold ${i === 0 ? "text-pine/70" : "text-foam/55"}`}>
                      {b.note}
                    </span>
                  </span>
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-[10px] transition-transform group-hover:-translate-x-0.5 ${
                      i === 0 ? "bg-pine/10 text-pine" : "bg-foam/10 text-gold"
                    }`}
                  >
                    <IconArrow className="h-4.5 w-4.5 -rotate-45" />
                  </span>
                </a>
              ))}
            </div>
            <a
              href={`tel:${CONTACT.bookingPhone}`}
              className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-dashed border-gold/50 px-4 py-3 text-sm font-bold text-foam/85 transition-colors hover:border-gold hover:text-gold"
            >
              <span className="flex items-center gap-2">
                <IconPhone className="h-4.5 w-4.5 text-gold" />
                ترجیح می‌دهید تلفنی نوبت بگیرید؟
              </span>
              <span dir="ltr" className="font-display text-lg text-gold">
                {CONTACT.bookingPhoneDisplay}
              </span>
            </a>
          </div>
        </div>
      </Reveal>

      {/* کارت‌های اطلاعات */}
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <Reveal delay={100}>
          <div className="lift h-full rounded-[18px] border border-sea/15 bg-card p-6">
            <span className="grid h-12 w-12 place-items-center rounded-[13px] bg-mist text-sea">
              <IconPhone className="h-6 w-6" />
            </span>
            <h3 className="font-display mt-4 text-2xl text-pine">تلفن‌ها</h3>
            <ul className="mt-3 space-y-2.5 text-sm font-bold text-ink">
              <li className="flex items-center justify-between gap-2">
                <span className="text-inksoft">پذیرش</span>
                <a dir="ltr" href={`tel:${CONTACT.phone}`} className="text-seadeep underline-offset-4 hover:underline">
                  {CONTACT.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center justify-between gap-2">
                <span className="text-inksoft">نوبت‌دهی</span>
                <a dir="ltr" href={`tel:${CONTACT.bookingPhone}`} className="text-seadeep underline-offset-4 hover:underline">
                  {CONTACT.bookingPhoneDisplay}
                </a>
              </li>
              <li className="flex items-center justify-between gap-2">
                <span className="text-inksoft">همراه</span>
                <a dir="ltr" href={`tel:${CONTACT.mobile}`} className="text-seadeep underline-offset-4 hover:underline">
                  {CONTACT.mobileDisplay}
                </a>
              </li>
            </ul>
          </div>
        </Reveal>

        <Reveal delay={180}>
          <div className="lift h-full rounded-[18px] border border-sea/15 bg-card p-6">
            <span className="grid h-12 w-12 place-items-center rounded-[13px] bg-mist text-sea">
              <IconPin className="h-6 w-6" />
            </span>
            <h3 className="font-display mt-4 text-2xl text-pine">نشانی</h3>
            <p className="mt-3 text-sm font-bold leading-7 text-ink">{CONTACT.address}</p>
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-goldsoft px-3 py-1 text-[0.7rem] font-extrabold text-golddeep">
              <IconStar8 className="h-3 w-3" />
              {CONTACT.landmark}
            </p>
          </div>
        </Reveal>

        <Reveal delay={260}>
          <div className="lift h-full rounded-[18px] border border-sea/15 bg-card p-6">
            <span className="grid h-12 w-12 place-items-center rounded-[13px] bg-mist text-sea">
              <IconClock className="h-6 w-6" />
            </span>
            <h3 className="font-display mt-4 text-2xl text-pine">ساعت کاری</h3>
            <ul className="mt-3 space-y-2.5 text-sm font-bold text-ink">
              {CONTACT.hours.map((h) => (
                <li key={h.days} className="flex items-center justify-between gap-2">
                  <span className="text-inksoft">{h.days}</span>
                  <span className="text-seadeep">{h.time}</span>
                </li>
              ))}
            </ul>
            <p
              className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.72rem] font-extrabold ${
                open ? "bg-sea/10 text-seadeep" : "bg-clay/10 text-clay"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${open ? "bg-teal pulse-ring" : "bg-clay"}`} />
              {open ? "هم‌اکنون باز هستیم" : "هم‌اکنون بسته‌ایم"}
            </p>
          </div>
        </Reveal>
      </div>

      {/* نقشه + نمای ساختمان */}
      <div className="mt-8 grid gap-4 lg:grid-cols-5">
        <Reveal delay={120} className="lg:col-span-3">
          <div className="h-full min-h-[16rem]">
            <MapCard />
          </div>
        </Reveal>
        <Reveal delay={200} className="lg:col-span-2">
          <div className="arch-ring h-full bg-gradient-to-b from-sea/20 to-transparent p-2.5">
            <div className="arch relative h-full min-h-[16rem] overflow-hidden">
              <img
                src={IMG.exterior}
                alt="نمای ساختمان درمانگاه خیریه آوای مهر ولی‌الله"
                className="kenburns h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pine/60 via-transparent to-transparent" />
              <p className="font-display absolute bottom-4 start-5 text-xl text-card drop-shadow">
                ساختمان {faNum(4)} طبقه‌ی درمانگاه
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* ─────────────── فوتر ─────────────── */
export function Footer({ onNavigate }: { onNavigate: (id: TabId) => void }) {
  const go = (id: TabId) => {
    onNavigate(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden bg-pine text-foam">
      <div className="girih-light absolute inset-0" aria-hidden="true" />
      <div className="wrap relative grid gap-10 py-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <button onClick={() => go("home")} className="group flex items-center gap-3 text-start">
            <span className="arch-ring grid h-12 w-12 place-items-center bg-gold text-pine transition-transform duration-300 group-hover:rotate-3">
              <LogoMark className="h-8 w-8" />
            </span>
            <span className="font-display text-xl text-card">آوای مهر ولی‌الله</span>
          </button>
          <p className="mt-4 text-sm leading-7 text-foam/60">
            درمانگاه خیریه با بیش از {faNum(27)} سال سابقه؛ جایی که مهر، صدای سلامتی است.
            خدمات تشخیصی و درمانی با تعرفه‌ی خیریه، برای همه.
          </p>
          <a
            href={CONTACT.instagram}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-[11px] border border-foam/20 px-4 py-2.5 text-sm font-bold text-foam transition-colors hover:border-gold hover:text-gold"
          >
            <IconInstagram className="h-4.5 w-4.5" />
            <span dir="ltr">@{CONTACT.instagramId}</span>
          </a>
        </div>

        <div className="lg:col-span-3">
          <h3 className="font-display text-lg text-gold">دسترسی سریع</h3>
          <ul className="mt-4 space-y-2.5 text-sm font-bold text-foam/75">
            {TABS.filter((t) => t.id !== "home").map((t) => (
              <li key={t.id}>
                <button onClick={() => go(t.id)} className="group flex items-center gap-2 transition-colors hover:text-gold">
                  <IconArrow className="h-3.5 w-3.5 opacity-0 transition-all group-hover:-translate-x-1 group-hover:opacity-100" />
                  {t.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5">
          <h3 className="font-display text-lg text-gold">اطلاعات تماس</h3>
          <ul className="mt-4 space-y-3.5 text-sm leading-7 text-foam/75">
            <li className="flex items-start gap-3">
              <IconPin className="mt-1 h-4.5 w-4.5 shrink-0 text-teal" />
              {CONTACT.address}
            </li>
            <li className="flex flex-wrap items-center gap-3">
              <IconPhone className="h-4.5 w-4.5 shrink-0 text-teal" />
              <a dir="ltr" href={`tel:${CONTACT.phone}`} className="font-bold text-card underline-offset-4 hover:underline">
                {CONTACT.phoneDisplay}
              </a>
              <span className="text-foam/40">|</span>
              <a dir="ltr" href={`tel:${CONTACT.bookingPhone}`} className="font-bold text-card underline-offset-4 hover:underline">
                {CONTACT.bookingPhoneDisplay}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <IconClock className="h-4.5 w-4.5 shrink-0 text-teal" />
              هر روز هفته: ۷ صبح تا ۲۳
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-foam/10">
        <div className="wrap flex flex-wrap items-center justify-between gap-3 py-5 text-[0.74rem] font-bold text-foam/50">
          <span>© {faNum(1404)} درمانگاه خیریه آوای مهر ولی‌الله — تمامی حقوق محفوظ است.</span>
          <span className="flex items-center gap-1.5">
            ساخته‌شده با <IconHeart className="heartbeat h-3.5 w-3.5 text-clay" /> برای سلامتی شما
          </span>
        </div>
      </div>
    </footer>
  );
}
