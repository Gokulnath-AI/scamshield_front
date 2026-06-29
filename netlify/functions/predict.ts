import type { Handler } from "@netlify/functions";

const SCAMSHIELD_API =
  process.env.SCAMSHIELD_API_URL || "https://scamshield-14i0.onrender.com";

function heuristicAnalyze(message: string) {
  const lower = message.toLowerCase();
  let scamScore = 0.1;
  const redFlags: string[] = [];

  if (lower.includes("upi://") || lower.includes("@ybl") || lower.includes("@paytm"))
    { scamScore += 0.3; redFlags.push("Direct UPI payment link detected"); }
  if (lower.includes("kyc") || lower.includes("blocked") || lower.includes("suspend"))
    { scamScore += 0.25; redFlags.push("Account suspension or KYC threat"); }
  if (lower.includes("won") || lower.includes("lottery") || lower.includes("lucky draw"))
    { scamScore += 0.35; redFlags.push("Lottery or prize scam pattern"); }
  if (lower.includes(".xyz") || lower.includes("bit.ly") || lower.includes("http:"))
    { scamScore += 0.25; redFlags.push("Suspicious URL detected"); }
  if (lower.includes("digital arrest") || lower.includes("cbi") || lower.includes("narcotics"))
    { scamScore += 0.45; redFlags.push("Digital arrest intimidation pattern"); }
  if (lower.includes("otp") || lower.includes("pin") || lower.includes("password"))
    { scamScore += 0.3; redFlags.push("Soliciting OTP or credentials"); }

  scamScore = Math.min(0.98, Math.max(0.05, scamScore));
  const isScam = scamScore > 0.45;

  return {
    label: isScam ? "Scam" : "Safe",
    confidence: Number(scamScore.toFixed(2)),
    analysis: isScam
      ? `Heuristic engine flagged: ${redFlags.join("; ")}`
      : "No high-risk patterns detected.",
    actionSteps: isScam
      ? ["Do not click any links", "Block the sender immediately", "Call 1930 Cyber Helpline"]
      : ["Verify unknown senders independently", "Never share OTPs with anyone"],
  };
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { message } = JSON.parse(event.body || "{}");

    if (!message || typeof message !== "string") {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Message is required" }),
      };
    }

    // Primary: call Render ML backend
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);

      const res = await fetch(`${SCAMSHIELD_API}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        const isSpam = data.prediction === "spam";
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            label: isSpam ? "Scam" : "Safe",
            confidence: Math.round((data.risk_percentage ?? 50)) / 100,
            analysis: data.solution || "",
            actionSteps: isSpam
              ? ["Do not click any links", "Block the sender immediately", "Report to 1930 Cyber Helpline"]
              : ["Verify unknown senders independently", "Never share OTPs"],
          }),
        };
      }
    } catch {
      console.warn("ML backend unreachable, switching to heuristic fallback");
    }

    // Fallback: heuristic engine
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(heuristicAnalyze(message)),
    };

  } catch (err) {
    console.error("Function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
