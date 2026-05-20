import { useEffect, useState } from "react";
import type { IncentiveRow } from "./dataUtils";

let cache: IncentiveRow[] | null = null;

export const useIncentiveData = () => {
  const [data, setData] = useState<IncentiveRow[] | null>(cache);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache) return;
    fetch("/summery.json")
      .then((r) => r.json())
      .then((d: IncentiveRow[]) => {
        cache = d;
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { data: data || [], loading };
};
