import React, { useState } from 'react';
import { ExternalLink, BookOpen, FileText, Download, Sparkles, GraduationCap, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

export const ExNotePage: React.FC = () => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const exnoteUrl = 'https://exnote.vercel.app/';

  const resourceCategories = [
    {
      title: 'First Year Core Cycle Notes',
      desc: 'Physics Cycle, Chemistry Cycle, Engineering Mathematics, and Programming in C/Python.',
      tags: ['Sem 1', 'Sem 2', 'P-Cycle', 'C-Cycle'],
      color: 'border-blue-200 bg-blue-50/50 text-blue-900',
    },
    {
      title: 'Branch-Wise Core Engineering Notes',
      desc: 'Curated semester notes for CSE, ISE, ECE, EEE, AIML, and Data Science departments.',
      tags: ['Sem 3 - 8', 'DSA', 'DBMS', 'OS', 'Networks'],
      color: 'border-emerald-200 bg-emerald-50/50 text-emerald-900',
    },
    {
      title: 'Autonomous Previous Year Question Papers (PYQs)',
      desc: 'Semester End Examination (SEE) and CIE previous test papers with model answer keys.',
      tags: ['BMSCE SEE', 'CIE Tests', 'Answer Keys'],
      color: 'border-amber-200 bg-amber-50/50 text-amber-900',
    },
    {
      title: 'Lab Manuals & Practical Records',
      desc: 'Standard laboratory experiment records, code implementations, and viva voce question banks.',
      tags: ['Data Structures Lab', 'Microprocessors Lab', 'Web Lab'],
      color: 'border-purple-200 bg-purple-50/50 text-purple-900',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" /> ExNote Academic Integration
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            ExNote — BMSCE Academic Notes & Question Papers Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Access free semester-wise class notes, verified handwritten lecture materials, previous year examination question papers (PYQs), and laboratory manuals for BMSCE engineering students.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href={exnoteUrl}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-extrabold rounded-xl shadow-md shadow-brand-500/30 flex items-center gap-2 transition-all hover:scale-102"
            >
              <span>Launch ExNote Web App</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <span className="text-xs text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Verified External BMSCE Resource Portal
            </span>
          </div>
        </div>

        {/* Decorative background watermark */}
        <div className="absolute right-4 bottom-2 text-white/5 font-black text-8xl pointer-events-none select-none">
          ExNote
        </div>
      </div>

      {/* Resource Quick Category Cards */}
      <div className="space-y-3">
        <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <FileText className="w-4 h-4 text-brand-600" />
          Curated Study Material Directory on ExNote
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {resourceCategories.map((cat, i) => (
            <div
              key={i}
              className={`p-4 rounded-2xl border ${cat.color} shadow-xs flex flex-col justify-between hover:shadow-md transition-all`}
            >
              <div>
                <h3 className="font-bold text-sm mb-1.5">{cat.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">{cat.desc}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {cat.tags.map((t, idx) => (
                    <span key={idx} className="text-[10px] font-semibold bg-white/80 px-2 py-0.5 rounded border border-slate-200/80">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <a
                href={exnoteUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-brand-700 hover:text-brand-800 inline-flex items-center gap-1 hover:underline pt-2 border-t border-slate-200/60"
              >
                <span>Browse on ExNote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Embedded Live ExNote Portal View */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-600" />
              ExNote Live Embedded Viewer
            </h3>
            <p className="text-xs text-slate-500">
              Direct access to notes hosted on <span className="font-mono text-brand-700 font-semibold">{exnoteUrl}</span>
            </p>
          </div>

          <a
            href={exnoteUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Open in Fullscreen</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Iframe View */}
        <div className="relative w-full rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden min-h-[620px]">
          <iframe
            src={exnoteUrl}
            title="ExNote Notes Portal"
            className="w-full h-[620px] border-0"
            onLoad={() => setIframeLoaded(true)}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />

          {/* Quick overlay helper banner */}
          <div className="p-3 bg-slate-100 border-t border-slate-200 text-center text-xs text-slate-600 flex items-center justify-center gap-2">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>
              If your browser restricts embedding third-party web apps, you can{' '}
              <a href={exnoteUrl} target="_blank" rel="noreferrer" className="text-brand-600 font-bold hover:underline">
                launch ExNote directly here
              </a>.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
