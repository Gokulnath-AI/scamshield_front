"use client";

import { Shield } from "lucide-react";

const links = {
  Product: ["Features", "Demo", "Pricing", "API"],
  Company: ["About", "Blog", "Careers", "Contact"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
};

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-lg font-bold">
                <span className="text-white">SCAM</span>
                <span className="text-primary">SHIELD</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              AI-powered scam detection platform built for safer digital payments in India.
            </p>
          </div>
          {Object.entries(links).map(([heading, items]) => (
            <div key={heading}>
              <h4 className="text-sm font-semibold text-white mb-4">{heading}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm hover:text-white transition-colors cursor-pointer">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">
            &copy; {new Date().getFullYear()} ScamShield. Built for safer digital payments in India.
          </p>
          <p className="text-xs text-slate-500">
            Made with care in India
          </p>
        </div>
      </div>
    </footer>
  );
}
