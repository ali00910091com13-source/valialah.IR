import { useMemo, useState } from "react";
import { DOCTOR_SPECS, faNum, CONTACT, BOOKING_LINKS } from "./data";
import { useDoctors } from "./doctorStore";
import { Reveal } from "./fx";
import {
  IconDoctor,
  IconSearch,
  IconStetho,
  IconPhone,
  IconClose,
  IconCheck,
  IconArrow,
} from "./Icons";

const SPEC_LABEL = Object.fromEntries(DOCTOR_SPECS.map((s) => [s.id, s.label]));

export default function Doctors() {
  const [query, setQuery] = useState("");
  const [spec, setSpec] = useState<string>("all");
  const doctors = useDoctors();

  const list = useMemo(() => {
    const q = query.trim();
    return doctors.filter((d) => {
      const okSpec = spec === "all" || d.spec === spec;
      if (!okSpec) return false;
      if (!q) return true;
      const hay = `${d.name} ${d.title} ${d.focus ?? ""} ${SPEC_LABEL[d.spec]}`;
      return hay.includes(q);
    });
  }, [query, spec, doctors]);

  const specCount = (id: string) => doctors.filter((d) => d.spec === id).length;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
      {/* ── سربرگ ── */}
      <Reveal>
        <div className="text-center">
          <span className="eyebrow justify-center text-seadeep!">
            <IconDoctor className="h-4.5 w-4.5" />
            تیم پزشکی ما
          </span>
          <h1 className="font-display mt-4 text-4xl leading-[1.25] text-pine sm:text-5xl">
            پزشکان درمانگاه آوای مهر
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-inksoft sm:text-lg">
            مجموعه‌ای از پزشکان متخصص و عمومی در کنار دندانپزشکان مجرب؛ با بیش از{" "}
            {faNum(27)} سال تجربه در خدمت سلامت شما. پزشک موردنظر خود را جستجو یا بر
            اساس تخصص فیلتر کنید.
          </p>
        </div>
      </Reveal>

      {/* ── جستجو و فیلترها ── */}
      <Reveal delay={80}>
        <div className="mt-8">
          <div className="relative mx-auto max-w-xl">
            <IconSearch className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sea" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="نام پزشک یا تخصص…"
              aria-label="جستجوی پزشک"
              className="w-full rounded-full border-2 border-sea/20 bg-card py-3.5 pr-12 pl-11 text-base text-ink shadow-sm outline-none transition-all placeholder:text-inksoft/50 focus:border-sea focus:shadow-lg focus:shadow-sea/10"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="پاک کردن جستجو"
                className="absolute left-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-sea/10 text-sea transition-colors hover:bg-sea hover:text-foam"
              >
                <IconClose className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="fade-x no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:justify-center sm:overflow-visible">
            <FilterChip active={spec === "all"} onClick={() => setSpec("all")} label="همه تخصص‌ها" count={doctors.length} />
            {DOCTOR_SPECS.map((s) => (
              <FilterChip
                key={s.id}
                active={spec === s.id}
                onClick={() => setSpec(spec === s.id ? "all" : s.id)}
                label={s.label}
                count={specCount(s.id)}
              />
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── نتایج ── */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-bold text-inksoft">
            <b className="font-display text-lg text-seadeep">{faNum(list.length)}</b> پزشک یافت شد
          </span>
          {(spec !== "all" || query) && (
            <button
              onClick={() => {
                setSpec("all");
                setQuery("");
              }}
              className="flex items-center gap-1.5 font-bold text-clay transition-colors hover:text-clay/70"
            >
              <IconClose className="h-4 w-4" />
              حذف فیلترها
            </button>
          )}
        </div>

        {list.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-sea/25 bg-card/60 px-6 py-16 text-center">
            <IconSearch className="mx-auto h-12 w-12 text-sea/30" />
            <p className="font-display mt-4 text-xl text-pine">پزشکی با این مشخصات یافت نشد</p>
            <p className="mt-2 text-sm leading-7 text-inksoft">
              عبارت دیگری جستجو کنید یا برای اطلاع از برنامه کامل حضور پزشکان با
              پذیرش تماس بگیرید.
            </p>
            <a href={`tel:${CONTACT.phone}`} className="btn btn-sea mx-auto mt-6 inline-flex">
              <IconPhone className="h-5 w-5" />
              تماس با پذیرش
            </a>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((d, i) => (
              <Reveal key={d.name} delay={Math.min(i * 50, 300)}>
                <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-sea/15 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-sea/40 hover:shadow-xl hover:shadow-sea/10">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-sea to-teal opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="flex items-start gap-4">
                    {d.photo ? (
                      <img
                        src={d.photo}
                        alt={d.name}
                        className="h-14 w-14 shrink-0 rounded-2xl border-2 border-sea/30 object-cover transition-colors duration-300 group-hover:border-sea"
                      />
                    ) : (
                      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-sea/10 text-sea transition-colors duration-300 group-hover:bg-sea group-hover:text-foam">
                        <IconStetho className="h-7 w-7" />
                      </span>
                    )}
                    <div className="min-w-0">
                      <span className="inline-block rounded-full bg-goldsoft px-2.5 py-0.5 text-[11px] font-bold text-golddeep">
                        {SPEC_LABEL[d.spec] ?? d.spec}
                      </span>
                      <h3 className="font-display mt-1.5 text-lg leading-7 text-pine">{d.name}</h3>
                    </div>
                  </div>
                  <p className="mt-3.5 text-sm font-semibold leading-7 text-ink">{d.title}</p>
                  {d.focus && (
                    <p className="mt-2 flex items-start gap-2 text-[13px] leading-6 text-inksoft">
                      <IconCheck className="mt-1 h-3.5 w-3.5 shrink-0 text-sea" />
                      {d.focus}
                    </p>
                  )}
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
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      {/* ── یادداشت و رزرو ── */}
      <Reveal delay={120}>
        <div className="mt-10 rounded-3xl bg-seadeep p-6 text-center text-foam sm:p-8">
          <p className="font-display text-xl leading-9 sm:text-2xl">
            برنامه حضور پزشکان در روزهای مختلف هفته متفاوت است.
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-8 text-foam/80">
            برای رزرو نوبت می‌توانید از سامانه‌های آنلاین استفاده کنید یا با
            شماره‌های پذیرش تماس بگیرید.
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
      </Reveal>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-bold transition-all duration-200 active:scale-95 ${
        active
          ? "border-sea bg-sea text-foam shadow-md shadow-sea/25"
          : "border-sea/25 bg-card text-ink hover:border-sea/50 hover:bg-sea/5"
      }`}
    >
      {label}
      <span
        className={`rounded-full px-1.5 py-0.5 text-[11px] ${
          active ? "bg-foam/20" : "bg-sea/10 text-seadeep"
        }`}
      >
        {faNum(count)}
      </span>
    </button>
  );
}
