import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2, Send, AlertCircle, Loader2 } from 'lucide-react';
import { saveScamReport } from '../lib/supabase';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refId, setRefId] = useState('');

  React.useEffect(() => {
    if (initialText) {
      setMessageText(initialText);
    }
  }, [initialText]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const success = await saveScamReport({
      message: messageText,
      sender_info: vpaOrPhone,
      category: category,
      description: `Category: ${category} | Sender: ${vpaOrPhone}`,
      scam_score: undefined,
    });

    setIsSubmitting(false);

    if (success) {
      const id = `IND-${Math.floor(100000 + Math.random() * 900000)}`;
      setRefId(id);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setVpaOrPhone('');
        setMessageText('');
        setRefId('');
        onClose();
      }, 3500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg glass-vessel bg-[#0c1324] border border-[#8aebff]/30 rounded-3xl p-6 sm:p-9 shadow-2xl shadow-[#8aebff]/10">
        
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
            <h3 className="font-['Montserrat'] text-2xl font-bold text-white mb-2">Report Saved Successfully</h3>
            <p className="text-[#bbc9cd] text-sm max-w-md mx-auto">
              Your scam report has been saved to our database and queued for review. Thank you for contributing to Indian digital security.
            </p>
            <div className="mt-6 font-['Geist'] text-xs text-[#8aebff] font-semibold tracking-widest uppercase">
              Reference ID: #{refId}
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
                <p className="text-xs font-['Geist'] text-[#bbc9cd]">Saved to database for review & cyber crime reporting</p>
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
                  <option value="Login Phishing">Fake Login / Account Security Alert</option>
                  <option value="Other">Other Scam Type</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-['Geist'] font-semibold uppercase tracking-wider text-[#bbc9cd] mb-1.5">
                  Suspicious Message Content
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
                <span>For urgent financial loss, immediately call National Cyber Helpline <strong>1930</strong> or visit cybercrime.gov.in</span>
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
                  disabled={isSubmitting}
                  className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-[#8aebff] to-[#22d3ee] text-[#070d1f] font-['Montserrat'] font-extrabold text-sm flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-[#8aebff]/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /><span>Saving...</span></>
                  ) : (
                    <><Send className="w-4 h-4" /><span>Submit Report</span></>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
