import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  LogOut, 
  Settings as SettingsIcon, 
  GraduationCap, 
  Users, 
  ChevronDown,
  LayoutDashboard,
  LogIn,
  UserPlus,
  Menu,
  X,
  Crown
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'courses' | 'admin' | 'roadmap';
  setCurrentTab: (tab: 'courses' | 'admin' | 'roadmap') => void;
  onOpenSettings: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenSettings,
  onOpenAuth,
}) => {
  const { user, isApproved, isAdmin, isHost, logout, switchPersona } = useAuth();
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-2 z-50 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto rounded-2xl glass-pill px-4 sm:px-6 py-2.5 flex items-center justify-between border border-white/[0.08] shadow-2xl backdrop-blur-xl">
        {/* Brand Logo */}
        <div 
          onClick={() => {
            setCurrentTab('courses');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform border border-white/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white group-hover:text-indigo-200 transition-colors">
                CognitiveForge
              </span>
              <span className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-gray-400 hidden md:block tracking-normal">
              Autonomous AI Masterclass Platform
            </p>
          </div>
        </div>

        {/* Center Navigation Links (Admin Panel ONLY visible to Admin or Host) */}
        <nav className="hidden md:flex items-center gap-1.5 bg-gray-950/60 p-1 rounded-xl border border-white/[0.05]">
          <button
            onClick={() => setCurrentTab('courses')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              currentTab === 'courses'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Courses & Roadmaps</span>
          </button>

          {/* ADMIN PANEL: STRICTLY VISIBLE ONLY TO ADMIN OR HOST */}
          {isAdmin && (
            <button
              onClick={() => setCurrentTab('admin')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                currentTab === 'admin'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
              {isHost && (
                <span className="text-[9px] bg-purple-900/60 text-purple-200 px-1 rounded font-bold border border-purple-400/30">
                  HOST
                </span>
              )}
            </button>
          )}
        </nav>

        {/* Right Area: User Status, Host Tool & Profile Actions */}
        <div className="flex items-center gap-2.5">
          {/* Quick Persona Switcher: ONLY VISIBLE TO HOST, NEVER VISIBLE TO STUDENTS */}
          {isHost && (
            <div className="relative">
              <button
                onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/40 border border-purple-500/40 text-xs font-medium text-purple-200 transition-colors"
                title="Host Demo Tool: Test Student and Admin view"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden lg:inline text-[11px] text-gray-300">Test Persona:</span>
                <span className="font-semibold text-white truncate max-w-[90px]">
                  {user ? user.name.split(' ')[0] : 'Host'}
                </span>
                <ChevronDown className="w-3 h-3 text-purple-300" />
              </button>

              {showPersonaMenu && (
                <div 
                  className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#0d121c] border border-white/10 shadow-2xl p-2 z-50 text-xs text-gray-200 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setShowPersonaMenu(false)}
                >
                  <div className="px-2.5 py-1.5 border-b border-white/[0.06] text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Host Persona Switcher (Live Preview)
                  </div>

                  <button
                    onClick={() => {
                      switchPersona('host');
                      setShowPersonaMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-white/[0.06] flex items-center justify-between group mt-1 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs">
                        👑
                      </div>
                      <div>
                        <div className="font-semibold text-white">Platform Host (You)</div>
                        <div className="text-[10px] text-gray-400">host@learningidea.com</div>
                      </div>
                    </div>
                    <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/30 font-bold">
                      Host
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      switchPersona('student-approved');
                      setShowPersonaMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-white/[0.06] flex items-center justify-between group mt-1 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs">
                        🎓
                      </div>
                      <div>
                        <div className="font-semibold text-white">Alex Chen (Student)</div>
                        <div className="text-[10px] text-gray-400">Approved Student View</div>
                      </div>
                    </div>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30 font-bold">
                      Student
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      switchPersona('student-pending');
                      setShowPersonaMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-white/[0.06] flex items-center justify-between group mt-1 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs">
                        ⏳
                      </div>
                      <div>
                        <div className="font-semibold text-white">Sarah Jenkins (Student)</div>
                        <div className="text-[10px] text-gray-400">Pending Approval View</div>
                      </div>
                    </div>
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30 font-bold">
                      Pending
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* User Status / Profile Pill */}
          {user ? (
            <div className="flex items-center gap-1.5">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs">
                {isApproved ? (
                  <span className="flex items-center gap-1 text-emerald-300 font-medium text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="capitalize">{user.name}</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-300 font-medium text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Pending Verification</span>
                  </span>
                )}
              </div>

              {/* Settings button */}
              <button
                onClick={onOpenSettings}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                title="Settings & Audio Voices"
              >
                <SettingsIcon className="w-4 h-4" />
              </button>

              {/* Logout button */}
              <button
                onClick={logout}
                className="p-2 rounded-xl text-gray-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-gray-200 text-xs font-semibold border border-white/[0.08] flex items-center gap-1.5 transition-all"
              >
                <LogIn className="w-3.5 h-3.5 text-indigo-400" />
                <span>Sign In</span>
              </button>

              <button
                onClick={() => onOpenAuth('register')}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Request Access</span>
                <span className="sm:hidden">Join</span>
              </button>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-3 rounded-2xl bg-[#0c1017]/95 border border-white/10 shadow-2xl backdrop-blur-2xl space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <button
            onClick={() => {
              setCurrentTab('courses');
              setMobileMenuOpen(false);
            }}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              currentTab === 'courses' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-white/[0.04]'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Courses & Roadmaps</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => {
                setCurrentTab('admin');
                setMobileMenuOpen(false);
              }}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                currentTab === 'admin' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-white/[0.04]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Admin Management Panel</span>
            </button>
          )}

          {user && (
            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between px-2 text-xs text-gray-400">
              <span className="capitalize">{user.name} ({user.role})</span>
              <button onClick={logout} className="text-rose-400 font-semibold">
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
