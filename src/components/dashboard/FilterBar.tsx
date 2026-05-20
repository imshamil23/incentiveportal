import { useMemo } from "react";
import type { IncentiveRow } from "@/lib/dataUtils";
import { Filter } from "lucide-react";

interface Props {
  data: IncentiveRow[];
  division: string;
  setDivision: (v: string) => void;
  branch: string;
  setBranch: (v: string) => void;
}

export const FilterBar = ({ data, division, setDivision, branch, setBranch }: Props) => {
  const divisions = useMemo(() => ["All", ...Array.from(new Set(data.map(r => r.DIVISION))).sort()], [data]);
  const branches = useMemo(() => ["All", ...Array.from(new Set(data.map(r => r.Branch))).sort()], [data]);

  return (
    <div className="glass-card p-4 flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground pr-2">
        <Filter className="w-4 h-4" /> Filters
      </div>
      <Select label="Division" value={division} onChange={setDivision} options={divisions} />
      <Select label="Branch" value={branch} onChange={setBranch} options={branches} />
      {(division !== "All" || branch !== "All") && (
        <button
          onClick={() => { setDivision("All"); setBranch("All"); }}
          className="text-xs text-primary font-semibold hover:underline ml-auto"
        >
          Clear filters
        </button>
      )}
    </div>
  );
};

const Select = ({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) => (
  <div className="flex items-center gap-2">
    <span className="text-xs text-muted-foreground">{label}:</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="text-sm px-3 py-1.5 rounded-lg bg-secondary border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);
