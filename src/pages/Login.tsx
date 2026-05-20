import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, User, ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import { setSession } from "@/lib/auth";

interface Cred { EmpCode: string; Password: string }

const Login = () => {
  const navigate = useNavigate();
  const [empCode, setEmpCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/PASSWORD.json");
      const creds: Cred[] = await res.json();
      const match = creds.find(
        (c) => c.EmpCode.toLowerCase() === empCode.trim().toLowerCase() && c.Password === password
      );
      if (!match) {
        setError("Invalid Employee Code or Password");
        setLoading(false);
        return;
      }
      setSession({ empCode: match.EmpCode, loginAt: Date.now() });
      navigate("/app");
    } catch {
      setError("Could not load credentials");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen soft-gradient relative flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute inset-0 glow-bg pointer-events-none" />
      <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-20 right-20 w-72 h-72 rounded-full bg-accent/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="glass-card p-8 md:p-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl hero-gradient flex items-center justify-center shadow-glow mb-4">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to your incentive portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-2 block">EMPLOYEE CODE</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={empCode}
                  onChange={(e) => setEmpCode(e.target.value)}
                  required
                  placeholder="e.g. E1001"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-secondary/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-2 block">PASSWORD</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter password"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-secondary/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2"
              >
                <AlertCircle className="w-4 h-4" /> {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full hero-gradient text-white font-semibold py-3 rounded-xl shadow-glow flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </motion.button>
          </form>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            Try <span className="font-mono font-semibold">E1001</span> / <span className="font-mono font-semibold">demo123</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
