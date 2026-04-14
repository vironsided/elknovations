import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Wrench,
  HelpCircle,
  MessageSquareQuote,
  Settings,
  Share2,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

const links = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/services", label: "Services", icon: Wrench },
  { to: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { to: "/admin/social-links", label: "Social Links", icon: Share2 },
  { to: "/admin/settings", label: "Site Settings", icon: Settings },
];

export function AdminLayout() {
  const navigate = useNavigate();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-neutral-200 bg-white">
        <div className="flex h-14 items-center gap-2 border-b border-neutral-200 px-4">
          <span className="text-sm font-bold tracking-tight text-neutral-900">Elk Novations</span>
          <span className="rounded bg-neutral-900 px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase text-white">
            Admin
          </span>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
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

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
