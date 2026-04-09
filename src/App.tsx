import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Stats } from "./components/Stats";
import { Services } from "./components/Services";
import { WorkShowcase } from "./components/WorkShowcase";
import { Testimonials } from "./components/Testimonials";
import { FAQ } from "./components/FAQ";
import { Contact } from "./components/Contact";

function App() {
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

export default App;
