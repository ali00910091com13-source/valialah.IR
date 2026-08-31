import {
  INSURERS,
  BASE_INSURERS,
  TEAM_SPECIALTIES,
  CONTACT,
  IMG,
  faNum,
  type Insurer,
} from "./data";
import { Reveal, Stamp, CountUp } from "./fx";
import {
  IconShield,
  IconStar8,
  IconCheck,
  IconHeartPulse,
  IconInstagram,
  IconPhone,
} from "./Icons";

/* ---------------- insurance wall ---------------- */
function InsurerTile({ it, i }: { it: Insurer; i: number }) {
  const isLatin = it.mono === "SOS";
  return (
    <Reveal delay={Math.min(i * 55, 440)} className="h-full">
      <div className="group h-full">
        <div
          className="relative flex h-28 flex-col items-center justify-center overflow-hidden rounded-b-[14px] rounded-t-[3.2rem] shadow-[0_14px_30px_-16px_rgba(7,39,42,0.45)] transition-transform duration-300 group-hover:-translate-y-1.5 group-hover:rotate-[0.6deg]"
          style={{ backgroundColor: it.color }}
        >
          <div className="girih-light absolute inset-0 opacity-50" aria-hidden="true" />
          <span
            className={`font-display relative leading-none text-foam ${
              isLatin ? "text-[1.35rem] tracking-[0.15em]" : "text-[2.6rem]"
            }`}
            dir={isLatin ? "ltr" : undefined}
          >
            {it.mono}
          </span>
          <span className="relative mt-2 text-[0.6rem] font-bold tracking-[0.25em] text-foam/80">
            {isLatin ? "INSURANCE" : "بیمه"}
          </span>
        </div>
        <div className="mt-2.5 flex items-center justify-between gap-2 rounded-[11px] border border-sea/15 bg-card px-3 py-2.5 transition-colors duration-300 group-hover:border-sea/45 group-hover:bg-mist/60">
          <span className="text-[0.82rem] font-extrabold leading-6 text-pine">
            {it.name}
          </span>
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sea/10 text-sea transition-colors duration-300 group-hover:bg-sea group-hover:text-foam">
            <IconCheck className="h-3.5 w-3.5" strokeWidth={2.6} />
          </span>
        </div>
      </div>
    </Reveal>
  );
}

export function Insurance() {
  return (
    <section
      id="insurance"
      className="relative scroll-mt-24 overflow-hidden bg-foam py-16 sm:py-24"
    >
      <div className="girih absolute inset-0 opacity-80" aria-hidden="true" />
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(52rem 30rem at 90% 0%, rgba(14,124,116,0.12), transparent 60%)",
        }}
      />
      <div className="wrap relative">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow justify-center text-seadeep!">
              <IconShield className="h-4 w-4 text-gold" />
              پذیرش بیمه‌های مختلف
            </span>
            <h2 className="font-display mt-4 text-4xl leading-tight text-pine sm:text-5xl">
              با خیالِ بیمه‌شده <span className="text-sea">بیایید</span>
            </h2>
            <p className="mt-4 leading-8 text-inksoft">
              برای سهولت و رفاه مراجعین، با بیمه‌های پایه، سازمان‌های خدمات درمانی و
              طیف گسترده‌ای از بیمه‌های تکمیلی طرف قرارداد هستیم؛ تا دغدغه‌ی شما فقط
              سلامتی باشد.
            </p>
          </div>
        </Reveal>

        {/* نوار بیمه‌های پایه */}
        <Reveal delay={120}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-[16px] border border-sea/20 bg-card/85 px-5 py-4 shadow-sm">
            <span className="flex items-center gap-2 text-sm font-extrabold text-pine">
              <IconShield className="h-4.5 w-4.5 text-gold" />
              بیمه‌های پایه:
            </span>
            {BASE_INSURERS.map((b, i) => (
              <span
                key={b}
                className="flex items-center gap-3 text-sm font-bold text-inksoft"
              >
                {b}
                {i < BASE_INSURERS.length - 1 && <span className="text-gold">•</span>}
              </span>
            ))}
          </div>
        </Reveal>

        {/* دیوار لوگوی بیمه‌ها */}
        <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {INSURERS.map((it, i) => (
            <InsurerTile key={it.name} it={it} i={i} />
          ))}
          <Reveal delay={500} className="h-full">
            <div className="flex h-full flex-col">
              <div className="flex h-28 flex-col items-center justify-center gap-1 rounded-b-[14px] rounded-t-[3.2rem] border-2 border-dashed border-gold/60 bg-goldsoft/40">
                <IconStar8 className="h-7 w-7 text-golddeep" />
                <span className="text-[0.6rem] font-bold text-golddeep">و بیشتر…</span>
              </div>
              <div className="mt-2.5 rounded-[11px] border border-dashed border-gold/50 bg-goldsoft/30 px-3 py-2.5 text-center text-[0.82rem] font-extrabold leading-6 text-golddeep">
                سایر بیمه‌های طرف قرارداد
              </div>
            </div>
          </Reveal>
        </div>

        {/* نوار استعلام */}
        <Reveal delay={200}>
          <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-[16px] bg-pine px-6 py-5 sm:flex-row sm:px-8">
            <p className="flex items-center gap-3 text-center text-sm font-bold leading-7 text-foam/85 sm:text-start">
              <IconPhone className="h-5 w-5 shrink-0 text-gold" />
              برای استعلام اعتبار بیمه‌ی خود پیش از مراجعه، تماس بگیرید.
            </p>
            <a
              dir="ltr"
              href={`tel:${CONTACT.phone}`}
              className="btn btn-gold shrink-0 py-2.5! text-sm"
            >
              {CONTACT.phoneDisplay}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- medical team ---------------- */
