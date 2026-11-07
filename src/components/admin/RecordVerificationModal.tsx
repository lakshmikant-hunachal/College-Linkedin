import React, { useState } from 'react';
import { X, CheckCircle, XCircle, Archive, ShieldCheck, Building, DollarSign } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { PlacementRecord, VerificationStatus } from '../../types';

interface Props {
  record: PlacementRecord | any | null;
  onClose: () => void;
  onVerified: () => void;
}

export const RecordVerificationModal: React.FC<Props> = ({ record, onClose, onVerified }) => {
  const { showToast } = useToast();
  const [selectedStatus, setSelectedStatus] = useState<VerificationStatus>('VERIFIED');
  const [auditNotes, setAuditNotes] = useState('Cross-referenced with official student offer letters and placement cell records.');
  const [submitting, setSubmitting] = useState(false);

  if (!record) return null;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post(`/placements/admin/${record.id}/verify`, {
        status: selectedStatus,
        auditNotes: auditNotes.trim(),
      });

      if (res.data.success) {
        showToast(`Record status updated to ${selectedStatus}`, 'success');
        onVerified();
        onClose();
      }
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Verification action failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-600" />
            <h3 className="font-bold text-slate-900 text-base">Record Verification Action</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Record Overview */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5 mb-4">
          <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <Building className="w-4 h-4 text-brand-600" />
            {record.companyName}
          </div>
          <div className="text-slate-600 font-medium">
            Role: <span className="font-semibold text-slate-800">{record.jobRole}</span> • Drive: {record.recruitmentYear}
          </div>
          {record.annualCtc && (
            <div className="text-emerald-700 font-bold flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              Annual CTC: ₹ {(record.annualCtc / 100000).toFixed(2)} LPA
            </div>
          )}
          <div className="text-slate-400 text-[11px]">Source: {record.dataSource}</div>
        </div>

        <form onSubmit={handleVerify} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Official Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedStatus('VERIFIED')}
                className={`p-2.5 rounded-xl border font-bold text-center flex flex-col items-center gap-1 transition-all ${
                  selectedStatus === 'VERIFIED'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-500 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>VERIFY</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedStatus('REJECTED')}
                className={`p-2.5 rounded-xl border font-bold text-center flex flex-col items-center gap-1 transition-all ${
                  selectedStatus === 'REJECTED'
                    ? 'bg-rose-50 text-rose-800 border-rose-500 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>REJECT</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedStatus('ARCHIVED')}
                className={`p-2.5 rounded-xl border font-bold text-center flex flex-col items-center gap-1 transition-all ${
                  selectedStatus === 'ARCHIVED'
                    ? 'bg-slate-100 text-slate-800 border-slate-500 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Archive className="w-4 h-4 text-slate-500" />
                <span>ARCHIVE</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Audit Trail & Verification Notes</label>
            <textarea
              rows={3}
              value={auditNotes}
              onChange={(e) => setAuditNotes(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-1 focus:ring-brand-500 focus:outline-none"
              placeholder="Provide justification or record provenance for the audit trail..."
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold rounded-lg shadow-sm transition-colors"
            >
              {submitting ? 'Applying Change...' : 'Confirm Action'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
