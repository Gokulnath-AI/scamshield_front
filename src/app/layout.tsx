import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ScamShield — AI-Powered Scam Detection for India",
  description:
    "Detect UPI fraud, OTP scams, phishing links, fake job offers, and more with ScamShield's ML-powered analysis engine. Built for safer digital payments in India.",
  keywords: [
    "scam detection", "UPI fraud", "phishing detection", "AI scam detector",
    "India cybersecurity", "OTP scam", "WhatsApp scam", "digital fraud prevention",
    "machine learning", "ScamShield",
  ],
  openGraph: {
    title: "ScamShield — AI-Powered Scam Detection for India",
    description: "Instantly detect and classify digital scams targeting Indian users. ML-powered, real-time, multilingual.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
