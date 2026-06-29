import { SampleMessage, SecurityLayer, RecentReport } from '../types';

export const SAMPLE_MESSAGES: Record<string, SampleMessage> = {
  upi: {
    id: 'upi',
    title: 'UPI Bill Trap',
    category: 'UPI Collect Scam',
    text: "Dear User, your electricity bill of Rs 4,820 is overdue. Disconnection scheduled tonight at 9:30 PM. Pay immediately via UPI official link: upi://pay?pa=uppcl.collect99@ybl&pn=PowerOfficer&am=4820",
    riskLevel: 'Critical'
  },
  bank: {
    id: 'bank',
    title: 'SBI KYC Alert',
    category: 'Phishing',
    text: "SBI ALERT: Your NetBanking account has been temporary HOLD due to pending Pan Aadhaar link. Visit http://sbi-kyc-verify-portal.net/auth to restore access within 24 hrs.",
    riskLevel: 'Critical'
  },
  gift: {
    id: 'gift',
    title: 'Amazon Mega Draw',
    category: 'Lottery Scam',
    text: "Congratulations! Your mobile number won 1st Prize Apple iPhone 15 Pro Max in Amazon Anniversary Lucky Draw. Click here to pay Rs 499 delivery tax & claim: bit.ly/amz-lucky-claim99",
    riskLevel: 'High'
  },
  fedex: {
    id: 'fedex',
    title: 'FedEx Customs Hold',
    category: 'Courier Scam',
    text: "FedEx Notice: Parcel ID #FX88291 containing 5 expired passports and MDMA narcotics sent in your name is held at Mumbai Narcotics Customs. Press 1 or contact CBI Cyber Cell helpline immediately to avoid arrest warrant.",
    riskLevel: 'Critical'
  },
  arrest: {
    id: 'arrest',
    title: 'Digital Arrest Threat',
    category: 'Intimidation',
    text: "URGENT: This is Senior IPS Officer Sharma from Telecom Regulatory Authority (TRAI). Your Aadhaar was used for illegal SIM money laundering. Connect on Skype video call for immediate Digital Arrest interrogation.",
    riskLevel: 'Critical'
  },
  telegram: {
    id: 'telegram',
    title: 'Telegram Part-Time',
    category: 'Task Scam',
    text: "Earn Rs 3000 to 8000 daily! Simple part-time work from home rating Google Maps hotels and liking YouTube videos. No experience needed. Join official VIP Telegram recruitment channel: t.me/google_task_earn_in",
    riskLevel: 'High'
  }
};

export const SECURITY_LAYERS: SecurityLayer[] = [
  {
    icon: 'Brain',
    title: 'Neural Analysis',
    description: 'LLM-based linguistic pattern matching identifies urgency triggers, fear tactics, and coercive intimidation.'
  },
  {
    icon: 'Link',
    title: 'Link Scrubbing',
    description: 'Deep-scans redirection paths, shortened URLs, and domain reputation against global threat intelligence.'
  },
  {
    icon: 'IndianRupee',
    title: 'UPI Verification',
    description: 'Cross-checks Virtual Payment Addresses (VPAs) against NPCI fraud registries and reported collection traps.'
  },
  {
    icon: 'ShieldCheck',
    title: 'Safe Resolution',
    description: 'Provides localized action steps aligned with RBI guidelines, 1930 Cyber Helpline, and Sanchar Saathi.'
  }
];

export const RECENT_BLOCKED_VPAS: RecentReport[] = [
  { id: '1', vpaOrPhone: 'electricity.pay99@ybl', type: 'UPI Collect Scam', timestamp: '2 mins ago', location: 'Delhi NCR' },
  { id: '2', vpaOrPhone: '+91 98210-XXXXX', type: 'Digital Arrest Threat', timestamp: '7 mins ago', location: 'Mumbai' },
  { id: '3', vpaOrPhone: 'fedex.customs@okaxis', type: 'Courier Impersonation', timestamp: '14 mins ago', location: 'Bengaluru' },
  { id: '4', vpaOrPhone: 'lottery-claim@paytm', type: 'Fake Prize Tax Trap', timestamp: '22 mins ago', location: 'Hyderabad' },
  { id: '5', vpaOrPhone: 'sbi.update.kyc@ibkl', type: 'Banking Phishing', timestamp: '31 mins ago', location: 'Pune' },
];
