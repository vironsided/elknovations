import { Header } from "./Header";
import { Hero } from "./Hero";
import { About } from "./About";
import { Stats } from "./Stats";
import { Services } from "./Services";
import { WorkShowcase } from "./WorkShowcase";
import { Testimonials } from "./Testimonials";
import { FAQ } from "./FAQ";
import { Contact } from "./Contact";

export function MainSite() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Stats />
        <Services />
        <WorkShowcase />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
    </>
  );
}
