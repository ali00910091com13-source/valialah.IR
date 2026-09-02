import { useState, type FC, type SVGProps } from "react";

export type P = SVGProps<SVGSVGElement>;

const base: P = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export const IconTooth: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="M12 5.4C10.9 4.2 8.6 3.8 7.2 5.1 5.7 6.5 5.8 8.7 6.8 10.7c.8 1.6 1.2 3.4 1.4 5.6.1 1.2 1.7 1.5 2.1.3l1-3c.2-.7 1-.7 1.3 0l1 3c.4 1.2 2 1 2.1-.3.2-2.2.6-4 1.4-5.6 1-2 1.1-4.2-.4-5.6-1.4-1.3-3.7-.9-4.8.3z" />
  </svg>
);

export const IconPulse: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="M3 12h4l2-5 3.5 10 2.5-7 1.5 2H21" />
  </svg>
);

export const IconBuilding: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="M4 21V5.5L12 3v18" />
    <path d="M12 21V8l8 2.5V21" />
    <path d="M2.5 21h19" />
    <path d="M7 8h.01M7 12h.01M7 16h.01M16 13h.01M16 17h.01" strokeWidth="2.1" />
  </svg>
);

export const IconDoor: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
    <path d="M3 21h18" />
    <circle cx="15" cy="12.5" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const IconUsers: FC<P> = (p) => (
  <svg {...base} {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 19.5c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5" />
    <path d="M15.5 5.6a3.2 3.2 0 0 1 0 4.9" />
    <path d="M17.6 14.9c1.6.7 2.6 2.3 2.9 4.6" />
  </svg>
);

export const IconStetho: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="M5 3.5v5a4.5 4.5 0 0 0 9 0v-5" />
    <path d="M9.5 13v2.5a4.5 4.5 0 0 0 9 0v-1.6" />
    <circle cx="18.5" cy="11.5" r="2.2" />
  </svg>
);

export const IconBone: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="M7.5 9.5 14.5 16.5" />
    <path d="M9.3 7.7a2.4 2.4 0 1 0-3.4-3.4 2.4 2.4 0 1 0-1.6 4.1 2.4 2.4 0 1 0 4.1-1.6z" />
    <path d="M14.7 16.3a2.4 2.4 0 1 0 3.4 3.4 2.4 2.4 0 1 0 1.6-4.1 2.4 2.4 0 1 0-4.1 1.6z" />
  </svg>
);

export const IconWave: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="M3 12c2.2 0 2.2-4 4.4-4s2.2 8 4.4 8 2.2-8 4.4-8 2.2 4 4.8 4" />
    <path d="M3 18h18" opacity="0.4" />
  </svg>
);

export const IconFlask: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="M9.5 3h5" />
    <path d="M10.5 3v6L5.7 18a2 2 0 0 0 1.8 3h9a2 2 0 0 0 1.8-3L13.5 9V3" />
    <path d="M7.5 15h9" />
  </svg>
);

export const IconEar: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="M7 9a5.5 5.5 0 1 1 10 3.2c-1 1.7-2.6 2.4-3 4.3-.3 1.6-1.3 3-3 3-1.5 0-2.4-1-2.6-2.3" />
    <path d="M10.5 9.5a3 3 0 0 1 5 1.5c0 1.3-1.3 1.8-2 2.8" />
  </svg>
);

export const IconPill: FC<P> = (p) => (
  <svg {...base} {...p}>
    <rect x="3.2" y="8.6" width="17.6" height="6.8" rx="3.4" transform="rotate(-45 12 12)" />
    <path d="M8.5 8.5l7 7" />
  </svg>
);

export const IconGlasses: FC<P> = (p) => (
  <svg {...base} {...p}>
    <circle cx="6.5" cy="14" r="3.2" />
    <circle cx="17.5" cy="14" r="3.2" />
    <path d="M9.7 13.5c.7-1 3.9-1 4.6 0" />
    <path d="M3.3 13.5 2.5 11M20.7 13.5l.8-2.5" />
  </svg>
);

export const IconShield: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3 5 5.8v5.4c0 4.5 2.9 7.7 7 9.8 4.1-2.1 7-5.3 7-9.8V5.8z" />
    <path d="m9 11.6 2.1 2.2L15.3 9.5" />
  </svg>
);

