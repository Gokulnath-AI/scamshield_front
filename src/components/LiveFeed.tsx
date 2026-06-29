import React from 'react';
import { Radar, ShieldAlert, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { RECENT_BLOCKED_VPAS } from '../data/samples';

interface LiveFeedProps {
  onTestVpa: (text: string) => void;
}

export const LiveFeed: React.FC<LiveFeedProps> = ({ onTestVpa }) => {
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
                  National Cyber Threat Radar
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-['Geist'] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider animate-pulse">
                  Live Feed
                </span>
              </div>
              <p className="text-sm text-[#bbc9cd] mt-1 font-normal max-w-xl">
                Real-time collection traps, suspicious VPAs, and SMS phishing vectors intercepted and flagged across Indian digital banking corridors.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 glass-vessel px-6 py-3 rounded-2xl bg-white/[0.02] border border-white/10 shrink-0">
            <div className="text-center pr-6 border-r border-white/10">
              <div className="font-['Montserrat'] text-2xl font-bold text-[#8aebff]">1,492</div>
              <div className="text-[10px] font-['Geist'] text-[#bbc9cd] uppercase tracking-wider">VPAs Blocked Today</div>
            </div>
            <div className="text-center">
              <div className="font-['Montserrat'] text-2xl font-bold text-emerald-400">99.8%</div>
              <div className="text-[10px] font-['Geist'] text-[#bbc9cd] uppercase tracking-wider">Accuracy Matrix</div>
            </div>
          </div>
        </div>

        {/* List of blocked threat records */}
        <div className="space-y-3.5">
          <div className="hidden sm:grid grid-cols-12 px-5 py-2 text-[11px] font-['Geist'] font-semibold text-[#bbc9cd]/60 uppercase tracking-widest border-b border-white/5">
            <div className="col-span-4">Intercepted VPA / String</div>
            <div className="col-span-3">Scam Vector</div>
            <div className="col-span-2">Location Node</div>
            <div className="col-span-3 text-right">Detection Time</div>
          </div>

          {RECENT_BLOCKED_VPAS.map((item) => (
            <div 
              key={item.id}
              onClick={() => onTestVpa(`Check this suspicious UPI request: upi://pay?pa=${item.vpaOrPhone}&pn=ScamVerify&am=5000`)}
              className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4 p-4 sm:px-5 rounded-2xl bg-white/[0.03] hover:bg-[#8aebff]/10 border border-white/5 hover:border-[#8aebff]/30 transition-all duration-300 cursor-pointer group"
            >
              <div className="sm:col-span-4 font-['Geist'] font-medium text-sm text-red-300 flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                <span className="truncate">{item.vpaOrPhone}</span>
              </div>

              <div className="sm:col-span-3 text-xs font-semibold text-[#dce1fb]">
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 inline-block">
                  {item.type}
                </span>
              </div>

              <div className="sm:col-span-2 text-xs text-[#bbc9cd] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8aebff]"></span>
                <span>{item.location}</span>
              </div>

              <div className="sm:col-span-3 text-right flex items-center justify-between sm:justify-end gap-3 text-xs text-[#bbc9cd]/80 font-['Geist']">
                <span>{item.timestamp}</span>
                <span className="text-[11px] font-bold text-[#8aebff] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                  Analyze <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#bbc9cd]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Threat database synchronized with National Cybercrime Reporting Portal (NCRP)</span>
          </div>
          <div className="font-['Geist'] text-[#8aebff] font-semibold tracking-wider">
            HELPLINE: DIAL 1930
          </div>
        </div>

      </div>
    </section>
  );
};
