import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Wrench,
  HelpCircle,
  MessageSquareQuote,
  Star,
  Tags,
  Images,
  Clapperboard,
  Settings,
  Share2,
  QrCode,
  LogOut,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

const links = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/services", label: "Services", icon: Wrench },
  { to: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { to: "/admin/google-reviews", label: "Google Reviews", icon: Star },
  { to: "/admin/work-categories", label: "Work Categories", icon: Tags },
  { to: "/admin/work-cases", label: "Work Cases", icon: Images },
  { to: "/admin/transformations", label: "Transformations", icon: Clapperboard },
  { to: "/admin/social-links", label: "Social Links", icon: Share2 },
  { to: "/admin/qr-generator", label: "QR Generator", icon: QrCode },
  { to: "/admin/settings", label: "Site Settings", icon: Settings },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="relative flex min-h-screen bg-neutral-100">
      {menuOpen && (
        <button
          type="button"
          aria-label="Close menu overlay"
          className="fixed inset-0 z-30 bg-black/35 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-screen w-60 shrink-0 flex-col border-r border-neutral-200 bg-white transition-transform duration-200 lg:sticky lg:top-0 lg:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center gap-2 border-b border-neutral-200 px-4">
          <span className="text-sm font-bold tracking-tight text-neutral-900">Elk Novations</span>
          <span className="rounded bg-neutral-900 px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase text-white">
            Admin
          </span>
          <button
            type="button"
            aria-label="Close menu"
            className="ml-auto rounded-md p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 lg:hidden"
            onClick={() => setMenuOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                }`
              }
            >
              <l.icon size={18} strokeWidth={1.75} />
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-neutral-200 p-2 space-y-0.5">
          <a
            href="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition"
          >
            <ArrowLeft size={18} strokeWidth={1.75} />
            View site
          </a>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition"
          >
            <LogOut size={18} strokeWidth={1.75} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-y-auto">
        <div className="sticky top-0 z-20 border-b border-neutral-200 bg-white p-2 lg:hidden">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={16} />
            Menu
          </button>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
