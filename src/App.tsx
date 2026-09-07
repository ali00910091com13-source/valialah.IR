import { useEffect, useState } from "react";
import Nav from "./Nav";
import Hero from "./Hero";
import { StatsBand, Departments, OtherUnits } from "./Sections";
import { Insurance, Team } from "./Sections2";
import Doctors from "./Doctors";
import { ArticlesList, ArticleView } from "./Articles";
import { ContactSection, Footer } from "./Contact";
import Admin from "./Admin";
import { TABS, type TabId } from "./data";

export default function App() {
  const [tab, setTab] = useState<TabId>(() => {
    const hash = window.location.hash.replace("#/", "");
    return TABS.find((t) => t.id === hash)?.id || "home";
  });
  const [articleId, setArticleId] = useState<string | null>(null);

  useEffect(() => {
    const onHash = () => {
      const hash = window.location.hash.replace("#/", "");
      const [tabPart, articlePart] = hash.split("/");
      const newTab = TABS.find((t) => t.id === tabPart)?.id || "home";
      setTab(newTab);
      setArticleId(articlePart || null);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = (id: TabId, articleId?: string) => {
    window.location.hash = articleId ? `#/${id}/${articleId}` : `#/${id}`;
    setTab(id);
    setArticleId(articleId || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-paper">
      <Nav active={tab} onNavigate={navigate} />
      
      <main>
        {tab === "home" && (
          <>
            <Hero onNavigate={navigate} />
            <Team onNavigate={navigate} />
          </>
        )}
        
        {tab === "services" && (
          <>
            <Departments onNavigate={navigate} />
            <OtherUnits />
          </>
        )}
        
        {tab === "doctors" && <Doctors />}
        
        {tab === "articles" && (
          articleId ? (
            <ArticleView id={articleId} onNavigate={navigate} />
          ) : (
            <ArticlesList onNavigate={navigate} />
          )
        )}
        
        {tab === "facilities" && <StatsBand />}
        
        {tab === "insurance" && <Insurance />}
        
        {tab === "contact" && <ContactSection />}
      </main>
      
      <Footer onNavigate={navigate} />
    </div>
  );
}
