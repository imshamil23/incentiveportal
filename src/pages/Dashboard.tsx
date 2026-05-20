import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, BarChart3, Building2, Layers, Trophy, User, LogOut, Menu, X, Sparkles } from "lucide-react";
import { clearSession, getSession } from "@/lib/auth";
import { MyDashboard } from "@/components/dashboard/MyDashboard";
import { OverallDashboard } from "@/components/dashboard/OverallDashboard";
import { GroupAnalytics } from "@/components/dashboard/GroupAnalytics";
import { TopPerformers } from "@/components/dashboard/TopPerformers";
import { Profile } from "@/components/dashboard/Profile";

type SectionId = "my" | "overall" | "branch" | "division" | "top" | "profile";

const NAV: { id: SectionId; label: string; icon: any; desc: string }[] = [
  { id: "my", label: "My Dashboard", icon: LayoutDashboard, desc: "Your personal stats" },
  { id: "overall", label: "Overall Dashboard", icon: BarChart3, desc: "Company-wide view" },
  { id: "branch", label: "Branch Analytics", icon: Building2, desc: "Branch performance" },
  { id: "division", label: "Division Analytics", icon: Layers, desc: "Division insights" },
  { id: "top", label: "Top Performers", icon: Trophy, desc: "Leaderboard" },
  { id: "profile", label: "Profile", icon: User, desc: "Your account" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const session = getSession();
  const [section, setSection] = useState<SectionId>("my");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!session) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    clearSession();
    navigate("/");
  };

  const current = NAV.find(n => n.id === section)!;

  const SidebarContent = (
    <>
      <div className={`flex items-center gap-3 px-5 py-6 border-b border-border/50 ${collapsed ? "justify-center px-2" : ""}`}>
        <div className="w-10 h-10 rounded-xl hero-gradient flex items-center justify-center shadow-lg shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="font-bold leading-tight">DriveMetrics</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Incentive Portal</div>
          </div>
        )}
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {NAV.map(item => {
          const active = section === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => { setSection(item.id); setMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "hero-gradient text-white shadow-glow"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              } ${collapsed ? "justify-center" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>
      <div className="p-3 border-t border-border/50">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition ${
            collapsed ? "justify-center" : ""
          }`}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen soft-gradient flex">
      {/* Desktop sidebar */}
      <aside className={`hidden md:flex flex-col bg-card/70 backdrop-blur-xl border-r border-border/50 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}>
        {SidebarContent}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-card z-50 flex flex-col md:hidden border-r border-border"
            >
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 bg-background/70 backdrop-blur-xl border-b border-border/50 px-4 md:px-8 py-4 flex items-center gap-4">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCollapsed(c => !c)}
            className="hidden md:block p-2 rounded-lg hover:bg-secondary"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg md:text-xl font-bold truncate">{current.label}</h1>
            <p className="text-xs text-muted-foreground truncate">{current.desc}</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-xs font-medium">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" style={{ background: "hsl(var(--success))" }} />
            {session.empCode}
          </div>
        </header>

        <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {section === "my" && <MyDashboard />}
              {section === "overall" && <OverallDashboard />}
              {section === "branch" && <GroupAnalytics mode="branch" />}
              {section === "division" && <GroupAnalytics mode="division" />}
              {section === "top" && <TopPerformers />}
              {section === "profile" && <Profile />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
