import { useState, type FormEvent } from "react";
import { CONTACT, DEPARTMENTS, IMG, faNum } from "./data";
import { Reveal, useOpenStatus } from "./fx";
import {
  IconPhone,
  IconPin,
  IconClock,
  IconInstagram,
  IconStar8,
  IconArrow,
  IconCheck,
  IconHeart,
  IconHeartPulse,
} from "./Icons";

type FormState = {
  name: string;
  phone: string;
  dept: string;
  time: string;
  note: string;
};

const empty: FormState = { name: "", phone: "", dept: "", time: "", note: "" };

function AppointmentForm() {
  const [f, setF] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [done, setDone] = useState(false);

  const set = (k: keyof FormState) => (e: { target: { value: string } }) => {
    setF((s) => ({ ...s, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const er: Partial<FormState> = {};
    if (f.name.trim().length < 3) er.name = "نام و نام خانوادگی را کامل وارد کنید.";
    if (!/^[0-9۰-۹+\-\s]{8,15}$/.test(f.phone.trim()))
      er.phone = "شماره تماس معتبر نیست (مثلاً ۰۹۱۲۳۴۵۶۷۸۹).";
    if (!f.dept) er.dept = "بخش موردنظر را انتخاب کنید.";
    setErrors(er);
    if (Object.keys(er).length === 0) setDone(true);
  };

  const field =
    "w-full rounded-[10px] border bg-paper px-4 py-3 text-sm font-medium text-ink outline-none transition-all placeholder:text-inksoft/50 focus:border-sea focus:bg-card focus:ring-2 focus:ring-sea/20";

  if (done) {
    return (
      <div className="fadeup flex h-full flex-col items-center justify-center rounded-[18px] border border-sea/25 bg-card p-8 text-center shadow-[0_24px_60px_-30px_rgba(7,39,42,0.35)] sm:p-10">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-sea/12 text-sea">
          <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 12.5 4.5 4.5L19 7.5" className="draw-check" />
          </svg>
        </span>
        <h3 className="font-display mt-5 text-3xl text-pine">درخواست شما ثبت شد</h3>
        <p className="mt-3 max-w-sm leading-8 text-inksoft">
          {f.name} عزیز، درخواست نوبت شما برای بخش <b className="text-seadeep">{f.dept}</b>
          {" "}آماده است. برای قطعی‌شدن نوبت، با شماره زیر تماس بگیرید؛ همکاران ما منتظر شما هستند.
        </p>
        <a href={`tel:${CONTACT.bookingPhone}`} className="btn btn-gold mt-6">
          <IconPhone className="h-4.5 w-4.5" />
          <span dir="ltr">{CONTACT.bookingPhoneDisplay}</span>
        </a>
        <button
          onClick={() => {
            setF(empty);
            setDone(false);
          }}
          className="mt-4 text-sm font-bold text-seadeep underline underline-offset-4 transition-colors hover:text-gold"
        >
          ثبت درخواست دیگر
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="rounded-[18px] border border-sea/25 bg-card p-7 shadow-[0_24px_60px_-30px_rgba(7,39,42,0.35)] sm:p-9"
    >
      <h3 className="font-display text-3xl text-pine">فرم درخواست نوبت</h3>
      <p className="mt-2 text-sm leading-7 text-inksoft">
        اطلاعات را وارد کنید؛ سپس برای هماهنگی نهایی با شما تماس گرفته می‌شود.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[0.8rem] font-extrabold text-pine">نام و نام خانوادگی *</label>
          <input
            className={`${field} ${errors.name ? "border-clay! ring-2 ring-clay/15" : "border-sea/20"}`}
            placeholder="مثلاً: مریم احمدی"
            value={f.name}
            onChange={set("name")}
          />
          {errors.name && <p className="mt-1.5 text-[0.72rem] font-bold text-clay">{errors.name}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-[0.8rem] font-extrabold text-pine">شماره تماس *</label>
          <input
            dir="ltr"
            className={`${field} text-left ${errors.phone ? "border-clay! ring-2 ring-clay/15" : "border-sea/20"}`}
            placeholder="0912 345 6789"
            value={f.phone}
            onChange={set("phone")}
          />
          {errors.phone && <p className="mt-1.5 text-[0.72rem] font-bold text-clay">{errors.phone}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-[0.8rem] font-extrabold text-pine">بخش موردنظر *</label>
          <select
            className={`${field} ${errors.dept ? "border-clay! ring-2 ring-clay/15" : "border-sea/20"}`}
            value={f.dept}
            onChange={set("dept")}
          >
            <option value="">انتخاب کنید…</option>
            {DEPARTMENTS.map((d) => (
              <option key={d.id} value={d.title}>{d.title}</option>
            ))}
            <option value="کلینیک تخصصی و عمومی">کلینیک تخصصی و عمومی</option>
            <option value="آزمایشگاه">آزمایشگاه</option>
            <option value="داروخانه">داروخانه</option>
            <option value="عینک‌سازی">عینک‌سازی</option>
          </select>
          {errors.dept && <p className="mt-1.5 text-[0.72rem] font-bold text-clay">{errors.dept}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-[0.8rem] font-extrabold text-pine">زمان ترجیحی</label>
          <select className={`${field} border-sea/20`} value={f.time} onChange={set("time")}>
            <option value="">فرقی نمی‌کند</option>
            <option value="صبح (۷ تا ۱۲)">صبح (۷ تا ۱۲)</option>
            <option value="بعدازظهر (۱۲ تا ۱۷)">بعدازظهر (۱۲ تا ۱۷)</option>
            <option value="عصر (۱۷ تا ۲۳)">عصر (۱۷ تا ۲۳)</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-[0.8rem] font-extrabold text-pine">توضیحات (اختیاری)</label>
          <textarea
            rows={3}
            className={`${field} resize-none border-sea/20`}
            placeholder="مثلاً: درد دندان عقل، نیاز به نوبت زودتر…"
            value={f.note}
            onChange={set("note")}
          />
        </div>
      </div>

      <button type="submit" className="btn btn-sea mt-6 w-full justify-center text-base">
        ثبت درخواست نوبت
        <IconArrow className="h-4.5 w-4.5" />
      </button>
      <p className="mt-3 text-center text-[0.72rem] leading-6 text-inksoft">
        نوبت‌دهی تلفنی سریع‌تر است: <a dir="ltr" href={`tel:${CONTACT.bookingPhone}`} className="font-extrabold text-seadeep hover:text-gold">{CONTACT.bookingPhoneDisplay}</a>
      </p>
    </form>
  );
}

/* stylized decorative map card */
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
        {/* bridge */}
        <rect x="96" y="126" width="48" height="48" rx="6" fill="none" stroke="#d69a25" strokeWidth="2.5" strokeDasharray="5 5" />
        <text x="120" y="200" textAnchor="middle" fill="#7fae9f" fontSize="12" fontFamily="Vazirmatn">پل محلاتی</text>
        <text x="210" y="143" fill="#7fae9f" fontSize="12" fontFamily="Vazirmatn">بزرگراه شهید محلاتی</text>
        {/* clinic pin */}
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
    <section id="contact" className="relative scroll-mt-24 overflow-hidden bg-paper py-24">
      <div className="girih absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="wrap relative">
        <Reveal>
          <div className="max-w-2xl">
            <span className="eyebrow">
              <IconStar8 className="h-4 w-4 text-gold" />
              نوبت‌دهی و ارتباط با ما
            </span>
            <h2 className="font-display mt-4 text-4xl leading-tight text-pine sm:text-5xl">
              سلامتی را به <span className="text-sea">فردا</span> نیندازید
            </h2>
            <p className="mt-4 leading-8 text-inksoft">
              چه تلفنی، چه حضوری و چه با همین فرم — راهِ رسیدن به ما کوتاه است.
              همکاران ما هر روز از ساعت ۷ صبح پاسخگوی شما هستند.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <AppointmentForm />
          </Reveal>

          <div className="grid content-start gap-5 lg:col-span-5">
            <Reveal delay={100}>
              <div className="rounded-[18px] border border-sea/20 bg-card p-6">
                <h3 className="font-display text-2xl text-pine">اطلاعات تماس</h3>
                <ul className="mt-4 space-y-4 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-mist text-sea">
                      <IconPin className="h-4.5 w-4.5" />
                    </span>
                    <span className="leading-7 text-inksoft">
                      <b className="text-pine">آدرس:</b> {CONTACT.address}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-mist text-sea">
                      <IconPhone className="h-4.5 w-4.5" />
                    </span>
                    <span className="leading-7 text-inksoft">
                      <b className="text-pine">تلفن اصلی:</b>{" "}
                      <a dir="ltr" href={`tel:${CONTACT.phone}`} className="font-extrabold text-seadeep hover:text-gold">{CONTACT.phoneDisplay}</a>
                      <span className="mx-2 text-sea/40">|</span>
                      <b className="text-pine">نوبت‌دهی:</b>{" "}
                      <a dir="ltr" href={`tel:${CONTACT.bookingPhone}`} className="font-extrabold text-seadeep hover:text-gold">{CONTACT.bookingPhoneDisplay}</a>
                      <span className="mx-2 text-sea/40">|</span>
                      <a dir="ltr" href={`tel:${CONTACT.mobile}`} className="font-extrabold text-seadeep hover:text-gold">{CONTACT.mobileDisplay}</a>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-mist text-sea">
                      <IconClock className="h-4.5 w-4.5" />
                    </span>
                    <span className="leading-7 text-inksoft">
                      {CONTACT.hours.map((h) => (
                        <span key={h.days} className="block">
                          <b className="text-pine">{h.days}:</b> {h.time}
                        </span>
                      ))}
                      <span className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.72rem] font-extrabold ${open ? "bg-sea/12 text-seadeep" : "bg-clay/12 text-clay"}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${open ? "pulse-ring bg-sea" : "bg-clay"}`} />
                        وضعیت لحظه‌ای: {open ? "باز" : "بسته"}
                      </span>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-mist text-sea">
                      <IconInstagram className="h-4.5 w-4.5" />
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
        </div>

        {/* clinic exterior banner */}
        <Reveal delay={150}>
          <div className="relative mt-14 overflow-hidden rounded-[20px]">
            <img src={IMG.exterior} alt="نمای ساختمان درمانگاه آوای مهر ولی‌الله" className="h-64 w-full object-cover sm:h-80" />
            <div className="absolute inset-0 bg-gradient-to-l from-pine/85 via-pine/35 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-start justify-center gap-3 p-8 sm:p-12">
              <span className="font-display text-3xl leading-snug text-card sm:text-5xl">
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

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-pine text-foam/80">
      <div className="girih-light absolute inset-0" aria-hidden="true" />
      <div className="wrap relative grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <a href="#home" className="flex items-center gap-3">
            <span className="arch-ring grid h-11 w-11 place-items-center bg-gold text-pine">
              <IconHeartPulse className="heartbeat h-6 w-6" strokeWidth={2} />
            </span>
            <span className="font-display text-xl text-card">آوای مهر ولی‌الله</span>
          </a>
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
            {[
              ["#facilities", "امکانات مجموعه"],
              ["#departments", "بخش‌های تخصصی"],
              ["#insurance", "بیمه‌های طرف قرارداد"],
              ["#team", "تیم پزشکی"],
              ["#charity", "نیکوکاری"],
            ].map(([href, label]) => (
              <li key={href}>
                <a href={href} className="group flex items-center gap-2 transition-colors hover:text-gold">
                  <IconArrow className="h-3.5 w-3.5 text-gold/60 transition-transform group-hover:-translate-x-1" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg text-gold">بخش‌ها</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {["دندانپزشکی", "فیزیوتراپی", "رادیولوژی و سونوگرافی", "آزمایشگاه", "شنوایی‌سنجی", "داروخانه و عینک‌سازی"].map((s) => (
              <li key={s}>
                <a href="#departments" className="transition-colors hover:text-gold">{s}</a>
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
        <div className="wrap flex flex-col items-center justify-between gap-3 py-5 text-[0.78rem] text-foam/50 sm:flex-row">
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
