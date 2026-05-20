import { useMemo, useState } from "react";
import { useIncentiveData } from "@/lib/useIncentiveData";
import { formatMonth, formatCurrency, formatCurrencyFull, sum } from "@/lib/dataUtils";
import { KpiCard } from "./KpiCard";
import { SectionCard } from "./SectionCard";
import { Users, Wallet, Building2, TrendingUp } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Line, LineChart, Legend } from "recharts";
import { FilterBar } from "./FilterBar";

export const OverallDashboard = () => {
  const { data } = useIncentiveData();
  const [division, setDivision] = useState<string>("All");
  const [branch, setBranch] = useState<string>("All");

  const filtered = useMemo(() => data.filter(r =>
    (division === "All" || r.DIVISION === division) &&
    (branch === "All" || r.Branch === branch)
  ), [data, division, branch]);

  const stats = useMemo(() => {
    const total = sum(filtered.map(r => +r["Net Incentive to Credit"] || 0));
    const employees = new Set(filtered.map(r => r["Emp Code"])).size;
    const branches = new Set(filtered.map(r => r.Branch)).size;
    const avgPerEmp = employees ? total / employees : 0;

    const byMonth = new Map<number, number>();
    filtered.forEach(r => {
      const k = +r["Month-Yy"];
      byMonth.set(k, (byMonth.get(k) || 0) + (+r["Net Incentive to Credit"] || 0));
    });
    const monthly = [...byMonth.entries()].sort((a, b) => a[0] - b[0])
      .map(([k, v]) => ({ month: formatMonth(k), total: v }));

    const byBranch = new Map<string, number>();
    filtered.forEach(r => byBranch.set(r.Branch, (byBranch.get(r.Branch) || 0) + (+r["Net Incentive to Credit"] || 0)));
    const branchData = [...byBranch.entries()].sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }));

    return { total, employees, branches, avgPerEmp, monthly, branchData };
  }, [filtered]);

  return (
    <div className="space-y-6">
      <FilterBar division={division} setDivision={setDivision} branch={branch} setBranch={setBranch} data={data} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total Incentive Paid" value={stats.total} currency icon={Wallet} accent="primary" />
        <KpiCard label="Total Employees" value={stats.employees} icon={Users} accent="accent" delay={0.05} />
        <KpiCard label="Active Branches" value={stats.branches} icon={Building2} accent="success" delay={0.1} />
        <KpiCard label="Avg per Employee" value={stats.avgPerEmp} currency icon={TrendingUp} accent="warning" delay={0.15} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <SectionCard title="Monthly Incentive Trend" subtitle="Total payout across all selected employees">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => formatCurrency(v)} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }}
                formatter={(v: number) => formatCurrencyFull(v)} />
              <Line type="monotone" dataKey="total" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Top 3 Branches" subtitle="Best performing branches by total incentive">
          <div className="space-y-3">
            {stats.branchData.slice(0, 3).map((b, i) => {
              const max = stats.branchData[0]?.value || 1;
              const pct = (b.value / max) * 100;
              const medals = ["🥇", "🥈", "🥉"];
              return (
                <div key={b.name} className="p-3 rounded-xl bg-secondary/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold flex items-center gap-2">
                      <span className="text-xl">{medals[i]}</span> {b.name}
                    </div>
                    <div className="font-bold gradient-text">{formatCurrency(b.value)}</div>
                  </div>
                  <div className="h-2 rounded-full bg-background overflow-hidden">
                    <div className="h-full hero-gradient transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="All Branches Comparison" subtitle="Incentive payout per branch">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={stats.branchData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} angle={-15} textAnchor="end" height={70} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => formatCurrency(v)} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }}
              formatter={(v: number) => formatCurrencyFull(v)} />
            <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>
    </div>
  );
};
