import Nav from "./Nav";
import Hero from "./Hero";
import { StatsBand, Departments, OtherUnits } from "./Sections";
import { Insurance, Team, Charity } from "./Sections2";
import { ContactSection, Footer } from "./Contact";

export default function App() {
  return (
    <div className="relative min-h-screen">
      <div className="noise-layer" aria-hidden="true" />
      <Nav />
      <main>
        <Hero />
        <StatsBand />
        <Departments />
        <OtherUnits />
        <Insurance />
        <Team />
        <Charity />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
