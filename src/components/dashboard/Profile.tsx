import { useMemo } from "react";
import { useIncentiveData } from "@/lib/useIncentiveData";
import { getSession } from "@/lib/auth";
import { formatCurrency, formatCurrencyFull, formatMonth, sum } from "@/lib/dataUtils";
import { SectionCard } from "./SectionCard";
import { User, Mail, Briefcase, Building2, Car, Calendar, TrendingUp, Trophy } from "lucide-react";
import { motion } from "framer-motion";

export const Profile = () => {
  const { data } = useIncentiveData();
  const session = getSession();

  const info = useMemo(() => {
    if (!session) return null;
    const mine = data.filter(r => r["Emp Code"].toLowerCase() === session.empCode.toLowerCase());
    if (!mine.length) return null;
    const p = mine[0];
    const total = sum(mine.map(r => +r["Net Incentive to Credit"] || 0));
    const best = [...mine].sort((a, b) => +b["Net Incentive to Credit"] - +a["Net Incentive to Credit"])[0];
    return { p, total, months: mine.length, best, fy: p.FY };
  }, [data, session]);

  if (!info) return <div className="glass-card p-8 text-center text-muted-foreground">No profile data available</div>;
  const { p, total, months, best, fy } = info;

  const initials = p["Emp Name"].split(" ").map(s => s[0]).slice(0, 2).join("");

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card overflow-hidden">
        <div className="hero-gradient h-32 relative">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        </div>
        <div className="px-6 md:px-8 pb-6 -mt-16">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="w-28 h-28 rounded-3xl hero-gradient flex items-center justify-center text-white text-4xl font-extrabold border-4 border-card shadow-elevated">
              {initials}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-extrabold">{p["Emp Name"]}</h2>
              <p className="text-muted-foreground">{p.Designation} · {p.Branch}</p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">{fy}</span>
              <span className="px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold">Active</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        <SectionCard title="Personal Details" subtitle="Your profile information">
          <div className="space-y-3">
            <Row icon={User} label="Employee Code" value={p["Emp Code"]} />
            <Row icon={Briefcase} label="Designation" value={p.Designation} />
            <Row icon={Building2} label="Branch" value={p.Branch} />
            <Row icon={Car} label="Dealership" value={p.Dealership} />
            <Row icon={Mail} label="Division" value={p.DIVISION} />
            <Row icon={Calendar} label="Financial Year" value={fy} />
          </div>
        </SectionCard>

        <SectionCard title="Performance Snapshot" subtitle="Quick summary of your year">
          <div className="grid grid-cols-2 gap-3">
            <Stat icon={Trophy} label="Total Earned" value={formatCurrencyFull(total)} />
            <Stat icon={Calendar} label="Active Months" value={String(months)} />
            <Stat icon={TrendingUp} label="Avg / Month" value={formatCurrency(total / Math.max(months, 1))} />
            <Stat icon={Trophy} label="Best Month" value={formatMonth(best["Month-Yy"])} sub={formatCurrency(+best["Net Incentive to Credit"])} />
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

const Row = ({ icon: Icon, label, value }: any) => (
  <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40">
    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
      <Icon className="w-4 h-4 text-primary" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-semibold truncate">{value}</div>
    </div>
  </div>
);

const Stat = ({ icon: Icon, label, value, sub }: any) => (
  <div className="p-4 rounded-xl bg-secondary/40">
    <Icon className="w-5 h-5 text-primary mb-2" />
    <div className="text-xs text-muted-foreground">{label}</div>
    <div className="font-bold text-lg">{value}</div>
    {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
  </div>
);
