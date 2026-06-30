import React, { useEffect, useState } from 'react';
import { Radar, ShieldAlert, ShieldCheck, CheckCircle2, ArrowUpRight, RefreshCw } from 'lucide-react';
import { getRecentScans, getLiveStats } from '../lib/supabase';

interface ScanRecord {
  id: string;
  message: string;
  label: string;
  scam_score: number;
  risk_level: string;
  analysis: string;
  created_at: string;
}

interface LiveStats {
  totalScans: number;
  scamsDetected: number;
  safeMessages: number;
}

interface LiveFeedProps {
  onTestVpa: (text: string) => void;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

function truncateMessage(msg: string, max = 50): string {
  if (msg.length <= max) return msg;
  return msg.slice(0, max) + '…';
}

export const LiveFeed: React.FC<LiveFeedProps> = ({ onTestVpa }) => {
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [stats, setStats] = useState<LiveStats>({ totalScans: 0, scamsDetected: 0, safeMessages: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const [scansData, statsData] = await Promise.all([
        getRecentScans(10),
        getLiveStats(),
      ]);
      setScans(scansData as ScanRecord[]);
      setStats(statsData);
    } catch (err) {
      console.error('LiveFeed fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => fetchData(), 30000);
    return () => clearInterval(interval);
  }, []);

  const detectionRate = stats.totalScans > 0
    ? ((stats.scamsDetected / stats.totalScans) * 100).toFixed(1)
    : '0.0';

  return (
    <section id="live-feed" className="max-w-[1280px] mx-auto px-6 md:px-10 py-20 border-t border-white/5">
      <div className="glass-vessel rounded-[32px] p-8 md:p-12 bg-gradient-to-b from-[#0c1324]/90 to-[#070d1f]/90 border border-[#8aebff]/20 relative overflow-hidden">
        
        {/* Background radar grid effect */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-[#8aebff]/5 rounded-full border border-[#8aebff]/10 pointer-events-none animate-ping duration-[10000ms]"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10 pb-8 border-b border-white/10">
          <div className="flex items-start gap-4">
            <div className="relative mt-1">
              <div className="absolute inset-0 bg-emerald-500/30 rounded-2xl blur-md animate-pulse"></div>
              <div className="relative p-3.5 rounded-2xl bg-[#070d1f] border border-emerald-400/40 text-emerald-400">
                <Radar className="w-7 h-7 animate-spin duration-[8000ms]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-['Montserrat'] text-3xl font-extrabold text-white tracking-tight">
                  Live Scan Feed
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-['Geist'] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider animate-pulse">
                  Live
                </span>
              </div>
              <p className="text-sm text-[#bbc9cd] mt-1 font-normal max-w-xl">
                Real-time scan results from users across India — every message analyzed through the ML pipeline appears here.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-[#8aebff]/40 text-[#bbc9cd] hover:text-[#8aebff] transition-all cursor-pointer disabled:opacity-50"
              aria-label="Refresh feed"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <div className="flex items-center gap-6 glass-vessel px-6 py-3 rounded-2xl bg-white/[0.02] border border-white/10 shrink-0">
              <div className="text-center pr-6 border-r border-white/10">
                <div className="font-['Montserrat'] text-2xl font-bold text-[#8aebff]">
                  {stats.totalScans.toLocaleString()}
                </div>
                <div className="text-[10px] font-['Geist'] text-[#bbc9cd] uppercase tracking-wider">Total Scans</div>
              </div>
              <div className="text-center pr-6 border-r border-white/10">
                <div className="font-['Montserrat'] text-2xl font-bold text-red-400">
                  {stats.scamsDetected.toLocaleString()}
                </div>
                <div className="text-[10px] font-['Geist'] text-[#bbc9cd] uppercase tracking-wider">Scams Caught</div>
              </div>
              <div className="text-center">
                <div className="font-['Montserrat'] text-2xl font-bold text-emerald-400">{detectionRate}%</div>
                <div className="text-[10px] font-['Geist'] text-[#bbc9cd] uppercase tracking-wider">Scam Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scan results list */}
        <div className="space-y-3.5">
          <div className="hidden sm:grid grid-cols-12 px-5 py-2 text-[11px] font-['Geist'] font-semibold text-[#bbc9cd]/60 uppercase tracking-widest border-b border-white/5">
            <div className="col-span-1">Status</div>
            <div className="col-span-4">Message Preview</div>
            <div className="col-span-2">Risk Level</div>
            <div className="col-span-2">Scam Score</div>
            <div className="col-span-3 text-right">Scanned</div>
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <div className="w-10 h-10 mx-auto rounded-full border-2 border-[#8aebff]/20 border-t-[#8aebff] animate-spin mb-4"></div>
              <p className="text-sm text-[#bbc9cd]">Loading live scan data...</p>
            </div>
          ) : scans.length === 0 ? (
            <div className="py-16 text-center">
              <Radar className="w-10 h-10 mx-auto text-[#8aebff]/40 mb-4" />
              <p className="text-sm text-[#bbc9cd]">No scans yet. Analyze a message above to see it here.</p>
            </div>
          ) : (
            scans.map((scan) => {
              const isScam = scan.label === 'Scam';
              return (
                <div 
                  key={scan.id}
                  onClick={() => onTestVpa(scan.message)}
                  className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4 p-4 sm:px-5 rounded-2xl bg-white/[0.03] hover:bg-[#8aebff]/10 border border-white/5 hover:border-[#8aebff]/30 transition-all duration-300 cursor-pointer group"
                >
                  <div className="sm:col-span-1 flex items-center">
                    {isScam ? (
                      <ShieldAlert className="w-5 h-5 text-red-400" />
                    ) : (
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    )}
                  </div>

                  <div className="sm:col-span-4 font-['Geist'] font-medium text-sm text-[#dce1fb] truncate">
                    {truncateMessage(scan.message, 55)}
                  </div>

                  <div className="sm:col-span-2">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold inline-block ${
                      isScam 
                        ? 'bg-red-500/15 text-red-300 border border-red-500/20' 
                        : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                    }`}>
                      {scan.risk_level || scan.label}
                    </span>
                  </div>

                  <div className="sm:col-span-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${isScam ? 'bg-red-400' : 'bg-emerald-400'}`}
                          style={{ width: `${Math.min(scan.scam_score, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-['Geist'] font-bold text-[#bbc9cd] w-10 text-right">
                        {scan.scam_score}%
                      </span>
                    </div>
                  </div>

                  <div className="sm:col-span-3 text-right flex items-center justify-between sm:justify-end gap-3 text-xs text-[#bbc9cd]/80 font-['Geist']">
                    <span>{scan.created_at ? timeAgo(scan.created_at) : '—'}</span>
                    <span className="text-[11px] font-bold text-[#8aebff] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                      Re-scan <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#bbc9cd]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>All scans are processed through XGBoost + TF-IDF ML pipeline with heuristic booster</span>
          </div>
          <div className="font-['Geist'] text-[#8aebff] font-semibold tracking-wider">
            HELPLINE: DIAL 1930
          </div>
        </div>

      </div>
    </section>
  );
};
