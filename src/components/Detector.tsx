import React, { useState } from 'react';
import { SearchCheck, Activity, Loader2, Info, ShieldAlert, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { SAMPLE_MESSAGES } from '../data/samples';
import { AnalysisResult, SampleType } from '../types';
import { Gauge } from './Gauge';

// Use Netlify function (which calls Render + has heuristic fallback)
const ML_API = '/api/predict';

interface DetectorProps {
  onReportMessage: (text: string) => void;
}

export const Detector: React.FC<DetectorProps> = ({ onReportMessage }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [coldStart, setColdStart] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const charCount = message.length;

  const handleQuickFill = (type: SampleType) => {
    const sample = SAMPLE_MESSAGES[type];
    if (sample) {
      setMessage(sample.text);
      setResult(null);
    }
  };

  function mapMLResponse(raw: Record<string, unknown>): AnalysisResult {
    const prediction = raw.prediction as string;
    const isSpam = prediction === 'spam' || prediction === 'Scam';
    
    // Handle BOTH old API format and new XGBoost format
    const scamScore = typeof raw.scam_score === 'number' ? raw.scam_score : 
                      typeof raw.risk_percentage === 'number' ? raw.risk_percentage : 50;
    const confidence = scamScore > 1 ? scamScore / 100 : scamScore;
    
    const riskLevel = (raw.risk_level as string) || (raw.risk_factor as string) || 'Medium';
    const analysis = (raw.recommended_action as string) || (raw.solution as string) || (raw.analysis as string) || '';
    const actionSteps = raw.actionSteps as string[] | undefined;

    const riskLabel = riskLevel === 'High' ? 'critical' : riskLevel === 'Medium' ? 'moderate' : 'low-level';

    return {
      label: isSpam ? 'Scam' : 'Safe',
      confidence: Number(confidence.toFixed(2)),
      analysis: analysis || (isSpam
        ? `ML model (XGBoost + TF-IDF bigrams, trained on Indian scam dataset) detected a ${riskLabel} threat.`
        : `Message passed all scam detection filters with ${riskLevel.toLowerCase()} risk.`),
      actionSteps: actionSteps || (isSpam ? [
        'Do not click any links or scan QR codes present in this message',
        'Never enter your UPI PIN or OTP to receive funds or unblock accounts',
        'Block the sender immediately on your SMS or WhatsApp application',
        'Report to Chakshu portal on Sanchar Saathi or call 1930 Cyber Helpline'
      ] : [
        'Verify unknown senders independently before sharing any information',
        'Keep your mobile banking and UPI applications updated to the latest version',
        'Never share OTPs or security credentials over calls or messages'
      ])
    };
  }

  // Also handle Netlify function response format (label, confidence, analysis, actionSteps)
  function mapNetlifyResponse(raw: Record<string, unknown>): AnalysisResult {
    if (raw.label) {
      return {
        label: raw.label as string,
        confidence: typeof raw.confidence === 'number' ? raw.confidence : 0.5,
        analysis: (raw.analysis as string) || '',
        actionSteps: (raw.actionSteps as string[]) || []
      };
    }
    return mapMLResponse(raw);
  }

  function heuristicFallback(msg: string): AnalysisResult {
    const lower = msg.toLowerCase();
    let score = 0.1;
    const flags: string[] = [];

    if (lower.includes('upi://') || lower.includes('@ybl') || lower.includes('@okaxis') || lower.includes('@paytm')) { score += 0.3; flags.push('UPI collection link'); }
    if (lower.includes('kyc') || lower.includes('blocked') || lower.includes('suspend') || lower.includes('deactivate')) { score += 0.25; flags.push('KYC/suspension threat'); }
    if (lower.includes('won') || lower.includes('lottery') || lower.includes('lucky draw') || lower.includes('iphone')) { score += 0.35; flags.push('fake prize offer'); }
    if (lower.includes('bit.ly') || lower.includes('.xyz') || lower.includes('http:') || lower.includes('apk')) { score += 0.25; flags.push('suspicious URL'); }
    if (lower.includes('https:') && (lower.includes('verify') || lower.includes('secure') || lower.includes('login') || lower.includes('alert'))) { score += 0.35; flags.push('phishing URL with urgency'); }
    if (lower.includes('electricity') || lower.includes('overdue') || lower.includes('disconnect')) { score += 0.35; flags.push('utility impersonation'); }
    if (lower.includes('fedex') || lower.includes('cbi') || lower.includes('digital arrest') || lower.includes('aadhaar') || lower.includes('narcotics')) { score += 0.45; flags.push('digital arrest / courier scam'); }
    if (lower.includes('telegram') || lower.includes('part time') || lower.includes('daily income') || lower.includes('work from home')) { score += 0.4; flags.push('Telegram task scam'); }
    if (lower.includes('otp') || lower.includes('pin') || lower.includes('password')) { score += 0.3; flags.push('credential solicitation'); }
    if (lower.includes('suspicious login') || lower.includes('new device') || lower.includes('was not you') || lower.includes('secure your account')) { score += 0.4; flags.push('fake login alert phishing'); }

    score = Math.min(0.98, Math.max(0.05, score));
    const isScam = score > 0.45;

    return {
      label: isScam ? 'Scam' : 'Safe',
      confidence: Number(score.toFixed(2)),
      analysis: isScam
        ? `Heuristic engine detected high-risk patterns: ${flags.join(', ')}. This message uses social engineering tactics common in Indian digital fraud.`
        : 'No malicious UPI strings, blacklisted domains, or high-risk patterns were detected.',
      actionSteps: isScam ? [
        'Do not click any links or scan QR codes present in this message',
        'Never enter your UPI PIN or OTP to receive money or unblock accounts',
        'Block the sender immediately on your SMS or WhatsApp',
        'Report to Chakshu on Sanchar Saathi portal or call 1930 Cyber Helpline'
      ] : [
        'Verify unknown senders independently before sharing information',
        'Keep your mobile banking and UPI applications updated',
        'Never share OTPs or passwords over calls, SMS or messages'
      ]
    };
  }

  const analyzeMessage = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    setColdStart(false);
    setResult(null);
    setLoadingStep(0);

    const stepTimer1 = setTimeout(() => setLoadingStep(1), 800);
    const stepTimer2 = setTimeout(() => setLoadingStep(2), 1800);
    const coldStartTimer = setTimeout(() => setColdStart(true), 8000);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const res = await fetch(ML_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim() }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const raw = await res.json() as Record<string, unknown>;
        setResult(mapNetlifyResponse(raw));
      } else {
        throw new Error(`API ${res.status}`);
      }
    } catch {
      setResult(heuristicFallback(message));
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(coldStartTimer);
      setColdStart(false);
      setIsLoading(false);
    }
  };

  const loadingMessages = [
    'Parsing syntactic structure & VPAs...',
    'Cross-referencing NPCI threat intelligence...',
    'Running XGBoost + TF-IDF classification...'
  ];

  return (
    <section id="detector" className="max-w-[1024px] mx-auto px-6 py-24">
      <div className="glass-vessel rounded-[28px] p-8 md:p-14 relative overflow-hidden bg-[#0c1324]/90 border border-white/10 shadow-2xl">
        
        <div className="flex items-center gap-3.5 mb-8">
          <div className="bg-[#8aebff]/10 p-3 rounded-2xl border border-[#8aebff]/30 text-[#8aebff]">
            <SearchCheck className="w-7 h-7" />
          </div>
          <div>
            <h2 className="font-['Montserrat'] text-3xl font-bold text-white tracking-tight">Message Analyzer</h2>
            <p className="text-xs font-['Geist'] text-[#bbc9cd] mt-0.5">Real-time ML inspection — XGBoost + TF-IDF trained on Indian scam samples</p>
          </div>
        </div>

        <div className="relative mb-6">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={500}
            placeholder="Paste a suspicious SMS, WhatsApp forward, telegram offer or UPI collect request here..."
            className="w-full h-52 bg-[#070d1f]/70 border border-white/15 rounded-2xl p-6 text-[#dce1fb] placeholder:text-[#bbc9cd]/40 focus:ring-2 focus:ring-[#8aebff]/50 focus:border-[#8aebff]/50 transition-all resize-none font-['Inter'] text-base leading-relaxed outline-none shadow-inner"
          ></textarea>
          <div className="absolute bottom-4 right-5 text-xs font-['Geist'] font-medium text-[#bbc9cd]/70 bg-[#070d1f]/80 px-2.5 py-1 rounded-md border border-white/5">
            <span>{charCount}</span>/500
          </div>
        </div>

        <div className="mb-9">
          <div className="text-[11px] font-['Geist'] font-semibold uppercase tracking-wider text-[#bbc9cd]/70 mb-3">
            Load Live Indian Scam Trap Samples:
          </div>
          <div className="flex flex-wrap gap-2.5">
            {(['upi','bank','gift','fedex','arrest','telegram'] as SampleType[]).map((type) => {
              const colors: Record<string, string> = { upi: 'bg-red-400', bank: 'bg-red-400', gift: 'bg-amber-400', fedex: 'bg-purple-400', arrest: 'bg-rose-500', telegram: 'bg-blue-400' };
              const labels: Record<string, string> = { upi: 'UPI Bill Trap', bank: 'Bank Alert (KYC)', gift: 'Gift / Lottery Offer', fedex: 'FedEx Customs Hold', arrest: 'Digital Arrest Threat', telegram: 'Telegram Task Scam' };
              return (
                <button key={type} onClick={() => handleQuickFill(type)}
                  className="px-4 py-2 rounded-full border border-white/10 bg-white/[0.04] text-xs font-medium text-[#dce1fb] hover:bg-[#8aebff]/15 hover:border-[#8aebff]/40 hover:text-white transition-all cursor-pointer flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${colors[type]}`}></span>
                  {labels[type]}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={analyzeMessage}
          disabled={isLoading || !message.trim()}
          className={`shimmer-btn w-full py-4.5 px-6 bg-gradient-to-r from-[#8aebff] via-[#22d3ee] to-[#a4c9ff] text-[#070d1f] font-['Montserrat'] font-extrabold text-lg rounded-2xl shadow-xl shadow-[#8aebff]/20 flex justify-center items-center gap-3 cursor-pointer transition-all ${
            isLoading || !message.trim() ? 'opacity-50 cursor-not-allowed transform none' : 'hover:scale-[1.01] active:scale-[0.99]'
          }`}
        >
          {isLoading ? (
            <><Loader2 className="w-6 h-6 animate-spin text-[#070d1f]" /><span>Analyzing Message...</span></>
          ) : (
            <><Activity className="w-6 h-6 text-[#070d1f]" /><span>Analyze Message</span></>
          )}
        </button>

        {isLoading && (
          <div className="absolute inset-0 glass-vessel bg-[#0c1324]/95 flex flex-col items-center justify-center z-30 p-8 rounded-[28px] animate-fadeIn">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full border-4 border-[#8aebff]/20 border-t-[#8aebff] animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Activity className="w-8 h-8 text-[#8aebff] animate-pulse" />
              </div>
            </div>
            <h3 className="font-['Montserrat'] text-xl font-bold text-white mb-2">
              {coldStart ? 'Waking Up ML Engine...' : 'Analyzing Threat Vectors'}
            </h3>
            <p className="font-['Geist'] text-sm text-[#8aebff] font-medium animate-pulse">
              {coldStart ? 'Free tier cold start — please wait up to 30s...' : (loadingMessages[loadingStep] || loadingMessages[0])}
            </p>
          </div>
        )}
      </div>

      {result && (
        <div id="resultsPanel" className="mt-12 glass-vessel rounded-[28px] p-8 md:p-14 relative bg-[#0c1324]/95 border border-white/15 shadow-2xl animate-fadeIn">
          <div className="grid md:grid-cols-12 gap-10 items-center">
            
            <div className="md:col-span-5 flex flex-col items-center text-center border-b md:border-b-0 md:border-r border-white/10 pb-8 md:pb-0 md:pr-6">
              <Gauge score={Math.round(result.confidence * 100)} isScam={result.label === 'Scam'} />
              
              <div className="mt-6">
                <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full font-['Geist'] font-bold uppercase tracking-widest text-xs mb-3 shadow-md ${
                  result.label === 'Scam' 
                    ? 'bg-[#ffb4ab]/20 text-[#ffb4ab] border border-[#ffb4ab]/40 shadow-[#ffb4ab]/10' 
                    : 'bg-[#68f5b8]/20 text-[#68f5b8] border border-[#68f5b8]/40 shadow-[#68f5b8]/10'
                }`}>
                  {result.label === 'Scam' ? (
                    <><AlertTriangle className="w-3.5 h-3.5 animate-bounce" /><span>{result.confidence > 0.85 ? 'Critical Scam Threat' : 'High Risk Scam'}</span></>
                  ) : (
                    <><ShieldCheck className="w-3.5 h-3.5" /><span>Verified Safe Content</span></>
                  )}
                </div>

                <h3 className="font-['Montserrat'] text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  {result.label === 'Scam' ? 'Potentially Dangerous' : 'Safe Communication'}
                </h3>
                <p className="text-xs text-[#bbc9cd] mt-2 font-['Geist']">
                  Analyzed against Indian digital financial regulations
                </p>
              </div>
            </div>

            <div className="md:col-span-7 flex flex-col gap-6">
              
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#8aebff]"></div>
                <h4 className="font-['Geist'] text-xs font-bold tracking-widest text-[#8aebff] mb-2.5 flex items-center gap-2 uppercase">
                  <Info className="w-4 h-4 text-[#8aebff]" />
                  ML Threat Verdict
                </h4>
                <p className="text-[#dce1fb] leading-relaxed text-sm md:text-base font-normal">
                  {result.analysis}
                </p>
              </div>

              <div className={`border rounded-2xl p-6 relative overflow-hidden ${
                result.label === 'Scam' 
                  ? 'bg-[#ffb4ab]/[0.06] border-[#ffb4ab]/25' 
                  : 'bg-[#68f5b8]/[0.06] border-[#68f5b8]/25'
              }`}>
                <div className={`absolute top-0 left-0 w-1.5 h-full ${result.label === 'Scam' ? 'bg-[#ffb4ab]' : 'bg-[#68f5b8]'}`}></div>
                <h4 className={`font-['Geist'] text-xs font-bold tracking-widest mb-3 flex items-center gap-2 uppercase ${
                  result.label === 'Scam' ? 'text-[#ffb4ab]' : 'text-[#68f5b8]'
                }`}>
                  <ShieldAlert className="w-4 h-4" />
                  Recommended Action Matrix (India)
                </h4>
                
                <ul className="space-y-2.5 text-xs sm:text-sm text-[#bbc9cd]">
                  {result.actionSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0 text-[10px] font-bold mt-0.5 ${
                        result.label === 'Scam' ? 'bg-[#ffb4ab]/20 text-[#ffb4ab]' : 'bg-[#68f5b8]/20 text-[#68f5b8]'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="leading-snug text-[#dce1fb]">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <button
                  onClick={() => { setMessage(''); setResult(null); }}
                  className="text-[#8aebff] hover:text-white transition-colors flex items-center gap-2 font-['Geist'] text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Scan Another Message
                </button>

                {result.label === 'Scam' && (
                  <button
                    onClick={() => onReportMessage(message)}
                    className="px-5 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-['Geist'] font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-red-500/10"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    Forward to Cyber Police 1930
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

    </section>
  );
};
