import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, ShieldCheck, UserCheck, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const { login, switchAccount } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [showAdminCodeInput, setShowAdminCodeInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [quickAdminCode, setQuickAdminCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password, adminCode.trim() || undefined);
      showToast('Welcome back to Campus Connect!', 'success');
      navigate('/');
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Invalid email or password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStudentLogin = async () => {
    setLoading(true);
    try {
      await switchAccount('STUDENT');
      showToast('Signed in as Priya Patel (Student)', 'success');
      navigate('/');
    } catch {
      showToast('Student quick login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quickAdminCode.trim() !== '2028') {
      showToast('Invalid Admin Security Code! Passcode 2028 is required for Admin access.', 'error');
      return;
    }
    setLoading(true);
    try {
      await switchAccount('ADMINISTRATOR', '2028');
      showToast('Signed in as Dr. Ramesh K. (Administrator)', 'success');
      setAdminModalOpen(false);
      navigate('/admin');
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Admin quick login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-lg shadow-brand-500/20">
            CC
          </div>
          <h1 className="font-extrabold text-2xl text-slate-900 tracking-tight">
            Sign In to Campus Connect
          </h1>
          <p className="text-xs text-slate-500">
            Exclusive to BMS College of Engineering (BMSCE), Bengaluru
          </p>
        </div>

        {/* 1-Click Fast Login Personas - Strictly Student & Admin */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-4 rounded-2xl border border-blue-200/80 shadow-xs space-y-2.5 text-xs">
          <div className="flex items-center justify-between font-bold text-slate-900">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>Instant Access Personas</span>
            </div>
            <span className="text-[10px] text-brand-700 bg-brand-100/70 px-2 py-0.5 rounded font-medium">
              Student & Admin
            </span>
          </div>
          <p className="text-[11px] text-slate-600">
            Choose your portal role to evaluate the platform immediately:
          </p>
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            {/* Student Persona */}
            <button
              type="button"
              disabled={loading}
              onClick={handleQuickStudentLogin}
              className="p-3 rounded-xl bg-white border border-blue-200 text-left hover:border-brand-500 hover:shadow-xs transition-all group"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Student Role</span>
              </div>
              <div className="font-bold text-slate-900 text-xs group-hover:text-brand-600 transition-colors">
                Priya Patel
              </div>
              <div className="text-[10px] text-slate-500">6th Sem CSE • Pre-final Year</div>
            </button>

            {/* Admin Persona - Requires 2028 */}
            <button
              type="button"
              disabled={loading}
              onClick={() => setAdminModalOpen(true)}
              className="p-3 rounded-xl bg-white border border-rose-200 text-left hover:border-rose-500 hover:shadow-xs transition-all group"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span className="text-[10px] uppercase font-bold text-rose-600 tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Admin (2028)
                </span>
              </div>
              <div className="font-bold text-slate-900 text-xs group-hover:text-rose-600 transition-colors">
                Dr. Ramesh K.
              </div>
              <div className="text-[10px] text-slate-500">Chief Placement Officer</div>
            </button>
          </div>
        </div>

        {/* Regular Sign In Form */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">BMSCE Email Address</label>
              <input
                type="email"
                placeholder="name@bmsce.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                required
              />
            </div>

            {/* Admin Code Toggle / Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <button
                  type="button"
                  onClick={() => setShowAdminCodeInput(!showAdminCodeInput)}
                  className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{showAdminCodeInput ? 'Hide Admin Passcode Field' : 'Logging in as Administrator? Enter Code'}</span>
                </button>
              </div>

              {showAdminCodeInput && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1.5 animate-fade-in">
                  <label className="block text-[11px] font-bold text-rose-900">
                    Admin Security Passcode (Code: 2028)
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    placeholder="Enter 2028 for Admin role"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-rose-300 bg-white font-mono tracking-widest text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                  <p className="text-[10px] text-rose-700">
                    Required for BMSCE Administrator and Placement Coordinator accounts.
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            </button>
          </form>

          {/* Quick Admin Code Modal */}
          {adminModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-slate-200 text-slate-900 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">Admin Security Passcode</h3>
                  </div>
                  <button
                    onClick={() => {
                      setAdminModalOpen(false);
                      setQuickAdminCode('');
                    }}
                    className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Administrator access for <strong>Dr. Ramesh K.</strong> requires the 4-digit college admin security passcode <span className="font-bold font-mono text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">2028</span>.
                </p>

                <form onSubmit={handleQuickAdminLoginSubmit} className="space-y-3">
                  <input
                    type="password"
                    maxLength={6}
                    placeholder="Enter Code: 2028"
                    value={quickAdminCode}
                    onChange={(e) => setQuickAdminCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-center text-lg font-mono tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    autoFocus
                    required
                  />

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAdminModalOpen(false);
                        setQuickAdminCode('');
                      }}
                      className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs text-white font-bold shadow-md shadow-rose-600/30"
                    >
                      {loading ? 'Verifying...' : 'Verify & Enter'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-brand-600 hover:underline">
              Register with BMSCE ID
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
