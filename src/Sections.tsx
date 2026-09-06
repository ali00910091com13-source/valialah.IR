import { STATS, DEPARTMENTS, UNITS, faNum, type TabId } from "./data";
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

/* ─────────────── خدمات تخصصی — پرونده‌های درمانی ─────────────── */
export function Departments({ onNavigate }: { onNavigate?: (id: TabId, articleId?: string) => void }) {
  return (
    <section id="departments" className="relative scroll-mt-24 overflow-hidden bg-paper py-14 sm:py-24">
      <div className="girih absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="wrap relative">
        <Reveal>
          <div className="max-w-2xl">
            <span className="eyebrow">
              <IconStar8 className="h-4 w-4 text-gold" />
              بخش‌ها و خدمات تخصصی
            </span>
            <h1 className="font-display mt-4 text-4xl leading-[1.25] text-pine sm:text-5xl">
              پرونده‌ی <span className="text-sea">سلامت</span> شما، همین‌جا باز می‌شود
            </h1>
            <p className="mt-4 leading-8 text-inksoft">
              سه بخش تخصصی اصلی درمانگاه را ورق بزنید؛ هر بخش با تعرفه‌ی خیریه و
              کادری مجرب، آماده‌ی خدمت است.
            </p>
          </div>
        </Reveal>

        {/* خط‌الوقت عمودی */}
        <div className="relative mt-14">
          <span
            className="absolute right-[1.4rem] top-0 hidden h-full w-[3px] rounded-full bg-gradient-to-b from-sea/40 via-gold/40 to-sea/40 sm:block"
            aria-hidden="true"
          />
          <div className="space-y-16">
            {DEPARTMENTS.map((d, i) => {
              const Ic = ICONS[d.icon];
              const flip = i % 2 === 1;
              return (
                <Reveal key={d.id} delay={60}>
                  <article className="relative grid gap-6 sm:grid-cols-12 sm:gap-8">
                    {/* شماره روی خط‌الوقت */}
                    <span
                      className="font-display absolute right-0 top-1 z-10 hidden h-12 w-12 place-items-center rounded-full border-4 border-paper bg-pine text-2xl text-gold shadow-lg sm:grid"
                      aria-hidden="true"
                    >
                      {faNum(i + 1)}
                    </span>

                    {/* تصویر قوسی */}
                    <div className={`sm:col-span-5 ${flip ? "sm:order-2 sm:col-start-8" : ""}`}>
                      <div className="arch-ring group relative bg-gradient-to-b from-sea/25 to-transparent p-2.5">
                        <div className="arch relative aspect-[4/4.2] overflow-hidden">
                          <img
                            src={d.image}
                            alt={d.title}
                            className="kenburns h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-pine/60 via-transparent to-transparent" />
                          <span className="absolute bottom-4 start-5 flex items-center gap-2 rounded-full bg-card/95 px-3.5 py-1.5 text-[0.7rem] font-extrabold text-seadeep shadow">
                            {Ic && <Ic className="h-4 w-4 text-sea" />}
                            {d.short}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* متن */}
                    <div className={`sm:col-span-7 ${flip ? "sm:order-1 sm:col-start-1" : ""}`}>
                      <div className="flex items-start gap-4">
                        <span className="font-display shrink-0 text-6xl leading-none text-sea/15 sm:text-7xl" aria-hidden="true">
                          {faNum(i + 1)}
                        </span>
                        <div className="pt-1.5">
                          <h2 className="font-display text-3xl leading-tight text-pine sm:text-4xl">{d.title}</h2>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {d.badges.map((b) => (
                              <span key={b} className="chip">
                                <IconStar8 className="h-3 w-3 text-gold" />
                                {b}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="mt-4 leading-8 text-inksoft">{d.desc}</p>
                      <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                        {d.services.map((s) => (
                          <li
                            key={s}
                            className="flex items-start gap-2.5 rounded-[11px] bg-mist/60 px-3.5 py-2.5 text-[0.83rem] font-bold text-pine transition-colors hover:bg-goldsoft/70"
                          >
                            <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-sea" strokeWidth={2.4} />
                            {s}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-6 flex flex-wrap items-center gap-4">
                        <button
                          onClick={() => onNavigate?.("doctors")}
                          className="group inline-flex items-center gap-2 rounded-[10px] bg-sea px-5 py-2.5 text-sm font-bold text-foam transition-all hover:-translate-y-0.5 hover:bg-seadeep"
                        >
                          پزشکان این حوزه
                          <IconArrow className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        </button>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── سایر بخش‌ها (بنتو) ─────────────── */
export function OtherUnits() {
  const [big, ...rest] = UNITS;
  return (
    <section id="units" className="relative scroll-mt-24 bg-mist/60 py-14 sm:py-24">
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
                  {ICONS[big.icon] && <span className="[&>svg]:h-7 [&>svg]:w-7">{renderIcon(big.icon)}</span>}
                </span>
                <h3 className="font-display mt-5 text-3xl">{big.title}</h3>
                <p className="mt-2 max-w-md text-[0.85rem] leading-7 text-foam/70">{big.desc}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {big.chips?.map((c) => (
                    <span
                      key={c}
                      className="rounded-full border border-foam/25 px-3 py-1.5 text-[0.7rem] font-extrabold text-foam/85 transition-colors hover:border-gold hover:text-gold"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
          {rest.map((u, i) => (
            <Reveal key={u.title} delay={120 + i * 80}>
              <div className="card-lift group h-full rounded-[18px] border border-sea/15 bg-card p-6">
                <span className="grid h-12 w-12 place-items-center rounded-[13px] bg-mist text-sea transition-colors duration-300 group-hover:bg-sea group-hover:text-foam">
                  {renderIcon(u.icon)}
                </span>
                <h3 className="font-display mt-4 text-2xl text-pine">{u.title}</h3>
                <p className="mt-1.5 text-[0.8rem] leading-7 text-inksoft">{u.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function renderIcon(name: string) {
  const Ic = ICONS[name];
  return Ic ? <Ic className="h-6 w-6" /> : null;
}
