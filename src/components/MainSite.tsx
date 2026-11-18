import { Suspense, lazy, useState } from "react";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { WorkNearYouTab } from "./work-near-you/WorkNearYouTab";

const BelowTheFold = lazy(() => import("./BelowTheFold"));

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
        <Suspense fallback={null}>
          <BelowTheFold />
        </Suspense>
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
