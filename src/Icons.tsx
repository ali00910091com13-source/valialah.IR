import type { FC, SVGProps } from "react";

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
    <path d="M3.5 20c.6-3.4 2.8-5.2 5.5-5.2s4.9 1.8 5.5 5.2" />
    <path d="M15.2 5.1a3.1 3.1 0 1 1 .4 6.1" />
    <path d="M16.2 15.1c2.2.5 3.8 2.2 4.3 4.9" />
  </svg>
);

export const IconStetho: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="M5.5 3.5v4.7a4.8 4.8 0 0 0 9.6 0V3.5" />
    <path d="M10.3 13v3.2a4.3 4.3 0 0 0 8.6 0v-1.9" />
    <circle cx="18.9" cy="11.6" r="2.2" />
  </svg>
);

export const IconBone: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="M8.4 15.6 15.6 8.4" />
    <circle cx="6.9" cy="14.1" r="2" />
    <circle cx="5.4" cy="17.4" r="2" />
    <circle cx="17.1" cy="9.9" r="2" />
    <circle cx="18.6" cy="6.6" r="2" />
  </svg>
);

export const IconWave: FC<P> = (p) => (
  <svg {...base} {...p}>
    <circle cx="6.5" cy="17.5" r="2.2" />
    <path d="M6.5 10.8a6.7 6.7 0 0 1 6.7 6.7" />
    <path d="M6.5 4.5A13 13 0 0 1 19.5 17.5" />
  </svg>
);

export const IconFlask: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="M9.8 3h4.4" />
    <path d="M10.4 3v5.2L5.6 17a3 3 0 0 0 2.7 4.4h7.4a3 3 0 0 0 2.7-4.4l-4.8-8.8V3" />
    <path d="M7.4 14.5h9.2" />
  </svg>
);

export const IconEar: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="M8.5 20a3 3 0 0 0 5.6-1.3c0-2.1 1.4-2.7 2.4-4.1a6.6 6.6 0 0 0-10.9-6.2" />
    <path d="M9.4 9.3a3.1 3.1 0 0 1 5.2 2.3c0 1.2-.7 1.9-1.5 2.6" />
  </svg>
);

export const IconPill: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="m10.6 6.2 7.2 7.2a3.9 3.9 0 1 1-5.5 5.5l-7.2-7.2a3.9 3.9 0 1 1 5.5-5.5z" />
    <path d="M9.2 14.8 14.8 9.2" />
  </svg>
);

export const IconGlasses: FC<P> = (p) => (
  <svg {...base} {...p}>
    <circle cx="7" cy="15" r="3.6" />
    <circle cx="17" cy="15" r="3.6" />
    <path d="M10.6 15a1.4 1.4 0 0 1 2.8 0" />
    <path d="M3.4 14.6 5 7.5h2.6" />
    <path d="M20.6 14.6 19 7.5h-2.6" />
  </svg>
);

export const IconShield: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3 5 5.8v5.4c0 4.6 3 7.7 7 9.3 4-1.6 7-4.7 7-9.3V5.8L12 3z" />
    <path d="m9 11.7 2.2 2.2 4.2-4.4" />
  </svg>
);

export const IconPhone: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
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
    <path d="M12 21.5S5 15.8 5 10a7 7 0 0 1 14 0c0 5.8-7 11.5-7 11.5z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
);

export const IconHeart: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="M12 20.2 4.9 13a5 5 0 1 1 7.1-7.1 5 5 0 1 1 7.1 7.1L12 20.2z" />
  </svg>
);

export const IconHeartPulse: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="M12 20.2 4.9 13a5 5 0 1 1 7.1-7.1 5 5 0 1 1 7.1 7.1L12 20.2z" />
    <path d="M6.2 11.5h2.2l1.3-2.5 2.2 5 1.6-3.6.9 1.1h2.6" />
  </svg>
);

export const IconHandHeart: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="M12 11.2c-2.6-1.9-4-3.5-4-5.1a2.3 2.3 0 0 1 4-1.6 2.3 2.3 0 0 1 4 1.6c0 1.6-1.4 3.2-4 5.1z" />
    <path d="M3.5 21v-6.5" />
    <path d="M3.5 14.5h3l3.2 1.6h5.4a1.6 1.6 0 0 1 0 3.2H9.5" />
    <path d="M12.5 19.3h4.5l3.2-2.4a1.5 1.5 0 0 0-1.8-2.4l-2.5 1.2" />
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
    <rect x="7" y="7" width="10" height="10" />
    <rect x="7" y="7" width="10" height="10" transform="rotate(45 12 12)" />
  </svg>
);

export const IconInstagram: FC<P> = (p) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
  </svg>
);

export const IconMenu: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </svg>
);

export const IconClose: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

export const IconCalendar: FC<P> = (p) => (
  <svg {...base} {...p}>
    <rect x="4" y="5.5" width="16" height="15" rx="2.5" />
    <path d="M4 10h16M8 3.5v4M16 3.5v4" />
  </svg>
);

export const IconBolt: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="M13 2 5 13h6l-1 9 9-12h-6l1-8z" />
  </svg>
);

export const IconSpark: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
  </svg>
);

export const IconCross: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="M9.5 4h5v5.5H20v5h-5.5V20h-5v-5.5H4v-5h5.5V4z" />
  </svg>
);

export const IconSearch: FC<P> = (p) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export const IconHome: FC<P> = (p) => (
  <svg {...base} {...p}>
    <path d="M3.5 10.8 12 3.8l8.5 7" />
    <path d="M5.5 9.5V20h13V9.5" />
    <path d="M9.5 20v-5.5h5V20" />
  </svg>
);

export const IconDoctor: FC<P> = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="7" r="3.4" />
    <path d="M4.5 21c.7-4 3.6-6.2 7.5-6.2s6.8 2.2 7.5 6.2" />
    <path d="M9.8 12.6v1.8a2.2 2.2 0 0 0 4.4 0v-1.8" />
    <path d="M12 16.6v.9" strokeWidth="2.2" />
  </svg>
);

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
};
