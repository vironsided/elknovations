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
      "https://images.unsplash.com/photo-1600566752355-35792bedcfe1?auto=format&fit=crop&w=1200&q=80",
    theme: "light" as const,
  },
];

export const testimonials = [
  {
    text: "Elk Novations did an incredible job on our kitchen. Highly recommend.",
    name: "Emily Carter",
  },
  {
    text: "Brilliant service from start to finish—the new bathroom exceeded expectations.",
    name: "James Richardson",
  },
  {
    text: "Our loft conversion was smooth and stress-free. Attention to detail was excellent.",
    name: "Sophie Williams",
  },
  {
    text: "They transformed our outdoor space. On time and beautiful workmanship.",
    name: "Daniel Foster",
  },
  {
    text: "Our extension is exactly what we wanted—spacious, bright, and solid.",
    name: "Charlotte Harris",
  },
  {
    text: "Fantastic workmanship on our bathroom renovation. Would hire again.",
    name: "Oliver Bennett",
  },
];

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
