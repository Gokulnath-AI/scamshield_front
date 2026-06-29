import React from 'react';
import { Shield, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  onOpenReport: () => void;
  onScrollTo: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenReport, onScrollTo }) => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0c1324]/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-4 flex justify-between items-center">
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-[#8aebff]/30 rounded-full blur-md group-hover:bg-[#8aebff]/60 transition duration-300"></div>
            <div className="relative bg-[#070d1f] border border-[#8aebff]/40 p-2 rounded-xl text-[#8aebff]">
              <Shield className="w-6 h-6 fill-[#8aebff]/20 text-[#8aebff]" />
            </div>
          </div>
          <span className="font-['Montserrat'] text-2xl font-bold text-[#8aebff] tracking-tight group-hover:text-white transition-colors">
            ScamShield
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-['Geist'] font-medium uppercase tracking-widest bg-[#8aebff]/10 text-[#8aebff] border border-[#8aebff]/20 rounded-full">
            India AI
          </span>
        </a>

        <div className="hidden md:flex gap-8 items-center font-medium text-sm">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-[#8aebff] font-semibold hover:text-white transition-colors cursor-pointer"
          >
            Home
          </button>
          <button 
            onClick={() => onScrollTo('detector')}
            className="text-[#bbc9cd] hover:text-[#8aebff] transition-colors cursor-pointer"
          >
            Detector
          </button>
          <button 
            onClick={() => onScrollTo('how-it-works')}
            className="text-[#bbc9cd] hover:text-[#8aebff] transition-colors cursor-pointer"
          >
            How it works
          </button>
          <button 
            onClick={() => onScrollTo('live-feed')}
            className="text-[#bbc9cd] hover:text-[#8aebff] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Live Radar
          </button>
          
          <button 
            onClick={onOpenReport}
            className="relative group overflow-hidden rounded-full p-px font-semibold text-xs tracking-wider uppercase cursor-pointer active:scale-95 transition-transform"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#8aebff] via-[#22d3ee] to-[#a4c9ff] rounded-full animate-pulse"></span>
            <span className="relative flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#070d1f] text-[#8aebff] group-hover:bg-transparent group-hover:text-[#070d1f] transition-all duration-300 font-bold">
              <ShieldAlert className="w-4 h-4 text-red-400 group-hover:text-[#070d1f]" />
              Report Scam
            </span>
          </button>
        </div>

        <button 
          onClick={onOpenReport}
          className="md:hidden px-4 py-2 bg-[#8aebff] text-[#070d1f] rounded-full font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#8aebff]/20 active:scale-95"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          Report
        </button>
      </div>
    </nav>
  );
};