export const IconPhone: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="M5.5 4h3l1.5 4-2 1.5a12.5 12.5 0 0 0 6.5 6.5L16 14l4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3.5 6.2 2 2 0 0 1 5.5 4z" />
  </svg>
);

export const IconClock: FC<P> = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const IconPin: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="M12 21s7-6.1 7-11.5a7 7 0 1 0-14 0C5 14.9 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.6" />
  </svg>
);

export const IconHeart: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="M12 20.5C6.5 16 3.5 12.9 3.5 9.2 3.5 6.7 5.4 5 7.6 5c1.8 0 3.3 1 4.4 2.7C13.1 6 14.6 5 16.4 5c2.2 0 4.1 1.7 4.1 4.2 0 3.7-3 6.8-8.5 11.3z" />
  </svg>
);

export const IconHeartPulse: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="M12 20.5C6.5 16 3.5 12.9 3.5 9.2 3.5 6.7 5.4 5 7.6 5c1.8 0 3.3 1 4.4 2.7C13.1 6 14.6 5 16.4 5c2.2 0 4.1 1.7 4.1 4.2 0 3.7-3 6.8-8.5 11.3z" />
    <path d="M6.5 12h3l1.5-2.8 2 5 1.5-3.4 1 1.2h4" />
  </svg>
);

export const IconHandHeart: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="M3 14.5V21" />
    <path d="M3 17h3.5l3 1.5h5a1.6 1.6 0 0 0 0-3.2H10" />
    <path d="M14.5 15.5 19 12.8a1.7 1.7 0 0 1 2 2.8l-4.5 3.9H9.5" />
    <path d="M12 9.8C9.9 8.1 8.8 6.9 8.8 5.5 8.8 4.5 9.5 3.8 10.4 3.8c.7 0 1.3.4 1.6 1 .4-.6 1-1 1.7-1 .9 0 1.6.7 1.6 1.7 0 1.4-1.2 2.6-3.3 4.3z" />
  </svg>
);

export const IconCheck: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

export const IconArrow: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="M19 12H5" />
    <path d="m11 6-6 6 6 6" />
  </svg>
);

export const IconStar8: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
    <path d="M18.5 16.5l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6z" strokeWidth="1.3" />
  </svg>
);

export const IconInstagram: FC<P> = (p) => (
  <svg {...base} {...p}>
    <rect x="4" y="4" width="16" height="16" rx="4.5" />
    <circle cx="12" cy="12" r="3.6" />
    <circle cx="16.8" cy="7.2" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const IconCalendar: FC<P> = (p) => (
  <svg {...base} {...p}>
    <rect x="4" y="5.5" width="16" height="15" rx="2.5" />
    <path d="M4 10h16M8.5 3.5v3.5M15.5 3.5v3.5" />
    <path d="m9.5 15 1.8 1.8 3.4-3.6" />
  </svg>
);

export const IconBolt: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="M13 3 5 13.5h5.5L10 21l8-10.5h-5.5z" />
  </svg>
);

export const IconSpark: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="M12 4v4M12 16v4M4 12h4M16 12h4M6.8 6.8l2 2M15.2 15.2l2 2M17.2 6.8l-2 2M8.8 15.2l-2 2" />
  </svg>
);

export const IconCross: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="M9.5 3.5h5v6h6v5h-6v6h-5v-6h-6v-5h6z" />
  </svg>
);

export const IconSearch: FC<P> = (p) => (
  <svg {...base} {...p}>
    <circle cx="10.5" cy="10.5" r="6" />
    <path d="m15.5 15.5 4.5 4.5" />
  </svg>
);

export const IconDoctor: FC<P> = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="7.5" r="3.4" />
    <path d="M5.5 20.5c.7-4 3.3-6.2 6.5-6.2s5.8 2.2 6.5 6.2" />
    <path d="M12 14.3v2.4M10.8 15.5h2.4" strokeWidth="1.5" />
  </svg>
);

export const IconHome: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="m3.5 11 8.5-7 8.5 7" />
    <path d="M5.5 9.5V20h13V9.5" />
    <path d="M10 20v-5h4v5" />
  </svg>
);

