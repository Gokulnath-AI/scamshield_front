"use client";

import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area,
} from "recharts";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { insightStats, monthlyTrends, scamDistribution } from "@/data/mock";

export default function Insights() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-blue-50/30 to-white">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          badge="Insights"
          title="Indian Scam Landscape"
          subtitle="Data-driven overview of scam trends across India."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
        >
          {insightStats.map((stat) => (
            <motion.div key={stat.label} variants={fadeInUp}>
              <GlassCard variant="strong" className="p-5 text-center cursor-pointer">
                <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm font-medium text-foreground mt-1">{stat.label}</div>
                <div className="text-xs text-slate-400 mt-0.5">{stat.description}</div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <GlassCard variant="strong" className="p-6" hover={false}>
              <h3 className="text-base font-semibold text-foreground mb-4">Monthly Scam Trends</h3>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(255,255,255,0.95)",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  />
                  <Area type="monotone" dataKey="reported" stroke="#EF4444" fill="#FEE2E2" strokeWidth={2} />
                  <Area type="monotone" dataKey="detected" stroke="#2563EB" fill="#DBEAFE" strokeWidth={2} />
                  <Area type="monotone" dataKey="prevented" stroke="#22C55E" fill="#DCFCE7" strokeWidth={2} />
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
            </GlassCard>
          </motion.div>

          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <GlassCard variant="strong" className="p-6" hover={false}>
              <h3 className="text-base font-semibold text-foreground mb-4">Top Scam Categories</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={scamDistribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 12, fill: "#94a3b8" }} unit="%" />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: "#64748b" }} width={85} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(255,255,255,0.95)",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                    formatter={(value) => [`${value}%`, "Share"]}
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                    {scamDistribution.map((entry) => (
                      <motion.rect key={entry.name} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          </motion.div>
        </div>

        {/* State heatmap placeholder */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-6"
        >
          <GlassCard variant="strong" className="p-6" hover={false}>
            <h3 className="text-base font-semibold text-foreground mb-2">State-Wise Scam Density</h3>
            <p className="text-xs text-slate-400 mb-4">Interactive heatmap coming soon</p>
            <div className="aspect-[2.5/1] bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl flex items-center justify-center border border-blue-100">
              <div className="text-center">
                <div className="text-4xl mb-2 text-primary/20">🗺️</div>
                <div className="text-sm text-slate-400">India Heatmap</div>
                <div className="text-xs text-slate-300 mt-1">Hover for state-level stats</div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
