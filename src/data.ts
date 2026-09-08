export const LOGO = "https://i.postimg.cc/tRnLnb88/Chat-GPT-Image-9-shhrywr-1405-12-31-49.png";

export const IMG = {
  hero: "https://image.qwenlm.ai/generated-images/1a8ab95e-8eca-4826-9d50-82a52fcd5c79/_result.png",
  dental: "https://image.qwenlm.ai/generated-images/90faee3b-3032-4f56-82a2-19fdf70a85f5/_result.png",
  physio: "https://image.qwenlm.ai/generated-images/8ed6e390-8cfd-403d-96d6-394ad3ec1b3f/_result.png",
  radio: "https://image.qwenlm.ai/generated-images/cb8ff3df-84ba-443a-8db6-12cf3c047a0b/_result.png",
  team: "https://image.qwenlm.ai/generated-images/19dcb729-7111-483b-95d1-e143a81a701a/_result.png",
  exterior: "https://image.qwenlm.ai/generated-images/ee473f35-7172-4768-a3ce-3d054c9c75dc/_result.png",
};

export const CONTACT = {
  phone: "02133132114",
  phoneDisplay: "۰۲۱-۳۳۱۳۲۱۱۴",
  bookingPhone: "02133559068",
  bookingPhoneDisplay: "۰۲۱-۳۳۵۵۹۰۶۸",
  mobile: "09902507780",
  mobileDisplay: "۰۹۹۰-۲۵۰۷۷۸۰",
  address: "تهران، بزرگراه شهید محلاتی، بین سه‌راهی ری و چهارراه ۱۷ شهریور، پلاک ۳۱۲",
  landmark: "زیر پل محلاتی",
  instagram: "https://instagram.com/valialahclinic",
  instagramId: "valialahclinic",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("درمانگاه خیریه آوای مهر ولی الله محلاتی تهران"),
  hours: [
    { days: "شنبه تا پنجشنبه", time: "۷:۰۰ صبح تا ۲۳:۰۰" },
    { days: "جمعه", time: "۷:۰۰ صبح تا ۲۳:۰۰" },
  ],
};

export const TABS = [
  { id: "home", label: "خانه", icon: "home" },
  { id: "services", label: "خدمات تخصصی", icon: "stetho" },
  { id: "doctors", label: "پزشکان", icon: "doctor" },
  { id: "articles", label: "مقالات", icon: "news" },
  { id: "facilities", label: "امکانات", icon: "building" },
  { id: "contact", label: "تماس با ما", icon: "phone" },
] as const;

export type TabId = (typeof TABS)[number]["id"];

export const BOOKING_LINKS = [
  { name: "پذیرش۲۴", note: "رزرو آنلاین با کد ملی", url: "https://www.paziresh24.com/center/%D8%AF%D8%B1%D9%85%D8%A7%D9%86%DA%AF%D8%A7%D9%87-%D8%AE%DB%8C%D8%B1%DB%8C%D9%87-%D8%A2%D9%88%D8%A7%DB%8C-%D9%85%D9%87%D8%B1-%D9%88%D9%84%DB%8C-%D8%A7%D9%84%D9%84%D9%87/" },
  { name: "دکترتو", note: "همراه با نظرات بیماران", url: "https://doctoreto.com/center/avaye-mehr-valiollah/YJpggL" },
];

export type Stat = { value: number; label: string; note?: string; icon: string; approx?: boolean };

export const STATS: Stat[] = [
  { value: 27, label: "سال سابقه", note: "خدمت بی‌وقفه", icon: "clock" },
  { value: 4, label: "طبقه مجزا", note: "به‌همراه زیرزمین", icon: "building" },
  { value: 35, label: "اتاق مراجعه", note: "مجهز و مدرن", icon: "door" },
  { value: 50, label: "پرسنل مجرب", note: "اداری و اجرایی", icon: "users" },
  { value: 42, label: "پزشک و دندانپزشک", note: "متخصص و عمومی", icon: "stetho" },
  { value: 500, label: "بیمار در روز", note: "به‌طور میانگین", icon: "pulse", approx: true },
];

