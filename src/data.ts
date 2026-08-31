export const IMG = {
  hero: "https://image.qwenlm.ai/generated-images/1a8ab95e-8eca-4826-9d50-82a52fcd5c79/_result.png",
  dental:
    "https://image.qwenlm.ai/generated-images/90faee3b-3032-4f56-82a2-19fdf70a85f5/_result.png",
  physio:
    "https://image.qwenlm.ai/generated-images/8ed6e390-8cfd-403d-96d6-394ad3ec1b3f/_result.png",
  radio:
    "https://image.qwenlm.ai/generated-images/7ae812c7-cafc-4675-a7b1-c7a1a689a247/_result.png",
  team: "https://image.qwenlm.ai/generated-images/19dcb729-7111-483b-95d1-e143a81a701a/_result.png",
  exterior:
    "https://image.qwenlm.ai/generated-images/ee473f35-7172-4768-a3ce-3d054c9c75dc/_result.png",
};

export const CONTACT = {
  phone: "02133132114",
  phoneDisplay: "۰۲۱-۳۳۱۳۲۱۱۴",
  bookingPhone: "02133559068",
  bookingPhoneDisplay: "۰۲۱-۳۳۵۵۹۰۶۸",
  mobile: "09902507780",
  mobileDisplay: "۰۹۹۰-۲۵۰۷۷۸۰",
  address:
    "تهران، بزرگراه شهید محلاتی، بین سه‌راهی ری و چهارراه ۱۷ شهریور، پلاک ۳۱۲",
  addressShort: "بزرگراه شهید محلاتی، پلاک ۳۱۲",
  landmark: "زیر پل محلاتی، محله قیام",
  instagram: "https://instagram.com/valialahclinic",
  instagramId: "valialahclinic",
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("درمانگاه خیریه آوای مهر ولی الله محلاتی تهران"),
  hours: [
    { days: "شنبه تا پنجشنبه", time: "۷:۰۰ صبح تا ۲۳:۰۰" },
    { days: "جمعه", time: "۷:۰۰ صبح تا ۲۳:۰۰" },
  ],
};

export const TABS = [
  { id: "home", label: "خانه", icon: "home" },
  { id: "services", label: "خدمات تخصصی", icon: "stetho" },
  { id: "doctors", label: "پزشکان", icon: "doctor" },
  { id: "facilities", label: "امکانات", icon: "building" },
  { id: "insurance", label: "بیمه‌ها", icon: "shield" },
  { id: "contact", label: "تماس با ما", icon: "phone" },
] as const;

export type TabId = (typeof TABS)[number]["id"];

export type Stat = {
  value: number;
  label: string;
  note?: string;
  icon: string;
  approx?: boolean;
};

export const STATS: Stat[] = [
  { value: 4, label: "طبقه مجزا", note: "به‌همراه زیرزمین", icon: "building" },
  { value: 35, label: "اتاق مراجعه", note: "در تمام بخش‌ها", icon: "door" },
  { value: 50, label: "پرسنل اداری و اجرایی", note: "در خدمت شما", icon: "users" },
  { value: 27, label: "پزشک متخصص و عمومی", note: "در رشته‌های مختلف", icon: "stetho" },
  { value: 15, label: "دندانپزشک مجرب", note: "در تمام شاخه‌ها", icon: "tooth" },
  { value: 500, label: "مراجعه‌کننده در روز", note: "به‌طور میانگین", icon: "pulse", approx: true },
];

export type Department = {
  id: string;
  title: string;
  short: string;
  icon: string;
  image: string;
  desc: string;
  badges: string[];
  services: string[];
  serviceNotes?: string[];
};

