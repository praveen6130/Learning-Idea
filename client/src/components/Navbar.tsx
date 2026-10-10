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
  UserPlus
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

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-gray-950/80 border-b border-gray-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentTab('courses')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                CognitiveForge
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                AI ACADEMY
              </span>
            </div>
            <p className="text-xs text-gray-400 hidden sm:block">Autonomous AI Roadmaps & Interactive Video Masterclasses</p>
          </div>
        </div>

        {/* Center Navigation Links (Admin Panel ONLY visible to Admin or Host!) */}
        <nav className="flex items-center gap-2">
          <button
            onClick={() => setCurrentTab('courses')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              currentTab === 'courses'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Courses & Roadmaps</span>
          </button>

          {/* ADMIN PANEL: STRICTLY VISIBLE ONLY TO ADMIN OR HOST */}
          {isAdmin && (
            <button
              onClick={() => setCurrentTab('admin')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                currentTab === 'admin'
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Admin Panel</span>
              {isHost && (
                <span className="text-[10px] bg-purple-500/30 text-purple-200 px-1 rounded font-bold">
                  HOST
                </span>
              )}
            </button>
          )}
        </nav>

        {/* Right Area: User Status & Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Persona Switcher: ONLY VISIBLE TO HOST, NEVER VISIBLE TO STUDENTS! */}
          {isHost && (
            <div className="relative">
              <button
                onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 border border-purple-700/60 text-xs font-medium text-purple-300 transition-colors"
                title="Host Demo Tool: Test Student and Admin view"
              >
                <Users className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden md:inline">Host Switcher:</span>
                <span className="font-semibold text-white truncate max-w-[110px]">
                  {user ? user.name.split(' ')[0] : 'Host'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {showPersonaMenu && (
                <div 
                  className="absolute right-0 mt-2 w-72 rounded-xl bg-gray-900 border border-gray-700/80 shadow-2xl p-2 z-50 text-xs text-gray-200"
                  onMouseLeave={() => setShowPersonaMenu(false)}
                >
                  <div className="px-2 py-1.5 border-b border-gray-800 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    Host Persona Switcher (For Testing)
                  </div>

                  <button
                    onClick={() => {
                      switchPersona('host');
                      setShowPersonaMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-gray-800/80 flex items-center justify-between group mt-1"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                        👑
                      </div>
                      <div>
                        <div className="font-semibold text-purple-300">Platform Host (You)</div>
                        <div className="text-[11px] text-gray-400">host@learningidea.com</div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-purple-900/40 text-purple-300 px-1.5 py-0.5 rounded border border-purple-600/30">
                      Host
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      switchPersona('student-approved');
                      setShowPersonaMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-gray-800/80 flex items-center justify-between group mt-1"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                        🎓
                      </div>
                      <div>
                        <div className="font-semibold text-emerald-300">Alex Chen (Student)</div>
                        <div className="text-[11px] text-gray-400">Approved Student View</div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-900/40 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-600/30">
                      Student
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      switchPersona('student-pending');
                      setShowPersonaMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-gray-800/80 flex items-center justify-between group mt-1"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                        ⏳
                      </div>
                      <div>
                        <div className="font-semibold text-amber-300">Sarah Jenkins (Student)</div>
                        <div className="text-[11px] text-gray-400">Pending Approval View</div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-amber-900/40 text-amber-300 px-1.5 py-0.5 rounded border border-amber-600/30">
                      Pending
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* User Status / Profile Pill */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-900 border border-gray-800 text-xs">
                {isApproved ? (
                  <span className="flex items-center gap-1 text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="capitalize">{user.name} ({user.role})</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{user.name} (Pending Approval)</span>
                  </span>
                )}
              </div>

              {/* Settings button */}
              <button
                onClick={onOpenSettings}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors"
                title="Settings & Audio"
              >
                <SettingsIcon className="w-4 h-4" />
              </button>

              {/* Logout button */}
              <button
                onClick={logout}
                className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold border border-gray-700 flex items-center gap-1.5 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 text-blue-400" />
                <span>Sign In</span>
              </button>

              <button
                onClick={() => onOpenAuth('register')}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Request Access</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
