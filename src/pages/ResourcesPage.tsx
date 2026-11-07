import React, { useState, useEffect } from 'react';
import { BookOpen, Search, ExternalLink, Tag, CheckCircle2, Bookmark, Code2, Database, Layers, Brain, Terminal } from 'lucide-react';
import { api } from '../services/api';
import { LearningResource } from '../types';

export const ResourcesPage: React.FC = () => {
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (activeCategory !== 'ALL') params.category = activeCategory;
      if (search.trim()) params.search = search.trim();

      const res = await api.get('/resources', { params });
      if (res.data.success) {
        setResources(res.data.data);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [activeCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResources();
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'DSA':
        return Code2;
      case 'Core CS':
        return Database;
      case 'System Design':
        return Layers;
      case 'Machine Learning':
        return Brain;
      default:
        return Terminal;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="mb-6">
        <h1 className="font-extrabold text-2xl text-slate-900 tracking-tight flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-brand-600" />
          Technical Preparation & Learning Resources
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Curated textbooks, problem-solving sheets, and open-source curriculums for BMSCE placement preparation.
        </p>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 space-y-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search resources by title, topic, or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50"
          />
        </form>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'ALL', label: 'All Curriculums' },
            { id: 'DSA', label: 'Data Structures & Algorithms' },
            { id: 'Core CS', label: 'Core CS (OS, DBMS, Networks)' },
            { id: 'System Design', label: 'System Design (HLD & LLD)' },
            { id: 'Web Development', label: 'Full Stack & APIs' },
            { id: 'Machine Learning', label: 'Machine Learning & AI' },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-3 py-1.5 rounded-full font-semibold shrink-0 transition-all ${
                activeCategory === c.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Cards Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400">
          Loading learning resources...
        </div>
      ) : resources.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500">
          No resources found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {resources.map((res) => {
            const Icon = getCategoryIcon(res.category);
            return (
              <div
                key={res.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-200 flex items-center gap-1">
                      <Icon className="w-3 h-3" />
                      {res.category}
                    </span>
                    {res.isOfficialCollegeResource && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> BMSCE Syllabus
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 mb-1.5 leading-snug">{res.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{res.description}</p>

                  {/* Tags */}
                  {res.tags && res.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {res.tags.map((t, idx) => (
                        <span key={idx} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-semibold uppercase">{res.resourceType}</span>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-600 text-brand-700 hover:text-white font-bold text-xs transition-all border border-brand-200 hover:border-brand-600"
                  >
                    <span>Open Resource</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
