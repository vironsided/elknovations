import { Suspense, lazy, useState } from "react";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { About } from "./About";
import { Stats } from "./Stats";
import { Services } from "./Services";
import { WorkShowcase } from "./WorkShowcase";
import { VideoTransformations } from "./VideoTransformations";
import { Testimonials } from "./Testimonials";
import { FAQ } from "./FAQ";
import { Contact } from "./Contact";
import { WorkNearYouTab } from "./work-near-you/WorkNearYouTab";

const WorkNearYouDrawer = lazy(() =>
  import("./work-near-you/WorkNearYouDrawer").then((m) => ({ default: m.WorkNearYouDrawer })),
);

export function MainSite() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  // Mount the drawer (and fetch its code, map and data) only after the first open.
  const [drawerMounted, setDrawerMounted] = useState(false);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Stats />
        <Services />
        <WorkShowcase />
        <VideoTransformations />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <WorkNearYouTab
        onOpen={() => {
          setDrawerMounted(true);
          setDrawerOpen(true);
        }}
      />
      {drawerMounted && (
        <Suspense fallback={null}>
          <WorkNearYouDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
