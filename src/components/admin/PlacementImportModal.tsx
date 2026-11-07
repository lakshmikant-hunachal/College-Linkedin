import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle, AlertTriangle, AlertCircle, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: () => void;
}

export const PlacementImportModal: React.FC<Props> = ({ isOpen, onClose, onImportSuccess }) => {
  const { showToast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [importSummary, setImportSummary] = useState<any>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setImportSummary(null);
    }
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      showToast('Please select a CSV or JSON file to import', 'error');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/placements/admin/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setImportSummary(res.data.summary);
        showToast(res.data.message, 'success');
        onImportSuccess();
      }
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Import failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-click test import for official sample data
  const handleLoadSampleBatch = async () => {
    setLoading(true);
    try {
      const sampleRecords = [
        {
          companyName: `Siemens Healthineers (Drive ${Date.now().toString().slice(-4)})`,
          companyCategory: 'Product-Based',
          recruitmentYear: 2025,
          academicYear: '2024-2025',
          jobRole: 'Software Engineer - Medical Imaging',
          employmentType: 'Full-Time',
          eligibleDepartments: ['CSE', 'ISE', 'ECE'],
          eligibleGraduationYears: [2025],
          annualCtc: 1350000,
          fixedCompensation: 1100000,
          variableCompensation: 250000,
          compensationNotes: 'Base 11 LPA + 2.5 LPA joining performance incentive',
          dataSource: 'Official BMSCE Placement Cell 2024-25 Drive Bulletin',
        },
        {
          companyName: `Texas Instruments (Drive ${Date.now().toString().slice(-4)})`,
          companyCategory: 'Product-Based',
          recruitmentYear: 2025,
          academicYear: '2024-2025',
          jobRole: 'Embedded Software Engineer',
          employmentType: 'Internship + PPO',
          eligibleDepartments: ['ECE', 'EEE', 'CSE'],
          annualCtc: 1900000,
          fixedCompensation: 1550000,
          internshipStipend: 45000,
          compensationNotes: '45k/mo internship stipend followed by 19 LPA CTC',
          dataSource: 'Official BMSCE Departmental Circular',
        },
      ];

      const res = await api.post('/placements/admin/import', {
        filename: 'sample_real_bmsce_import.json',
        records: sampleRecords,
      });

      if (res.data.success) {
        setImportSummary(res.data.summary);
        showToast('Sample official records imported for verification queue', 'success');
        onImportSuccess();
      }
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to import sample batch', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-scale-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Import College Placement Records</h3>
              <p className="text-xs text-slate-500">Authorized BMSCE Placement Cell Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workflow Info Alert */}
        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 mb-4 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
          <p className="leading-tight text-[11px]">
            <strong>Two-Stage Verification Policy:</strong> Uploaded spreadsheets are stored with status <span className="font-bold text-brand-800">PENDING_VERIFICATION</span>. An authorized Placement Coordinator must explicitly verify records before they appear in official college statistics.
          </p>
        </div>

        {/* Upload Form */}
        {!importSummary ? (
          <form onSubmit={handleImport} className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-brand-500 transition-colors bg-slate-50">
              <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <label className="cursor-pointer block">
                <span className="text-xs font-bold text-brand-600 hover:underline">
                  Click to select CSV or JSON file
                </span>
                <span className="text-xs text-slate-500 block mt-1">
                  Expected format: companyName, jobRole, recruitmentYear, annualCtc, etc.
                </span>
                <input
                  type="file"
                  accept=".csv,.json"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {file && (
                <div className="mt-3 p-2 bg-white rounded-lg border border-slate-200 inline-flex items-center gap-2 text-xs font-semibold text-slate-800">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </div>
              )}
            </div>

            {/* Quick Sample Button */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-600">Want to test without a file?</span>
              <button
                type="button"
                onClick={handleLoadSampleBatch}
                disabled={loading}
                className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-800 font-semibold rounded-lg border border-slate-300 shadow-xs flex items-center gap-1 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Import Official Sample Batch</span>
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!file || loading}
                className="px-5 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{loading ? 'Processing Import...' : 'Upload & Validate'}</span>
              </button>
            </div>
          </form>
        ) : (
          /* Import Summary Results */
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
              <h4 className="font-bold text-sm text-emerald-900 mb-2 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> Import Batch Processed Successfully
              </h4>
              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                <div className="bg-white p-2 rounded-lg border border-emerald-200">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Accepted for Verification</div>
                  <div className="text-lg font-black text-emerald-700">{importSummary.importedCount}</div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-emerald-200">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Duplicates Ignored</div>
                  <div className="text-lg font-black text-amber-700">{importSummary.duplicateCount}</div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-emerald-200">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Rejected (Malformed)</div>
                  <div className="text-lg font-black text-rose-700">{importSummary.rejectedCount}</div>
                </div>
              </div>
            </div>

            {/* Errors / Warnings List */}
            {importSummary.errorsSummary && importSummary.errorsSummary.length > 0 && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 max-h-40 overflow-y-auto">
                <span className="font-bold text-slate-700 block mb-1">Batch Validation Log:</span>
                <ul className="space-y-1 text-slate-600">
                  {importSummary.errorsSummary.map((err: any, idx: number) => (
                    <li key={idx} className="flex items-start gap-1 text-[11px]">
                      <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                      <span>
                        Row {err.row}: {err.error}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-slate-900 text-white font-bold rounded-lg text-xs hover:bg-slate-800"
              >
                Go to Verification Queue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