export const FACILITIES = [
  {
    title: "ساختمان مدرن",
    desc: "ساختمان ۴ طبقه به‌همراه زیرزمین با طراحی مدرن و دسترسی آسان برای همه مراجعین",
    icon: "building",
    features: ["آسانسور", "پارکینگ", "دسترسی معلولین", "تهویه مطبوع"],
  },
  {
    title: "تجهیزات پیشرفته",
    desc: "استفاده از جدیدترین تجهیزات پزشکی و دندانپزشکی برای تشخیص و درمان دقیق",
    icon: "spark",
    features: ["دستگاه پانورکس دیجیتال", "سونوگرافی رنگی", "یونیت‌های دندانپزشکی مدرن", "تجهیزات فیزیوتراپی"],
  },
  {
    title: "کادر مجرب",
    desc: "تیمی از پزشکان متخصص، دندانپزشکان و پرسنل با تجربه در خدمت شما",
    icon: "users",
    features: ["۲۷ پزشک متخصص", "۱۵ دندانپزشک", "۵۰ پرسنل اداری", "مشاوران حرفه‌ای"],
  },
  {
    title: "خدمات ۲۴ ساعته",
    desc: "ارائه خدمات درمانی از ساعت ۷ صبح تا ۲۳ شب، همه روزه حتی تعطیلات",
    icon: "clock",
    features: ["صبح تا شب", "همه روزه", "نوبت‌دهی آنلاین", "مشاوره تلفنی"],
  },
  {
    title: "تعرفه خیریه",
    desc: "ارائه خدمات با تعرفه مناسب و خیریه برای همه اقشار جامعه",
    icon: "heart",
    features: ["قیمت مناسب", "تخفیف ویژه", "خدمات رایگان", "پذیرش بیمه"],
  },
  {
    title: "موقعیت مناسب",
    desc: "دسترسی آسان از تمام نقاط تهران با حمل‌ونقل عمومی و خودروی شخصی",
    icon: "pin",
    features: ["نزدیک مترو", "پارکینگ اختصاصی", "دسترسی از بزرگراه", "محله امن"],
  },
];

export type Department = { id: string; title: string; short: string; icon: string; image: string; desc: string; badges: string[]; services: string[] };

export const DEPARTMENTS: Department[] = [
  {
    id: "dental", title: "دندانپزشکی", short: "۱۵ دندانپزشک", icon: "tooth", image: IMG.dental,
    desc: "ارائه خدمات متنوع و جامع دندانپزشکی با حضور ۱۵ دندانپزشک مجرب.",
    badges: ["۱۵ دندانپزشک مجرب", "ایمپلنت با سیستم سوئیسی و کره‌ای", "بخش ویژه کودکان"],
    services: ["معاینه و تشخیص", "ترمیم و پرکردن", "جرم‌گیری", "درمان ریشه", "روکش و پروتز", "ایمپلنت", "دندانپزشکی کودکان", "ارتودنسی"],
  },
  {
    id: "physio", title: "فیزیوتراپی", short: "توانبخشی", icon: "bone", image: IMG.physio,
    desc: "خدمات توانبخشی و فیزیوتراپی با هدف کاهش درد و بهبود حرکت.",
    badges: ["برنامه درمانی اختصاصی", "تجهیزات الکتروتراپی", "حرکات اصلاحی"],
    services: ["درمان مشکلات عضلانی", "توانبخشی پس از آسیب", "الکتروتراپی", "گرما و سرما درمانی", "تمرینات درمانی", "بهبود مشکلات ستون فقرات"],
  },
  {
    id: "radio", title: "رادیولوژی و سونوگرافی", short: "تصویربرداری", icon: "wave", image: IMG.radio,
    desc: "ارائه خدمات تصویربرداری تشخیصی برای کمک به تشخیص دقیق‌تر.",
    badges: ["تصویربرداری دیجیتال", "پانورکس و پری‌اپیکال", "سونوگرافی شکم و لگن"],
    services: ["پانورکس", "پری‌اپیکال", "سونوگرافی تشخیصی", "بررسی اندام‌های داخلی", "سونوگرافی شکم و لگن"],
  },
];

export type Unit = { title: string; desc: string; icon: string; big?: boolean; chips?: string[] };

export const UNITS: Unit[] = [
  { title: "کلینیک تخصصی و عمومی", desc: "ویزیت در رشته‌های تخصصی و عمومی.", icon: "stetho", big: true, chips: ["قلب و عروق", "ارتوپدی", "ارولوژی", "گوش، حلق و بینی", "زنان و زایمان", "پوست", "روان‌شناسی"] },
  { title: "آزمایشگاه", desc: "انجام انواع آزمایش‌های تشخیصی.", icon: "flask" },
  { title: "شنوایی‌سنجی", desc: "ادیومتری و ارزیابی شنوایی.", icon: "ear" },
  { title: "داروخانه", desc: "تأمین داروهای تجویزی.", icon: "pill" },
  { title: "عینک‌سازی", desc: "تعیین نمره چشم و ساخت عینک.", icon: "glasses" },
];

export type Insurer = { name: string; mono: string; color: string; logo?: string };

export const BASE_INSURERS = ["تامین اجتماعی", "بیمه سلامت و خدمات درمانی", "و کلیه بیمه‌های پایه دیگر"];

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

