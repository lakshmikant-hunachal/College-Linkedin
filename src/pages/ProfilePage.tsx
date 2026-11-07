import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Edit3,
  Github,
  Linkedin,
  Globe,
  GraduationCap,
  ShieldCheck,
  CheckCircle,
  X,
  Plus,
  Save,
  Award,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [department, setDepartment] = useState('CSE');
  const [currentSemester, setCurrentSemester] = useState(6);
  const [graduationYear, setGraduationYear] = useState(2026);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [isPublicProfile, setIsPublicProfile] = useState(true);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setHeadline(user.headline || '');
      setBio(user.bio || '');
      setDepartment(user.department || 'CSE');
      setCurrentSemester(user.currentSemester || 6);
      setGraduationYear(user.graduationYear || 2026);
      setSkills(user.skills || []);
      setGithubUrl(user.githubUrl || '');
      setLinkedinUrl(user.linkedinUrl || '');
      setPortfolioUrl(user.portfolioUrl || '');
      setIsPublicProfile(user.isPublicProfile !== false);
    }
  }, [user]);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      const res = await api.patch(`/students/${user.id}`, {
        fullName,
        headline,
        bio,
        department,
        currentSemester: Number(currentSemester),
        graduationYear: Number(graduationYear),
        skills,
        githubUrl,
        linkedinUrl,
        portfolioUrl,
        isPublicProfile,
      });

      if (res.data.success) {
        showToast('Profile updated successfully!', 'success');
        await refreshUser();
        setEditModalOpen(false);
      }
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to update profile', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-500 text-xs">
        Please sign in to view your profile.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Cover Banner */}
        <div className="h-36 bg-gradient-to-r from-navy-950 via-navy-900 to-brand-800 relative">
          <div className="absolute right-4 top-4 text-xs font-bold text-white/80 bg-black/20 px-3 py-1 rounded-full backdrop-blur-xs flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
            BMSCE College-Verified Profile
          </div>
        </div>

        <div className="p-6 sm:p-8 pt-0 relative">
          {/* Avatar and Edit Button */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 mb-4">
            <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-brand-700 to-brand-500 text-white font-black text-4xl flex items-center justify-center border-4 border-white shadow-xl shrink-0">
              {user.fullName?.charAt(0) || 'U'}
            </div>

            <button
              onClick={() => setEditModalOpen(true)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-colors self-start sm:self-auto"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>

          {/* Name & Academic Meta */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-extrabold text-2xl text-slate-900">{user.fullName}</h1>
              {user.role === 'SENIOR_ALUMNI' && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  BMSCE Senior Alumni
                </span>
              )}
              {user.role === 'ADMINISTRATOR' && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  Placement Cell Admin
                </span>
              )}
            </div>

            <p className="text-sm font-semibold text-brand-700">{user.headline || 'BMSCE Student'}</p>

            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium pt-1 flex-wrap">
              <span>{user.department} Department</span>
              <span>•</span>
              <span>Semester {user.currentSemester}</span>
              <span>•</span>
              <span>Class of {user.graduationYear}</span>
              {user.collegeId && (
                <>
                  <span>•</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-bold">
                    USN: {user.collegeId}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3 pt-4 mt-4 border-t border-slate-100 text-xs">
            {user.githubUrl && (
              <a
                href={user.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold transition-colors"
              >
                <Github className="w-3.5 h-3.5" /> GitHub
              </a>
            )}
            {user.linkedinUrl && (
              <a
                href={user.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-brand-700 font-semibold transition-colors border border-blue-200"
              >
                <Linkedin className="w-3.5 h-3.5" /> LinkedIn
              </a>
            )}
            {user.portfolioUrl && (
              <a
                href={user.portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold transition-colors"
              >
                <Globe className="w-3.5 h-3.5" /> Portfolio
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Bio / Professional Introduction */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 text-xs space-y-2">
        <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
          Professional Introduction
        </h3>
        <p className="text-slate-600 leading-relaxed text-sm">
          {user.bio || 'Add a professional introduction highlighting your technical interests, coding journey, and career goals.'}
        </p>
      </div>

      {/* Technical Skills */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 text-xs space-y-3">
        <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
          Technical Skills & Proficiencies
        </h3>
        <div className="flex flex-wrap gap-2">
          {user.skills && user.skills.length > 0 ? (
            user.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 font-semibold text-xs border border-blue-200 shadow-2xs"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-slate-400 italic">No skills listed yet. Click Edit Profile to add skills.</span>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-scale-up max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-base text-slate-900">Edit Student Profile</h3>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-1 focus:ring-brand-500 font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Headline</label>
                  <input
                    type="text"
                    placeholder="e.g. Pre-final Year CSE @ BMSCE | Aspiring SDE"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="CSE">CSE</option>
                    <option value="ISE">ISE</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="AI_ML">AI & ML</option>
                    <option value="DATA_SCIENCE">Data Science</option>
                    <option value="MECH">MECH</option>
                    <option value="CIVIL">CIVIL</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Semester</label>
                  <select
                    value={currentSemester}
                    onChange={(e) => setCurrentSemester(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Graduation Year</label>
                  <input
                    type="number"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Professional Introduction (Bio)</label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3 rounded-lg border border-slate-300 focus:ring-1 focus:ring-brand-500 leading-relaxed"
                />
              </div>

              {/* Skills Editor */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Technical Skills</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Type skill and press Add (e.g. React, Docker, Java)"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="flex-1 p-2 rounded-lg border border-slate-300"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded bg-blue-50 text-blue-800 font-semibold border border-blue-200 flex items-center gap-1"
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(s)}
                        className="text-blue-500 hover:text-rose-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Social URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username"
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Portfolio URL</label>
                  <input
                    type="url"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://mywebsite.dev"
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              {/* Privacy Toggle */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Public College Profile</span>
                  <span className="text-slate-500 text-[11px]">Allow fellow BMSCE students to view your profile in the directory</span>
                </div>
                <input
                  type="checkbox"
                  checked={isPublicProfile}
                  onChange={(e) => setIsPublicProfile(e.target.checked)}
                  className="w-4 h-4 text-brand-600 rounded"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{submitting ? 'Saving...' : 'Save Profile'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
