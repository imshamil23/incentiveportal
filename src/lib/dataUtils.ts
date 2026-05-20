export interface IncentiveRow {
  "Emp Code": string;
  "Emp Name": string;
  Designation: string;
  Branch: string;
  Dealership: string;
  DIVISION: string;
  "Month-Yy": number | string;
  "Net Incentive to Credit": number;
  FY: string;
}

export const excelSerialToDate = (serial: number | string): Date => {
  if (typeof serial === "string") {
    const d = new Date(serial);
    if (!isNaN(d.getTime())) return d;
    const n = parseFloat(serial);
    if (!isNaN(n)) return excelSerialToDate(n);
    return new Date();
  }
  const utcDays = serial - 25569;
  return new Date(utcDays * 86400 * 1000);
};

export const formatMonth = (serial: number | string): string => {
  const d = excelSerialToDate(serial);
  return d.toLocaleString("en-US", { month: "short", year: "2-digit" });
};

export const formatCurrency = (n: number): string => {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n.toFixed(0)}`;
};

export const formatCurrencyFull = (n: number): string =>
  `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
export const avg = (arr: number[]) => (arr.length ? sum(arr) / arr.length : 0);

export const groupBy = <T,>(arr: T[], key: (t: T) => string): Record<string, T[]> =>
  arr.reduce((acc, item) => {
    const k = key(item);
    (acc[k] = acc[k] || []).push(item);
    return acc;
  }, {} as Record<string, T[]>);
