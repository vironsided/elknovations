import { About } from "./About";
import { Stats } from "./Stats";
import { Services } from "./Services";
import { WorkShowcase } from "./WorkShowcase";
import { VideoTransformations } from "./VideoTransformations";
import { Testimonials } from "./Testimonials";
import { FAQ } from "./FAQ";
import { Contact } from "./Contact";

/**
 * Everything below the hero. Loaded as a separate chunk so the browser can paint the
 * header and hero before it spends time on the rest of the page (slow phones).
 */
export default function BelowTheFold() {
  return (
    <>
      <About />
      <Stats />
      <Services />
      <WorkShowcase />
      <VideoTransformations />
      <Testimonials />
      <FAQ />
      <Contact />
    </>
  );
}
