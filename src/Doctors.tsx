import { useMemo, useState } from "react";
import { DOCTOR_SPECS, CONTACT, BOOKING_LINKS, type SpecId } from "./data";
import { useDoctors } from "./doctorStore";
import { Reveal } from "./fx";
import {
  IconSearch,
  IconStar8,
  IconDoctor,
  IconPhone,
  IconArrow,
  IconCheck,
} from "./Icons";

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
];
const tintOf = (spec: SpecId) => {
  const i = DOCTOR_SPECS.findIndex((s) => s.id === spec);
  return TINTS[(i < 0 ? 0 : i) % TINTS.length];
};
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
      const hay = `${d.name} ${d.title} ${d.focus ?? ""} ${SPEC_LABEL[d.spec] ?? ""}`;
      return hay.includes(q);
    });
  }, [query, spec, doctors]);

  const specCount = (id: string) => doctors.filter((d) => d.spec === id).length;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
      {/* سربرگ */}
      <Reveal>
        <div className="text-center">
          <span className="eyebrow justify-center text-seadeep!">
            <IconDoctor className="h-4 w-4" />
            تیم درمان
          </span>
          <h1 className="font-display mt-4 text-4xl leading-[1.25] text-pine sm:text-5xl">
            پزشکان <span className="text-sea">آوای مهر</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl leading-8 text-inksoft">
            فهرست پزشکان و متخصصان حاضر در درمانگاه؛ نام پزشک موردنظر را جستجو کنید
            یا بر اساس تخصص فیلتر کنید.
          </p>
        </div>
      </Reveal>

      {/* جستجو */}
      <Reveal delay={120}>
        <div className="relative mx-auto mt-8 max-w-xl">
          <IconSearch className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sea/60" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی نام پزشک یا تخصص…"
            className="w-full rounded-[14px] border border-sea/25 bg-card py-3.5 pe-4 ps-12 text-sm font-semibold text-ink shadow-[0_14px_40px_-24px_rgba(11,59,56,0.5)] outline-none transition-all placeholder:text-inksoft/60 focus:border-sea focus:shadow-[0_0_0_4px_rgba(14,124,116,0.14)]"
          />
        </div>
      </Reveal>

      {/* فیلتر تخصص‌ها */}
      <Reveal delay={180}>
        <div className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
          <FilterChip
            active={spec === "all"}
            onClick={() => setSpec("all")}
            label="همه تخصص‌ها"
            count={doctors.length}
          />
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
      </Reveal>

      {/* کارت‌های پزشکان */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((d, i) => {
          const tint = tintOf(d.spec);
          return (
            <Reveal key={`${d.name}-${i}`} delay={Math.min(i * 60, 300)}>
              <article className="lift group relative flex h-full flex-col overflow-hidden rounded-[18px] border border-sea/15 bg-card p-5">
                <span className="absolute inset-x-0 top-0 h-1.5" style={{ background: tint }} aria-hidden="true" />
                <div className="flex items-start gap-4">
                  {d.photo ? (
                    <img
                      src={d.photo}
                      alt={d.name}
                      className="h-16 w-16 shrink-0 rounded-[16px] border-2 object-cover"
                      style={{ borderColor: `${tint}55` }}
                    />
                  ) : (
                    <span
                      className="grid h-16 w-16 shrink-0 place-items-center rounded-[16px] transition-transform duration-300 group-hover:scale-105"
                      style={{ background: `${tint}18` }}
                    >
                      <IconDoctor className="h-8 w-8" style={{ color: tint }} />
                    </span>
                  )}
                  <div className="min-w-0">
                    <h2 className="font-display truncate text-xl leading-7 text-pine">{d.name}</h2>
                    <p className="mt-0.5 text-[0.82rem] font-extrabold" style={{ color: tint }}>
                      {d.title}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.68rem] font-extrabold"
                    style={{ background: `${tint}14`, color: tint }}
                  >
                    <IconStar8 className="h-3 w-3" />
                    {SPEC_LABEL[d.spec] ?? d.spec}
                  </span>
                </div>
                {d.focus && <p className="mt-3 flex-1 text-[0.82rem] leading-7 text-inksoft">{d.focus}</p>}
                <div className="mt-auto flex items-center justify-between gap-2 border-t border-sea/10 pt-4">
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
          );
        })}
      </div>

      {list.length === 0 && (
        <div className="mt-10 rounded-[18px] border border-dashed border-sea/40 bg-card p-12 text-center">
          <IconSearch className="mx-auto h-10 w-10 text-sea/40" />
          <p className="font-display mt-4 text-2xl text-pine">پزشکی یافت نشد</p>
          <p className="mt-2 text-sm font-semibold text-inksoft">
            عبارت دیگری جستجو کنید یا فیلتر تخصص را بردارید.
          </p>
          <button
            onClick={() => {
              setQuery("");
              setSpec("all");
            }}
            className="btn btn-sea mt-6 py-2.5! text-sm"
          >
            نمایش همه پزشکان
          </button>
        </div>
      )}

      {/* نوار پایین */}
      <Reveal delay={150}>
        <div className="relative mt-14 overflow-hidden rounded-[20px] bg-pine p-7 text-center text-foam sm:p-10">
          <div className="girih-light absolute inset-0" aria-hidden="true" />
          <div className="relative">
            <h2 className="font-display text-3xl text-card sm:text-4xl">
              روز و ساعت حضور هر پزشک را <span className="text-gold">استعلام</span> کنید
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-8 text-white/80">
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
                    i === 0 ? "btn-gold" : "border-2 border-white/30 text-white hover:bg-white/10"
                  }`}
                >
                  <IconArrow className="h-4.5 w-4.5 -rotate-45" />
                  نوبت از {b.name}
                </a>
              ))}
              <a
                href={`tel:${CONTACT.bookingPhone}`}
                className="btn w-full border-2 border-white/30 text-white hover:bg-white/10 sm:w-auto"
              >
                <IconPhone className="h-4.5 w-4.5" />
                نوبت‌دهی: <span dir="ltr">{CONTACT.bookingPhoneDisplay}</span>
              </a>
            </div>
          </div>
        </div>
      </Reveal>

      {/* نکته */}
      <p className="mt-6 flex items-center justify-center gap-2 text-center text-[0.74rem] font-bold text-inksoft">
        <IconCheck className="h-4 w-4 text-sea" strokeWidth={2.4} />
        فهرست پزشکان به‌صورت متمرکز مدیریت می‌شود و همیشه به‌روز است.
      </p>
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
      className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-[0.78rem] font-extrabold transition-all duration-200 ${
        active
          ? "border-sea bg-sea text-foam shadow-[0_10px_24px_-12px_rgba(10,90,84,0.7)]"
          : "border-sea/25 bg-card text-pine hover:border-sea/60 hover:bg-mist"
      }`}
    >
      {label}
      <span
        className={`rounded-full px-1.5 py-0.5 text-[0.62rem] font-black ${
          active ? "bg-foam/20 text-foam" : "bg-mist text-inksoft"
        }`}
      >
        {count > 0 ? String(count).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]) : "۰"}
      </span>
    </button>
  );
}
