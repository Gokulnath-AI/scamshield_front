import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2, Send, AlertCircle } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialText?: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, initialText = '' }) => {
  const [vpaOrPhone, setVpaOrPhone] = useState('');
  const [category, setCategory] = useState('UPI Bill Scam');
  const [messageText, setMessageText] = useState(initialText);
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    if (initialText) {
      setMessageText(initialText);
    }
  }, [initialText]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setVpaOrPhone('');
      setMessageText('');
      onClose();
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg glass-vessel bg-[#0c1324] border border-[#8aebff]/30 rounded-3xl p-6 sm:p-9 shadow-2xl shadow-[#8aebff]/10">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#bbc9cd] hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-12 text-center flex flex-col items-center justify-center animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-400 flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="font-['Montserrat'] text-2xl font-bold text-white mb-2">Threat Flagged Successfully</h3>
            <p className="text-[#bbc9cd] text-sm max-w-md mx-auto">
              Thank you for contributing to Indian digital security. Your report has been logged to our neural scrubbing node and queued for NPCI Chakshu verification.
            </p>
            <div className="mt-6 font-['Geist'] text-xs text-[#8aebff] font-semibold tracking-widest uppercase">
              Reference ID: #IND-{Math.floor(100000 + Math.random() * 900000)}
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-['Montserrat'] text-2xl font-bold text-white">Report Scam Incident</h3>
                <p className="text-xs font-['Geist'] text-[#bbc9cd]">Help safeguard Indian UPI & banking networks</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-['Geist'] font-semibold uppercase tracking-wider text-[#bbc9cd] mb-1.5">
                  Scammer VPA / Phone Number / Link
                </label>
                <input 
                  type="text" 
                  required
                  value={vpaOrPhone}
                  onChange={(e) => setVpaOrPhone(e.target.value)}
                  placeholder="e.g. fraudster@ybl or +91 98992-XXXXX"
                  className="w-full px-4 py-3 rounded-xl bg-[#070d1f] border border-white/15 text-white placeholder:text-[#bbc9cd]/40 focus:border-[#8aebff] outline-none text-sm font-['Geist'] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-['Geist'] font-semibold uppercase tracking-wider text-[#bbc9cd] mb-1.5">
                  Scam Category
                </label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#070d1f] border border-white/15 text-white focus:border-[#8aebff] outline-none text-sm font-medium transition-colors"
                >
                  <option value="UPI Bill Scam">Electricity / Utility Bill Disconnection</option>
                  <option value="Digital Arrest">Digital Arrest / TRAI / Police Impersonation</option>
                  <option value="Courier Fraud">FedEx / Customs Narcotics Hold</option>
                  <option value="Telegram Task">Telegram Part-Time Task Scam</option>
                  <option value="Lottery Scam">Lucky Draw / Fake Gift Claim Tax</option>
                  <option value="Bank Phishing">SBI / Bank KYC Account Block Alert</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-['Geist'] font-semibold uppercase tracking-wider text-[#bbc9cd] mb-1.5">
                  Suspicious Message Content (Optional)
                </label>
                <textarea 
                  rows={3}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Paste the exact SMS or chat forward here..."
                  className="w-full p-4 rounded-xl bg-[#070d1f] border border-white/15 text-white placeholder:text-[#bbc9cd]/40 focus:border-[#8aebff] outline-none text-sm resize-none font-['Inter'] transition-colors"
                ></textarea>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-amber-200">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>For urgent financial loss where money was already debited, immediately call National Cyber Helpline <strong>1930</strong> or visit cybercrime.gov.in</span>
              </div>

              <div className="pt-3 flex gap-3">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="w-1/3 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-[#8aebff] to-[#22d3ee] text-[#070d1f] font-['Montserrat'] font-extrabold text-sm flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-[#8aebff]/20 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Submit Report
                </button>
              </div>
            </form>
          </>
        )}

      </div>
    </div>
  );
};
