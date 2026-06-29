import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Save scan result
export async function saveScanResult(data: {
  message: string;
  label: string;
  scam_score: number;
  risk_level: string;
  analysis: string;
}) {
  const { error } = await supabase.from('scan_results').insert([data]);
  if (error) console.error('Failed to save scan:', error);
}

// Save scam report
export async function saveScamReport(data: {
  message: string;
  sender_info: string;
  category: string;
  description: string;
  scam_score?: number;
}) {
  const { error } = await supabase.from('scam_reports').insert([data]);
  if (error) console.error('Failed to save report:', error);
  return !error;
}

// Get recent scans for Live Feed
export async function getRecentScans(limit = 20) {
  const { data, error } = await supabase
    .from('scan_results')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) console.error('Failed to fetch scans:', error);
  return data || [];
}

// Get live stats
export async function getLiveStats() {
  const { data: total } = await supabase
    .from('scan_results')
    .select('id', { count: 'exact', head: true });

  const { data: scams } = await supabase
    .from('scan_results')
    .select('id', { count: 'exact', head: true })
    .eq('label', 'Scam');

  const { count: totalCount } = await supabase
    .from('scan_results')
    .select('*', { count: 'exact', head: true });

  const { count: scamCount } = await supabase
    .from('scan_results')
    .select('*', { count: 'exact', head: true })
    .eq('label', 'Scam');

  return {
    totalScans: totalCount || 0,
    scamsDetected: scamCount || 0,
    safeMessages: (totalCount || 0) - (scamCount || 0),
  };
}
