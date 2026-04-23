import { Suspense, lazy, useState } from "react";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { About } from "./About";
import { Stats } from "./Stats";
import { Services } from "./Services";
import { WorkShowcase } from "./WorkShowcase";
import { Testimonials } from "./Testimonials";
import { FAQ } from "./FAQ";
import { Contact } from "./Contact";
import { WorkNearYouTab } from "./work-near-you/WorkNearYouTab";

const WorkNearYouDrawer = lazy(() =>
  import("./work-near-you/WorkNearYouDrawer").then((m) => ({ default: m.WorkNearYouDrawer })),
);

export function MainSite() {
  const [drawerOpen, setDrawerOpen] = useState(false);

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
      <WorkNearYouTab onOpen={() => setDrawerOpen(true)} />
      <Suspense fallback={null}>
        <WorkNearYouDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      </Suspense>
    </>
  );
}