export const TEAM_SPECIALTIES = ["قلب و عروق", "ارتوپدی", "ارولوژی", "گوش، حلق و بینی", "زنان و زایمان", "مامایی", "پوست", "روان‌شناسی بالینی", "جراحی عمومی", "پزشکی عمومی"];

export const DOCTOR_SPECS = [
  { id: "dent", label: "دندانپزشکی" },
  { id: "card", label: "قلب و عروق" },
  { id: "ortho", label: "ارتوپدی" },
  { id: "uro", label: "ارولوژی" },
  { id: "ent", label: "گوش، حلق و بینی" },
  { id: "gyn", label: "زنان و زایمان" },
  { id: "derm", label: "پوست و مو" },
  { id: "psy", label: "روان‌شناسی" },
  { id: "gen", label: "عمومی و داخلی" },
  { id: "mid", label: "مامایی" },
  { id: "phys", label: "فیزیوتراپی" },
  { id: "lab", label: "آزمایشگاه" },
  { id: "coun", label: "مشاوره" },
] as const;

export type SpecId = (typeof DOCTOR_SPECS)[number]["id"];

export type Doctor = { name: string; spec: SpecId; title: string; focus?: string; photo?: string };

export const DOCTORS: Doctor[] = [
  { name: "دکتر احسان دانشمندی", spec: "dent", title: "دندانپزشک", focus: "ترمیم و زیبایی" },
  { name: "دکتر محسن مخنفی", spec: "dent", title: "متخصص پروتزهای دندانی" },
  { name: "دکتر حسین هادی‌زاده", spec: "dent", title: "متخصص ارتودنسی" },
  { name: "دکتر مریم صالحی", spec: "dent", title: "دندانپزشک کودکان" },
  { name: "دکتر رضا کریمی", spec: "dent", title: "متخصص درمان ریشه" },
  { name: "دکتر نرگس موسوی", spec: "dent", title: "جراح دندانپزشک", focus: "ایمپلنت" },
  { name: "دکتر امیر توکلی", spec: "card", title: "متخصص قلب و عروق" },
  { name: "دکتر سارا محمدی", spec: "ortho", title: "متخصص ارتوپدی" },
  { name: "دکتر بهرام نادری", spec: "uro", title: "متخصص ارولوژی" },
  { name: "دکتر لیلا احمدی", spec: "ent", title: "متخصص گوش، حلق و بینی" },
  { name: "دکتر نازنین رضایی", spec: "gyn", title: "متخصص زنان و زایمان" },
  { name: "دکتر کاوه شریفی", spec: "derm", title: "متخصص پوست و مو" },
  { name: "دکتر الهام قاسمی", spec: "psy", title: "روان‌شناس بالینی" },
  { name: "دکتر فرهاد میرزایی", spec: "gen", title: "متخصص داخلی" },
  { name: "دکتر سمیرا جعفری", spec: "gen", title: "پزشک عمومی" },
  { name: "دکتر آرش بهرامی", spec: "gen", title: "پزشک عمومی" },
  { name: "دکتر پیمان رستمی", spec: "gen", title: "جراح عمومی" },
  { name: "دکتر مینا عبداللهی", spec: "mid", title: "ماما" },
  { name: "غیدا عباس‌زاده", spec: "mid", title: "کارشناس مامایی" },
  { name: "دکتر امید فرهمند", spec: "phys", title: "فیزیوتراپیست" },
  { name: "دکتر شیرین کمالی", spec: "lab", title: "مسئول فنی آزمایشگاه" },
  { name: "زهرا خدادادی", spec: "coun", title: "مشاور" },
];

export type Article = { id: string; title: string; category: string; excerpt: string; body: string[]; date: string; author?: string; cover?: string };

export const ARTICLE_CATS = [
  { id: "دندانپزشکی", icon: "tooth", color: "#0e7c74" },
  { id: "فیزیوتراپی", icon: "bone", color: "#b65a45" },
  { id: "تصویربرداری", icon: "wave", color: "#24408e" },
  { id: "کلینیک عمومی", icon: "stetho", color: "#5d7c2e" },
  { id: "بیمه و پذیرش", icon: "shield", color: "#8a5a12" },
] as const;

export const catMeta = (cat: string) => ARTICLE_CATS.find((c) => c.id === cat) ?? ARTICLE_CATS[3];

export const readMinutes = (body: string[]) => Math.max(1, Math.round(body.join(" ").split(/\s+/).length / 170));

export const faDateNow = () => {
  try {
    return new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long", day: "numeric" }).format(new Date());
  } catch {
    return "امروز";
  }
};

