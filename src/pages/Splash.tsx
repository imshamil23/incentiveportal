import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, BarChart3, Trophy } from "lucide-react";
import heroImg from "@/assets/auto-hero.jpg";

const Splash = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen overflow-hidden soft-gradient">
      <div className="absolute inset-0 glow-bg pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />

      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl hero-gradient flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-lg leading-tight">DriveMetrics</div>
            <div className="text-xs text-muted-foreground">Team Explore</div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-sm text-muted-foreground hidden md:block"
        >
          Automobile Employee Incentive Analytics
        </motion.div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-8 md:pt-16 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-xs font-medium mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Premium Analytics Experience
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-extrabold leading-[1.05] mb-6"
          >
            Drive Your <span className="gradient-text">Incentives</span> Forward
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-muted-foreground mb-8 max-w-lg"
          >
            A simple, beautiful dashboard to explore your monthly incentives, see how your branch is performing, and celebrate top performers.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/login")}
            className="group inline-flex items-center gap-3 hero-gradient text-white px-8 py-4 rounded-2xl font-semibold shadow-glow hover:shadow-elevated transition-all"
          >
            Enter Portal
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-3 gap-4 mt-12 max-w-md"
          >
            {[
              { icon: BarChart3, label: "Live KPIs" },
              { icon: Trophy, label: "Leaderboard" },
              { icon: Sparkles, label: "Insights" },
            ].map((f, i) => (
              <div key={i} className="glass-card p-4 text-center glass-card-hover">
                <f.icon className="w-5 h-5 mx-auto mb-2 text-primary" />
                <div className="text-xs font-medium">{f.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 hero-gradient blur-3xl opacity-30 rounded-full" />
          <div className="relative glass-card overflow-hidden rounded-3xl">
            <img src={heroImg} alt="Premium automobile" className="w-full h-auto" width={1536} height={896} />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="absolute -bottom-6 -left-6 glass-card p-4 flex items-center gap-3"
          >
            <div className="kpi-icon !w-10 !h-10"><Trophy className="w-5 h-5" /></div>
            <div>
              <div className="text-xs text-muted-foreground">This Month</div>
              <div className="font-bold">Top Performer</div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <footer className="relative z-10 text-center text-xs text-muted-foreground py-8 mt-12">
        Crafted by <span className="font-semibold text-foreground">Team Explore</span> · © 2026
      </footer>
    </div>
  );
};

export default Splash;
