export interface AnalysisResult {
  label: 'Scam' | 'Safe';
  confidence: number; // 0.0 to 1.0
  analysis: string;
  actionSteps: string[];
}

export type SampleType = 'upi' | 'bank' | 'gift' | 'fedex' | 'arrest' | 'telegram';

export interface SampleMessage {
  id: SampleType;
  title: string;
  category: string;
  text: string;
  riskLevel: 'High' | 'Critical' | 'Medium';
}

export interface SecurityLayer {
  icon: string;
  title: string;
  description: string;
}

export interface RecentReport {
  id: string;
  vpaOrPhone: string;
  type: string;
  timestamp: string;
  location: string;
}
