import { useEffect, useRef, useState } from "react";
import { BOOKING_LINKS, CONTACT } from "./data";
import { IconCalendar, IconPhone, IconArrow, IconClose } from "./Icons";

type Props = {
  label?: string;
  variant?: "gold" | "sea" | "line";
  className?: string;
};

/**
 * دکمه «رزرو نوبت» — با کلیک، فهرست سامانه‌های نوبت‌دهی آنلاین
 * (پذیرش۲۴ و دکترتو) و تماس تلفنی باز می‌شود.
 */
export default function BookingMenu({
  label = "رزرو نوبت آنلاین",
  variant = "gold",
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`btn btn-${variant} ${open ? "ring-2 ring-gold/40" : ""}`}
      >
        <IconCalendar className="h-4.5 w-4.5" />
        {label}
        <svg
          viewBox="0 0 24 24"
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="menu-pop fixed inset-x-3 bottom-4 z-[70] sm:absolute sm:inset-x-auto sm:bottom-auto sm:end-0 sm:top-full sm:mt-3 sm:w-[19.5rem]">
          <div className="overflow-hidden rounded-[16px] border border-sea/25 bg-card shadow-[0_24px_60px_-18px_rgba(7,39,42,0.45)]">
            <div className="flex items-center justify-between bg-pine px-4 py-3">
              <span className="font-display text-base text-gold">انتخاب سامانه نوبت‌دهی</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="بستن"
                className="grid h-7 w-7 place-items-center rounded-full text-foam/70 transition-colors hover:bg-foam/10 hover:text-foam"
              >
                <IconClose className="h-4 w-4" />
              </button>
            </div>
            <div className="p-2">
              {BOOKING_LINKS.map((b) => (
                <a
                  key={b.name}
                  href={b.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between gap-3 rounded-[12px] px-3 py-2.5 transition-colors hover:bg-mist"
                >
                  <span>
                    <span className="block text-sm font-extrabold text-pine transition-colors group-hover:text-seadeep">
                      {b.name}
                    </span>
                    <span className="block text-[0.72rem] font-semibold text-inksoft">{b.note}</span>
                  </span>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[9px] bg-mist text-sea transition-all group-hover:bg-sea group-hover:text-foam">
                    <IconArrow className="h-4 w-4 -rotate-45" />
                  </span>
                </a>
              ))}
            </div>
            <a
              href={`tel:${CONTACT.bookingPhone}`}
              className="flex items-center justify-between gap-3 border-t border-sea/15 bg-goldsoft/40 px-4 py-3 transition-colors hover:bg-goldsoft"
            >
              <span className="flex items-center gap-2 text-sm font-extrabold text-pine">
                <IconPhone className="h-4 w-4 text-golddeep" />
                نوبت‌دهی تلفنی
              </span>
              <span dir="ltr" className="font-display text-base text-golddeep">
                {CONTACT.bookingPhoneDisplay}
              </span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
