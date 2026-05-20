import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { formatCurrency } from "@/lib/dataUtils";

interface Props {
  label: string;
  value: number | string;
  hint?: string;
  icon: LucideIcon;
  currency?: boolean;
  delay?: number;
  accent?: "primary" | "success" | "warning" | "accent";
}

const accentMap = {
  primary: "from-primary to-accent",
  success: "from-emerald-500 to-teal-500",
  warning: "from-amber-500 to-orange-500",
  accent: "from-sky-500 to-indigo-500",
};

export const KpiCard = ({ label, value, hint, icon: Icon, currency, delay = 0, accent = "primary" }: Props) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="glass-card glass-card-hover p-5 relative overflow-hidden"
  >
    <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${accentMap[accent]} opacity-10 blur-2xl`} />
    <div className="flex items-start justify-between mb-4 relative">
      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${accentMap[accent]} flex items-center justify-center shadow-lg`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</div>
    <div className="text-2xl md:text-3xl font-extrabold mt-1">
      {currency && typeof value === "number" ? formatCurrency(value) : value}
    </div>
    {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
  </motion.div>
);
