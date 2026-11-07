import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Filter,
  Search,
  Building,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Eye,
  SlidersHorizontal,
  ChevronDown,
  ArrowUpDown,
  Download,
} from 'lucide-react';
import { api } from '../services/api';
import { PlacementRecord } from '../types';
import { AnalyticsDashboard } from '../components/placements/AnalyticsDashboard';
import { RecordDetailModal } from '../components/placements/RecordDetailModal';
import { DemoDataBadge } from '../components/common/DemoDataBadge';

export const PlacementsPage: React.FC = () => {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true); // default to demo mode in dev so the 52 synthetic records are explorable
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [records, setRecords] = useState<PlacementRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<PlacementRecord | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [jobRole, setJobRole] = useState('ALL');
  const [year, setYear] = useState('ALL');
  const [employmentType, setEmploymentType] = useState('ALL');
  const [sortBy, setSortBy] = useState('recruitmentYear');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchPlacementData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Analytics
      const analyticsRes = await api.get('/placements/analytics', {
        params: { includeDemoSample: 'true' },
      });
      if (analyticsRes.data.success) {
        setAnalyticsData(analyticsRes.data);
      }

      // 2. Fetch Placement Records
      const params: any = {
        includeDemo: isDemoMode ? 'true' : 'false',
        verificationStatus: isDemoMode ? 'ALL' : 'VERIFIED',
        sortBy,
        sortOrder,
      };

      if (category !== 'ALL') params.category = category;
      if (jobRole !== 'ALL') params.jobRole = jobRole;
      if (year !== 'ALL') params.recruitmentYear = year;
      if (employmentType !== 'ALL') params.employmentType = employmentType;
      if (search.trim()) params.search = search.trim();

      const recordsRes = await api.get('/placements', { params });
      if (recordsRes.data.success) {
        setRecords(recordsRes.data.data);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlacementData();
  }, [isDemoMode, category, jobRole, year, employmentType, sortBy, sortOrder]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPlacementData();
  };

  const formatLPA = (amount?: number | null) => {
    if (!amount) return '-';
    return `₹ ${(amount / 100000).toFixed(1)} L`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Title & Mode Toggle Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-extrabold text-2xl text-slate-900 tracking-tight flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-brand-600" />
            BMSCE Placement Records & Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Structured records of campus recruitment drives, verified compensation breakdowns, and hiring criteria.
          </p>
        </div>

        {/* Mode Switcher Toggle */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200/90 shadow-sm shrink-0">
          <span className="text-xs font-bold text-slate-700 ml-1">Data Mode:</span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setIsDemoMode(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                !isDemoMode
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Official Verified Data
            </button>
            <button
              onClick={() => setIsDemoMode(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                isDemoMode
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Demo Exploration Mode
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Dashboard (Recharts + Cards + Zero-Fabrication Protection) */}
      <AnalyticsDashboard
        isDemoMode={isDemoMode}
        verifiedStats={analyticsData?.verifiedStats}
        demoStats={analyticsData?.demoStats}
        emptyStateMessage={analyticsData?.emptyStateMessage}
      />

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by company, role, or skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50"
            />
          </form>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs">
            {/* Category Filter */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="text-xs p-2 rounded-xl border border-slate-200 focus:ring-1 focus:ring-brand-500 bg-slate-50 font-medium"
            >
              <option value="ALL">All Categories</option>
              <option value="Product-Based">Product-Based</option>
              <option value="Fintech">Fintech</option>
              <option value="AI & ML">AI & ML</option>
              <option value="Startups">Startups</option>
              <option value="Service-Based">Service-Based</option>
              <option value="Cloud & Infrastructure">Cloud & Infra</option>
              <option value="Data & Analytics">Data & Analytics</option>
            </select>

            {/* Role Filter */}
            <select
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              className="text-xs p-2 rounded-xl border border-slate-200 focus:ring-1 focus:ring-brand-500 bg-slate-50 font-medium"
            >
              <option value="ALL">All Job Roles</option>
              <option value="Software Development Engineer">SDE</option>
              <option value="Backend Developer">Backend Dev</option>
              <option value="Frontend Developer">Frontend Dev</option>
              <option value="Full-Stack Developer">Full-Stack Dev</option>
              <option value="Data Analyst">Data Analyst</option>
              <option value="Machine Learning Engineer">ML Engineer</option>
              <option value="Cloud Engineer">Cloud Engineer</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
            </select>

            {/* Year Filter */}
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="text-xs p-2 rounded-xl border border-slate-200 focus:ring-1 focus:ring-brand-500 bg-slate-50 font-medium"
            >
              <option value="ALL">All Years</option>
              <option value="2026">2026 Drive</option>
              <option value="2025">2025 Drive</option>
              <option value="2024">2024 Drive</option>
              <option value="2023">2023 Drive</option>
            </select>

            {/* Employment Type */}
            <select
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              className="text-xs p-2 rounded-xl border border-slate-200 focus:ring-1 focus:ring-brand-500 bg-slate-50 font-medium"
            >
              <option value="ALL">All Opportunity Types</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Internship">Internship</option>
              <option value="Internship + PPO">Internship + PPO</option>
            </select>
          </div>
        </div>
      </div>

      {/* Placement Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-slate-900">Placement Records Archive</h3>
            <span className="text-xs text-slate-500">({records.length} records found)</span>
          </div>
          {isDemoMode && (
            <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Showing Synthetic Demo Dataset
            </span>
          )}
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading placement records...</div>
        ) : records.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Building className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-sm text-slate-800">No records found</h4>
            <p className="text-xs text-slate-500">
              {isDemoMode
                ? 'Try broadening your filters above.'
                : 'No official verified records match the filter. Switch to Demo Exploration Mode to preview synthetic data.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Company & Category</th>
                  <th className="py-3 px-4">Job Role</th>
                  <th className="py-3 px-4">Year</th>
                  <th className="py-3 px-4">Opportunity Type</th>
                  <th className="py-3 px-4">Compensation</th>
                  <th className="py-3 px-4">Verification</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{r.companyName}</div>
                      <span className="text-[10px] text-slate-400 font-medium">{r.companyCategory}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{r.jobRole}</td>
                    <td className="py-3 px-4 font-medium text-slate-600">{r.recruitmentYear}</td>
                    <td className="py-3 px-4 font-medium text-slate-600">{r.employmentType}</td>
                    <td className="py-3 px-4">
                      {r.isSalaryAvailable ? (
                        r.annualCtc ? (
                          <div>
                            <div className="font-bold text-brand-700">{formatLPA(r.annualCtc)} CTC</div>
                            {r.fixedCompensation && (
                              <div className="text-[10px] text-slate-400">Fixed: {formatLPA(r.fixedCompensation)}</div>
                            )}
                          </div>
                        ) : r.internshipStipend ? (
                          <div className="font-bold text-emerald-700">
                            ₹ {r.internshipStipend.toLocaleString('en-IN')}/mo
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Disclosed</span>
                        )
                      ) : (
                        <span className="text-slate-400 italic">Undisclosed</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <DemoDataBadge status={r.verificationStatus} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedRecord(r)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-brand-600 hover:text-white bg-brand-50 hover:bg-brand-600 rounded-md transition-colors border border-brand-200 hover:border-brand-600 inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Details Modal */}
      <RecordDetailModal
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />
    </div>
  );
};
