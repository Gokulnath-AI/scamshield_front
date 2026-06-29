import React from 'react';
import { Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#070d1f] w-full py-12 border-t border-white/10 relative z-10">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="bg-[#8aebff]/10 border border-[#8aebff]/30 p-1.5 rounded-lg text-[#8aebff]">
            <Shield className="w-5 h-5 fill-[#8aebff]/20 text-[#8aebff]" />
          </div>
          <span className="font-['Montserrat'] text-white text-xl font-bold tracking-tight">
            ScamShield
          </span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 text-xs font-['Geist'] font-medium text-[#bbc9cd]">
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[#8aebff] transition-colors duration-300">
            Privacy Policy
          </a>
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[#8aebff] transition-colors duration-300">
            Terms of Service
          </a>
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[#8aebff] transition-colors duration-300">
            UPI Security
          </a>
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[#8aebff] transition-colors duration-300">
            Contact Support
          </a>
        </div>

        {/* Copyright */}
        <p className="text-[#bbc9cd]/70 text-xs font-['Geist'] text-center md:text-right">
          © {new Date().getFullYear()} ScamShield. Securely protecting Indian digital citizens.
        </p>

      </div>
    </footer>
  );
};
