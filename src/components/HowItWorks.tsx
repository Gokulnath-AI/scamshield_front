import React from 'react';
import { Brain, Link, IndianRupee, ShieldCheck } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const stages = [
    {
      icon: Brain,
      title: 'Neural Analysis',
      description: 'LLM-based linguistic pattern matching identifies emotional triggers, fake panic, and urgency traps used by cybercriminals.'
    },
    {
      icon: Link,
      title: 'Link Scrubbing',
      description: 'Deep-scans redirection paths, URL shorteners, and domain reputation across global threat intelligence databases.'
    },
    {
      icon: IndianRupee,
      title: 'UPI Verification',
      description: 'Checks VPA legitimacy and cross-references blacklisted collection endpoints reported across Indian banking networks.'
    },
    {
      icon: ShieldCheck,
      title: 'Safe Resolution',
      description: 'Provides localized action advice tailored to RBI regulations, 1930 Cyber Helpline, and Sanchar Saathi Chakshu reporting.'
    }
  ];

  return (
    <section id="how-it-works" className="max-w-[1280px] mx-auto px-6 md:px-10 py-24 border-t border-white/5">
      
      {/* Section Title Container */}
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <h2 className="font-['Montserrat'] text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
          Fortified Security Layer
        </h2>
        <p className="text-[#bbc9cd] text-base sm:text-lg leading-relaxed font-normal">
          Our four-stage defense mechanism ensures your digital financial assets stay protected from sophisticated social engineering.
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stages.map((stage, index) => {
          const IconComponent = stage.icon;
          return (
            <div 
              key={index} 
              className="glass-vessel p-8 rounded-[28px] bg-[#0c1324]/80 border border-white/10 hover:border-[#8aebff]/40 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#070d1f] border border-[#8aebff]/30 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-[#8aebff]/10 transition-all duration-300 shadow-lg shadow-[#8aebff]/5">
                  <IconComponent className="w-7 h-7 text-[#8aebff]" />
                </div>
                
                <h3 className="font-['Montserrat'] text-xl font-bold text-white mb-3 tracking-tight group-hover:text-[#8aebff] transition-colors">
                  {stage.title}
                </h3>
                
                <p className="text-[#bbc9cd] text-sm leading-relaxed font-normal">
                  {stage.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-['Geist'] font-semibold text-[#8aebff]/70 tracking-widest uppercase">
                <span>STAGE 0{index + 1}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#8aebff]/50 group-hover:bg-[#8aebff] transition-colors"></span>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
