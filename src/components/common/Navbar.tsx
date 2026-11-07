import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Users,
  MessageSquare,
  FileText,
  Compass,
  Building2,
  Briefcase,
  BookOpen,
  User as UserIcon,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  Search,
  UserCheck,
  ChevronDown,
  Lock,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const { user, logout, switchAccount } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminCodeInput, setAdminCodeInput] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/companies?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleRoleSwitch = async (role: UserRole, roleName: string, code?: string) => {
    try {
      await switchAccount(role, code);
      setSwitcherOpen(false);
      setAdminModalOpen(false);
      setAdminCodeInput('');
      showToast(`Switched active account to ${roleName}`, 'info');
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to switch account', 'error');
    }
  };

  const handleAdminSwitchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminCodeInput.trim() !== '2028') {
      showToast('Invalid Admin Security Code! Passcode 2028 is required for Admin access.', 'error');
      return;
    }
    handleRoleSwitch('ADMINISTRATOR', 'Dr. Ramesh K. (Admin)', '2028');
  };

  const navLinks = [
    { name: 'Feed', path: '/', icon: Home },
    { name: 'My Network', path: '/network', icon: Users },
    { name: 'Messages', path: '/messages', icon: MessageSquare },
    { name: 'ExNote', path: '/exnote', icon: FileText, highlight: true },
    { name: 'Roadmaps', path: '/roadmaps', icon: Compass },
    { name: 'Companies', path: '/companies', icon: Building2 },
    { name: 'Placements', path: '/placements', icon: Briefcase },
    { name: 'Resources', path: '/resources', icon: BookOpen },
  ];

  const isAdminOrCoordinator = user?.role === 'ADMINISTRATOR' || user?.role === 'PLACEMENT_COORDINATOR';

  return (
    <nav className="sticky top-0 z-40 bg-navy-900 border-b border-navy-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white font-black text-xl shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                CC
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight tracking-tight text-white flex items-center gap-1.5">
                  Campus Connect
                  <span className="text-[10px] font-semibold uppercase bg-brand-500/20 text-brand-300 px-1.5 py-0.5 rounded border border-brand-400/30">
                    BMSCE
                  </span>
                </span>
                <span className="text-[11px] text-slate-400 hidden sm:inline leading-none mt-0.5">
                  BMS College of Engineering
                </span>
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-xs lg:max-w-sm relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search companies, roles, skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-navy-950/80 border border-navy-700 rounded-lg pl-9 pr-3 py-1.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            />
          </form>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex flex-col items-center justify-center px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all relative ${
                    isActive
                      ? 'text-brand-400 bg-white/5 border-b-2 border-brand-500'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="relative">
                    <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />
                    {link.highlight && (
                      <span className="absolute -top-1 -right-2 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                    )}
                  </div>
                  <span>{link.name}</span>
                </Link>
              );
            })}

            {isAdminOrCoordinator && (
              <Link
                to="/admin"
                className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  location.pathname === '/admin'
                    ? 'text-amber-400 bg-white/5 border-b-2 border-amber-500'
                    : 'text-amber-300 hover:text-amber-200 hover:bg-white/5'
                }`}
              >
                <ShieldCheck className="w-4 h-4 mb-0.5 text-amber-400" />
                <span>Admin</span>
              </Link>
            )}
          </div>

          {/* Test Switcher & Profile Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Quick Test Account Switcher - Only Student & Admin */}
            <div className="relative">
              <button
                onClick={() => setSwitcherOpen(!switcherOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-navy-800 hover:bg-navy-700 text-slate-200 border border-navy-600 transition-colors shadow-sm"
                title="Switch between Student and Admin accounts"
              >
                <UserCheck className="w-3.5 h-3.5 text-brand-400" />
                <span className="hidden xl:inline text-slate-400">Role:</span>
                <span className="font-semibold text-white">
                  {user?.role === 'ADMINISTRATOR' ? 'Admin' : 'Student'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {switcherOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-navy-900 border border-navy-700 rounded-xl shadow-2xl py-2 z-50 animate-fade-in text-xs">
                  <div className="px-3 py-1.5 font-semibold text-slate-400 border-b border-navy-800 flex items-center justify-between">
                    <span>Role Switcher</span>
                    <span className="text-[10px] text-slate-500">Student & Admin</span>
                  </div>

                  {/* Student Option */}
                  <button
                    onClick={() => handleRoleSwitch('STUDENT', 'Priya Patel (Student)')}
                    className="w-full text-left px-3 py-2.5 hover:bg-navy-800 flex items-center justify-between text-slate-200 transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        <span>Priya Patel</span>
                        <span className="text-[9px] bg-brand-500/20 text-brand-300 px-1 py-0.2 rounded font-mono">Student</span>
                      </div>
                      <div className="text-[11px] text-slate-400">Pre-final Year CSE Student</div>
                    </div>
                    {user?.role === 'STUDENT' && <span className="text-emerald-400 font-bold">Active</span>}
                  </button>

                  {/* Admin Option - Requires 2028 passcode */}
                  <button
                    onClick={() => {
                      setSwitcherOpen(false);
                      setAdminModalOpen(true);
                    }}
                    className="w-full text-left px-3 py-2.5 hover:bg-navy-800 flex items-center justify-between text-slate-200 transition-colors border-t border-navy-800/60"
                  >
                    <div>
                      <div className="font-semibold text-rose-300 flex items-center gap-1.5">
                        <Lock className="w-3 h-3 text-rose-400" />
                        <span>Dr. Ramesh K.</span>
                        <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1 py-0.2 rounded font-mono">Admin</span>
                      </div>
                      <div className="text-[11px] text-slate-400">Chief Placement Officer (Passcode: 2028)</div>
                    </div>
                    {user?.role === 'ADMINISTRATOR' ? (
                      <span className="text-emerald-400 font-bold">Active</span>
                    ) : (
                      <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Admin Security Passcode Modal */}
            {adminModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-navy-900 border border-navy-700 rounded-2xl p-5 max-w-sm w-full shadow-2xl text-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                        <Lock className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-sm text-white">Admin Security Passcode</h3>
                    </div>
                    <button
                      onClick={() => {
                        setAdminModalOpen(false);
                        setAdminCodeInput('');
                      }}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Access to Administrator persona (Dr. Ramesh K.) is restricted. Enter authorized security passcode <span className="font-bold text-amber-300 font-mono">2028</span> to proceed:
                  </p>

                  <form onSubmit={handleAdminSwitchSubmit} className="space-y-3">
                    <input
                      type="password"
                      maxLength={6}
                      placeholder="Enter Admin Code (2028)"
                      value={adminCodeInput}
                      onChange={(e) => setAdminCodeInput(e.target.value)}
                      className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-center text-lg font-mono tracking-widest text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
                      autoFocus
                      required
                    />

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setAdminModalOpen(false);
                          setAdminCodeInput('');
                        }}
                        className="flex-1 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-xs text-slate-300 font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs text-white font-bold shadow-md shadow-rose-600/30"
                      >
                        Verify & Switch
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-lg hover:bg-navy-800 transition-colors border border-transparent hover:border-navy-700"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center font-bold text-sm text-white">
                    {user.fullName?.charAt(0) || 'U'}
                  </div>
                  <div className="text-left hidden xl:block">
                    <div className="text-xs font-semibold text-white leading-tight">{user.fullName}</div>
                    <div className="text-[10px] text-slate-400 leading-none">{user.department}</div>
                  </div>
                </Link>

                <button
                  onClick={logout}
                  title="Sign out"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-navy-800 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white rounded-lg hover:bg-navy-800 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-lg shadow transition-colors"
                >
                  Join BMSCE
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white hover:bg-navy-800 rounded-lg focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-navy-950 border-b border-navy-800 px-4 pt-3 pb-5 space-y-3">
          <form onSubmit={handleSearch} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search companies, skills, roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-navy-900 border border-navy-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </form>

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive ? 'bg-brand-600/20 text-brand-400 border border-brand-500/30' : 'text-slate-300 hover:bg-navy-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}

            {isAdminOrCoordinator && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Console</span>
              </Link>
            )}

            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-navy-800"
            >
              <UserIcon className="w-4 h-4" />
              <span>My Profile</span>
            </Link>
          </div>

          <div className="pt-2 border-t border-navy-800 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              Logged in as <strong className="text-white">{user?.fullName || 'Guest'}</strong>
            </div>
            {user && (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-rose-400 hover:underline flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
