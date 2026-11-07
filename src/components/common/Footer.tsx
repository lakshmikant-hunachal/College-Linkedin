import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-950 text-slate-400 border-t border-navy-900 mt-auto py-10 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <span className="w-6 h-6 rounded bg-brand-600 flex items-center justify-center text-xs">CC</span>
              Campus Connect — BMSCE Bengaluru
            </div>
            <p className="text-slate-400 leading-relaxed max-w-md">
              A college-exclusive professional networking, curriculum roadmap, and placement guidance platform designed specifically for students, alumni, and faculty of BMS College of Engineering, Bull Temple Road, Bengaluru.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              BMSCE College-Exclusive Network (Non-public institutional ecosystem)
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider mb-3">Academic Roadmaps</h4>
            <ul className="space-y-2">
              <li><a href="/roadmaps" className="hover:text-white transition-colors">Semester 1 to 8 Guides</a></li>
              <li><a href="/companies" className="hover:text-white transition-colors">Software Engineering Tracks</a></li>
              <li><a href="/companies" className="hover:text-white transition-colors">Data Science & AI Careers</a></li>
              <li><a href="/resources" className="hover:text-white transition-colors">Core CS & DSA Curriculums</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider mb-3">Placement Cell & Governance</h4>
            <ul className="space-y-2">
              <li><a href="/placements" className="hover:text-white transition-colors">Placement Records & Analytics</a></li>
              <li><a href="/admin" className="hover:text-white transition-colors">Coordinator Data Import</a></li>
              <li><span className="text-slate-500">BMSCE Training & Placement Cell</span></li>
              <li><span className="text-slate-500">Bull Temple Rd, Basavanagudi</span></li>
            </ul>
          </div>
        </div>

        {/* Legal & Data Integrity Notice */}
        <div className="pt-6 border-t border-navy-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-2 max-w-3xl">
            <Info className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-400 leading-tight">
              <strong>Data Integrity Guarantee:</strong> Synthetic placement records for application development are strictly labelled as <span className="text-amber-400 font-semibold">DEMO DATA</span> and excluded from verified institutional analytics. Official placement statistics reflect only verified records confirmed by the BMSCE Placement Office.
            </p>
          </div>
          <div className="text-[11px] text-slate-400 shrink-0">
            &copy; {new Date().getFullYear()} BMSCE Campus Connect. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
