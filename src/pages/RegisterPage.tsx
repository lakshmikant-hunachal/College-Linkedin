import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, ShieldCheck, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [collegeId, setCollegeId] = useState('');
  const [department, setDepartment] = useState('CSE');
  const [currentSemester, setCurrentSemester] = useState(6);
  const [graduationYear, setGraduationYear] = useState(2026);
  const [password, setPassword] = useState('');
  const [headline, setHeadline] = useState('');
  const [skillsStr, setSkillsStr] = useState('React, TypeScript, Data Structures');
  const [role, setRole] = useState<'STUDENT' | 'ADMINISTRATOR'>('STUDENT');
  const [adminCode, setAdminCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (role === 'ADMINISTRATOR' && adminCode.trim() !== '2028') {
      showToast('Admin Security Passcode 2028 is required for Administrator registration.', 'error');
      return;
    }

    setLoading(true);

    const skills = skillsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      await register({
        fullName,
        email: email.trim(),
        collegeId: collegeId.trim().toUpperCase(),
        department,
        currentSemester: Number(currentSemester),
        graduationYear: Number(graduationYear),
        password,
        headline: headline.trim() || `${department} Student @ BMSCE`,
        skills,
        role,
        adminCode: role === 'ADMINISTRATOR' ? adminCode.trim() : undefined,
      });

      showToast('Registration successful! Welcome to Campus Connect.', 'success');
      navigate('/');
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full space-y-6">
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white font-black text-xl flex items-center justify-center mx-auto shadow-md">
            CC
          </div>
          <h1 className="font-extrabold text-2xl text-slate-900 tracking-tight">
            Create BMSCE Student Account
          </h1>
          <p className="text-xs text-slate-500">
            Join the exclusive professional network for BMS College of Engineering
          </p>
        </div>

        {/* College Email Policy Alert */}
        <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-tight">
            <strong>BMSCE Verification Policy:</strong> To maintain an exclusive, trustworthy campus ecosystem, registration requires a valid college email address ending with <span className="font-bold text-brand-700">@bmsce.ac.in</span> and your College USN.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm text-xs">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Priya Patel"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-brand-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">BMSCE Email (@bmsce.ac.in)</label>
                <input
                  type="email"
                  placeholder="yourname@bmsce.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-brand-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">College USN / Identifier</label>
                <input
                  type="text"
                  placeholder="1BM22CS089"
                  value={collegeId}
                  onChange={(e) => setCollegeId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-brand-500 uppercase font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Account Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="STUDENT">Student</option>
                  <option value="ADMINISTRATOR">Administrator</option>
                </select>
              </div>
            </div>

            {/* Admin Passcode requirement if registering as Administrator */}
            {role === 'ADMINISTRATOR' && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl space-y-1.5 animate-fade-in">
                <div className="flex items-center gap-1.5 font-bold text-rose-900 text-xs">
                  <ShieldCheck className="w-4 h-4 text-rose-600" />
                  <span>Admin Security Passcode (Code: 2028 Required)</span>
                </div>
                <input
                  type="password"
                  maxLength={6}
                  placeholder="Enter Security Code (2028)"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-rose-300 bg-white font-mono tracking-widest text-slate-900 focus:ring-2 focus:ring-rose-500 font-bold"
                  required
                />
                <p className="text-[11px] text-rose-700">
                  College security passcode <code className="font-bold bg-white px-1 rounded border border-rose-200">2028</code> is mandatory to activate an Administrator account.
                </p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
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
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      Semester {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Graduation</label>
                <input
                  type="number"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Professional Headline</label>
              <input
                type="text"
                placeholder="e.g. Pre-final year CSE @ BMSCE | Full Stack & Cloud Enthusiast"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Technical Skills (comma-separated)</label>
              <input
                type="text"
                placeholder="Java, Python, React, SQL, DSA"
                value={skillsStr}
                onChange={(e) => setSkillsStr(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-brand-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-brand-600 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