export function Team({ onNavigate }: { onNavigate?: (id: "doctors") => void }) {
  return (
    <section id="team" className="relative scroll-mt-24 overflow-hidden bg-paper py-24">
      <div className="wrap grid items-center gap-14 lg:grid-cols-2 lg:gap-10">
        <Reveal className="relative order-2 lg:order-1">
          <div className="arch-ring relative p-3">
            <div className="arch-ring absolute inset-0 border-2 border-dashed border-gold/50" />
            <div className="arch relative aspect-[4/4.4] overflow-hidden">
              <img
                src={IMG.team}
                alt="تیم پزشکی درمانگاه خیریه آوای مهر ولی‌الله"
                className="kenburns h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pine/50 via-transparent to-transparent" />
              <div className="absolute bottom-4 start-4 flex items-center gap-3 rounded-[12px] bg-card/95 px-4 py-3 shadow-lg">
                <IconHeartPulse className="heartbeat h-6 w-6 text-sea" />
                <span className="text-sm font-extrabold text-pine">
                  <CountUp to={27} /> پزشک + <CountUp to={15} /> دندانپزشک
                </span>
              </div>
            </div>
          </div>
          <Stamp className="absolute -top-6 -end-4 h-28 w-28 drop-shadow-lg sm:-end-8" />
        </Reveal>

        <div className="order-1 lg:order-2">
          <Reveal>
            <span className="eyebrow">
              <IconStar8 className="h-4 w-4 text-gold" />
              تیم پزشکی مجرب
            </span>
            <h2 className="font-display mt-4 text-4xl leading-tight text-pine sm:text-5xl">
              دستانِ امینِ <span className="text-sea">شهر</span>
            </h2>
            <p className="mt-5 leading-8 text-inksoft">
              با حضور <b className="text-seadeep">{faNum(27)} پزشک متخصص و پزشک عمومی</b> و{" "}
              <b className="text-seadeep">{faNum(15)} دندانپزشک مجرب</b>، درمانگاه آوای مهر
              آمادگی کامل دارد تا با بهره‌گیری از دانش، تجربه و امکانات تخصصی،
              خدمات تشخیصی و درمانی مورد نیاز مراجعین را ارائه نماید.
            </p>
          </Reveal>

          <Reveal delay={140}>
            <div className="mt-6 flex flex-wrap gap-2">
              {TEAM_SPECIALTIES.map((s) => (
                <span key={s} className="chip">
                  <IconStar8 className="h-3 w-3 text-gold" />
                  {s}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={220}>
            <blockquote className="relative mt-8 rounded-[16px] border border-sea/20 bg-card p-6 pe-8">
              <span className="font-display absolute -top-5 start-6 text-7xl leading-none text-gold">
                ”
              </span>
              <p className="font-display text-2xl leading-relaxed text-seadeep">
                سلامت شما، اولویت ماست.
              </p>
              <footer className="mt-2 flex items-center gap-2 text-sm font-semibold text-inksoft">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4.5 w-4.5 text-sea"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5.5 18.5c8.5 1 13.5-4.5 13.5-13.5-9.5 0-14.5 5.5-13.5 13.5z" />
                  <path d="M5.5 18.5c2.8-4.8 6.8-8.5 11.5-10.5" />
                </svg>
                آوای مهر؛ صدای سلامت و خدمت
              </footer>
            </blockquote>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a
                href={CONTACT.instagram}
                target="_blank"
                rel="noreferrer"
                className="btn btn-line py-2.5! text-sm"
              >
                <IconInstagram className="h-4.5 w-4.5" />
                <span dir="ltr">@{CONTACT.instagramId}</span>
              </a>
              <button
                onClick={() => onNavigate?.("doctors")}
                className="text-sm font-bold text-seadeep underline underline-offset-4 transition-colors hover:text-gold"
              >
                مشاهده پزشکان و درخواست ویزیت
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
