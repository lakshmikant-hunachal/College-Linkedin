import React from 'react';
import { X, Building, Globe, MapPin, Briefcase, CheckCircle, Info, ExternalLink, Lightbulb, ListOrdered } from 'lucide-react';
import { Company } from '../../types';

interface Props {
  company: Company | null;
  onClose: () => void;
}

export const CompanyDetailModal: React.FC<Props> = ({ company, onClose }) => {
  if (!company) return null;

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-scale-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-navy-900 to-brand-700 text-white font-extrabold text-2xl flex items-center justify-center shadow-md shrink-0">
              {company.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <h3 className="font-extrabold text-xl text-slate-900">{company.name}</h3>
                {company.isRecruitingAtBmsceConfirmed ? (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Confirmed BMSCE Recruiter
                  </span>
                ) : (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    Industry Profile
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 font-medium flex items-center gap-3">
                <span>{company.industry}</span>
                {company.headquarters && (
                  <span className="flex items-center gap-1 text-slate-400">
                    <MapPin className="w-3.5 h-3.5" /> {company.headquarters}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-5 text-xs text-slate-700">
          {/* Institutional Accuracy Notice */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 flex items-start gap-2">
            <Info className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
            <p className="leading-tight text-[11px]">
              <strong>Factual Placement Notice:</strong> Interview stages and technical requirements below represent confirmed industry benchmarks. BMSCE campus drives for this organization are shown as confirmed only when verified placement archives support that status.
            </p>
          </div>

          {/* Overview */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-1.5">Company Overview</h4>
            <p className="text-xs text-slate-600 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200/80">
              {company.description}
            </p>
          </div>

          {/* Categories & Opportunities */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">Company Categories</span>
              <div className="flex flex-wrap gap-1">
                {company.categories.map((c, i) => (
                  <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded font-semibold text-xs border border-blue-200">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">Opportunities Offered</span>
              <div className="flex items-center gap-3 font-semibold text-xs mt-1">
                {company.offersInternship && <span className="text-emerald-700">✓ Summer / Semester Internship</span>}
                {company.offersFullTime && <span className="text-blue-700">✓ Full-Time Campus Role</span>}
              </div>
            </div>
          </div>

          {/* Key Job Roles */}
          {company.relevantJobRoles && company.relevantJobRoles.length > 0 && (
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-1.5 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-slate-500" /> Relevant Engineering Roles
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {company.relevantJobRoles.map((role, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-semibold text-xs border border-slate-200">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Required Skills */}
          {company.requiredSkills && company.requiredSkills.length > 0 && (
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-1.5">Core Technical Skills Evaluated</h4>
              <div className="flex flex-wrap gap-1.5">
                {company.requiredSkills.map((skill, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md bg-brand-50 text-brand-800 font-semibold text-xs border border-brand-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Confirmed Interview Stages */}
          {company.interviewStages && company.interviewStages.length > 0 && (
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-1.5 flex items-center gap-1.5">
                <ListOrdered className="w-4 h-4 text-slate-500" /> Typical Recruitment Assessment Stages
              </h4>
              <ol className="space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200 list-decimal list-inside text-xs font-medium text-slate-700">
                {company.interviewStages.map((stage, i) => (
                  <li key={i}>{stage}</li>
                ))}
              </ol>
            </div>
          )}

          {/* Preparation Resources & Tips */}
          {company.preparationResources && company.preparationResources.length > 0 && (
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-1.5 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500" /> Preparation Strategy & Tips
              </h4>
              <ul className="space-y-1.5 bg-amber-50/50 p-3.5 rounded-xl border border-amber-200/80 text-xs text-amber-950 font-medium">
                {company.preparationResources.map((tip, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Official Website */}
          {company.website && (
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-slate-500">Official Company Portal:</span>
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:text-brand-700 hover:underline"
              >
                <span>Visit {company.name} Careers</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
