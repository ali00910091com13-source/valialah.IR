import { IMG, faNum, type TabId } from "./data";
import { Reveal, EcgLine, Stamp, Squiggle, useOpenStatus } from "./fx";
import BookingMenu from "./Booking";
import {
  IconStar8,
  IconArrow,
  IconDoctor,
  IconHeartPulse,
  IconUsers,
  IconCalendar,
} from "./Icons";

export default function Hero({ onNavigate }: { onNavigate?: (id: TabId) => void }) {
  const open = useOpenStatus();

  return (
    <section className="relative overflow-hidden bg-paper">
      <div className="girih absolute inset-0 opacity-60" aria-hidden="true" />
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(52rem 30rem at 85% 8%, rgba(14,124,116,0.14), transparent 60%), radial-gradient(40rem 26rem at 10% 95%, rgba(214,154,37,0.13), transparent 60%)",
        }}
      />

      <div className="wrap relative grid items-center gap-12 pb-16 pt-10 sm:pt-14 lg:grid-cols-12 lg:gap-8 lg:pb-24 lg:pt-16">
        {/* ── متن ── */}
        <div className="relative z-10 lg:col-span-6">
          <Reveal>
            <span className="eyebrow">
              <IconStar8 className="h-4 w-4 text-gold" />
              درمانگاه خیریه • همراه شما در مسیر سلامتی
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="font-display mt-5 text-[2.6rem] leading-[1.22] text-pine sm:text-6xl sm:leading-[1.18] lg:text-[4.1rem]">
              صدای <span className="text-sea">مهر</span>،
              <br />
              نوای{" "}
              <span className="relative inline-block text-golddeep">
                سلامتی
                <Squiggle className="absolute -bottom-2 right-0 h-3 w-full text-gold" />
              </span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 max-w-xl text-[0.95rem] leading-8 text-inksoft sm:text-lg sm:leading-9">
              با افتخار، درمانگاه خیریه آوای مهر ولی‌الله با بیش از{" "}
              <b className="text-seadeep">{faNum(27)} سال سابقه‌ی فعالیت مستمر</b>، با تکیه بر
              کادر پزشکی مجرب، امکانات تخصصی و محیطی مناسب، خدماتی شایسته و
              باکیفیت به مراجعین محترم ارائه می‌نماید.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <BookingMenu label="رزرو نوبت آنلاین" />
              <button onClick={() => onNavigate?.("services")} className="btn btn-line">
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
          <Reveal delay={420}>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-3">
              {[
                { icon: IconCalendar, n: 27, t: "سال تجربه" },
                { icon: IconUsers, n: 42, t: "پزشک و دندانپزشک" },
                { icon: IconHeartPulse, n: 500, t: "بیمار در روز", approx: true },
              ].map((s) => (
                <div
                  key={s.t}
                  className="lift rounded-[14px] border border-sea/15 bg-card/80 px-3 py-3.5 text-center"
                >
                  <s.icon className="mx-auto h-5 w-5 text-sea" />
                  <dt className="sr-only">{s.t}</dt>
                  <dd className="font-display mt-1.5 text-2xl leading-none text-pine">
                    {s.approx && "≈"}
                    {faNum(s.n)}
                  </dd>
                  <dd className="mt-1 text-[0.66rem] font-bold text-inksoft sm:text-[0.72rem]">{s.t}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* ── تصویر قوسی ── */}
        <div className="relative lg:col-span-6">
          <Reveal delay={180}>
            <div className="relative mx-auto max-w-[30rem]">
              <div className="arch-ring bg-gradient-to-b from-gold/60 via-sea/30 to-sea/10 p-2.5 shadow-[0_40px_90px_-40px_rgba(11,59,56,0.55)]">
                <div className="arch relative aspect-[4/4.6]">
                  <img
                    src={IMG.hero}
                    alt="محیط درمانگاه خیریه آوای مهر ولی‌الله"
                    className="kenburns h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pine/55 via-transparent to-transparent" />
                  <div className="absolute bottom-4 start-4 end-4 flex items-center justify-between gap-3 rounded-[13px] bg-card/95 px-4 py-3 shadow-lg sm:end-auto">
                    <span className="flex items-center gap-2.5">
                      <span className={`h-2.5 w-2.5 rounded-full ${open ? "bg-teal pulse-ring" : "bg-clay"}`} />
                      <span>
                        <span className="block text-[0.8rem] font-extrabold text-pine">
                          {open ? "همین حالا باز هستیم" : "فعلاً بسته‌ایم"}
                        </span>
                        <span className="block text-[0.66rem] font-bold text-inksoft">هر روز • ۷ صبح تا ۲۳</span>
                      </span>
                    </span>
                    <IconHeartPulse className={`h-6 w-6 text-sea ${open ? "heartbeat" : ""}`} />
                  </div>
                </div>
              </div>
              <Stamp className="absolute -top-7 -start-3 h-24 w-24 drop-shadow-xl sm:-start-8 sm:h-32 sm:w-32" />
              <div className="lift absolute -bottom-5 -end-2 hidden items-center gap-3 rounded-[14px] border border-gold/40 bg-goldsoft px-4 py-3 shadow-lg sm:flex">
                <span className="font-display text-3xl leading-none text-golddeep">{faNum(35)}</span>
                <span className="text-[0.72rem] font-extrabold leading-5 text-pine">
                  اتاق مراجعه
                  <br />
                  <span className="font-bold text-inksoft">در ۴ طبقه + زیرزمین</span>
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* نوار ضربان قلب */}
      <div className="relative border-t border-sea/15 bg-card/70">
        <EcgLine className="h-12 w-full text-sea sm:h-14" />
      </div>
    </section>
  );
}
