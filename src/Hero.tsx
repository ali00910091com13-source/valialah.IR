import { IMG, faNum } from "./data";
import { Reveal, EcgLine, Stamp, Squiggle, useOpenStatus } from "./fx";
import BookingMenu from "./Booking";
import {
  IconArrow,
  IconStar8,
  IconClock,
  IconHeartPulse,
  IconUsers,
  IconCalendar,
  IconDoctor,
} from "./Icons";

export default function Hero({
  onNavigate,
}: {
  onNavigate?: (id: "services" | "doctors") => void;
}) {
  const open = useOpenStatus();
  return (
    <section id="home" className="relative overflow-hidden scroll-mt-24">
      {/* layered ambient background */}
      <div className="girih absolute inset-0 opacity-70" aria-hidden="true" />
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(58rem 34rem at 88% -8%, rgba(14,124,116,0.13), transparent 62%), radial-gradient(44rem 30rem at -6% 96%, rgba(214,154,37,0.14), transparent 60%)",
        }}
      />
      <svg
        className="absolute -start-24 top-24 h-[26rem] w-[26rem] text-sea/10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        aria-hidden="true"
      >
        <rect x="7" y="7" width="10" height="10" />
        <rect x="7" y="7" width="10" height="10" transform="rotate(45 12 12)" />
      </svg>

      <div className="wrap relative grid items-center gap-12 pb-16 pt-12 lg:grid-cols-12 lg:gap-8 lg:pt-16">
        {/* text column */}
        <div className="lg:col-span-7">
          <Reveal>
            <span className="eyebrow">
              <IconStar8 className="h-4 w-4 text-gold" />
              درمانگاه خیریه • همراه شما در مسیر سلامتی
            </span>
          </Reveal>

          <Reveal delay={90}>
            <h1 className="font-display mt-5 text-[2.9rem] leading-[1.18] text-pine sm:text-6xl lg:text-[4.4rem]">
              آوای مِهر؛
              <span className="relative mt-1 block">
                صدای{" "}
                <span className="relative inline-block text-sea">
                  سلامت
                  <Squiggle className="absolute -bottom-2 start-0 h-3.5 w-full" />
                </span>{" "}
                و خدمت
              </span>
            </h1>
          </Reveal>

          <Reveal delay={180}>
            <p className="mt-6 max-w-xl text-[1.02rem] leading-8 text-inksoft">
              بیش از <b className="text-seadeep">{faNum(27)} سال</b> است که درمانگاه خیریه
              آوای مهر ولی‌الله با تکیه بر کادر پزشکی مجرب، امکانات تخصصی و محیطی
              شایسته، در کنار مردم ایستاده است؛ تا سلامتی، سهمِ همه باشد — با
              تعرفه‌ای که هیچ کس را پشت در نمی‌گذارد.
            </p>
          </Reveal>

          <Reveal delay={260}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <BookingMenu label="رزرو نوبت آنلاین" />
              <button
                onClick={() => onNavigate?.("services")}
                className="btn btn-line"
              >
                آشنایی با بخش‌ها
                <IconArrow className="h-4 w-4" />
              </button>
              <button
                onClick={() => onNavigate?.("doctors")}
                className="btn bg-pine text-foam hover:bg-seadeep hover:text-foam"
              >
                <IconDoctor className="h-4.5 w-4.5" />
                پزشکان ما
              </button>
            </div>
          </Reveal>

          <Reveal delay={340}>
            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm font-semibold text-inksoft">
              <span className="flex items-center gap-2">
                <IconCalendar className="h-4.5 w-4.5 text-gold" />
                همه‌روزه ۷ صبح تا ۲۳
              </span>
              <span className="hidden h-4 w-px bg-sea/25 sm:block" />
              <span className="flex items-center gap-2">
                <IconUsers className="h-4.5 w-4.5 text-gold" />
                روزانه حدود {faNum(500)} مراجعه‌کننده
              </span>
              <span className="hidden h-4 w-px bg-sea/25 sm:block" />
              <span className="flex items-center gap-2">
                <span
                  className={`pulse-ring h-2 w-2 rounded-full ${open ? "bg-sea" : "bg-clay"}`}
                />
                {open ? "هم‌اکنون پذیرش فعال است" : "پذیرش از ساعت ۷ صبح"}
              </span>
            </div>
          </Reveal>
        </div>

        {/* visual column */}
        <div className="relative lg:col-span-5">
          <Reveal delay={200} className="relative">
            <div className="arch-ring relative p-3">
              <div className="arch-ring absolute inset-0 border-2 border-dashed border-sea/35" />
              <div className="arch relative aspect-[4/5] overflow-hidden">
                <img
                  src={IMG.hero}
                  alt="فضای داخلی درمانگاه خیریه آوای مهر ولی‌الله"
                  className="kenburns h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pine/45 via-transparent to-transparent" />
                <div className="absolute bottom-4 start-4 end-4 flex items-center justify-between rounded-[12px] bg-pine/80 px-4 py-3 text-foam backdrop-blur-[2px]">
                  <span className="flex items-center gap-2 text-sm font-bold">
                    <IconHeartPulse className="heartbeat h-5 w-5 text-gold" />
                    نیکوکاری، بنیان ماست
                  </span>
                  <span className="text-[0.7rem] text-foam/70">وقف خدمت به مردم</span>
                </div>
              </div>
            </div>

            {/* rotating stamp */}
            <Stamp className="absolute -top-7 -start-7 h-28 w-28 drop-shadow-lg sm:-start-10 sm:h-32 sm:w-32" />

            {/* floating live status card */}
            <div className="floaty absolute -bottom-6 -end-3 rounded-[14px] border border-sea/15 bg-card p-4 shadow-[0_18px_44px_-18px_rgba(7,39,42,0.4)] sm:-end-8">
              <div className="flex items-center gap-3">
                <span
                  className={`grid h-10 w-10 place-items-center rounded-full ${
                    open ? "pulse-ring bg-sea/15 text-sea" : "bg-clay/15 text-clay"
                  }`}
                >
                  <IconClock className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-extrabold text-pine">
                    امروز {open ? "باز است" : "بسته است"}
                  </span>
                  <span className="block text-[0.72rem] text-inksoft">
                    ساعت کاری: ۷:۰۰ تا ۲۳:۰۰
                  </span>
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ecg strip */}
      <div className="relative mt-2 border-y border-sea/15 bg-mist/70">
        <EcgLine className="h-16 w-full sm:h-20" />
        <span className="absolute start-1/2 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full bg-card px-4 py-1 text-[0.72rem] font-bold text-seadeep shadow-sm">
          ضربانِ {faNum(27)} ساله‌ی خدمت
        </span>
      </div>
    </section>
  );
}
