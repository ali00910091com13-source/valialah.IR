import { STATS, DEPARTMENTS, UNITS, faNum, type TabId, type Department } from "./data";
import { Reveal, CountUp } from "./fx";
import { ICONS, IconStar8, IconCheck, IconArrow, IconHeartPulse } from "./Icons";

/* ─────────────── نوار آمار ─────────────── */
export function StatsBand() {
  return (
    <section className="relative overflow-hidden bg-pine py-16 sm:py-20">
      <div className="girih-light absolute inset-0" aria-hidden="true" />
      <div className="wrap relative">
        <Reveal>
          <h2 className="font-display text-center text-3xl text-card sm:text-4xl">
            امکانات مجموعه در یک نگاه
          </h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {STATS.map((s, i) => {
            const Ic = ICONS[s.icon];
            return (
              <Reveal key={s.label} delay={i * 80}>
                <div className="card-lift group h-full rounded-[16px] border border-foam/12 bg-pine2/70 p-5 text-center">
                  {Ic && <Ic className="mx-auto h-7 w-7 text-teal transition-transform duration-300 group-hover:-translate-y-1" />}
                  <div className="font-display mt-3 text-4xl text-gold">
                    {s.approx && "≈"}
                    <CountUp to={s.value} />
                  </div>
                  <div className="mt-1.5 text-[0.78rem] font-extrabold leading-5 text-foam/90">{s.label}</div>
                  {s.note && <div className="mt-1 text-[0.64rem] font-bold text-foam/45">{s.note}</div>}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── بخش‌های تخصصی — پرونده‌های درمانی ─────────────── */
export function Departments({ onNavigate }: { onNavigate?: (id: TabId, articleId?: string) => void }) {
  return (
    <section className="relative overflow-hidden bg-paper py-14 sm:py-24">
      <div className="girih absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="wrap relative">
        {/* سربرگ editorial */}
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5 border-b-[3px] border-pine pb-6">
            <div>
              <span className="eyebrow">
                <IconStar8 className="h-4 w-4 text-gold" />
                پرونده‌های درمانی مجموعه
              </span>
              <h1 className="font-display mt-4 text-[2.6rem] leading-[1.15] text-pine sm:text-6xl">
                بخش‌های <span className="text-sea">تخصصی</span>
              </h1>
            </div>
            <p className="max-w-sm text-sm leading-8 text-inksoft sm:text-[0.95rem]">
              سه پرونده‌ی مجزا؛ هر کدام با کادر مجرب، تجهیزات اختصاصی و تعرفه‌ی
              خیریه — از دندان تا تصویربرداری، زیر یک سقف.
            </p>
          </div>
        </Reveal>

        {/* پرونده‌ها روی خط‌الوقت */}
        <div className="relative">
          <div
            className="absolute bottom-6 start-[1.3rem] top-6 hidden w-px border-s-2 border-dashed border-sea/30 md:block"
            aria-hidden="true"
          />
          {DEPARTMENTS.map((d, i) => (
            <Dossier key={d.id} d={d} i={i} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Dossier({
  d,
  i,
  onNavigate,
}: {
  d: Department;
  i: number;
  onNavigate?: (id: TabId, articleId?: string) => void;
}) {
  const num = faNum(String(i + 1).padStart(2, "0"));
  const flip = i % 2 === 1;
  const Ic = ICONS[d.icon];

  return (
    <article className="relative border-b border-sea/15 py-10 last:border-b-0 sm:py-14">
      {/* گره‌ی خط‌الوقت */}
      <span
        className="absolute start-0 top-14 hidden h-11 w-11 place-items-center rounded-full bg-pine text-gold shadow-[0_10px_24px_-10px_rgba(11,59,56,0.6)] ring-4 ring-paper md:grid"
        aria-hidden="true"
      >
        <span className="font-display text-lg leading-none pt-1">{num}</span>
      </span>

      <div className="md:ps-20">
        {/* سرتیتر پرونده با شماره‌ی شبحی */}
        <Reveal>
          <div className="relative">
            <span
              className="font-display pointer-events-none absolute -top-8 start-0 select-none text-[5rem] leading-none text-sea/10 sm:-top-10 sm:text-[7.5rem]"
              aria-hidden="true"
            >
              {num}
            </span>
            <div className="relative flex flex-wrap items-center gap-3 sm:gap-4">
              {Ic && (
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px] bg-pine text-gold shadow-[0_12px_26px_-12px_rgba(11,59,56,0.65)] sm:h-14 sm:w-14">
                  <Ic className="h-6 w-6 sm:h-7 sm:w-7" />
                </span>
              )}
              <h2 className="font-display text-3xl text-pine sm:text-5xl">{d.title}</h2>
              <span className="chip">{d.short}</span>
              <span className="chip max-[400px]:hidden">
                <IconCheck className="h-3 w-3 text-sea" strokeWidth={2.6} />
                {faNum(d.services.length)} خدمت فعال
              </span>
            </div>
          </div>
        </Reveal>

        <div className="mt-7 grid gap-7 lg:grid-cols-12 lg:items-start">
          {/* تصویر قوسی */}
          <Reveal delay={120} className={`lg:col-span-5 ${flip ? "lg:order-2" : ""}`}>
            <div className="arch-ring bg-gradient-to-b from-gold/50 via-sea/25 to-transparent p-2 shadow-[0_30px_60px_-35px_rgba(11,59,56,0.55)] sm:p-2.5">
              <div className="arch relative aspect-[4/3.3] overflow-hidden">
                <img src={d.image} alt={d.title} className="kenburns h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-pine/65 via-pine/5 to-transparent" aria-hidden="true" />
                <span className="font-display absolute end-4 top-3 rounded-full bg-pine/55 px-3 py-1 text-lg leading-7 text-gold backdrop-blur-sm">
                  {faNum(d.services.length)} خدمت
                </span>
                <div className="absolute bottom-3 start-3.5 end-3.5 flex flex-wrap gap-1.5">
                  {d.badges.slice(0, 2).map((b) => (
                    <span key={b} className="rounded-full bg-card/90 px-2.5 py-1 text-[0.62rem] font-extrabold text-seadeep">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* شرح و خدمات */}
          <Reveal delay={200} className={`lg:col-span-7 ${flip ? "lg:order-1" : ""}`}>
            <p className="max-w-2xl text-[0.92rem] leading-8 text-inksoft sm:text-base sm:leading-9">
              {d.desc}
            </p>
            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {d.services.map((s) => (
                <li
                  key={s}
                  className="group flex items-start gap-3 rounded-[12px] border border-sea/12 bg-card px-3.5 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/60 hover:bg-goldsoft/50"
                >
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sea/12 text-sea transition-all duration-300 group-hover:scale-110 group-hover:bg-gold group-hover:text-pine">
                    <IconCheck className="h-3.5 w-3.5" strokeWidth={2.6} />
                  </span>
                  <span className="text-[0.82rem] font-bold leading-6 text-pine">{s}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate?.("doctors")}
                className="group btn btn-sea py-2.5! text-sm"
              >
                پزشکان {d.title}
                <IconArrow className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              </button>
              {d.badges[2] && <span className="chip">{d.badges[2]}</span>}
            </div>
          </Reveal>
        </div>
      </div>
    </article>
  );
}

/* ─────────────── سایر بخش‌ها (بنتو) ─────────────── */
export function OtherUnits() {
  const [big, ...rest] = UNITS;
  const BigIc = ICONS[big.icon];
  return (
    <section className="relative bg-mist/60 py-14 sm:py-24">
      <div className="wrap">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow">
                <IconHeartPulse className="h-4 w-4 text-gold" />
                سایر بخش‌های مجموعه
              </span>
              <h2 className="font-display mt-4 text-4xl leading-tight text-pine sm:text-5xl">
                یک سقف، <span className="text-sea">همه‌ی نیازها</span>
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-inksoft">
              از آزمایش تا داروخانه؛ خدمات پشتیبان درمان در خود مجموعه فراهم است تا
              رفت‌وآمد شما کمتر و درمان کامل‌تر باشد.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal className="sm:col-span-2 lg:col-span-2 lg:row-span-2">
            <div className="card-lift relative h-full overflow-hidden rounded-[20px] bg-pine p-7 text-foam sm:p-8">
              <div className="girih-light absolute inset-0" aria-hidden="true" />
              <div className="relative">
                <span className="grid h-14 w-14 place-items-center rounded-[15px] bg-gold text-pine">
                  {BigIc && <BigIc className="h-7 w-7" />}
                </span>
                <h3 className="font-display mt-5 text-3xl">{big.title}</h3>
                <p className="mt-2 max-w-md text-[0.85rem] leading-7 text-foam/70">{big.desc}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {big.chips?.map((c) => (
                    <span key={c} className="rounded-full border border-foam/25 px-3 py-1.5 text-[0.7rem] font-extrabold text-foam/85 transition-colors hover:border-gold hover:text-gold">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
          {rest.map((u, i) => {
            const Ic = ICONS[u.icon];
            return (
              <Reveal key={u.title} delay={120 + i * 80}>
                <div className="card-lift group h-full rounded-[18px] border border-sea/15 bg-card p-6">
                  <span className="grid h-12 w-12 place-items-center rounded-[13px] bg-mist text-sea transition-colors duration-300 group-hover:bg-sea group-hover:text-foam">
                    {Ic && <Ic className="h-6 w-6" />}
                  </span>
                  <h3 className="font-display mt-4 text-2xl text-pine">{u.title}</h3>
                  <p className="mt-1.5 text-[0.8rem] leading-7 text-inksoft">{u.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
