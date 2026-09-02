import { useEffect, useState } from "react";
import Nav from "./Nav";
import Hero from "./Hero";
import { StatsBand, Departments, OtherUnits } from "./Sections";
import { Insurance, Team } from "./Sections2";
import Doctors from "./Doctors";
import Admin from "./Admin";
import { ContactSection, Footer } from "./Contact";
import { IMG, faNum, type TabId } from "./data";
import { Reveal } from "./fx";
import { IconBuilding } from "./Icons";

export default function App() {
  const [tab, setTab] = useState<TabId>("home");
  const [route, setRoute] = useState(() => window.location.hash);

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [tab, route]);

  /* ── پنل ادمین مخفی: yoursite.com/#/admin ── */
  if (route.startsWith("#/admin")) {
    return <Admin />;
  }

  return (
    <div className="relative min-h-screen">
      <div className="noise-layer" aria-hidden="true" />
      <Nav active={tab} onNavigate={setTab} />

      <main key={tab} className="view-enter">
        {tab === "home" && (
          <>
            <Hero onNavigate={setTab} />
            <Team onNavigate={setTab} />
          </>
        )}
        {tab === "services" && (
          <>
            <Departments onNavigate={setTab} />
            <OtherUnits />
          </>
        )}
        {tab === "doctors" && <Doctors />}
        {tab === "facilities" && (
          <>
            <FacilitiesIntro />
            <StatsBand />
          </>
        )}
        {tab === "insurance" && <Insurance />}
        {tab === "contact" && <ContactSection />}
      </main>

      <Footer onNavigate={setTab} />
    </div>
  );
}

/* ── معرفی کوتاه امکانات ── */
function FacilitiesIntro() {
  return (
    <section className="relative overflow-hidden bg-paper px-4 pt-14 sm:px-6 sm:pt-20">
      <div className="girih absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <Reveal>
          <span className="eyebrow justify-center text-seadeep!">
            <IconBuilding className="h-4.5 w-4.5" />
            امکانات مجموعه
          </span>
          <h1 className="font-display mt-4 text-4xl leading-[1.25] text-pine sm:text-5xl">
            یک مجموعه‌ی کامل، <span className="text-sea">در چهار طبقه</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-inksoft sm:text-lg">
            {faNum(4)} طبقه‌ی مجزا به‌همراه زیرزمین، {faNum(35)} اتاق مراجعه و {faNum(50)} نفر
            پرسنل اداری و اجرایی؛ همه برای اینکه مراجعت شما راحت، سریع و در شأن شما باشد.
          </p>
        </Reveal>
        <Reveal delay={150}>
          <div className="arch-ring relative mx-auto mt-10 max-w-3xl bg-gradient-to-b from-sea/25 to-transparent p-2.5">
            <div className="arch relative aspect-[16/8] overflow-hidden">
              <img
                src={IMG.exterior}
                alt="ساختمان درمانگاه خیریه آوای مهر ولی‌الله"
                className="kenburns h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pine/50 via-transparent to-transparent" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
