import { INSURANCES, TEAM_SPECIALTIES, CONTACT, IMG, faNum } from "./data";
import { Reveal, Stamp, CountUp } from "./fx";
import {
  IconShield,
  IconStar8,
  IconHeartPulse,
  IconInstagram,
} from "./Icons";

/* ---------------- insurance marquee ---------------- */
function InsuranceRow({ reverse = false }: { reverse?: boolean }) {
  const seq = [
    ...INSURANCES.map((n) => ({ n, extra: false })),
    { n: "", extra: true },
  ];
  const items = [...seq, ...seq];
  return (
    <div className="marquee">
      <div className={`marquee-track py-1.5 ${reverse ? "rev" : ""}`}>
        {items.map((it, i) =>
          it.extra ? (
            <span
              key={`extra-${i}`}
              className="ms-3 flex shrink-0 items-center gap-2.5 rounded-full border border-dashed border-gold/70 bg-goldsoft/60 px-5 py-2.5 text-sm font-bold text-golddeep"
            >
              <IconStar8 className="h-4 w-4" />و سایر بیمه‌های طرف قرارداد…
            </span>
          ) : (
            <span
              key={`${it.n}-${i}`}
              className="ms-3 flex shrink-0 items-center gap-2.5 rounded-full border border-sea/20 bg-card px-5 py-2.5 text-sm font-bold text-pine transition-colors hover:border-gold hover:bg-goldsoft"
            >
              <IconShield className="h-4.5 w-4.5 text-sea" />
              {it.n}
            </span>
          ),
        )}
      </div>
    </div>
  );
}

export function Insurance() {
  return (
    <section id="insurance" className="relative scroll-mt-24 overflow-hidden bg-foam py-24">
      <div className="girih absolute inset-0 opacity-80" aria-hidden="true" />
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
              درمانگاه با <b className="text-seadeep">کلیه بیمه‌های پایه و خدمات درمانی</b>،
              بیمه نیروهای مسلح و طیف گسترده‌ای از بیمه‌های تکمیلی طرف قرارداد است؛
              تا دغدغه‌ی شما فقط سلامتی باشد.
            </p>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="mt-12 space-y-3">
            <InsuranceRow />
            <InsuranceRow reverse />
          </div>
        </Reveal>

        <Reveal delay={250}>
          <p className="mt-8 text-center text-[0.82rem] font-semibold text-inksoft">
            برای استعلام اعتبار بیمه‌ی خود پیش از مراجعه، با شماره{" "}
            <a dir="ltr" href={`tel:${CONTACT.phone}`} className="font-extrabold text-seadeep underline underline-offset-4 hover:text-gold">
              {CONTACT.phoneDisplay}
            </a>{" "}
            تماس بگیرید.
          </p>
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


