import { useMemo, useState } from "react";
import { DOCTOR_SPECS, BOOKING_LINKS, CONTACT, faNum } from "./data";
import { useDoctors } from "./doctorStore";
import { Reveal } from "./fx";
import { IconSearch, IconDoctor, IconArrow, IconPhone, IconStar8 } from "./Icons";

const SPEC_LABEL = Object.fromEntries(DOCTOR_SPECS.map((s) => [s.id, s.label]));
const TINTS = [
  "#0e7c74",
  "#d69a25",
  "#b65a45",
  "#24408e",
  "#5d7c2e",
  "#0e7490",
  "#5b5bd6",
  "#8a5a12",
  "#b03052",
  "#12a594",
  "#2f7d4f",
  "#1f6fb2",
  "#cf7a1c",
];
const tintOf = (spec: string) => {
  const i = DOCTOR_SPECS.findIndex((s) => s.id === spec);
  return TINTS[(i < 0 ? 0 : i) % TINTS.length];
};
const monoOf = (name: string) =>
  name.replace(/^دکتر\s*/, "").trim().charAt(0) || "؟";

export default function Doctors() {
  const [query, setQuery] = useState("");
  const [spec, setSpec] = useState("all");
  const doctors = useDoctors();

  const list = useMemo(() => {
    const q = query.trim();
    return doctors.filter((d) => {
      if (spec !== "all" && d.spec !== spec) return false;
      if (!q) return true;
      return `${d.name} ${d.title} ${d.focus ?? ""} ${SPEC_LABEL[d.spec] ?? ""}`.includes(q);
    });
  }, [query, spec, doctors]);

  const specCount = (id: string) => doctors.filter((d) => d.spec === id).length;

  return (
    <div className="relative overflow-hidden">
      <div className="girih absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="wrap relative pb-20 pt-10 sm:pt-14">
        <Reveal>
          <div className="max-w-2xl">
            <span className="eyebrow">
              <IconDoctor className="h-4 w-4 text-gold" />
              تیم پزشکی مجرب
            </span>
            <h1 className="font-display mt-4 text-4xl leading-[1.25] text-pine sm:text-5xl">
              پزشکان <span className="text-sea">آوای مهر</span>
            </h1>
            <p className="mt-4 leading-8 text-inksoft">
              {faNum(27)} پزشک متخصص و عمومی به‌همراه {faNum(15)} دندانپزشک مجرب؛
              نام پزشک یا تخصص موردنظرتان را جستجو کنید.
            </p>
          </div>
        </Reveal>

        {/* جستجو */}
        <Reveal delay={120}>
          <div className="relative mt-8 max-w-xl">
            <IconSearch className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-inksoft/60" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجوی نام پزشک یا حوزه‌ی تخصصی…"
              className="w-full rounded-[15px] border border-sea/25 bg-card py-3.5 pe-4 ps-12 text-sm font-bold text-pine shadow-sm outline-none transition-all placeholder:font-normal placeholder:text-inksoft/60 focus:border-sea focus:shadow-[0_0_0_4px_rgba(14,124,116,0.12)]"
            />
          </div>
        </Reveal>

        {/* فیلتر تخصص‌ها */}
        <Reveal delay={180}>
          <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setSpec("all")}
              className={`shrink-0 rounded-full border px-4 py-2 text-[0.78rem] font-extrabold transition-all ${
                spec === "all"
                  ? "border-pine bg-pine text-gold"
                  : "border-sea/25 bg-card text-pine hover:border-sea/60 hover:bg-mist"
              }`}
            >
              همه ({faNum(doctors.length)})
            </button>
            {DOCTOR_SPECS.map((s) => {
              const n = specCount(s.id);
              if (n === 0) return null;
              const active = spec === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSpec(active ? "all" : s.id)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-[0.78rem] font-extrabold transition-all ${
                    active
                      ? "border-pine bg-pine text-gold"
                      : "border-sea/25 bg-card text-pine hover:border-sea/60 hover:bg-mist"
                  }`}
                >
                  {s.label} ({faNum(n)})
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* کارت پزشکان */}
        {list.length === 0 ? (
          <div className="mt-10 rounded-[18px] border border-dashed border-sea/30 bg-card p-12 text-center">
            <IconDoctor className="mx-auto h-12 w-12 text-sea/40" />
            <p className="mt-4 font-display text-2xl text-pine">پزشکی یافت نشد</p>
            <p className="mt-1.5 text-sm text-inksoft">عبارت دیگری جستجو کنید یا فیلتر را بردارید.</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((d, i) => (
              <Reveal key={`${d.name}-${i}`} delay={Math.min(i * 60, 300)}>
                <div className="card-lift group flex h-full flex-col rounded-[18px] border border-sea/15 bg-card p-5">
                  <div className="flex items-center gap-3.5">
                    {d.photo ? (
                      <img src={d.photo} alt={d.name} className="h-14 w-14 shrink-0 rounded-[15px] object-cover ring-2 ring-sea/25" />
                    ) : (
                      <span
                        className="font-display grid h-14 w-14 shrink-0 place-items-center rounded-[15px] text-2xl ring-2 transition-transform duration-300 group-hover:-translate-y-1"
                        style={{ background: `${tintOf(d.spec)}1a`, color: tintOf(d.spec), boxShadow: `inset 0 0 0 2px ${tintOf(d.spec)}33` }}
                      >
                        {monoOf(d.name)}
                      </span>
                    )}
                    <div className="min-w-0">
                      <h3 className="font-display truncate text-xl leading-6 text-pine">{d.name}</h3>
                      <span
                        className="mt-1 inline-block rounded-full px-2.5 py-0.5 text-[0.66rem] font-extrabold"
                        style={{ background: `${tintOf(d.spec)}1a`, color: tintOf(d.spec) }}
                      >
                        {SPEC_LABEL[d.spec] ?? d.spec}
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-[0.84rem] font-bold text-ink">{d.title}</p>
                  {d.focus && <p className="mt-1 text-[0.76rem] leading-6 text-inksoft">{d.focus}</p>}
                  <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                    <a
                      href={BOOKING_LINKS[0].url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-bold text-sea transition-colors hover:text-seadeep"
                    >
                      <IconArrow className="h-4 w-4 -rotate-45" />
                      رزرو نوبت آنلاین
                    </a>
                    <a
                      href={`tel:${CONTACT.phone}`}
                      className="inline-flex items-center gap-1.5 text-[12px] font-bold text-inksoft transition-colors hover:text-seadeep"
                    >
                      <IconPhone className="h-3.5 w-3.5" />
                      تلفنی
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {/* نوار استعلام برنامه پزشکان */}
        <Reveal delay={200}>
          <div className="relative mt-10 overflow-hidden rounded-[20px] bg-pine p-7 text-center text-foam sm:p-9">
            <div className="girih-light absolute inset-0" aria-hidden="true" />
            <div className="relative">
              <IconStar8 className="mx-auto h-8 w-8 text-gold" />
              <h2 className="font-display mt-3 text-2xl sm:text-3xl">برنامه‌ی حضور پزشکان را استعلام کنید</h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-8 text-foam/80">
                برای رزرو نوبت می‌توانید از سامانه‌های آنلاین استفاده کنید یا با شماره‌های پذیرش تماس بگیرید.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                {BOOKING_LINKS.map((b, i) => (
                  <a
                    key={b.name}
                    href={b.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`btn w-full sm:w-auto ${
                      i === 0 ? "btn-gold" : "border-2 border-foam/30 text-foam hover:bg-foam/10"
                    }`}
                  >
                    <IconArrow className="h-4.5 w-4.5 -rotate-45" />
                    نوبت از {b.name}
                  </a>
                ))}
                <a
                  href={`tel:${CONTACT.bookingPhone}`}
                  className="btn w-full border-2 border-foam/30 text-foam hover:bg-foam/10 sm:w-auto"
                >
                  <IconPhone className="h-4.5 w-4.5" />
                  نوبت‌دهی: <span dir="ltr">{CONTACT.bookingPhoneDisplay}</span>
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
