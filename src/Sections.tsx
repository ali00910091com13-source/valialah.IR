import { useState } from "react";
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

/* ─────────────── بخش‌های تخصصی با تب چسبان ─────────────── */
export function Departments({ onNavigate }: { onNavigate?: (id: TabId, articleId?: string) => void }) {
  const [idx, setIdx] = useState(0);
  const d = DEPARTMENTS[idx];

  return (
    <section id="departments" className="relative scroll-mt-24 bg-paper py-14 sm:py-24">
      <div className="girih absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="wrap relative">
        <Reveal>
          <div className="max-w-2xl">
            <span className="eyebrow">
              <IconStar8 className="h-4 w-4 text-gold" />
              بخش‌ها و خدمات تخصصی
            </span>
            <h1 className="font-display mt-4 text-4xl leading-[1.25] text-pine sm:text-5xl">
              هر آنچه برای <span className="text-sea">سلامتی</span> لازم است
            </h1>
            <p className="mt-4 leading-8 text-inksoft">
              سه بخش تخصصی اصلی درمانگاه را انتخاب کنید تا خدمات و جزئیات هر بخش
              را ببینید؛ همه با تعرفه‌ی خیریه.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-12">
          {/* تب‌ها */}
          <div className="lg:col-span-4">
            <div className="no-scrollbar fade-x flex gap-3 overflow-x-auto pb-2 lg:sticky lg:top-28 lg:flex-col lg:overflow-visible lg:pb-0">
              {DEPARTMENTS.map((dep, i) => {
                const Ic = ICONS[dep.icon];
                const active = i === idx;
                return (
                  <button
                    key={dep.id}
                    onClick={() => setIdx(i)}
                    className={`group flex min-w-[13.5rem] shrink-0 items-center gap-3.5 rounded-[14px] border p-3.5 text-start transition-all duration-300 sm:min-w-[15rem] sm:p-4 lg:w-full ${
                      active
                        ? "border-sea bg-pine text-foam shadow-[0_20px_44px_-20px_rgba(11,59,56,0.55)]"
                        : "border-sea/20 bg-card text-pine hover:border-sea/50 hover:bg-mist"
                    }`}
                  >
                    <span
                      className={`grid h-12 w-12 shrink-0 place-items-center rounded-[12px] transition-colors ${
                        active ? "bg-gold text-pine" : "bg-mist text-sea group-hover:bg-sea/15"
                      }`}
                    >
                      {Ic && <Ic className="h-6 w-6" />}
                    </span>
                    <span>
                      <span className="font-display block text-xl leading-6">{dep.title}</span>
                      <span className={`block text-[0.7rem] font-bold ${active ? "text-foam/60" : "text-inksoft"}`}>
                        {dep.short} • {faNum(dep.services.length)} خدمت
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* محتوای بخش */}
          <div className="lg:col-span-8">
            <Reveal key={d.id}>
              <div className="fade-x overflow-hidden rounded-[20px] border border-sea/20 bg-card shadow-[0_30px_70px_-40px_rgba(11,59,56,0.45)]">
                <div className="relative h-52 overflow-hidden sm:h-72">
                  <img src={d.image} alt={d.title} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-pine/70 via-pine/10 to-transparent" />
                  <h3 className="font-display absolute start-4 top-3 text-2xl text-card drop-shadow-md sm:start-5 sm:top-4 sm:text-4xl">
                    {d.title}
                  </h3>
                  <div className="absolute bottom-3 start-4 end-4 flex flex-wrap gap-1.5 sm:bottom-4 sm:start-5 sm:end-auto sm:gap-2">
                    {d.badges.map((b) => (
                      <span key={b} className="rounded-full bg-card/90 px-3 py-1.5 text-[0.66rem] font-extrabold text-seadeep">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-5 sm:p-8">
                  <p className="leading-8 text-inksoft">{d.desc}</p>
                  <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                    {d.services.map((s) => (
                      <li key={s} className="flex items-start gap-2.5 rounded-[11px] bg-mist/60 px-3.5 py-2.5 text-[0.83rem] font-bold text-pine transition-colors hover:bg-goldsoft/70">
                        <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-sea" strokeWidth={2.4} />
                        {s}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-7 flex flex-wrap items-center gap-4 border-t border-sea/10 pt-6">
                    <button
                      onClick={() => onNavigate?.("doctors")}
                      className="group inline-flex items-center gap-2 rounded-[10px] bg-sea px-5 py-2.5 text-sm font-bold text-foam transition-all hover:-translate-y-0.5 hover:bg-seadeep"
                    >
                      پزشکان این حوزه
                      <IconArrow className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
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
                  {ICONS[big.icon] ? <span className="[&>svg]:h-7 [&>svg]:w-7">{renderIcon(big.icon)}</span> : null}
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
