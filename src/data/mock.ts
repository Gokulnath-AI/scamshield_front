export const scamTypes = [
  {
    name: "UPI Fraud",
    description: "Fake payment requests, QR code scams, and unauthorized UPI transactions targeting digital payment users.",
    risk: "Critical",
    icon: "Smartphone" as const,
    color: "#EF4444",
  },
  {
    name: "OTP Scam",
    description: "Social engineering attacks to steal one-time passwords for unauthorized account access.",
    risk: "Critical",
    icon: "KeyRound" as const,
    color: "#F97316",
  },
  {
    name: "Phishing Link",
    description: "Fraudulent websites mimicking banks, e-commerce sites, or government portals to steal credentials.",
    risk: "High",
    icon: "Link" as const,
    color: "#EAB308",
  },
  {
    name: "Fake Job Offer",
    description: "Bogus recruitment schemes demanding registration fees or personal data from job seekers.",
    risk: "High",
    icon: "Briefcase" as const,
    color: "#8B5CF6",
  },
  {
    name: "Investment Scam",
    description: "Ponzi schemes, fake crypto platforms, and unrealistic return promises targeting retail investors.",
    risk: "Critical",
    icon: "TrendingUp" as const,
    color: "#EC4899",
  },
  {
    name: "Loan Scam",
    description: "Predatory lending apps and fake loan approvals demanding upfront processing fees.",
    risk: "High",
    icon: "IndianRupee" as const,
    color: "#14B8A6",
  },
  {
    name: "Courier Scam",
    description: "Fake delivery notifications and customs duty demands impersonating courier services.",
    risk: "Medium",
    icon: "Package" as const,
    color: "#6366F1",
  },
  {
    name: "WhatsApp Scam",
    description: "Impersonation, lottery wins, and malicious links spread through WhatsApp messages.",
    risk: "High",
    icon: "MessageCircle" as const,
    color: "#22C55E",
  },
];

export const modelMetrics = {
  accuracy: 96.8,
  precision: 95.2,
  recall: 94.7,
  f1Score: 94.9,
};

export const performanceData = [
  { month: "Jan", accuracy: 92.1, precision: 91.3, recall: 90.8 },
  { month: "Feb", accuracy: 93.4, precision: 92.1, recall: 91.5 },
  { month: "Mar", accuracy: 94.2, precision: 93.5, recall: 92.8 },
  { month: "Apr", accuracy: 94.8, precision: 93.9, recall: 93.2 },
  { month: "May", accuracy: 95.6, precision: 94.4, recall: 93.9 },
  { month: "Jun", accuracy: 96.1, precision: 94.8, recall: 94.2 },
  { month: "Jul", accuracy: 96.5, precision: 95.0, recall: 94.5 },
  { month: "Aug", accuracy: 96.8, precision: 95.2, recall: 94.7 },
];

export const scamDistribution = [
  { name: "UPI Fraud", value: 28, color: "#EF4444" },
  { name: "Phishing", value: 22, color: "#EAB308" },
  { name: "OTP Scam", value: 18, color: "#F97316" },
  { name: "Investment", value: 14, color: "#EC4899" },
  { name: "Job Scam", value: 10, color: "#8B5CF6" },
  { name: "Others", value: 8, color: "#6366F1" },
];

export const monthlyTrends = [
  { month: "Jan", reported: 12400, detected: 11200, prevented: 10800 },
  { month: "Feb", reported: 13100, detected: 12100, prevented: 11600 },
  { month: "Mar", reported: 14800, detected: 13900, prevented: 13400 },
  { month: "Apr", reported: 13600, detected: 12800, prevented: 12300 },
  { month: "May", reported: 15200, detected: 14500, prevented: 14000 },
  { month: "Jun", reported: 16800, detected: 16100, prevented: 15600 },
  { month: "Jul", reported: 17500, detected: 16900, prevented: 16400 },
  { month: "Aug", reported: 18200, detected: 17600, prevented: 17100 },
];

export const insightStats = [
  { label: "Scams Detected", value: "1.2M+", description: "Total scams identified" },
  { label: "Money Saved", value: "₹847Cr", description: "Fraud amount prevented" },
  { label: "Users Protected", value: "5.8M+", description: "Active users secured" },
  { label: "Avg Response", value: "< 2s", description: "Detection latency" },
];

export const howItWorks = [
  {
    step: 1,
    title: "Paste Content",
    description: "Copy and paste the suspicious message, URL, or transaction detail into ScamShield.",
  },
  {
    step: 2,
    title: "AI Extracts Features",
    description: "Our NLP engine extracts linguistic patterns, URLs, phone numbers, and behavioral signals.",
  },
  {
    step: 3,
    title: "ML Evaluates Risk",
    description: "Multiple ML models analyze the content against known scam patterns and emerging threats.",
  },
  {
    step: 4,
    title: "Get Results",
    description: "Receive instant scam probability, risk level, type classification, and recommended actions.",
  },
];

export const features = [
  {
    title: "Multilingual Detection",
    description: "Detects scams in Hindi, English, Tamil, Telugu, Bengali, and 10+ Indian languages.",
    icon: "Languages" as const,
  },
  {
    title: "UPI Transaction Analysis",
    description: "Analyzes UPI payment requests, QR codes, and transaction patterns for fraud signals.",
    icon: "Smartphone" as const,
  },
  {
    title: "WhatsApp Message Scanning",
    description: "Scans forwarded messages and group texts for phishing links and impersonation attempts.",
    icon: "MessageCircle" as const,
  },
  {
    title: "URL Phishing Detection",
    description: "Real-time analysis of suspicious URLs with domain reputation and content verification.",
    icon: "Link" as const,
  },
  {
    title: "Real-Time Prediction",
    description: "Sub-2-second response time for instant scam classification and risk assessment.",
    icon: "Zap" as const,
  },
  {
    title: "Explainable AI Insights",
    description: "Transparent explanations of why content was flagged, with key risk indicators highlighted.",
    icon: "Brain" as const,
  },
];

export const sampleAnalysis = {
  input: "Congratulations! You've won ₹50,00,000 in the KBC Lucky Draw. Send ₹5,000 processing fee to claim. Contact: +91-9876543210. Click: http://kbc-winner.fake.in",
  result: {
    probability: 98.7,
    riskLevel: "Critical",
    scamType: "Lottery/Prize Scam",
    indicators: [
      "Unsolicited prize claim",
      "Advance fee demand (₹5,000)",
      "Suspicious domain (fake.in)",
      "Urgency language patterns",
      "Unverified contact number",
    ],
    action: "Do NOT send any money or click the link. Block the sender and report to cybercrime.gov.in",
  },
};
