import { useMemo, useState } from "react";
import { useIncentiveData } from "@/lib/useIncentiveData";
import { formatCurrency, formatCurrencyFull, sum } from "@/lib/dataUtils";
import { SectionCard } from "./SectionCard";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";

type Mode = "branch" | "division";

export const GroupAnalytics = ({ mode }: { mode: Mode }) => {
  const { data } = useIncentiveData();
  const key = mode === "branch" ? "Branch" : "DIVISION";
  const groups = useMemo(() => Array.from(new Set(data.map(r => r[key as keyof typeof r] as string))).sort(), [data, key]);
  const [selected, setSelected] = useState<string | null>(null);

  const stats = useMemo(() => {
    const totals = new Map<string, { total: number; emps: Set<string>; count: number }>();
    data.forEach(r => {
      const g = r[key as keyof typeof r] as string;
      const t = totals.get(g) || { total: 0, emps: new Set<string>(), count: 0 };
      t.total += +r["Net Incentive to Credit"] || 0;
      t.emps.add(r["Emp Code"]);
      t.count += 1;
      totals.set(g, t);
    });
    const arr = [...totals.entries()]
      .map(([name, v]) => ({ name, total: v.total, employees: v.emps.size, count: v.count }))
      .sort((a, b) => b.total - a.total);
    return arr;
  }, [data, key]);

  const max = stats[0]?.total || 1;
  const colors = ["hsl(218 90% 52%)", "hsl(198 95% 55%)", "hsl(152 70% 42%)", "hsl(38 95% 55%)", "hsl(280 70% 60%)", "hsl(340 80% 60%)", "hsl(170 70% 45%)", "hsl(20 90% 60%)"];

  const detail = selected ? data.filter(r => r[key as keyof typeof r] === selected) : null;
  const detailTotal = detail ? sum(detail.map(r => +r["Net Incentive to Credit"] || 0)) : 0;
  const detailEmps = detail ? new Set(detail.map(r => r["Emp Code"])).size : 0;

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-4">
        {stats.slice(0, 3).map((g, i) => (
          <motion.div
            key={g.name}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card glass-card-hover p-5 cursor-pointer"
            onClick={() => setSelected(g.name === selected ? null : g.name)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-3xl">{["🥇","🥈","🥉"][i]}</div>
              <Building2 className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="font-bold text-lg">{g.name}</div>
            <div className="text-2xl font-extrabold gradient-text mt-1">{formatCurrency(g.total)}</div>
            <div className="text-xs text-muted-foreground mt-1">{g.employees} employees</div>
          </motion.div>
        ))}
      </div>

      <SectionCard
        title={mode === "branch" ? "Branch Performance" : "Division Performance"}
        subtitle="Click any bar to see details"
      >
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={stats} onClick={(e: any) => e?.activeLabel && setSelected(e.activeLabel)}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} angle={-15} textAnchor="end" height={80} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => formatCurrency(v)} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }}
              formatter={(v: number) => formatCurrencyFull(v)} />
            <Bar dataKey="total" radius={[10, 10, 0, 0]}>
              {stats.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>

      {selected && detail && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <SectionCard
            title={`${selected} — Details`}
            subtitle={`${detailEmps} employees · ${formatCurrencyFull(detailTotal)} total`}
            action={<button onClick={() => setSelected(null)} className="text-xs text-primary font-semibold hover:underline">Close</button>}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-muted-foreground border-b border-border">
                    <th className="text-left py-2 font-semibold">Employee</th>
                    <th className="text-left py-2 font-semibold">Designation</th>
                    <th className="text-right py-2 font-semibold">Total Incentive</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(
                    detail.reduce((acc, r) => {
                      const k = r["Emp Code"];
                      acc[k] = acc[k] || { name: r["Emp Name"], desig: r.Designation, total: 0 };
                      acc[k].total += +r["Net Incentive to Credit"] || 0;
                      return acc;
                    }, {} as Record<string, { name: string; desig: string; total: number }>)
                  ).sort((a, b) => b[1].total - a[1].total).map(([k, v]) => (
                    <tr key={k} className="border-b border-border/50 hover:bg-secondary/40 transition">
                      <td className="py-3 font-medium">{v.name}</td>
                      <td className="py-3 text-muted-foreground">{v.desig}</td>
                      <td className="py-3 text-right font-semibold">{formatCurrencyFull(v.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </motion.div>
      )}
    </div>
  );
};
