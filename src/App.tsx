import { useEffect, useState } from "react";
import Nav from "./Nav";
import Hero from "./Hero";
import { StatsBand, Departments, OtherUnits } from "./Sections";
import { Insurance, Team } from "./Sections2";
import Doctors from "./Doctors";
import Admin from "./Admin";
import { ArticlesList, ArticleView } from "./Articles";
import { ContactSection, Footer } from "./Contact";
import { IMG, TABS, faNum, type TabId } from "./data";
import { Reveal } from "./fx";
import { IconBuilding } from "./Icons";

type View = { tab: TabId; articleId: string | null };

/** آدرس مرورگر را به نمای فعلی تبدیل می‌کند */
function parseHash(): View {
  const h = window.location.hash.replace(/^#\/?/, "");
  const [seg, sub] = h.split("/");
  if (seg === "articles" && sub) return { tab: "articles", articleId: sub };
  const found = TABS.find((t) => t.id === seg);
  return { tab: found ? found.id : "home", articleId: null };
}

export default function App() {
  const [view, setView] = useState<View>(parseHash);
  const [admin, setAdmin] = useState(() => window.location.hash.startsWith("#/admin"));

  useEffect(() => {
    const onHash = () => {
      setAdmin(window.location.hash.startsWith("#/admin"));
      setView(parseHash());
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [view, admin]);

  /** ناوبری با تغییر آدرس — هر بخش، زیرآدرس خودش را دارد */
  const go = (tab: TabId, articleId?: string) => {
    const target = articleId ? `#/articles/${articleId}` : tab === "home" ? "#/" : `#/${tab}`;
    if (window.location.hash === target) return;
    window.location.hash = target;
  };

  if (admin) {
    return <Admin />;
  }

  return (
    <div className="relative min-h-screen">
      <div className="noise-layer" aria-hidden="true" />
      <Nav active={view.tab} onNavigate={go} />

      <main key={`${view.tab}-${view.articleId ?? ""}`} className="view-enter">
        {view.tab === "home" && (
          <>
            <Hero onNavigate={go} />
            <Team onNavigate={go} />
          </>
        )}
        {view.tab === "services" && (
          <>
            <Departments onNavigate={go} />
            <OtherUnits />
          </>
        )}
        {view.tab === "doctors" && <Doctors />}
        {view.tab === "articles" &&
          (view.articleId ? (
            <ArticleView id={view.articleId} onNavigate={go} />
          ) : (
            <ArticlesList onNavigate={go} />
          ))}
        {view.tab === "facilities" && (
          <>
            <FacilitiesIntro />
            <StatsBand />
          </>
        )}
        {view.tab === "insurance" && <Insurance />}
        {view.tab === "contact" && <ContactSection />}
      </main>

      <Footer onNavigate={go} />
    </div>
  );
}

/* ── معرفی کوتاه امکانات ── */
function FacilitiesIntro() {
  return (
    <section className="relative overflow-hidden bg-paper px-4 pt-14 sm:px-6 sm:pt-20">
      <div className="girih absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="relative mx-auto max-w-4xl px-4 pb-4 text-center sm:px-6">
        <Reveal>
          <span className="eyebrow justify-center text-seadeep!">
            <IconBuilding className="h-4.5 w-4.5" />
            امکانات مجموعه
          </span>
          <h1 className="font-display mt-4 text-4xl leading-[1.25] text-pine sm:text-5xl">
            یک مجموعه‌ی کامل، <span className="text-sea">در چهار طبقه</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-inksoft sm:text-lg">
            {faNum(4)} طبقه‌ی مجزا به‌همراه زیرزمین، {faNum(35)} اتاق مراجعه و {faNum(50)} نفر پرسنل
            اداری و اجرایی؛ همه برای اینکه مراجعت شما راحت، سریع و در شأن شما باشد.
          </p>
        </Reveal>
        <Reveal delay={150}>
          <div className="arch-ring relative mx-auto mt-10 max-w-3xl bg-gradient-to-b from-sea/25 to-transparent p-2.5">
            <div className="arch relative aspect-[16/8] overflow-hidden">
              <img src={IMG.exterior} alt="ساختمان درمانگاه خیریه آوای مهر ولی‌الله" className="kenburns h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-pine/50 via-transparent to-transparent" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