export const IconPlus: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M5 12h14" strokeWidth="2" />
  </svg>
);

export const IconTrash: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="M4 7h16" />
    <path d="M9 7V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v2" />
    <path d="M6.5 7l.8 12a2 2 0 0 0 2 1.9h5.4a2 2 0 0 0 2-1.9l.8-12" />
    <path d="M10 11v6M14 11v6" />
  </svg>
);

export const IconEdit: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="M12 20h8" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5z" />
  </svg>
);

export const IconGear: FC<P> = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5.3 5.3l1.9 1.9M16.8 16.8l1.9 1.9M18.7 5.3l-1.9 1.9M7.2 16.8l-1.9 1.9" />
  </svg>
);

export const IconKey: FC<P> = (p) => (
  <svg {...base} {...p}>
    <circle cx="8" cy="15.5" r="4.2" />
    <path d="M11.2 12.3 20 3.5M16.2 7.3l2.6 2.6M13.6 9.9l1.9 1.9" />
  </svg>
);

export const IconRefresh: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="M20 5v5h-5" />
    <path d="M20 10a8 8 0 1 0 .6 4" />
  </svg>
);

export const IconClose: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6 6 18" strokeWidth="2" />
  </svg>
);

export const IconNews: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="M4 5.5h13v14H5.5A1.5 1.5 0 0 1 4 18z" />
    <path d="M17 8.5h2a1 1 0 0 1 1 1v8a1.5 1.5 0 0 1-1.5 1.5H17" />
    <path d="M7 9h7M7 12.5h7M7 16h4.5" />
  </svg>
);

export const LogoMark: FC<P> = (p) => (
  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" {...p}>
    <path
      d="M8.5 24c4-8 9-12 15.5-12S35.5 16 39.5 24c-4 8-9 12-15.5 12S12.5 32 8.5 24z"
      stroke="currentColor"
      strokeWidth="2"
      opacity="0.35"
    />
    <path
      d="M24 39.5C14.8 31.9 9.4 26.6 9.4 19.9c0-4.4 3.4-7.6 7.4-7.6 3.1 0 5.7 1.9 7.2 4.7 1.5-2.8 4.1-4.7 7.2-4.7 4 0 7.4 3.2 7.4 7.6 0 6.7-5.4 12-14.6 19.6z"
      fill="currentColor"
    />
    <path
      d="M13.5 22.6h5.4l2-4.2 3.3 8.4 2.4-5.8 1.6 1.6h6.3"
      stroke="var(--color-goldsoft)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * لوگوی رسمی درمانگاه — اگر تصویر به هر دلیلی بارگذاری نشد
 * (قطعی اینترنت، فیلترینگ و…) به‌صورت خودکار نشان جایگزین نمایش داده می‌شود.
 */
export const LogoImg: FC<{ src: string; className?: string; style?: React.CSSProperties }> = ({
  src,
  className = "",
  style,
}) => {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <LogoMark className={`${className} text-sea`} style={style} />;
  }
  return (
    <img
      src={src}
      alt="لوگوی درمانگاه خیریه آوای مهر ولی‌الله"
      className={className}
      style={style}
      onError={() => setFailed(true)}
    />
  );
};

export const ICONS: Record<string, FC<P>> = {
  tooth: IconTooth,
  pulse: IconPulse,
  building: IconBuilding,
  door: IconDoor,
  users: IconUsers,
  stetho: IconStetho,
  bone: IconBone,
  wave: IconWave,
  flask: IconFlask,
  ear: IconEar,
  pill: IconPill,
  glasses: IconGlasses,
  shield: IconShield,
  phone: IconPhone,
  clock: IconClock,
  pin: IconPin,
  heart: IconHeart,
  heartPulse: IconHeartPulse,
  handHeart: IconHandHeart,
  check: IconCheck,
  arrow: IconArrow,
  star8: IconStar8,
  instagram: IconInstagram,
  calendar: IconCalendar,
  bolt: IconBolt,
  spark: IconSpark,
  cross: IconCross,
  search: IconSearch,
  doctor: IconDoctor,
  home: IconHome,
  plus: IconPlus,
  trash: IconTrash,
  edit: IconEdit,
  gear: IconGear,
  key: IconKey,
  refresh: IconRefresh,
};
