import React from 'react';
import { X, Building, Calendar, CheckCircle, Award, DollarSign, ListOrdered, FileText } from 'lucide-react';
import { PlacementRecord } from '../../types';
import { DemoDataBadge } from '../common/DemoDataBadge';

interface Props {
  record: PlacementRecord | null;
  onClose: () => void;
}

export const RecordDetailModal: React.FC<Props> = ({ record, onClose }) => {
  if (!record) return null;

  const formatLPA = (amount?: number | null) => {
    if (!amount) return 'N/A';
    return `₹ ${(amount / 100000).toFixed(2)} LPA`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-scale-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {record.companyCategory}
              </span>
              <DemoDataBadge status={record.verificationStatus} size="sm" />
            </div>
            <h3 className="font-extrabold text-xl text-slate-900 leading-tight flex items-center gap-2">
              <Building className="w-5 h-5 text-brand-600" />
              {record.companyName}
            </h3>
            <p className="text-sm font-semibold text-brand-700 mt-0.5">{record.jobRole}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content sections */}
        <div className="space-y-5 text-xs text-slate-700">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Drive Year</span>
              <div className="font-bold text-slate-900 text-sm mt-0.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" /> {record.recruitmentYear}
              </div>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Academic Year</span>
              <div className="font-bold text-slate-900 text-sm mt-0.5">{record.academicYear}</div>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Opportunity Type</span>
              <div className="font-bold text-slate-900 text-sm mt-0.5">{record.employmentType}</div>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Selected Students</span>
              <div className="font-bold text-slate-900 text-sm mt-0.5">
                {record.numberSelected ? `${record.numberSelected} placed` : <span className="text-slate-400 italic font-normal">Unspecified</span>}
              </div>
            </div>
          </div>

          {/* Compensation Breakdown (CTC vs Fixed vs Variable vs Stipend) */}
          <div className="p-4 rounded-xl border border-brand-200 bg-brand-50/30 space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-brand-900 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-brand-600" />
              Compensation Structure Details
            </h4>

            {record.isSalaryAvailable ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="bg-white p-2.5 rounded-lg border border-brand-100">
                  <div className="text-[10px] text-slate-500 font-medium">Total Annual CTC</div>
                  <div className="text-base font-extrabold text-brand-700">{formatLPA(record.annualCtc)}</div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-brand-100">
                  <div className="text-[10px] text-slate-500 font-medium">Fixed Base Salary</div>
                  <div className="text-sm font-bold text-slate-800">{formatLPA(record.fixedCompensation)}</div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-brand-100">
                  <div className="text-[10px] text-slate-500 font-medium">
                    {record.internshipStipend ? 'Internship Stipend' : 'Variable / Bonus'}
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    {record.internshipStipend
                      ? `₹ ${record.internshipStipend.toLocaleString('en-IN')}/mo`
                      : formatLPA(record.variableCompensation)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-slate-500 italic p-2 bg-white/60 rounded border border-slate-200">
                Official compensation figures were not published for this drive or remain confidential.
              </div>
            )}

            {record.compensationNotes && (
              <p className="text-[11px] text-slate-600 bg-white/70 p-2.5 rounded-lg border border-slate-200 leading-relaxed">
                <strong>Compensation Notes:</strong> {record.compensationNotes}
              </p>
            )}
          </div>

          {/* Eligibility & Departments */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-slate-600" />
              Eligibility & Department Scope
            </h4>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div>
                <span className="text-slate-500 font-semibold block mb-1">Eligible BMSCE Departments:</span>
                <div className="flex flex-wrap gap-1.5">
                  {record.eligibleDepartments && record.eligibleDepartments.length > 0 ? (
                    record.eligibleDepartments.map((dept, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-white font-semibold text-slate-800 border border-slate-200 text-[11px]">
                        {dept}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 italic">Open to all circuit/core branches</span>
                  )}
                </div>
              </div>

              {record.minimumEligibilityCriteria && (
                <div className="pt-2 border-t border-slate-200/60">
                  <span className="text-slate-500 font-semibold">Minimum Eligibility Criteria: </span>
                  <span className="text-slate-800">{record.minimumEligibilityCriteria}</span>
                </div>
              )}
            </div>
          </div>

          {/* Required Technical Skills */}
          {record.requiredSkills && record.requiredSkills.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Required Technical Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {record.requiredSkills.map((skill, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 font-medium text-xs border border-blue-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Selection Process Stages */}
          {record.selectionProcess && record.selectionProcess.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ListOrdered className="w-4 h-4 text-slate-600" />
                Hiring Assessment & Interview Rounds
              </h4>
              <ol className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200 list-decimal list-inside">
                {record.selectionProcess.map((stage, i) => (
                  <li key={i} className="text-slate-700 font-medium">
                    {stage}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Data Governance & Verification Provenance */}
          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-slate-500 bg-slate-50/50 p-3 rounded-lg">
            <div>
              <span className="font-semibold text-slate-700">Data Source: </span>
              {record.dataSource}
            </div>
            {record.dateLastVerified && (
              <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Verified on {new Date(record.dateLastVerified).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
