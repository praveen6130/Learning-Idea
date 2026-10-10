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
  Mail
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
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-gray-900/90 border border-gray-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Badge */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Access Gatekeeper Active
            </span>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-gray-400">
            Account Status: {user?.status?.toUpperCase()}
          </span>
        </div>

        {/* Hero Alert Icon */}
        <div className="flex flex-col items-center text-center">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-xl ${
            isRejected 
              ? 'bg-red-500/10 border border-red-500/30 text-red-400' 
              : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
          }`}>
            {isRejected ? (
              <AlertOctagon className="w-10 h-10 animate-pulse" />
            ) : (
              <Lock className="w-10 h-10 animate-bounce" />
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            {isRejected ? 'Application Not Approved' : 'Approval Required'}
          </h2>

          <p className="text-gray-300 text-sm sm:text-base max-w-lg mb-6 leading-relaxed">
            {isRejected ? (
              <>
                Your application for <span className="font-semibold text-white">{user?.email}</span> was reviewed and declined. Reason: {user?.rejectionReason || 'Criteria not met.'}
              </>
            ) : (
              <>
                Welcome, <span className="font-semibold text-white">{user?.name}</span>. This AI learning platform requires administrator authorization. <span className="text-amber-300 font-semibold">You cannot search courses, generate roadmaps, or watch AI videos</span> until an administrator or host approves your account.
              </>
            )}
          </p>

          {/* User details badge */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400 bg-gray-950/60 px-4 py-2 rounded-xl border border-gray-800 mb-8">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>{user?.email}</span>
            </span>
            {user?.phoneNumber && (
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{user.phoneNumber}</span>
              </span>
            )}
            <span className="capitalize font-semibold text-purple-300">
              Requested: {user?.role}
            </span>
          </div>
        </div>

        {/* Timeline Status Box */}
        <div className="bg-gray-950/70 border border-gray-800/80 rounded-2xl p-5 mb-8">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            Verification Status
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Step 1 */}
            <div className="p-3.5 rounded-xl bg-gray-900 border border-emerald-500/30 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-emerald-300">1. Account Registered</div>
                <div className="text-[11px] text-gray-400 truncate">Details saved</div>
              </div>
            </div>

            {/* Step 2 */}
            <div className={`p-3.5 rounded-xl bg-gray-900 border flex items-start gap-3 ${
              isRejected ? 'border-red-500/30' : 'border-amber-500/40 glow-box'
            }`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                isRejected ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-300'
              }`}>
                <Clock className="w-4 h-4 animate-spin" />
              </div>
              <div>
                <div className={`text-xs font-semibold ${isRejected ? 'text-red-300' : 'text-amber-300'}`}>
                  {isRejected ? '2. Review Declined' : '2. Awaiting Approval'}
                </div>
                <div className="text-[11px] text-gray-400 capitalize">Role: {user?.role}</div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 rounded-xl bg-gray-900/40 border border-gray-800 flex items-start gap-3 opacity-60">
              <div className="w-6 h-6 rounded-full bg-gray-800 text-gray-500 flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-400">3. AI Platform Access</div>
                <div className="text-[11px] text-gray-500">Locked until approved</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls (NO host buttons shown here!) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-800/80">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/20"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Check Approval Status</span>
          </button>

          <button
            onClick={logout}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-gray-700"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
