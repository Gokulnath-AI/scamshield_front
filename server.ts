import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const SCAMSHIELD_API = process.env.SCAMSHIELD_API_URL || 'https://scamshield-14i0.onrender.com';

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'ScamShield India', mlBackend: SCAMSHIELD_API });
});

function heuristicAnalyze(message: string) {
  const lower = message.toLowerCase();
  let scamScore = 0.1;
  const redFlags: string[] = [];

  if (lower.includes('upi://') || lower.includes('@vpa') || lower.includes('@ybl') || lower.includes('@okaxis') || lower.includes('@paytm')) {
    scamScore += 0.3; redFlags.push('Direct UPI payment collection link detected');
  }
  if (lower.includes('kyc') || lower.includes('blocked') || lower.includes('suspend') || lower.includes('deactivate')) {
    scamScore += 0.25; redFlags.push('Urgent account suspension or KYC threat');
  }
  if (lower.includes('won') || lower.includes('lottery') || lower.includes('iphone') || lower.includes('gift') || lower.includes('lucky draw') || lower.includes('claim')) {
    scamScore += 0.35; redFlags.push('Unrealistic prize or lottery claim offer');
  }
  if (lower.includes('bit.ly') || lower.includes('tinyurl') || lower.includes('.xyz') || lower.includes('apk') || lower.includes('http:')) {
    scamScore += 0.25; redFlags.push('Suspicious unverified third-party URL');
  }
  if (lower.includes('electricity') || lower.includes('overdue') || lower.includes('disconnect') || lower.includes('officer')) {
    scamScore += 0.35; redFlags.push('Utility impersonation with artificial urgency');
  }
  if (lower.includes('fedex') || lower.includes('customs') || lower.includes('cbi') || lower.includes('digital arrest') || lower.includes('aadhaar') || lower.includes('narcotics')) {
    scamScore += 0.45; redFlags.push('Digital Arrest or courier intimidation pattern');
  }
  if (lower.includes('telegram') || lower.includes('part time') || lower.includes('daily income') || lower.includes('like youtube') || lower.includes('work from home')) {
    scamScore += 0.4; redFlags.push('Telegram task-based investment scam pattern');
  }
  if (lower.includes('pin') || lower.includes('otp') || lower.includes('password')) {
    scamScore += 0.3; redFlags.push('Soliciting sensitive PIN or OTP credentials');
  }

  scamScore = Math.min(0.98, Math.max(0.05, scamScore));
  const isScam = scamScore > 0.45;

  return {
    label: isScam ? 'Scam' : 'Safe',
    confidence: Number(scamScore.toFixed(2)),
    analysis: isScam
      ? `Heuristic engine flagged high-risk patterns: ${redFlags.join('; ')}. This message uses social engineering tactics common in Indian digital fraud cases.`
      : 'No malicious UPI collection strings, blacklisted domains, or high-risk threat patterns were detected.',
    actionSteps: isScam ? [
      'Do not click any links or scan QR codes present in this message',
      'Never enter your UPI PIN or OTP to receive money or unblock accounts',
      'Block the sender immediately on SMS or WhatsApp',
      'Report to Chakshu on Sanchar Saathi portal or call 1930 Cyber Helpline'
    ] : [
      'Verify unknown senders independently before sharing any information',
      'Keep your mobile banking and UPI applications updated',
      'Never share OTPs or passwords over calls, SMS or messages'
    ]
  };
}

function mapBackendResponse(data: Record<string, unknown>) {
  const isSpam = data.prediction === 'spam';
  const riskPct = typeof data.risk_percentage === 'number' ? data.risk_percentage : 50;
  const confidence = Math.round(riskPct) / 100;
  const factor = (data.risk_factor as string) || 'Medium';
  const solution = (data.solution as string) || '';

  const riskLabel = factor === 'High' ? 'critical' : factor === 'Medium' ? 'moderate' : 'low-level';

  const analysis = isSpam
    ? `ML model (TF-IDF + SVM trained on 36,000+ Indian scam samples) detected a ${riskLabel} threat. ${solution}`
    : `Message passed all scam detection filters with ${factor.toLowerCase()} risk. ${solution}`;

  return {
    label: isSpam ? 'Scam' : 'Safe',
    confidence,
    analysis,
    actionSteps: isSpam ? [
      'Do not click any links or scan QR codes present in this message',
      'Never enter your UPI PIN, OTP or Aadhaar to receive funds or unblock accounts',
      'Block the sender immediately on your SMS or WhatsApp application',
      'Report to Chakshu portal on Sanchar Saathi or call 1930 Cyber Helpline'
    ] : [
      'Verify unknown senders independently before sharing any information',
      'Keep your mobile banking and UPI applications updated to latest version',
      'Never share OTPs or security credentials over calls or messages'
    ]
  };
}

app.post('/api/predict', async (req, res) => {
  try {
    const { message } = req.body as { message?: string };
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required' });
    }

    // Primary: call ScamShield ML backend
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      const backendRes = await fetch(`${SCAMSHIELD_API}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (backendRes.ok) {
        const data = await backendRes.json() as Record<string, unknown>;
        console.log(`[ML] prediction=${data.prediction} risk=${data.risk_percentage}%`);
        return res.json(mapBackendResponse(data));
      } else {
        console.warn(`[ML] Backend returned ${backendRes.status}, falling back to heuristic`);
      }
    } catch (backendErr: unknown) {
      const isTimeout = backendErr instanceof Error && backendErr.name === 'AbortError';
      console.warn(`[ML] Backend ${isTimeout ? 'timed out' : 'unreachable'}, using heuristic fallback`);
    }

    // Fallback: heuristic engine
    return res.json(heuristicAnalyze(message));
  } catch (err) {
    console.error('Prediction endpoint error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ScamShield server on http://localhost:${PORT} | ML backend: ${SCAMSHIELD_API}`);
  });
}

setupViteOrStatic();
