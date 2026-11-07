import React from 'react';
import { Building, ExternalLink, Briefcase, CheckCircle, ShieldAlert } from 'lucide-react';
import { Company } from '../../types';

interface Props {
  company: Company;
  onSelect: (company: Company) => void;
}

export const CompanyCard: React.FC<Props> = ({ company, onSelect }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-5 hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-slate-900 to-navy-800 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-sm">
              {company.name.charAt(0)}
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-900 hover:text-brand-600 transition-colors cursor-pointer" onClick={() => onSelect(company)}>
                {company.name}
              </h4>
              <div className="text-xs text-slate-500 font-medium">{company.industry}</div>
            </div>
          </div>

          {/* Recruitment confirmation status */}
          {company.isRecruitingAtBmsceConfirmed ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 shrink-0" title="Officially confirmed BMSCE on-campus drive partner">
              <CheckCircle className="w-3 h-3 text-emerald-600" /> Confirmed BMSCE Partner
            </span>
          ) : (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1 shrink-0" title="General industry profile; not claimed as an active BMSCE drive unless verified">
              Industry Explorer
            </span>
          )}
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {company.categories.map((cat, idx) => (
            <span key={idx} className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
              {cat}
            </span>
          ))}
          {company.headquarters && (
            <span className="text-[11px] text-slate-500 px-2 py-0.5 rounded-md bg-slate-100">
              {company.headquarters}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
          {company.description}
        </p>

        {/* Relevant Roles */}
        {company.relevantJobRoles && company.relevantJobRoles.length > 0 && (
          <div className="mb-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Associated Job Roles
            </span>
            <div className="flex flex-wrap gap-1">
              {company.relevantJobRoles.map((role, idx) => (
                <span key={idx} className="text-[11px] bg-slate-50 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-medium flex items-center gap-1">
                  <Briefcase className="w-2.5 h-2.5 text-slate-400" />
                  {role}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          {company.offersInternship && <span className="text-emerald-700 font-semibold">• Internship</span>}
          {company.offersFullTime && <span className="text-blue-700 font-semibold">• Full-Time</span>}
        </div>

        <button
          onClick={() => onSelect(company)}
          className="px-3 py-1.5 text-xs font-bold text-brand-700 hover:text-white bg-brand-50 hover:bg-brand-600 rounded-lg transition-all border border-brand-200 hover:border-brand-600"
        >
          View Company Guide
        </button>
      </div>
    </div>
  );
};
