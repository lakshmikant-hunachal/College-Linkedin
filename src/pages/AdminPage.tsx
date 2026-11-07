import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Upload,
  Clock,
  History,
  AlertCircle,
  CheckCircle,
  FileText,
  Lock,
  Flag,
  Settings,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PlacementImportModal } from '../components/admin/PlacementImportModal';
import { RecordVerificationModal } from '../components/admin/RecordVerificationModal';

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'VERIFICATION' | 'IMPORT' | 'AUDIT' | 'CONFIG'>('VERIFICATION');

  const [pendingRecords, setPendingRecords] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [collegeConfig, setCollegeConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [selectedRecordToVerify, setSelectedRecordToVerify] = useState<any>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'VERIFICATION') {
        const res = await api.get('/admin/pending-verifications');
        if (res.data.success) setPendingRecords(res.data.data);
      } else if (activeTab === 'AUDIT') {
        const res = await api.get('/admin/audit-logs');
        if (res.data.success) setAuditLogs(res.data.data);
      } else if (activeTab === 'CONFIG') {
        const [configRes, reportRes] = await Promise.all([
          api.get('/admin/college-config'),
          api.get('/admin/reports'),
        ]);
        if (configRes.data.success) setCollegeConfig(configRes.data.data);
        if (reportRes.data.success) setReports(reportRes.data.data);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [activeTab]);

  const handleResolveReport = async (reportId: string, removePost: boolean) => {
    try {
      const res = await api.post(`/admin/reports/${reportId}/resolve`, {
        status: 'RESOLVED',
        removePost,
        adminNotes: removePost ? 'Post removed by moderator' : 'Report resolved without removal',
      });
      if (res.data.success) {
        showToast(res.data.message, 'success');
        fetchAdminData();
      }
    } catch {
      showToast('Failed to resolve report', 'error');
    }
  };

  if (!user || (user.role !== 'ADMINISTRATOR' && user.role !== 'PLACEMENT_COORDINATOR')) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-3 shadow-md">
        <Lock className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="font-extrabold text-slate-900 text-lg">Restricted Access Portal</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          The Placement Administration Portal is restricted to authorized BMSCE Placement Coordinators and Administrators.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title & Role Indicator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              Role: {user.role === 'ADMINISTRATOR' ? 'Platform Administrator' : 'Placement Coordinator'}
            </span>
            <span className="text-xs text-slate-400">• BMSCE Placement Cell</span>
          </div>
          <h1 className="font-extrabold text-2xl text-slate-900 tracking-tight mt-1">
            Placement Administration & Verification Console
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={async () => {
              try {
                const res = await api.post('/admin/sync-dataset');
                if (res.data.success) {
                  showToast('Dataset files synchronized with live database', 'success');
                }
              } catch {
                showToast('Failed to sync dataset files', 'error');
              }
            }}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-colors"
            title="Force synchronization between database and campus_connect_dataset CSV files"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Sync Dataset Files</span>
          </button>

          <button
            onClick={() => setImportModalOpen(true)}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Import Official Records</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-slate-200/70 p-1 rounded-2xl mb-6 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('VERIFICATION')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'VERIFICATION' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4 text-brand-600" />
          <span>Verification Queue ({pendingRecords.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('IMPORT')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'IMPORT' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Upload className="w-4 h-4 text-emerald-600" />
          <span>Import Workflow & Guide</span>
        </button>

        <button
          onClick={() => setActiveTab('AUDIT')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'AUDIT' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <History className="w-4 h-4 text-purple-600" />
          <span>Audit Trail</span>
        </button>

        <button
          onClick={() => setActiveTab('CONFIG')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'CONFIG' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Settings className="w-4 h-4 text-slate-600" />
          <span>Policy & Moderation</span>
        </button>
      </div>

      {/* Tab 1: Verification Queue */}
      {activeTab === 'VERIFICATION' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Pending Placement Verification Queue</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Records uploaded via data import or submitted for placement verification. Explicit review required before appearing in official verified statistics.
              </p>
            </div>
            <button
              onClick={fetchAdminData}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
              title="Refresh Queue"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading verification queue...</div>
          ) : pendingRecords.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
              <h4 className="font-bold text-sm text-slate-800">Verification Queue is Clear</h4>
              <p className="text-xs text-slate-500">
                All uploaded records have been reviewed. Use the Import button to upload a new batch.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">Job Role</th>
                    <th className="py-3 px-4">Drive Year</th>
                    <th className="py-3 px-4">Opportunity</th>
                    <th className="py-3 px-4">Reported CTC</th>
                    <th className="py-3 px-4">Source / Batch</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{r.companyName}</td>
                      <td className="py-3 px-4 font-semibold text-slate-700">{r.jobRole}</td>
                      <td className="py-3 px-4 font-medium text-slate-600">{r.recruitmentYear}</td>
                      <td className="py-3 px-4 font-medium text-slate-600">{r.employmentType}</td>
                      <td className="py-3 px-4 font-bold text-brand-700">
                        {r.annualCtc ? `₹ ${(r.annualCtc / 100000).toFixed(2)} LPA` : r.internshipStipend ? `₹ ${r.internshipStipend}/mo` : '-'}
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px] truncate max-w-xs">{r.dataSource}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedRecordToVerify(r)}
                          className="px-3 py-1 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-lg text-xs shadow-xs transition-colors"
                        >
                          Review & Verify
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Import Workflow & Guide */}
      {activeTab === 'IMPORT' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-brand-600" />
              Real College Placement Data Import Workflow
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Campus Connect enables official BMSCE placement drives to supersede the synthetic test dataset without code changes or database rebuilds.
            </p>

            <ol className="space-y-2 text-xs text-slate-700 list-decimal list-inside font-medium bg-slate-50 p-4 rounded-xl border border-slate-200">
              <li>Upload a CSV or JSON file formatted with college placement fields.</li>
              <li>The system validates required fields and computes duplicates automatically.</li>
              <li>Missing fields or malformed records are flagged in a validation log.</li>
              <li>Accepted records are saved with status <span className="font-bold text-brand-800">PENDING_VERIFICATION</span>.</li>
              <li>An authorized coordinator completes explicit review in the Verification Queue.</li>
              <li>Verified records instantly update the official BMSCE placement charts!</li>
            </ol>

            <button
              onClick={() => setImportModalOpen(true)}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" /> Open Import Modal
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              Supported File Headers & Format
            </h3>
            <p className="text-xs text-slate-600">
              Ensure your CSV file contains the following column headers:
            </p>

            <div className="p-3 bg-slate-950 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto">
              companyName,companyCategory,recruitmentYear,academicYear,jobRole,employmentType,eligibleDepartments,annualCtc,fixedCompensation,variableCompensation,compensationNotes,dataSource
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-tight text-[11px]">
                <strong>Duplicate Protection:</strong> Rows with identical company, job role, recruitment year, and academic year are automatically flagged to prevent skewed college statistics.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Audit Trail */}
      {activeTab === 'AUDIT' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">Governance & Administrative Audit Trail</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Immutable log of data imports, record verification changes, and administrative actions with user attribution.
            </p>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading audit trail...</div>
          ) : auditLogs.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">No audit logs recorded yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Performed By</th>
                    <th className="py-3 px-4">Entity</th>
                    <th className="py-3 px-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-brand-700">{log.performedBy}</td>
                      <td className="py-3 px-4 text-slate-500">{log.entityType}</td>
                      <td className="py-3 px-4 text-[11px] text-slate-600 truncate max-w-xs">
                        {typeof log.details === 'object' ? JSON.stringify(log.details) : log.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Policy & Moderation */}
      {activeTab === 'CONFIG' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email Domain Allowlist */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-slate-600" />
              College Email Domain Policy
            </h3>
            <p className="text-xs text-slate-600">
              Only student accounts ending with approved institutional domains can register on Campus Connect.
            </p>

            {collegeConfig && (
              <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">College Institution</span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{collegeConfig.collegeName}</div>
                </div>

                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Approved Domains</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {collegeConfig.allowedEmailDomains.map((d: string, i: number) => (
                      <span key={i} className="px-2.5 py-1 bg-white font-mono font-bold text-brand-700 rounded border border-slate-200 shadow-2xs">
                        @{d}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center gap-2 text-emerald-700 font-semibold">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Strict Domain Validation Active
                </div>
              </div>
            )}
          </div>

          {/* Reported Content Moderation */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Flag className="w-5 h-5 text-rose-600" />
              Content Moderation Queue ({reports.length})
            </h3>
            <p className="text-xs text-slate-600">
              Reports filed by students regarding inaccurate placement posts, harassment, or impersonation.
            </p>

            {reports.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 italic bg-slate-50 rounded-xl border border-slate-200">
                No open content reports. Community standards are maintained!
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((rep) => (
                  <div key={rep.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                    <div className="font-bold text-slate-900 text-xs">Reason: {rep.reason}</div>
                    {rep.reportedPost && (
                      <div className="p-2 bg-white rounded border border-slate-200 text-slate-700">
                        <strong className="block text-slate-900">{rep.reportedPost.title}</strong>
                        <p className="line-clamp-2 text-slate-500 mt-0.5">{rep.reportedPost.content}</p>
                      </div>
                    )}
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => handleResolveReport(rep.id, false)}
                        className="px-2.5 py-1 bg-slate-200 text-slate-700 font-semibold rounded hover:bg-slate-300"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => handleResolveReport(rep.id, true)}
                        className="px-2.5 py-1 bg-rose-600 text-white font-semibold rounded hover:bg-rose-500"
                      >
                        Remove Post
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <PlacementImportModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImportSuccess={fetchAdminData}
      />

      <RecordVerificationModal
        record={selectedRecordToVerify}
        onClose={() => setSelectedRecordToVerify(null)}
        onVerified={fetchAdminData}
      />
    </div>
  );
};
