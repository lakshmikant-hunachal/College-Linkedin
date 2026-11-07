import React from 'react';
import { X, Briefcase, ListOrdered, Code2, Database, Layers, Lightbulb, CheckCircle2 } from 'lucide-react';
import { JobRole } from '../../types';

interface Props {
  role: JobRole | null;
  onClose: () => void;
}

export const JobRoleDetailModal: React.FC<Props> = ({ role, onClose }) => {
  if (!role) return null;

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 animate-scale-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
              {role.category}
            </span>
            <h3 className="font-extrabold text-xl text-slate-900 mt-1">{role.title}</h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Career Preparation Blueprint • Level: {role.averageExperienceLevel}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 text-xs text-slate-700">
          {/* Overview */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-1">Role Description</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{role.description}</p>
          </div>

          {/* Required Skills */}
          {role.requiredSkills && role.requiredSkills.length > 0 && (
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-2">
                Essential Technical Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {role.requiredSkills.map((s, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 font-semibold border border-blue-200">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Structured Learning Sequence */}
          {role.learningSequence && role.learningSequence.length > 0 && (
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
                <ListOrdered className="w-4 h-4 text-brand-600" />
                Recommended Step-by-Step Learning Sequence
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                {role.learningSequence.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-800 font-medium">
                    <span className="w-5 h-5 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                      {idx + 1}
                    </span>
                    <span className="truncate">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DSA & Core CS Topics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* DSA Topics */}
            {role.dsaTopics && role.dsaTopics.length > 0 && (
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30">
                <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-900 mb-2 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-emerald-700" /> High-Priority DSA Patterns
                </h4>
                <div className="flex flex-wrap gap-1">
                  {role.dsaTopics.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-white text-emerald-800 border border-emerald-200 font-semibold text-[11px]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Core CS Subjects */}
            {role.coreCsTopics && role.coreCsTopics.length > 0 && (
              <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/30">
                <h4 className="font-bold text-xs uppercase tracking-wider text-purple-900 mb-2 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-purple-700" /> Core CS Subject Foundations
                </h4>
                <ul className="space-y-1 text-purple-950 font-medium">
                  {role.coreCsTopics.map((c, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-purple-600">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* System Design & Projects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {role.systemDesignTopics && role.systemDesignTopics.length > 0 && (
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-brand-600" /> System Design & Architecture
                </h4>
                <div className="flex flex-wrap gap-1">
                  {role.systemDesignTopics.map((sd, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-white text-slate-800 border border-slate-200 font-medium text-[11px]">
                      {sd}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {role.projectSuggestions && role.projectSuggestions.length > 0 && (
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/30">
                <h4 className="font-bold text-xs uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-600" /> Recommended Standout Projects
                </h4>
                <ul className="space-y-1 text-amber-950 font-medium">
                  {role.projectSuggestions.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">→</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Interview Stages */}
          {role.interviewStages && role.interviewStages.length > 0 && (
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-2">
                Campus Interview Progression
              </h4>
              <div className="flex flex-wrap items-center gap-2">
                {role.interviewStages.map((stage, idx) => (
                  <React.Fragment key={idx}>
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-semibold text-slate-800 text-[11px] shadow-xs">
                      {stage}
                    </span>
                    {idx < role.interviewStages.length - 1 && <span className="text-slate-400 font-bold">→</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
