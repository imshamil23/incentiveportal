import { useMemo } from "react";
import { useIncentiveData } from "@/lib/useIncentiveData";
import { formatMonth, formatCurrency, formatCurrencyFull, sum } from "@/lib/dataUtils";
import { getSession } from "@/lib/auth";
import { KpiCard } from "./KpiCard";
import { SectionCard } from "./SectionCard";
import { Trophy, Wallet, Calendar, TrendingUp, Award, Sparkles } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { motion } from "framer-motion";

export const MyDashboard = () => {
  const { data, loading } = useIncentiveData();
  const session = getSession();

  const stats = useMemo(() => {
    if (!session) return null;
    const mine = data.filter((r) => r["Emp Code"].toLowerCase() === session.empCode.toLowerCase());
    if (!mine.length) return null;
    const total = sum(mine.map((r) => +r["Net Incentive to Credit"] || 0));
    const months = mine.length;
    const best = [...mine].sort((a, b) => +b["Net Incentive to Credit"] - +a["Net Incentive to Credit"])[0];
    const avgM = total / months;

    const sorted = [...mine].sort((a, b) => {
      const da = typeof a["Month-Yy"] === "number" ? a["Month-Yy"] : 0;
      const db = typeof b["Month-Yy"] === "number" ? b["Month-Yy"] : 0;
      return (da as number) - (db as number);
    });
    const trend = sorted.map((r) => ({
      month: formatMonth(r["Month-Yy"]),
      value: +r["Net Incentive to Credit"] || 0,
    }));

    // Rank among all employees by total
    const totals = new Map<string, { name: string; total: number }>();
    data.forEach((r) => {
      const k = r["Emp Code"];
      const t = totals.get(k) || { name: r["Emp Name"], total: 0 };
      t.total += +r["Net Incentive to Credit"] || 0;
      totals.set(k, t);
    });
    const ranked = [...totals.entries()].sort((a, b) => b[1].total - a[1].total);
    const rank = ranked.findIndex(([k]) => k.toLowerCase() === session.empCode.toLowerCase()) + 1;

    return { mine, total, months, best, avgM, trend, rank, totalEmployees: ranked.length, profile: mine[0] };
  }, [data, session]);

  if (loading) return <div className="text-muted-foreground">Loading your dashboard...</div>;
  if (!stats) return (
    <div className="glass-card p-8 text-center">
      <Sparkles className="w-10 h-10 mx-auto text-primary mb-3" />
      <h3 className="text-lg font-bold">No data found for your account</h3>
      <p className="text-sm text-muted-foreground mt-1">Please contact admin or check your Employee Code.</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 md:p-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 hero-gradient opacity-[0.08]" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Welcome back</div>
            <h2 className="text-2xl md:text-3xl font-extrabold">{stats.profile["Emp Name"]} 👋</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {stats.profile.Designation} · {stats.profile.Branch}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Your Rank</div>
              <div className="text-2xl font-extrabold gradient-text">#{stats.rank}</div>
            </div>
            <div className="w-14 h-14 rounded-2xl hero-gradient flex items-center justify-center shadow-glow">
              <Trophy className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total Incentive" value={stats.total} currency icon={Wallet} accent="primary" delay={0.05} />
        <KpiCard label="Months Earned" value={stats.months} icon={Calendar} accent="accent" delay={0.1} hint="Active months" />
        <KpiCard label="Avg / Month" value={stats.avgM} currency icon={TrendingUp} accent="success" delay={0.15} />
        <KpiCard label="Best Month" value={formatMonth(stats.best["Month-Yy"])} icon={Award} accent="warning" delay={0.2}
          hint={formatCurrency(+stats.best["Net Incentive to Credit"])} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SectionCard title="Your Incentive Journey" subtitle="Month-by-month earnings trend">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stats.trend}>
                <defs>
                  <linearGradient id="myGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => formatCurrency(v)} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }}
                  formatter={(v: number) => formatCurrencyFull(v)}
                />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} fill="url(#myGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </SectionCard>
        </div>

        <SectionCard title="Quick Insights" subtitle="Tips just for you">
          <div className="space-y-3">
            <InsightItem
              color="primary"
              text={`You're ranked #${stats.rank} out of ${stats.totalEmployees} employees. Keep pushing!`}
            />
            <InsightItem
              color="success"
              text={`Your best month was ${formatMonth(stats.best["Month-Yy"])} with ${formatCurrency(+stats.best["Net Incentive to Credit"])}.`}
            />
            <InsightItem
              color="warning"
              text={`Your average monthly incentive is ${formatCurrency(stats.avgM)}.`}
            />
            <InsightItem
              color="accent"
              text={`Total earned this FY: ${formatCurrencyFull(stats.total)}.`}
            />
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

const InsightItem = ({ color, text }: { color: string; text: string }) => (
  <div className="flex gap-3 p-3 rounded-xl bg-secondary/50">
    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 bg-${color}`} style={{ backgroundColor: `hsl(var(--${color}))` }} />
    <div className="text-sm">{text}</div>
  </div>
);
