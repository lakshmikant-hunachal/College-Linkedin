import React, { useState, useEffect } from 'react';
import { Building2, Search, Briefcase, Filter, ExternalLink, Award, Info, Code, Layers } from 'lucide-react';
import { api } from '../services/api';
import { Company, JobRole } from '../types';
import { CompanyCard } from '../components/companies/CompanyCard';
import { CompanyDetailModal } from '../components/companies/CompanyDetailModal';
import { JobRoleDetailModal } from '../components/companies/JobRoleDetailModal';

export const CompaniesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'COMPANIES' | 'ROLES'>('COMPANIES');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [jobRoles, setJobRoles] = useState<JobRole[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedRoleCategory, setSelectedRoleCategory] = useState<string>('ALL');

  // Modals
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedRole, setSelectedRole] = useState<JobRole | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'COMPANIES') {
        const params: any = {};
        if (selectedCategory !== 'ALL') params.category = selectedCategory;
        if (search.trim()) params.search = search.trim();

        const [compRes, catRes] = await Promise.all([
          api.get('/companies', { params }),
          api.get('/companies/categories'),
        ]);

        if (compRes.data.success) setCompanies(compRes.data.data);
        if (catRes.data.success) setCategories(catRes.data.data);
      } else {
        const params: any = {};
        if (selectedRoleCategory !== 'ALL') params.category = selectedRoleCategory;

        const res = await api.get('/companies/job-roles', { params });
        if (res.data.success) setJobRoles(res.data.data);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, selectedCategory, selectedRoleCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-extrabold text-2xl text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-7 h-7 text-brand-600" />
            Companies & Career Blueprints
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Explore company categories, verified campus recruiters, and step-by-step role blueprints for engineering placements.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-xl text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveTab('COMPANIES')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'COMPANIES' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Companies Directory
          </button>
          <button
            onClick={() => setActiveTab('ROLES')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'ROLES' ? 'bg-white text-brand-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Job Roles Taxonomy
          </button>
        </div>
      </div>

      {/* Accuracy & Integrity Alert Banner */}
      <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-xs text-blue-900 mb-6 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed text-[11px]">
          <strong>Factual Recruitment Information Policy:</strong> Technical skill requirements and interview stages are documented as standard industry practices. Specific companies are designated as active BMSCE recruiters only when verified by official college records.
        </p>
      </div>

      {activeTab === 'COMPANIES' ? (
        <>
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 space-y-3">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by company name, industry, or description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50"
                />
              </form>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`px-3 py-1 rounded-full font-semibold shrink-0 transition-all ${
                  selectedCategory === 'ALL'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-3 py-1 rounded-full font-semibold shrink-0 transition-all ${
                    selectedCategory === cat.name
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Companies Grid */}
          {loading ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400">
              Loading companies directory...
            </div>
          ) : companies.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500">
              No companies found matching the selected filter criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {companies.map((company) => (
                <CompanyCard
                  key={company.id}
                  company={company}
                  onSelect={(comp) => setSelectedCompany(comp)}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        /* Job Roles Taxonomy Tab */
        <div className="space-y-6">
          {/* Role Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {['ALL', 'Software Engineering', 'Data and AI', 'Infrastructure and Security'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedRoleCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full font-semibold shrink-0 transition-all ${
                  selectedRoleCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'All Engineering Domains' : cat}
              </button>
            ))}
          </div>

          {/* Roles Cards Grid */}
          {loading ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400">
              Loading job roles taxonomy...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {jobRoles.map((role) => (
                <div
                  key={role.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-brand-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                        {role.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{role.averageExperienceLevel}</span>
                    </div>

                    <h3 className="font-extrabold text-base text-slate-900 mb-1.5">{role.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                      {role.description}
                    </p>

                    {/* Required Skills chips */}
                    <div className="mb-4">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Core Competencies
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {role.requiredSkills.slice(0, 4).map((s, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-slate-50 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-medium"
                          >
                            {s}
                          </span>
                        ))}
                        {role.requiredSkills.length > 4 && (
                          <span className="text-[10px] text-slate-400 px-1 py-0.5">
                            +{role.requiredSkills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">
                      {role.learningSequence.length} Preparation Steps
                    </span>
                    <button
                      onClick={() => setSelectedRole(role)}
                      className="px-3 py-1.5 bg-brand-50 hover:bg-brand-600 text-brand-700 hover:text-white rounded-lg text-xs font-bold transition-all border border-brand-200 hover:border-brand-600"
                    >
                      View Role Blueprint
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <CompanyDetailModal
        company={selectedCompany}
        onClose={() => setSelectedCompany(null)}
      />

      <JobRoleDetailModal
        role={selectedRole}
        onClose={() => setSelectedRole(null)}
      />
    </div>
  );
};
