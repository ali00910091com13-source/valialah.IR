import {
  BASE_INSURERS,
  TEAM_SPECIALTIES,
  CONTACT,
  IMG,
  faNum,
  type Insurer,
  type TabId,
} from "./data";
import { Reveal, Stamp, CountUp } from "./fx";
import { useInsurers } from "./insurerStore";
import {
  IconShield,
  IconStar8,
  IconCheck,
  IconHeartPulse,
  IconInstagram,
  IconPhone,
} from "./Icons";

/* ─────────────── دیوار بیمه‌ها ─────────────── */
function InsurerTile({ ins, i }: { ins: Insurer; i: number }) {
  return (
    <Reveal delay={Math.min(i * 60, 360)}>
      <div className="card-lift group relative h-full overflow-hidden rounded-[16px] border border-sea/15 bg-card p-5 pt-6 text-center">
        <span
          className="absolute inset-x-0 top-0 h-1.5 transition-all duration-300 group-hover:h-2.5"
          style={{ background: ins.color }}
          aria-hidden="true"
        />
        {ins.logo ? (
          <span className="mx-auto grid h-14 w-14 place-items-center overflow-hidden rounded-[14px] bg-mist p-1.5 ring-1 ring-sea/15 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105">
            <img src={ins.logo} alt={`لوگوی ${ins.name}`} className="h-full w-full object-contain" />
          </span>
        ) : (
          <span
            className="font-display mx-auto grid h-14 w-14 place-items-center rounded-full text-lg transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105 sm:text-xl"
            style={{ background: `${ins.color}1a`, color: ins.color }}
          >
            {ins.mono}
          </span>
        )}
        <h3 className="mt-3.5 text-[0.92rem] font-extrabold leading-6 text-pine">{ins.name}</h3>
        <p className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-mist px-2.5 py-1 text-[0.66rem] font-bold text-seadeep">
          <IconCheck className="h-3 w-3" strokeWidth={2.6} />
          طرف قرارداد
        </p>
      </div>
    </Reveal>
  );
}

export function Insurance() {
  const insurers = useInsurers();
  return (
    <div className="relative overflow-hidden bg-paper py-14 sm:py-24">
      <div className="girih absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="wrap relative">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow justify-center text-seadeep!">
              <IconShield className="h-4 w-4 text-gold" />
              پذیرش بیمه‌های مختلف
            </span>
            <h2 className="font-display mt-4 text-4xl leading-tight text-pine sm:text-5xl">
              با خیالِ بیمه‌شده بیایید
            </h2>
            <p className="mt-4 leading-8 text-inksoft">
              برای سهولت و رفاه بیشتر مراجعین، درمانگاه با{" "}
              <b className="text-seadeep">کلیه بیمه‌های پایه و خدمات درمانی</b>، بیمه نیروهای مسلح و
              طیف گسترده‌ای از بیمه‌های تکمیلی طرف قرارداد است؛ تا دغدغه‌ی شما فقط سلامتی باشد.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5">
            <span className="text-[0.78rem] font-extrabold text-inksoft">بیمه‌های پایه:</span>
            {BASE_INSURERS.map((b) => (
              <span key={b} className="chip">
                <IconShield className="h-3.5 w-3.5 text-sea" />
                {b}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={200}>
          <h3 className="font-display mt-10 text-center text-2xl text-seadeep sm:text-3xl">
            بیمه‌های تکمیلی طرف قرارداد
          </h3>
        </Reveal>
        <div className="mt-8 grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {insurers.map((ins, i) => (
            <InsurerTile key={`${ins.name}-${i}`} ins={ins} i={i} />
          ))}
          <Reveal delay={380}>
            <div className="flex h-full flex-col items-center justify-center rounded-[16px] border-2 border-dashed border-gold/60 bg-goldsoft/40 p-5 text-center">
              <IconStar8 className="h-8 w-8 text-gold" />
              <h3 className="font-display mt-3 text-xl text-golddeep">و سایر بیمه‌ها…</h3>
              <p className="mt-1.5 text-[0.72rem] font-bold leading-6 text-inksoft">
                برای اطمینان از اعتبار بیمه‌ی خود، پیش از مراجعه استعلام بگیرید.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={260}>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-[16px] bg-pine px-5 py-5 text-foam sm:px-7">
            <p className="flex items-center gap-3 text-sm font-bold leading-7 sm:text-base">
              <IconPhone className="h-5 w-5 shrink-0 text-gold" />
              برای استعلام اعتبار بیمه‌ی خود پیش از مراجعه تماس بگیرید:
            </p>
            <a dir="ltr" href={`tel:${CONTACT.phone}`} className="btn btn-gold py-2.5! text-sm">
              {CONTACT.phoneDisplay}
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* ─────────────── تیم پزشکی (صفحه خانه) ─────────────── */
export function Team({ onNavigate }: { onNavigate?: (id: TabId, articleId?: string) => void }) {
  return (
    <section className="relative overflow-hidden bg-paper py-20 sm:py-24">
      <div className="wrap grid items-center gap-12 lg:grid-cols-2 lg:gap-10">
        <Reveal className="relative order-2 lg:order-1">
          <div className="arch-ring relative bg-gradient-to-b from-sea/25 to-transparent p-3">
            <div className="arch relative aspect-[4/4.4] overflow-hidden">
              <img src={IMG.team} alt="تیم پزشکی درمانگاه خیریه آوای مهر ولی‌الله" className="kenburns h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-pine/50 via-transparent to-transparent" />
              <div className="absolute bottom-4 start-4 flex items-center gap-3 rounded-[12px] bg-card/95 px-4 py-3 shadow-lg">
                <IconHeartPulse className="heartbeat h-6 w-6 text-sea" />
                <span className="text-sm font-extrabold text-pine">
                  <CountUp to={27} /> پزشک + <CountUp to={15} /> دندانپزشک
                </span>
              </div>
            </div>
          </div>
          <Stamp className="absolute -top-6 -end-4 h-24 w-24 drop-shadow-lg sm:-end-8 sm:h-28 sm:w-28" />
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
              <b className="text-seadeep">{faNum(15)} دندانپزشک مجرب</b>، درمانگاه آوای مهر آمادگی
              کامل دارد تا با بهره‌گیری از دانش، تجربه و امکانات تخصصی، خدمات تشخیصی و درمانی مورد
              نیاز مراجعین را ارائه نماید.
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
              <span className="font-display absolute -top-5 start-6 text-7xl leading-none text-gold">”</span>
              <p className="font-display text-2xl leading-relaxed text-seadeep">سلامت شما، اولویت ماست.</p>
              <footer className="mt-2 flex items-center gap-2 text-sm font-semibold text-inksoft">
                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-sea" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5.5 18.5c8.5 1 13.5-4.5 13.5-13.5-9.5 0-14.5 5.5-13.5 13.5z" />
                  <path d="M5.5 18.5c2.8-4.8 6.8-8.5 11.5-10.5" />
                </svg>
                آوای مهر؛ صدای سلامت و خدمت
              </footer>
            </blockquote>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a href={CONTACT.instagram} target="_blank" rel="noreferrer" className="btn btn-line py-2.5! text-sm">
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