export const DEPARTMENTS: Department[] = [
  {
    id: "dental",
    title: "دندانپزشکی",
    short: "۱۵ دندانپزشک",
    icon: "tooth",
    image: IMG.dental,
    desc: "ارائه خدمات متنوع و جامع دندانپزشکی با حضور ۱۵ دندانپزشک مجرب؛ از معاینه و پیشگیری تا پیشرفته‌ترین درمان‌های ترمیمی و زیبایی، با تعرفه‌ای که لبخند را برای همه ممکن می‌کند.",
    badges: ["۱۵ دندانپزشک مجرب", "ایمپلنت با سیستم سوئیسی و کره‌ای", "بخش ویژه کودکان"],
    services: [
      "معاینه و تشخیص بیماری‌های دهان و دندان",
      "ترمیم و پرکردن دندان",
      "جرم‌گیری و بروساژ",
      "درمان ریشه و عصب‌کشی",
      "روکش و پروتز دندان",
      "ایمپلنت دندان (سیستم سوئیسی و کره‌ای)",
      "خدمات دندانپزشکی کودکان",
      "ارتودنسی و اصلاح ناهنجاری‌های دندانی و فکی",
    ],
  },
  {
    id: "physio",
    title: "فیزیوتراپی",
    short: "توانبخشی",
    icon: "bone",
    image: IMG.physio,
    desc: "خدمات توانبخشی و فیزیوتراپی با هدف کاهش درد، بازگرداندن حرکت و بهبود عملکرد بدن؛ همراه با برنامه‌های درمانی اختصاصی برای هر مراجع، از سالمندان تا ورزشکاران.",
    badges: ["برنامه درمانی اختصاصی", "تجهیزات الکتروتراپی", "حرکات اصلاحی"],
    services: [
      "درمان مشکلات عضلانی و مفصلی",
      "توانبخشی پس از آسیب‌ها و جراحی‌ها",
      "الکتروتراپی",
      "گرما و سرما درمانی",
      "تمرینات درمانی و حرکات اصلاحی",
      "بهبود مشکلات ستون فقرات و کمر",
    ],
  },
  {
    id: "radio",
    title: "رادیولوژی و سونوگرافی",
    short: "تصویربرداری",
    icon: "wave",
    image: IMG.radio,
    desc: "ارائه خدمات تصویربرداری تشخیصی برای کمک به تشخیص دقیق‌تر؛ از رادیوگرافی‌های تخصصی دندان تا سونوگرافی‌های تشخیصی اندام‌های داخلی، در محیطی آرام و با رعایت کامل استانداردها.",
    badges: ["تصویربرداری دیجیتال", "پانورکس و پری‌اپیکال", "سونوگرافی شکم و لگن"],
    services: [
      "پانورکس (Panoramic)",
      "پری‌اپیکال (Periapical)",
      "سونوگرافی تشخیصی",
      "بررسی اندام‌های داخلی",
      "سونوگرافی شکم و لگن",
      "سونوگرافی‌های تخصصی (منوط به حضور پزشک و تجهیزات مربوطه)",
    ],
  },
];

export type Unit = {
  title: string;
  desc: string;
  icon: string;
  big?: boolean;
  chips?: string[];
};

export const UNITS: Unit[] = [
  {
    title: "کلینیک تخصصی و عمومی",
    desc: "ویزیت در رشته‌های تخصصی و عمومی با حضور پزشکان مجرب؛ از قلب تا پوست، زیر یک سقف.",
    icon: "stetho",
    big: true,
    chips: [
      "قلب و عروق",
      "ارتوپدی",
      "ارولوژی",
      "گوش، حلق و بینی",
      "زنان و زایمان",
      "مامایی",
      "پوست",
      "روان‌شناسی بالینی",
      "جراحی عمومی",
      "اورژانس",
    ],
  },
  {
    title: "آزمایشگاه",
    desc: "انجام انواع آزمایش‌های تشخیصی با تجهیزات به‌روز و پاسخ‌دهی سریع.",
    icon: "flask",
  },
  {
    title: "شنوایی‌سنجی",
    desc: "ادیومتری و ارزیابی دقیق شنوایی برای تمام رده‌های سنی.",
    icon: "ear",
  },
  {
    title: "داروخانه",
    desc: "تأمین داروهای تجویزی مراجعین با تعرفه‌ای مناسب و در دسترس.",
    icon: "pill",
  },
  {
    title: "عینک‌سازی",
    desc: "تعیین نمره چشم و ساخت انواع عینک طبی در محل درمانگاه.",
    icon: "glasses",
  },
];

export type Insurer = {
  name: string;
  mono: string;
  color: string;
};

export const BASE_INSURERS = [
  "تامین اجتماعی",
  "بیمه سلامت و خدمات درمانی",
  "و کلیه بیمه‌های پایه دیگر",
];

export const INSURERS: Insurer[] = [
  { name: "بیمه آسیا", mono: "آ", color: "#2f7d4f" },
  { name: "بیمه البرز", mono: "ال", color: "#1f6fb2" },
  { name: "بیمه ملت", mono: "مل", color: "#24408e" },
  { name: "بیمه ایران", mono: "ای", color: "#0e7c74" },
  { name: "بیمه کارآفرین", mono: "کا", color: "#cf7a1c" },
  { name: "بیمه دی", mono: "دی", color: "#0e7490" },
  { name: "کمک‌رسان ایران (SOS)", mono: "SOS", color: "#bf3b30" },
  { name: "بیمه کوثر", mono: "کو", color: "#5d7c2e" },
  { name: "بیمه سینا", mono: "سی", color: "#5b5bd6" },
  { name: "بیمه تجارتنو", mono: "تج", color: "#12a594" },
  { name: "بیمه پارسیان", mono: "پا", color: "#8a5a12" },
  { name: "آتیه‌سازان حافظ", mono: "حا", color: "#b03052" },
];

