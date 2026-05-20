import { useMemo } from "react";
import { useIncentiveData } from "@/lib/useIncentiveData";
import { formatCurrency, formatCurrencyFull } from "@/lib/dataUtils";
import { SectionCard } from "./SectionCard";
import { Trophy, Crown, Medal, Award } from "lucide-react";
import { motion } from "framer-motion";

export const TopPerformers = () => {
  const { data } = useIncentiveData();

  const leaderboard = useMemo(() => {
    const map = new Map<string, { name: string; branch: string; desig: string; total: number; months: number }>();
    data.forEach(r => {
      const k = r["Emp Code"];
      const cur = map.get(k) || { name: r["Emp Name"], branch: r.Branch, desig: r.Designation, total: 0, months: 0 };
      cur.total += +r["Net Incentive to Credit"] || 0;
      cur.months += 1;
      map.set(k, cur);
    });
    return [...map.entries()]
      .map(([code, v]) => ({ code, ...v }))
      .sort((a, b) => b.total - a.total);
  }, [data]);

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3, 20);

  const podiumStyles = [
    { h: "h-56", bg: "hero-gradient", icon: Crown, label: "Champion" },
    { h: "h-44", bg: "bg-gradient-to-br from-slate-400 to-slate-500", icon: Medal, label: "2nd" },
    { h: "h-36", bg: "bg-gradient-to-br from-amber-500 to-orange-500", icon: Award, label: "3rd" },
  ];
  const order = [1, 0, 2]; // 2nd, 1st, 3rd display order

  return (
    <div className="space-y-6">
      <SectionCard title="🏆 Top 3 Champions" subtitle="The stars of this financial year">
        <div className="grid grid-cols-3 gap-3 md:gap-6 items-end pt-6">
          {order.map((idx) => {
            const p = top3[idx];
            if (!p) return <div key={idx} />;
            const s = podiumStyles[idx];
            const Icon = s.icon;
            return (
              <motion.div
                key={p.code}
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15, type: "spring", stiffness: 100 }}
                className="flex flex-col items-center"
              >
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full ${s.bg} flex items-center justify-center shadow-glow mb-3`}>
                  <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                <div className="text-center mb-3">
                  <div className="font-bold text-sm md:text-base">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.branch}</div>
                  <div className="font-extrabold gradient-text mt-1">{formatCurrency(p.total)}</div>
                </div>
                <div className={`w-full ${s.h} ${s.bg} rounded-t-2xl flex items-start justify-center pt-3 text-white font-extrabold text-2xl shadow-elevated`}>
                  #{idx + 1}
                </div>
              </motion.div>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="Full Leaderboard" subtitle="Top 20 performers ranked by total incentive">
        <div className="space-y-2">
          {rest.map((p, i) => (
            <motion.div
              key={p.code}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.02 }}
              className="flex items-center gap-4 p-3 rounded-xl bg-secondary/40 hover:bg-secondary/70 transition"
            >
              <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center font-bold text-muted-foreground">
                #{i + 4}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{p.name}</div>
                <div className="text-xs text-muted-foreground truncate">{p.desig} · {p.branch}</div>
              </div>
              <div className="text-right">
                <div className="font-bold">{formatCurrency(p.total)}</div>
                <div className="text-xs text-muted-foreground">{p.months} months</div>
              </div>
            </motion.div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};
