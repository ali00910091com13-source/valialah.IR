import { useEffect, useState } from "react";
import Nav from "./Nav";
import Hero from "./Hero";
import { StatsBand, Departments, OtherUnits } from "./Sections";
import { Insurance, Team } from "./Sections2";
import Doctors from "./Doctors";
import { ArticlesList, ArticleView } from "./Articles";
import Admin from "./Admin";
import { ContactSection, Footer } from "./Contact";
import { IMG, faNum, type TabId } from "./data";
import { Reveal } from "./fx";
import { IconBuilding } from "./Icons";

/* تجزیه‌ی هش — مثل «#/doctors» یا «#/articles/a1» */
function parseHash(): { tab: TabId; articleId?: string } {
  const raw = window.location.hash.replace(/^#\/?/, "");
  const [seg, sub] = raw.split("/");
  const valid: TabId[] = ["home", "services", "doctors", "articles", "facilities", "insurance", "contact"];
  const tab = (valid.includes(seg as TabId) ? seg : "home") as TabId;
  return { tab, articleId: tab === "articles" && sub ? sub : undefined };
}

export default function App() {
  const [route, setRoute] = useState(parseHash);

  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const { tab, articleId } = route;

  /* تغییر تب = تغییر آدرس (بدون رفرش) */
  const onNavigate = (id: TabId, aid?: string) => {
    const target = aid ? `#/${id}/${aid}` : id === "home" ? "#/" : `#/${id}`;
    if (window.location.hash === target) return;
    window.location.hash = target;
  };

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [tab, articleId]);

  /* ── پنل ادمین مخفی: yoursite.com/#/admin ── */
  if (window.location.hash.startsWith("#/admin")) {
    return <Admin />;
  }

  return (
    <div className="relative min-h-screen">
      <div className="noise-layer" aria-hidden="true" />
      <Nav active={tab} onNavigate={onNavigate} />

      <main key={`${tab}-${articleId ?? ""}`} className="view-enter">
        {tab === "home" && (
          <>
            <Hero onNavigate={onNavigate} />
            <Team onNavigate={onNavigate} />
          </>
        )}
        {tab === "services" && (
          <>
            <Departments onNavigate={onNavigate} />
            <OtherUnits />
          </>
        )}
        {tab === "doctors" && <Doctors />}
        {tab === "articles" &&
          (articleId ? (
            <ArticleView id={articleId} onNavigate={onNavigate} />
          ) : (
            <ArticlesList onNavigate={onNavigate} />
          ))}
        {tab === "facilities" && (
          <>
            <FacilitiesIntro />
            <StatsBand />
          </>
        )}
        {tab === "insurance" && <Insurance />}
        {tab === "contact" && <ContactSection />}
      </main>

      <Footer onNavigate={onNavigate} />
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
            {faNum(4)} طبقه‌ی مجزا به‌همراه زیرزمین، {faNum(35)} اتاق مراجعه و{" "}
            {faNum(50)} نفر پرسنل اداری و اجرایی؛ همه برای اینکه مراجعت شما
            راحت، سریع و در شأن شما باشد.
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
