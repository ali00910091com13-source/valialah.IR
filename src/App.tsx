import { useEffect, useState } from "react";
import Nav from "./Nav";
import Hero from "./Hero";
import { StatsBand, Departments, OtherUnits } from "./Sections";
import { Insurance, Team } from "./Sections2";
import Doctors from "./Doctors";
import { ContactSection, Footer } from "./Contact";
import type { TabId } from "./data";

export default function App() {
  const [tab, setTab] = useState<TabId>("home");

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [tab]);

  return (
    <div className="relative min-h-screen">
      <div className="noise-layer" aria-hidden="true" />
      <Nav active={tab} onNavigate={setTab} />

      <main key={tab} className="view-enter">
        {tab === "home" && (
          <>
            <Hero onNavigate={setTab} />
            <Team onNavigate={setTab} />
            <Insurance />
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
        <span className="eyebrow justify-center text-seadeep!">
          <svg
            viewBox="0 0 24 24"
            className="h-4.5 w-4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 21V5.5L12 3v18" />
            <path d="M12 21V8l8 2.5V21" />
            <path d="M2.5 21h19" />
          </svg>
          امکانات مجموعه
        </span>
        <h1 className="font-display mt-4 text-4xl leading-[1.3] text-pine sm:text-5xl">
          فضایی در شأن <span className="text-sea">سلامت</span> شما
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-inksoft sm:text-lg">
          ساختمان ۴ طبقه به‌همراه زیرزمین، با ۳۵ اتاق مراجعه و تجهیزات تخصصی؛
          محیطی که در آن کیفیت خدمات و آرامش مراجعین در اولویت است.
        </p>
      </div>
    </section>
  );
}
