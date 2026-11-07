import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import {
  Building2,
  Users,
  Award,
  TrendingUp,
  AlertTriangle,
  Briefcase,
  DollarSign,
  Info,
} from 'lucide-react';

interface Props {
  isDemoMode: boolean;
  verifiedStats: any;
  demoStats: any;
  emptyStateMessage: string | null;
}

const CATEGORY_COLORS = ['#2563eb', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
const EMP_COLORS = ['#3b82f6', '#10b981'];

export const AnalyticsDashboard: React.FC<Props> = ({
  isDemoMode,
  verifiedStats,
  demoStats,
  emptyStateMessage,
}) => {
  const activeStats = isDemoMode ? demoStats : verifiedStats;

  // Format LPA numbers
  const formatLPA = (amount?: number | null) => {
    if (!amount) return 'N/A';
    return `₹ ${(amount / 100000).toFixed(1)} LPA`;
  };

  if (!isDemoMode && !verifiedStats) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-sm mb-6">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-brand-600 flex items-center justify-center mx-auto">
          <Info className="w-8 h-8" />
        </div>
        <div className="max-w-md mx-auto space-y-2">
          <h3 className="font-extrabold text-lg text-slate-900">Official Placement Statistics</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            {emptyStateMessage ||
              'Verified placement data has not been added yet. The sample records shown in this section are for demonstration purposes only.'}
          </p>
        </div>
        <div className="inline-flex items-center gap-2 p-3 bg-amber-50 text-amber-900 rounded-xl text-xs font-medium border border-amber-200 max-w-lg text-left">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            <strong>Zero-Fabrication Policy:</strong> Official BMSCE statistics are populated only when placement coordinators import verified drive spreadsheets. Toggle to <em>Demo Data Exploration Mode</em> to view charts with realistic synthetic data.
          </span>
        </div>
      </div>
    );
  }

  if (!activeStats) return null;

  const empTypeData = [
    { name: 'Full-Time', value: activeStats.fullTimeCount || 0 },
    { name: 'Internship', value: activeStats.internshipCount || 0 },
  ];

  return (
    <div className="space-y-6 mb-8">
      {/* Mode Indicator Banner */}
      {isDemoMode && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5 text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-950 uppercase tracking-wide">
                Demo Analytics Mode Active (Synthetic Test Dataset)
              </span>
              <p className="text-amber-800 text-[11px] mt-0.5">
                The analytics cards and visualizations below are generated strictly from the 50+ synthetic development records. They do not represent actual college recruitment outcomes.
              </p>
            </div>
          </div>
          <span className="inline-block px-2.5 py-1 rounded-full font-bold bg-amber-200 text-amber-900 shrink-0 border border-amber-300">
            SYNTHETIC SAMPLE
          </span>
        </div>
      )}

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Records */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {isDemoMode ? 'Demo Records' : 'Verified Drives'}
            </span>
            <Briefcase className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {isDemoMode ? activeStats.totalDemoRecords : activeStats.totalVerifiedRecords}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Recruitment opportunities</div>
        </div>

        {/* Companies Represented */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Companies</span>
            <Building2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{activeStats.companiesRepresented}</div>
          <div className="text-[11px] text-slate-400 mt-1">Across 7 industry categories</div>
        </div>

        {/* Highest Compensation */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {isDemoMode ? 'Sample Max CTC' : 'Highest CTC'}
            </span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-brand-700">
            {formatLPA(activeStats.highestAnnualCtc)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Annual Cost-to-Company</div>
        </div>

        {/* Average Compensation */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {isDemoMode ? 'Sample Avg CTC' : 'Average CTC'}
            </span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {formatLPA(activeStats.averageAnnualCtc)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Disclosed CTC packages</div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Company Category Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-sm text-slate-900">Distribution by Company Category</h4>
            <span className="text-xs text-slate-400">Categories</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeStats.byCategory} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {activeStats.byCategory.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Job Role Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-sm text-slate-900">Opportunities by Job Role</h4>
            <span className="text-xs text-slate-400">Roles</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={activeStats.byJobRole.slice(0, 6)}
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 10, fill: '#334155' }}
                  width={110}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Recruitment Trends by Year */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-sm text-slate-900">Recruitment Volume by Year</h4>
            <span className="text-xs text-slate-400">2023 - 2026</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activeStats.byYear} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#2563eb' }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Full-Time vs Internship Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-sm text-slate-900">Employment Type Breakdown</h4>
            <span className="text-xs text-slate-400">Full-Time vs Internship</span>
          </div>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={empTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {empTypeData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={EMP_COLORS[index % EMP_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
