import React from 'react';
import { Shield, ChevronDown, CheckCircle2, Zap, Lock } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore }) => {
  return (
    <section className="relative pt-24 pb-16 min-h-[800px] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      {/* Background cyan glow vessel */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#8aebff]/15 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      {/* Signature Shield Icon */}
      <div className="mb-10 relative group">
        <div className="absolute -inset-4 bg-gradient-to-tr from-[#8aebff]/40 via-[#22d3ee]/20 to-transparent rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
        <div className="relative glass-vessel p-8 rounded-3xl border border-[#8aebff]/40 bg-[#0c1324]/80 shadow-2xl shadow-[#8aebff]/10 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
          <Shield className="w-24 h-24 sm:w-32 sm:h-32 text-[#8aebff] fill-[#8aebff]/15 shield-liquid" />
        </div>
      </div>

      <h1 className="font-['Montserrat'] text-5xl sm:text-7xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] via-[#8aebff] to-[#22d3ee] mb-4 tracking-tight leading-tight">
        ScamShield
      </h1>

      <p className="font-['Montserrat'] text-2xl sm:text-3xl md:text-4xl text-[#dce1fb] font-semibold max-w-3xl mb-6 tracking-tight">
        AI-Powered Scam Detection for India
      </p>

      <p className="text-[#bbc9cd] text-base sm:text-lg md:text-xl max-w-2xl mb-10 font-normal leading-relaxed">
        Protecting Indian digital citizens against UPI fraud, bank KYC phishing, Digital Arrest intimidation, and OTP traps with real-time neural intelligence.
      </p>

      {/* Live capability badges */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-16 text-xs font-['Geist'] font-medium text-[#bbc9cd]">
        <div className="flex items-center gap-2 glass-vessel px-4 py-2 rounded-full border border-white/10 bg-white/[0.02]">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>NPCI & 1930 Helpline Aligned</span>
        </div>
        <div className="flex items-center gap-2 glass-vessel px-4 py-2 rounded-full border border-white/10 bg-white/[0.02]">
          <Zap className="w-4 h-4 text-[#8aebff]" />
          <span>Sub-Second Linguistic Engine</span>
        </div>
        <div className="flex items-center gap-2 glass-vessel px-4 py-2 rounded-full border border-white/10 bg-white/[0.02]">
          <Lock className="w-4 h-4 text-[#a4c9ff]" />
          <span>Zero Data Retention Privacy</span>
        </div>
      </div>

      {/* Bounce Down Trigger */}
      <button 
        onClick={onExplore}
        className="animate-bounce mt-4 p-4 rounded-full border border-[#8aebff]/20 bg-[#070d1f]/60 text-[#8aebff] hover:bg-[#8aebff]/10 hover:border-[#8aebff]/40 transition-all cursor-pointer shadow-lg shadow-[#8aebff]/5"
        aria-label="Scroll to Detector"
      >
        <ChevronDown className="w-8 h-8" />
      </button>
    </section>
  );
};
