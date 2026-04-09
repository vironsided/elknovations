export const brand = {
  name: "Elk Novations",
  short: "EN",
  tagline: "Your trusted partner for quality home improvement",
  lead:
    "Elk Novations delivers expert home improvements—beautiful, functional spaces with craftsmanship you can trust.",
};

export const nav = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Our work", href: "#work" },
  { label: "FAQs", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export const hero = {
  badge: "Available for work",
  cta: "Work with us",
  image:
    "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1800&q=85",
  quote:
    "Elk Novations transformed our home—the blend of function and design is exactly what we hoped for.",
  quoteAuthor: "Client review",
};

export const about = {
  badge: "About us",
  title: "home improvement specialists",
  body:
    "Welcome to Elk Novations—your partners for remodeling and construction done right. From kitchens and baths to garages and additions, we focus on clear communication, careful planning, and workmanship that lasts. Our mission is to bring your vision to life with guidance at every step—so you end up in a home you love.",
};

export const galleryImages = [
  "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80",
];

export const stats = [
  {
    value: "8",
    label: "Years experience",
    sub: "Improving homes with expert craftsmanship for years",
  },
  {
    value: "250+",
    label: "Projects completed",
    sub: "Successful projects delivered with quality and care",
  },
  {
    value: "30",
    label: "Skilled tradespeople",
    sub: "Our network ensures top-quality results on every job",
  },
  {
    value: "100%",
    label: "Client satisfaction",
    sub: "We stand behind our work from start to finish",
  },
];

export type ServiceItem = {
  id: string;
  title: string;
  description: string;
  image: string;
};

export const services: ServiceItem[] = [
  {
    id: "kitchens",
    title: "Kitchens",
    description:
      "We design and build kitchens tailored to your lifestyle—layout, cabinetry, lighting, and finishes that make the heart of your home work beautifully every day.",
    image:
      "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "loft",
    title: "Loft conversions",
    description:
      "Unlock extra living space with a bespoke loft conversion—bedroom, office, or studio—planned for comfort, code, and long-term value.",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "bathrooms",
    title: "Bathrooms",
    description:
      "From efficient family baths to spa-like suites—we handle waterproofing, fixtures, tile, and lighting with meticulous detail.",
    image:
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "extensions",
    title: "Extensions",
    description:
      "Seamless home extensions that match your home’s character while adding the square footage you need—structurally sound and energy-smart.",
    image:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "restorations",
    title: "Restorations",
    description:
      "Preserve character while upgrading systems and finishes—we balance heritage detail with modern comfort and durability.",
    image:
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "external",
    title: "External works",
    description:
      "Driveways, patios, decks, and façades—outdoor spaces built to weather beautifully and elevate curb appeal.",
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80",
  },
];

export const projects = [
  {
    title: "Modern kitchen refit",
    category: "Kitchen",
    duration: "4 weeks",
    description:
      "Custom cabinetry, premium surfaces, and lighting design brought this kitchen from dated to dramatic—optimized for cooking and entertaining.",
    quote:
      "Elk Novations completely transformed our kitchen. The team was professional, on schedule, and the craftsmanship is outstanding.",
    author: "Rachel Morgan",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    theme: "light" as const,
  },
  {
    title: "External garden path build",
    category: "External works",
    duration: "1 month",
    description:
      "A durable, elegant walkway integrated with planting and drainage—built to last through freeze-thaw and heavy use.",
    quote:
      "Our outdoor space finally feels finished. Elk Novations listened, executed, and the path looks incredible.",
    author: "Michael Turner",
    image:
      "https://images.unsplash.com/photo-1598902108854-10e335adac99?auto=format&fit=crop&w=1200&q=80",
    theme: "dark" as const,
  },
  {
    title: "Bathroom renovation",
    category: "Bathroom",
    duration: "6 weeks",
    description:
      "Full gut renovation with curbless shower, heated floors, and warm minimal finishes—calm, bright, and easy to maintain.",
    quote:
      "The new bathroom feels like a retreat. Quality work and zero surprises on communication.",
    author: "Laura Davies",
    image:
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80",
    theme: "light" as const,
  },
];

const testimonialFirstNames = [
  "Emily", "James", "Sophie", "Daniel", "Charlotte", "Oliver", "Hannah", "Michael",
  "Rachel", "Ben", "Laura", "Thomas", "Anna", "Chris", "Natalie", "Ryan", "Kate",
  "David", "Jessica", "Matthew", "Sarah", "Andrew", "Emma", "Joshua", "Nicole",
];

const testimonialLastNames = [
  "Carter", "Richardson", "Williams", "Foster", "Harris", "Bennett", "Morgan", "Collins",
  "Bell", "Murphy", "Bailey", "Rivera", "Cooper", "Howard", "Ward", "Torres", "Peterson",
  "Gray", "Ramirez", "James", "Watson", "Brooks", "Kelly", "Sanders", "Price",
];

const testimonialAreas = [
  "kitchen",
  "bathroom",
  "garage conversion",
  "deck",
  "loft",
  "extension",
  "mudroom",
  "basement",
  "pantry",
  "home office",
  "laundry room",
  "primary suite",
  "guest bath",
  "front porch",
  "back patio",
  "windows",
  "flooring",
  "open-plan living",
  "garage doors",
  "siding",
  "roofing",
  "insulation",
  "electrical",
  "plumbing",
  "tile work",
  "crown molding",
  "built-ins",
  "closet system",
  "sunroom",
  "attic",
  "walk-in shower",
  "vanity area",
  "island install",
  "cabinet refacing",
  "countertops",
  "backsplash",
  "lighting",
  "exterior paint",
  "interior paint",
  "trim and doors",
  "stair remodel",
  "fireplace surround",
  "outdoor kitchen",
  "fence",
  "driveway",
  "carport",
  "whole-home refresh",
  "historic restoration",
  "accessibility upgrades",
  "smart-home prep",
  "final punch list",
];

const testimonialEndings = [
  "Highly recommend.",
  "We would hire them again in a heartbeat.",
  "On time, respectful crew, beautiful result.",
  "Communication was clear from day one.",
  "The finish quality exceeded our expectations.",
  "No surprises on the budget we agreed to.",
  "They treated our home with real care.",
  "Scheduling was realistic and they stuck to it.",
  "Design suggestions were practical and stylish.",
  "Cleanup was thorough every single day.",
  "Permits and inspections were handled smoothly.",
  "Our neighbors even asked who did the work.",
  "We finally enjoy spending time in this space.",
  "Details like trim and caulking are flawless.",
  "They coordinated subcontractors seamlessly.",
  "Questions were answered quickly—no runaround.",
  "The site was safe for our kids and pets.",
  "We appreciated the weekly progress updates.",
  "Craftsmanship you can see and feel.",
  "Honest timeline and honest pricing.",
  "Small touch-ups were done without a fuss.",
  "They listened and delivered exactly what we asked.",
  "Stress level was way lower than we expected.",
  "We are proud to show this room to guests.",
  "Evening walkthroughs made decisions easy.",
  "Materials were high quality for the price point.",
  "They protected floors and furniture everywhere.",
  "We trusted their recommendations completely.",
  "The space feels bigger and brighter now.",
  "Worth every penny—we smile every morning.",
  "Professional from quote to final walkthrough.",
  "They caught issues before they became costly.",
  "Our architect was impressed with the execution.",
  "Quiet tools and considerate work hours.",
  "They stood behind a minor fix months later.",
  "We already referred friends to Elk Novations.",
  "The team was friendly and easy to talk to.",
  "Change orders were fair and documented.",
  "We felt heard during every design tweak.",
  "Lighting placement was perfect for the room.",
  "Tile layout and grout lines are immaculate.",
  "Paint lines are razor sharp—true pros.",
  "They helped us prioritize where to splurge.",
  "Our home value clearly went up after this.",
  "Insurance paperwork was easier with their help.",
  "Winter weather didn’t derail the schedule.",
  "They left us with a maintenance checklist too.",
  "We sleep better knowing the work is solid.",
  "Guests assume we paid far more than we did.",
  "The project felt collaborative, not stressful.",
  "We’d choose Elk Novations again without hesitation.",
  "Every trade showed up when promised.",
  "Final invoice matched the estimate closely.",
  "They improved ideas we didn’t know we needed.",
  "Our older home finally feels modern and warm.",
  "Energy bills dropped after the window upgrade.",
  "Soundproofing in the office is a game changer.",
  "The shower pressure and temp are perfect now.",
  "Storage solutions were smarter than big-box ideas.",
  "They blended new work with our existing style.",
  "We appreciated the written warranty explanation.",
  "Photos on the website didn’t oversell—they delivered.",
  "Evening emails got replies the next morning.",
  "They noticed a code issue and fixed it proactively.",
  "Our inspector complimented the framing and insulation.",
  "The deck feels rock solid—no squeaks or wobble.",
  "Color matching on the patch was invisible.",
  "We felt comfortable leaving them with a key.",
  "Holiday deadline met with room to spare.",
  "They coordinated appliance delivery perfectly.",
  "Trim profiles match the rest of the house.",
  "We finally have enough outlets where we need them.",
  "Grout color choice was spot on.",
  "They helped us stage the room for listing photos.",
  "Basement stays dry—sump and drainage done right.",
  "Garage is actually usable as a workshop now.",
  "Stair railings are sturdy and code compliant.",
  "Skylights transformed a dark hallway.",
  "Outdoor lighting feels resort-like at night.",
  "They minimized dust with smart containment.",
  "We appreciated the punch-list walkthrough video.",
  "Subcontractors were vetted and professional too.",
  "They remembered our dog’s feeding schedule—kind touch.",
  "Hardware and hinges feel substantial, not cheap.",
  "We compared three bids—Elk was the clearest.",
  "The project manager was always reachable.",
  "They documented everything in writing—no gray areas.",
  "We’re planning phase two with the same team.",
  "Caulk and paint transitions are gallery smooth.",
  "They suggested a layout tweak that saved us space.",
  "Ventilation in the bath actually works now.",
  "Our radiant floor heats evenly—cozy winters.",
  "They reused materials where it made sense.",
  "Landscaping damage was repaired before they left.",
  "We felt the pride they take in their trade.",
  "The quote meeting felt educational, not salesy.",
  "They earned our trust before demo day.",
  "Finish schedule was realistic—not fantasy dates.",
  "We still get compliments months later.",
  "Elk Novations is our first call for future work.",
];

/** 100 client reviews for the testimonials marquee (duplicated in the UI for seamless looping). */
export const testimonials = Array.from({ length: 100 }, (_, i) => {
  const area = testimonialAreas[i % testimonialAreas.length];
  const ending = testimonialEndings[i % testimonialEndings.length];
  const fn = testimonialFirstNames[i % testimonialFirstNames.length];
  const ln = testimonialLastNames[(i * 13) % testimonialLastNames.length];
  return {
    name: `${fn} ${ln}`,
    text: `Elk Novations did outstanding work on our ${area}. ${ending}`,
  };
});

export const faqs = [
  {
    q: "What areas do you serve?",
    a: "We work with homeowners across the United States depending on project scope. Reach out with your location and we’ll confirm availability.",
  },
  {
    q: "How long does a typical project take?",
    a: "Timelines depend on scope—a bath or kitchen may take weeks; larger additions can take months. You’ll get a clear schedule before work begins.",
  },
  {
    q: "Do you offer free quotes?",
    a: "Yes. After an initial conversation we provide a detailed estimate so you know what to expect.",
  },
  {
    q: "Will I need permits?",
    a: "Some projects require permits; others don’t. We help you understand what applies and coordinate documentation when needed.",
  },
  {
    q: "Do you guarantee your work?",
    a: "We stand behind our craftsmanship. Warranty details vary by trade and scope—ask us for specifics for your project.",
  },
  {
    q: "Can I stay in my home during the work?",
    a: "Often yes for smaller projects. Larger renovations may require temporary adjustments—we’ll plan with you up front.",
  },
  {
    q: "How do I get started?",
    a: "Use the contact form or call us. We’ll schedule a consultation, review your goals, and outline next steps.",
  },
];

export const contact = {
  badge: "Contact",
  title: "Get in touch",
  intro:
    "For inquiries or to explore your project, contact our team using the details below.",
  office: "Serving homeowners nationwide — schedule a call for your region.",
  email: "vusal.teymurov520@gmail.com",
  phone: "(555) 010-4200",
};

export const footerLinks = [
  { label: "About us", href: "#about" },
  { label: "Our work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQs", href: "#faq" },
  { label: "Contact", href: "#contact" },
];
