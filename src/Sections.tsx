import { useState } from "react";
import { STATS, DEPARTMENTS, UNITS, CONTACT, faNum, type TabId } from "./data";
import { Reveal, CountUp } from "./fx";
import { ICONS, IconStar8, IconCheck, IconArrow, IconSpark } from "./Icons";

/* ─────────────── stats band ─────────────── */
export function StatsBand() {
  return (
    <section id="facilities" className="relative scroll-mt-24 overflow-hidden bg-pine py-20">
      <div className="girih-light absolute inset-0" aria-hidden="true" />
      <div className="wrap relative">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow border-gold/40! bg-gold/10! text-gold!">
                <IconStar8 className="h-4 w-4" />
                امکانات مجموعه
              </span>
              <h2 className="font-display mt-4 text-4xl leading-tight text-card sm:text-5xl">
                مجموعه‌ای که <span className="text-gold">اندازه‌ی اعتماد</span> شماست
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-foam/70">
              از ساختمان ۴ طبقه تا روزانه حدود {faNum(500)} مراجعه؛ همه‌چیز برای خدمتِ
              شایسته به شما آماده است.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-3">
          {STATS.map((s, i) => {
            const Ic = ICONS[s.icon];
            return (
              <Reveal key={s.label} delay={i * 90}>
                <div className="lift group relative h-full overflow-hidden rounded-[16px] border border-foam/12 bg-pine2/70 p-5 sm:p-6">
                  <span className="absolute -left-5 -top-5 h-16 w-16 rounded-full bg-gold/10 transition-transform duration-500 group-hover:scale-[2.2]" aria-hidden="true" />
                  <span className="relative grid h-11 w-11 place-items-center rounded-[12px] bg-gold/15 text-gold">
                    {Ic && <Ic className="h-5.5 w-5.5" />}
                  </span>
                  <div className="font-display relative mt-4 text-4xl text-card sm:text-5xl">
                    {s.approx && <span className="text-2xl text-foam/60">≈</span>}
                    <CountUp to={s.value} />
                  </div>
                  <div className="relative mt-1 text-sm font-extrabold text-foam/90 sm:text-base">{s.label}</div>
                  {s.note && <div className="relative mt-0.5 text-[0.7rem] font-semibold text-foam/50">{s.note}</div>}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── departments (sticky tabs) ─────────────── */
export function Departments({ onNavigate }: { onNavigate?: (id: TabId) => void }) {
  const [idx, setIdx] = useState(0);
  const d = DEPARTMENTS[idx];

  return (
    <section id="departments" className="relative scroll-mt-24 bg-paper py-14 sm:py-24">
      <div className="wrap">
        <Reveal>
          <div className="max-w-2xl">
            <span className="eyebrow">
              <IconStar8 className="h-4 w-4 text-gold" />
              بخش‌ها و خدمات تخصصی
            </span>
            <h2 className="font-display mt-4 text-4xl leading-tight text-pine sm:text-5xl">
              هر آنچه بدن لازم دارد، <span className="text-sea">این‌جاست</span>
            </h2>
            <p className="mt-4 leading-8 text-inksoft">
              سه بخش تخصصی مجهز که با حضور پزشکان و متخصصان مجرب، خدمات کامل
              تشخیصی و درمانی را ارائه می‌دهند.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-8">
          {/* ریل تب‌ها */}
          <div className="lg:col-span-4">
            <div className="no-scrollbar fade-x flex gap-3 overflow-x-auto pb-2 lg:sticky lg:top-28 lg:flex-col lg:overflow-visible lg:pb-0">
              {DEPARTMENTS.map((dep, i) => {
                const Ic = ICONS[dep.icon];
                const activeTab = i === idx;
                return (
                  <button
                    key={dep.id}
                    onClick={() => setIdx(i)}
                    className={`group flex min-w-[13.5rem] shrink-0 items-center gap-3.5 rounded-[14px] border p-3.5 text-start transition-all duration-300 sm:min-w-[15rem] sm:p-4 lg:w-full ${
                      activeTab
                        ? "border-sea bg-sea text-mist shadow-[0_18px_40px_-16px_rgba(10,90,84,0.55)] lg:-translate-x-2"
                        : "border-sea/20 bg-card text-pine hover:border-sea/50 hover:bg-mist"
                    }`}
                  >
                    <span
                      className={`grid h-12 w-12 shrink-0 place-items-center rounded-[12px] transition-colors ${
                        activeTab ? "bg-gold text-pine" : "bg-mist text-sea group-hover:bg-foam"
                      }`}
                    >
                      <Ic className="h-6 w-6" />
                    </span>
                    <span>
                      <span className="font-display block text-xl leading-6">{dep.title}</span>
                      <span className={`mt-0.5 block text-[0.72rem] font-semibold ${activeTab ? "text-foam/80" : "text-inksoft"}`}>
                        {dep.short} • {faNum(dep.services.length)} خدمت
                      </span>
                    </span>
                  </button>
                );
              })}
              <div className="mt-2 hidden rounded-[14px] border border-dashed border-gold/50 bg-goldsoft/40 p-4 text-[0.82rem] leading-6 text-golddeep lg:block">
                <b>نکته:</b> برای اطلاع از تعرفه‌های خیریه‌ای هر بخش، با شماره{" "}
                <a dir="ltr" href={`tel:${CONTACT.phone}`} className="font-bold underline underline-offset-4">
                  {CONTACT.phoneDisplay}
                </a>{" "}
                تماس بگیرید.
              </div>
            </div>
          </div>

          {/* محتوای بخش */}
          <div className="lg:col-span-8">
            <div key={d.id} className="fadeup">
              <div className="relative overflow-hidden rounded-[18px] border border-sea/15 bg-card shadow-[0_24px_60px_-30px_rgba(7,39,42,0.35)]">
                <div className="relative h-52 overflow-hidden sm:h-72">
                  <img src={d.image} alt={d.title} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-pine/70 via-pine/10 to-transparent" />
                  <div className="absolute bottom-3 start-4 end-4 flex flex-wrap gap-1.5 sm:bottom-4 sm:start-5 sm:end-auto sm:gap-2">
                    {d.badges.map((b) => (
                      <span key={b} className="rounded-full bg-goldsoft/95 px-3 py-1 text-[0.72rem] font-extrabold text-pine">
                        {b}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-display absolute start-4 top-3 text-2xl text-card drop-shadow-md sm:start-5 sm:top-4 sm:text-4xl">
                    {d.title}
                  </h3>
                </div>

                <div className="p-5 sm:p-8">
                  <p className="leading-8 text-inksoft">{d.desc}</p>
                  <ul className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                    {d.services.map((s, i) => (
                      <li
                        key={s}
                        className="fadeup flex items-start gap-3 rounded-[10px] border border-sea/10 bg-mist/60 px-3.5 py-3 text-sm font-semibold text-pine transition-colors hover:border-sea/40 hover:bg-foam/60"
                        style={{ animationDelay: `${120 + i * 60}ms` }}
                      >
                        <IconCheck className="mt-0.5 h-4.5 w-4.5 shrink-0 text-sea" strokeWidth={2.4} />
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── other units bento ─────────────── */
export function OtherUnits() {
  const big = UNITS.find((u) => u.big)!;
  const smalls = UNITS.filter((u) => !u.big);

  return (
    <section className="relative bg-foam py-14 sm:py-24">
      <div className="girih absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="wrap relative">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow justify-center text-seadeep!">
              <IconSpark className="h-4 w-4 text-gold" />
              سایر بخش‌های مجموعه
            </span>
            <h2 className="font-display mt-4 text-4xl leading-tight text-pine sm:text-5xl">
              یک سقف، <span className="text-sea">همه‌ی نیازها</span>
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* کارت بزرگ کلینیک */}
          <Reveal className="sm:col-span-2 lg:col-span-2 lg:row-span-2">
            <div className="lift relative h-full overflow-hidden rounded-[18px] bg-pine p-7 text-foam sm:p-8">
              <div className="girih-light absolute inset-0" aria-hidden="true" />
              <div className="relative">
                <span className="grid h-14 w-14 place-items-center rounded-[15px] bg-gold text-pine">
                  {(() => {
                    const Ic = ICONS[big.icon];
                    return Ic ? <Ic className="h-7 w-7" /> : null;
                  })()}
                </span>
                <h3 className="font-display mt-5 text-3xl text-card">{big.title}</h3>
                <p className="mt-2 text-sm leading-7 text-foam/75">{big.desc}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {big.chips?.map((c) => (
                    <span
                      key={c}
                      className="rounded-full border border-foam/20 bg-foam/10 px-3 py-1.5 text-[0.72rem] font-bold text-foam/90 transition-colors hover:border-gold/60 hover:text-gold"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* چهار کارت کوچک */}
          {smalls.map((u, i) => {
            const Ic = ICONS[u.icon];
            return (
              <Reveal key={u.title} delay={120 + i * 90}>
                <div className="lift group h-full rounded-[18px] border border-sea/15 bg-card p-6">
                  <span className="grid h-12 w-12 place-items-center rounded-[13px] bg-mist text-sea transition-all duration-300 group-hover:bg-sea group-hover:text-foam">
                    {Ic && <Ic className="h-6 w-6" />}
                  </span>
                  <h3 className="font-display mt-4 text-2xl text-pine">{u.title}</h3>
                  <p className="mt-1.5 text-[0.84rem] leading-7 text-inksoft">{u.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
