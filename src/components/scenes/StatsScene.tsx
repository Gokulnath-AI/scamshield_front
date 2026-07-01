"use client";

import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
  AreaChart, Area, BarChart, Bar,
} from "recharts";
import GlassPanel from "@/components/ui/GlassPanel";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { modelMetrics, performanceData, scamDistribution, monthlyTrends, insightStats } from "@/data/mock";

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const metrics = [
  { label: "Accuracy", value: modelMetrics.accuracy },
  { label: "Precision", value: modelMetrics.precision },
  { label: "Recall", value: modelMetrics.recall },
  { label: "F1 Score", value: modelMetrics.f1Score },
];

const tooltipStyle = {
  background: "rgba(255,255,255,0.92)",
  border: "1px solid rgba(226,232,240,0.6)",
  borderRadius: "14px",
  fontSize: "12px",
  backdropFilter: "blur(12px)",
  boxShadow: "0 8px 32px rgba(37,99,235,0.06)",
};

export default function StatsScene() {
  return (
    <section className="scene-section !min-h-[200vh] py-24 relative" id="stats" aria-label="Model performance and insights">
      <div className="max-w-6xl mx-auto px-6 pointer-events-auto space-y-20">
        {/* Insight stats */}
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
          <motion.div variants={fadeUp} className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-[0.2em] uppercase text-primary bg-blue-50/80 border border-blue-100/60 mb-4 backdrop-blur-sm">
              Impact
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight font-[family-name:var(--font-display)]">
              Protecting India at Scale
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {insightStats.map((stat) => (
              <motion.div key={stat.label} variants={fadeUp}>
                <GlassPanel variant="strong" noise className="p-5 text-center cursor-pointer">
                  <div className="text-2xl md:text-3xl font-bold text-primary tracking-tight">{stat.value}</div>
                  <div className="text-sm font-medium text-foreground mt-1">{stat.label}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{stat.description}</div>
                </GlassPanel>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Model metrics */}
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
          <motion.div variants={fadeUp} className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-[0.2em] uppercase text-primary bg-blue-50/80 border border-blue-100/60 mb-4 backdrop-blur-sm">
              Performance
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight font-[family-name:var(--font-display)]">
              Model Metrics
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {metrics.map((m) => (
              <motion.div key={m.label} variants={fadeUp}>
                <GlassPanel variant="strong" className="p-5 text-center cursor-pointer">
                  <div className="text-3xl md:text-4xl font-bold text-primary tracking-tight">
                    <AnimatedCounter target={m.value} suffix="%" />
                  </div>
                  <div className="text-sm text-slate-500 mt-1">{m.label}</div>
                </GlassPanel>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <motion.div variants={fadeUp} className="lg:col-span-2">
              <GlassPanel variant="strong" noise className="p-6" hover={false}>
                <h3 className="text-sm font-semibold text-foreground mb-4">Performance Over Time</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f040" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                    <YAxis domain={[88, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line type="monotone" dataKey="accuracy" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 3, fill: "#2563EB" }} />
                    <Line type="monotone" dataKey="precision" stroke="#3B82F6" strokeWidth={2} dot={{ r: 2.5, fill: "#3B82F6" }} />
                    <Line type="monotone" dataKey="recall" stroke="#93c5fd" strokeWidth={2} dot={{ r: 2.5, fill: "#93c5fd" }} />
                  </LineChart>
                </ResponsiveContainer>
              </GlassPanel>
            </motion.div>

            <motion.div variants={fadeUp}>
              <GlassPanel variant="strong" noise className="p-6" hover={false}>
                <h3 className="text-sm font-semibold text-foreground mb-4">Scam Distribution</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={scamDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                      {scamDistribution.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value}%`, ""]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
                  {scamDistribution.map((d) => (
                    <div key={d.name} className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                      {d.name}
                    </div>
                  ))}
                </div>
              </GlassPanel>
            </motion.div>
          </div>
        </motion.div>

        {/* Trends */}
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <motion.div variants={fadeUp}>
              <GlassPanel variant="strong" noise className="p-6" hover={false}>
                <h3 className="text-sm font-semibold text-foreground mb-4">Monthly Scam Trends</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f040" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Area type="monotone" dataKey="reported" stroke="#EF4444" fill="#FEE2E2" strokeWidth={2} fillOpacity={0.5} />
                    <Area type="monotone" dataKey="detected" stroke="#2563EB" fill="#DBEAFE" strokeWidth={2} fillOpacity={0.5} />
                    <Area type="monotone" dataKey="prevented" stroke="#22C55E" fill="#DCFCE7" strokeWidth={2} fillOpacity={0.5} />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="flex gap-4 mt-3 justify-center">
                  {[
                    { label: "Reported", color: "#EF4444" },
                    { label: "Detected", color: "#2563EB" },
                    { label: "Prevented", color: "#22C55E" },
                  ].map((l) => (
                    <div key={l.label} className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
                      {l.label}
                    </div>
                  ))}
                </div>
              </GlassPanel>
            </motion.div>

            <motion.div variants={fadeUp}>
              <GlassPanel variant="strong" noise className="p-6" hover={false}>
                <h3 className="text-sm font-semibold text-foreground mb-4">Top Scam Categories</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={scamDistribution} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f040" />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} unit="%" />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#64748b" }} width={85} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value}%`, "Share"]} />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                      {scamDistribution.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </GlassPanel>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
