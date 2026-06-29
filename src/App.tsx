import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { BackgroundShader } from './components/BackgroundShader';
import { Hero } from './components/Hero';
import { Detector } from './components/Detector';
import { HowItWorks } from './components/HowItWorks';
import { LiveFeed } from './components/LiveFeed';
import { ReportModal } from './components/ReportModal';
import { Footer } from './components/Footer';

export default function App() {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportInitialText, setReportInitialText] = useState('');

  const handleScrollTo = (id: string) => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenReportWithText = (text: string) => {
    setReportInitialText(text);
    setIsReportOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0c1324] text-[#dce1fb] font-['Inter'] selection:bg-[#8aebff]/30 selection:text-white relative overflow-x-hidden">
      {/* Background Interactive Shader & Ambient Particles */}
      <BackgroundShader />

      {/* Glass Navigation Bar */}
      <Navbar 
        onOpenReport={() => { setReportInitialText(''); setIsReportOpen(true); }}
        onScrollTo={handleScrollTo}
      />

      {/* Main Content Area */}
      <main className="relative z-10 pt-16">
        <Hero onExplore={() => handleScrollTo('detector')} />
        <Detector onReportMessage={handleOpenReportWithText} />
        <HowItWorks />
        <LiveFeed onTestVpa={handleOpenReportWithText} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Report Modal */}
      <ReportModal 
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        initialText={reportInitialText}
      />
    </div>
  );
}