export const TEAM_SPECIALTIES = [
  "قلب و عروق",
  "ارتوپدی",
  "ارولوژی",
  "گوش، حلق و بینی",
  "زنان و زایمان",
  "مامایی",
  "پوست",
  "روان‌شناسی بالینی",
  "جراحی عمومی",
  "پزشکی عمومی",
];

export const faNum = (n: number | string): string =>
  String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

/* ─────────────── پزشکان ─────────────── */

export type Doctor = {
  name: string;
  spec: string; // کلید تخصص برای فیلتر
  title: string; // عنوان دقیق
  focus?: string; // حوزه تمرکز / علل شایع مراجعه
};

export const DOCTOR_SPECS: { id: string; label: string }[] = [
  { id: "uro", label: "اورولوژی" },
  { id: "ent", label: "گوش، حلق و بینی" },
  { id: "ortho", label: "ارتوپدی" },
  { id: "cardio", label: "قلب و عروق" },
  { id: "eye", label: "چشم‌پزشکی" },
  { id: "int", label: "داخلی و پوست" },
  { id: "psy", label: "روان‌شناسی" },
  { id: "dent", label: "دندانپزشکی" },
  { id: "mid", label: "مامایی" },
  { id: "coun", label: "مشاوره" },
];

export const DOCTORS: Doctor[] = [
  {
    name: "دکتر سید محمدعلی مدینه‌ای",
    spec: "uro",
    title: "فلوشیپ اندویورولوژی، متخصص اورولوژی",
    focus: "جراحی درون‌بین کلیه، مجاری ادراری و تناسلی",
  },
  {
    name: "دکتر عبدالرضا جهانگیری",
    spec: "ent",
    title: "متخصص گوش، حلق و بینی",
    focus: "کاهش شنوایی، گرفتگی گوش و بیماری‌های حلق و بینی",
  },
  {
    name: "دکتر وحید مجریان",
    spec: "ortho",
    title: "متخصص ارتوپدی",
    focus: "درد مفاصل، آسیب‌های استخوانی و ارتوپدی عمومی",
  },
  {
    name: "دکتر غلامرضا خرمی",
    spec: "ortho",
    title: "متخصص ارتوپدی",
    focus: "بیماری‌های استخوان و مفاصل",
  },
  {
    name: "دکتر ناهید فضلی بنفشه‌ورق",
    spec: "cardio",
    title: "متخصص قلب و عروق",
    focus: "تنگی نفس، فشار خون و بیماری‌های قلبی",
  },
  {
    name: "دکتر مرتضی میرعرب",
    spec: "eye",
    title: "متخصص چشم‌پزشکی",
    focus: "بیماری‌های چشم و بینایی",
  },
  {
    name: "دکتر وحید احیایی قدرتی",
    spec: "eye",
    title: "متخصص چشم و کارشناس بینایی‌سنجی",
    focus: "خشکی چشم، اپتومتری و سنجش بینایی",
  },
  {
    name: "دکتر محبوبه ثابت",
    spec: "int",
    title: "پزشک عمومی، داخلی و پوست و مو",
    focus: "ویزیت عمومی، بیماری‌های داخلی و مشکلات پوستی",
  },
  {
    name: "دکتر سید بهنام نورحسینی",
    spec: "psy",
    title: "روان‌شناس و درمانگر خانواده",
    focus: "مشاوره فردی و خانواده",
  },
  {
    name: "دکتر علی امیری",
    spec: "dent",
    title: "متخصص جراحی دهان، فک و صورت",
    focus: "جراحی‌های تخصصی دهان و فک",
  },
  {
    name: "دکتر سپیده علی‌نژاد",
    spec: "dent",
    title: "دندانپزشک و جراح",
    focus: "ترمیم، جراحی و درمان‌های دندانی",
  },
  {
    name: "غیدا عباس‌زاده",
    spec: "mid",
    title: "کارشناس مامایی",
    focus: "مراقبت‌های دوران بارداری و سلامت زنان",
  },
  {
    name: "زهرا خدادادی",
    spec: "coun",
    title: "مشاور",
    focus: "مشاوره و راهنمایی",
  },
];

/* ─────────────── سامانه‌های نوبت‌دهی آنلاین ─────────────── */

export const BOOKING_LINKS = [
  {
    name: "پذیرش۲۴",
    note: "رزرو آنلاین با کد ملی",
    url: "https://www.paziresh24.com/center/%D8%AF%D8%B1%D9%85%D8%A7%D9%86%DA%AF%D8%A7%D9%87-%D8%AE%DB%8C%D8%B1%DB%8C%D9%87-%D8%A2%D9%88%D8%A7%DB%8C-%D9%85%D9%87%D8%B1-%D9%88%D9%84%DB%8C-%D8%A7%D9%84%D9%84%D9%87/",
  },
  {
    name: "دکترتو",
    note: "همراه با نظرات بیماران",
    url: "https://doctoreto.com/center/avaye-mehr-valiollah/YJpggL",
  },
];