export const ARTICLES: Article[] = [
  {
    id: "a1", title: "جرم‌گیری؛ چرا سالانه یک‌بار لازم است؟", category: "دندانپزشکی",
    excerpt: "جرم دندان فقط یک مسئله‌ی زیبایی نیست؛ عامل اصلی خونریزی لثه و بوی بد دهان است.",
    body: ["جرم دندان از رسوب مواد معدنی بزاق روی پلاک میکروبی تشکیل می‌شود.", "## جرم‌گیری چه کاری انجام می‌دهد؟", "در جرم‌گیری، دندانپزشک با ابزار التراسونیک رسوبات را جدا می‌کند.", "## چه فاصله‌ای مناسب است؟", "برای بیشتر افراد، سالی یک‌بار جرم‌گیری کافی است."],
    date: "۱۲ اسفند ۱۴۰۳", author: "واحد آموزش سلامت درمانگاه",
  },
  {
    id: "a2", title: "ایمپلنت سوئیسی یا کره‌ای؛ کدام مناسب‌تر است؟", category: "دندانپزشکی",
    excerpt: "هر دو سیستم از تیتانیوم خالص ساخته شده‌اند و موفقیت بالایی دارند.",
    body: ["ایمپلنت دندان جایگزینی دائمی برای دندان از دست رفته است.", "## تفاوت‌ها در چیست؟", "سیستم‌های سوئیسی سابقه‌ی بالینی طولانی‌تری دارند.", "## کدام را انتخاب کنیم؟", "انتخاب نهایی باید بر اساس معاینه انجام شود."],
    date: "۵ اسفند ۱۴۰۳", author: "واحد آموزش سلامت درمانگاه",
  },
  {
    id: "a3", title: "کمردرد مزمن؛ چه زمانی فیزیوتراپی لازم است؟", category: "فیزیوتراپی",
    excerpt: "بیش از ۸۰ درصد کمردردها بدون جراحی بهبود می‌یابند.",
    body: ["کمردرد یکی از شایع‌ترین دلایل مراجعه به درمانگاه است.", "## چه زمانی باید مراجعه کنید؟", "اگر درد بیش از دو هفته طول کشیده، معاینه ضروری است.", "## در جلسات چه اتفاقی می‌افتد؟", "فیزیوتراپیست برنامه‌ای ترکیبی طراحی می‌کند."],
    date: "۲۸ بهمن ۱۴۰۳", author: "واحد آموزش سلامت درمانگاه",
  },
  {
    id: "a4", title: "سونوگرافی شکم و لگن؛ قبل از مراجعه چه بخوریم؟", category: "تصویربرداری",
    excerpt: "آمادگی ساده‌ی قبل از سونوگرافی کیفیت تصویر را چند برابر می‌کند.",
    body: ["سونوگرافی یک روش تصویربرداری بی‌خطر است.", "## برای سونوگرافی شکم", "۸ تا ۱۲ ساعت ناشتا بودن لازم است.", "## برای سونوگرافی لگن", "مثانه باید پُر باشد."],
    date: "۲۰ بهمن ۱۴۰۳", author: "واحد آموزش سلامت درمانگاه",
  },
  {
    id: "a5", title: "چطور از بیمه‌ی تکمیلی استفاده کنیم؟", category: "بیمه و پذیرش",
    excerpt: "درمانگاه با ۱۲ بیمه‌ی تکمیلی طرف قرارداد است.",
    body: ["برای استفاده از بیمه کافی است کارت ملی را ارائه دهید.", "## کدام بیمه‌ها طرف قراردادند؟", "علاوه بر بیمه‌های پایه، با بیمه‌های آسیا، البرز، ملت و... قرارداد داریم.", "## اگر بیمه‌ام در فهرست نبود؟", "می‌توانید فاکتور رسمی دریافت کنید."],
    date: "۱۵ بهمن ۱۴۰۳", author: "واحد پذیرش درمانگاه",
  },
  {
    id: "a6", title: "چکاپ سالانه؛ چه آزمایش‌هایی لازم است؟", category: "کلینیک عمومی",
    excerpt: "بسیاری از بیماری‌ها سال‌ها بی‌علامت می‌مانند.",
    body: ["فشار خون، قند و چربی خون سه شاخص مهم هستند.", "## آزمایش‌های پایه", "شامل شمارش کامل خون، قند ناشتا، پروفایل چربی است.", "## بعد از آزمایش چه کنیم؟", "نتایج را به پزشک نشان دهید."],
    date: "۸ بهمن ۱۴۰۳", author: "واحد آموزش سلامت درمانگاه",
  },
];

export const faNum = (n: number | string): string => String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
