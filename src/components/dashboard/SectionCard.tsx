import { ReactNode } from "react";
import { motion } from "framer-motion";

export const SectionCard = ({
  title, subtitle, children, action,
}: { title: string; subtitle?: string; children: ReactNode; action?: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="glass-card p-6"
  >
    <div className="flex items-start justify-between mb-5">
      <div>
        <h3 className="text-lg font-bold">{title}</h3>
        {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
    {children}
  </motion.div>
);
