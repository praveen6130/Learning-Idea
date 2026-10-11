import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Clock, 
  RotateCw, 
  Lock, 
  CheckCircle2, 
  AlertOctagon,
  LogOut,
  Phone,
  Mail,
  ShieldAlert
} from 'lucide-react';

export const PendingApprovalView: React.FC = () => {
  const { user, refreshUser, logout } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshUser();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const isRejected = user?.status === 'rejected';

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="double-bezel-card max-w-2xl w-full">
        <div className="double-bezel-inner p-6 sm:p-10 space-y-8 text-left">
          {/* Top Status Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Institutional Gatekeeper Active
              </span>
            </div>
            <span className="text-[11px] px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-gray-300 font-mono">
              Status: {user?.status?.toUpperCase()}
            </span>
          </div>

          {/* Alert Body */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl ${
              isRejected 
                ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400' 
                : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
            }`}>
              {isRejected ? (
                <AlertOctagon className="w-8 h-8" />
              ) : (
                <Lock className="w-8 h-8" />
              )}
            </div>

            <div className="space-y-2 max-w-lg">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {isRejected ? 'Application Not Approved' : 'Host Verification Required'}
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                {isRejected ? (
                  <>
                    Your application for <span className="font-semibold text-white">{user?.email}</span> was reviewed and declined. Reason: {user?.rejectionReason || 'Criteria not met.'}
                  </>
                ) : (
                  <>
                    Welcome, <span className="font-semibold text-white">{user?.name}</span>. This AI learning academy requires administrator authorization. Access to roadmaps and video masterclasses is locked until approved.
                  </>
                )}
              </p>
            </div>

            {/* User Meta Information */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400 bg-[#07090e] px-4 py-2.5 rounded-2xl border border-white/[0.06]">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>{user?.email}</span>
              </span>
              {user?.phoneNumber && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{user.phoneNumber}</span>
                </span>
              )}
              <span className="capitalize font-semibold text-purple-300">
                Role: {user?.role}
              </span>
            </div>
          </div>

          {/* Progression Step Tracker */}
          <div className="space-y-3">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-indigo-400" />
              <span>Verification Milestone Status</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Step 1 */}
              <div className="p-3.5 rounded-2xl bg-[#07090e] border border-emerald-500/30 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-emerald-300">1. Account Registered</div>
                  <div className="text-[10px] text-gray-400">Details encrypted</div>
                </div>
              </div>

              {/* Step 2 */}
              <div className={`p-3.5 rounded-2xl bg-[#07090e] border flex items-start gap-3 ${
                isRejected ? 'border-rose-500/30' : 'border-amber-500/40'
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  isRejected ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div>
                  <div className={`text-xs font-semibold ${isRejected ? 'text-rose-300' : 'text-amber-300'}`}>
                    {isRejected ? '2. Review Declined' : '2. Awaiting Review'}
                  </div>
                  <div className="text-[10px] text-gray-400 capitalize">Role: {user?.role}</div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-3.5 rounded-2xl bg-[#07090e] border border-white/[0.04] flex items-start gap-3 opacity-50">
                <div className="w-6 h-6 rounded-full bg-white/[0.06] text-gray-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-400">3. Platform Access</div>
                  <div className="text-[10px] text-gray-500">Locked until approved</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/[0.06]">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20 active:scale-[0.98]"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Check Verification Status</span>
            </button>

            <button
              onClick={logout}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-white/[0.06]"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
