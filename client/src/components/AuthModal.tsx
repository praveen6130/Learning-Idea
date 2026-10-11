import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Sparkles, 
  Lock, 
  Mail, 
  User, 
  Phone,
  GraduationCap, 
  ShieldAlert, 
  ArrowRight,
  ShieldCheck,
  KeyRound,
  CheckCircle
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { login, register, forgotPassword } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [requestedRole, setRequestedRole] = useState<'student' | 'admin'>('student');
  const [bio, setBio] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [unregisteredEmail, setUnregisteredEmail] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setUnregisteredEmail(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        if (!email.trim() || !password) {
          throw new Error('Please enter both your email and password.');
        }
        await login(email.trim(), password);
        onClose();
      } else if (mode === 'register') {
        if (!name.trim() || !email.trim() || !password || !phoneNumber.trim()) {
          throw new Error('Please fill out all required fields including phone number.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }
        await register(name.trim(), email.trim(), password, phoneNumber.trim(), requestedRole, bio.trim());
        onClose();
      } else if (mode === 'forgot') {
        if (!email.trim() || !phoneNumber.trim() || !newPassword) {
          throw new Error('Please fill in your registered email, phone number, and new password.');
        }
        if (newPassword.length < 6) {
          throw new Error('New password must be at least 6 characters long.');
        }
        if (newPassword !== confirmPassword) {
          throw new Error('The new passwords do not match. Please re-enter.');
        }
        await forgotPassword(email.trim(), phoneNumber.trim(), newPassword);
        setSuccessMessage('Password reset successfully! You can now log in with your new password.');
        setPassword('');
        setMode('login');
      }
    } catch (err: any) {
      if (err.code === 'USER_NOT_FOUND' || err.status === 404 || (err.message && err.message.toLowerCase().includes('not registered'))) {
        setUnregisteredEmail(email.trim());
      } else {
        setErrorMessage(err.message || 'Operation failed. Please verify your details.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="double-bezel-card max-w-md w-full relative">
        <div className="double-bezel-inner p-6 sm:p-8 space-y-5 text-left">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Brand Header */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-base text-white tracking-tight">CognitiveForge AI</span>
              <div className="text-[11px] text-gray-400">Autonomous Video Learning Hub</div>
            </div>
          </div>

          {/* Tab Switch (Login vs Register) */}
          {mode !== 'forgot' && (
            <div className="grid grid-cols-2 p-1 bg-[#07090e] rounded-xl text-xs font-semibold border border-white/[0.06]">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`py-2 rounded-lg transition-all ${
                  mode === 'login'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`py-2 rounded-lg transition-all ${
                  mode === 'register'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Request Access
              </button>
            </div>
          )}

          {/* Mode Heading for Forgot Password */}
          {mode === 'forgot' && (
            <div className="pb-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm mb-1">
                <KeyRound className="w-4 h-4 text-indigo-400" />
                <span>Reset Forgotten Password</span>
              </div>
              <p className="text-xs text-gray-400">
                Verify your identity with your registered phone number to set a new password.
              </p>
            </div>
          )}

          {/* Unregistered Email Warning Banner */}
          {unregisteredEmail ? (
            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs space-y-2.5">
              <div className="font-bold flex items-center gap-1.5 text-amber-300">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Email Not Registered!</span>
              </div>
              <p className="leading-relaxed text-gray-300">
                The email <span className="font-semibold text-white underline">{unregisteredEmail}</span> is not registered yet. Please register your account first, and then try to login.
              </p>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMessage(null);
                  setUnregisteredEmail(null);
                }}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-[0.98]"
              >
                <span>Click Here to Register First</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : errorMessage ? (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
              {errorMessage}
            </div>
          ) : null}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* REGISTER: Name */}
            {mode === 'register' && (
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full bg-[#07090e] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Email field */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@gmail.com"
                  className="w-full bg-[#07090e] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Phone Number Field (Register & Forgot) */}
            {(mode === 'register' || mode === 'forgot') && (
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Phone Number (for identity & reset) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. +1 555-019-2834 or 9876543210"
                    className="w-full bg-[#07090e] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <p className="text-[10px] text-gray-500 mt-1">
                  {mode === 'forgot'
                    ? 'Must match the phone number you registered with.'
                    : 'Used to securely reset your password if forgotten.'}
                </p>
              </div>
            )}

            {/* Password (Login & Register) */}
            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Password *
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setErrorMessage(null);
                        setSuccessMessage(null);
                      }}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#07090e] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* New Password & Confirm (Forgot mode) */}
            {mode === 'forgot' && (
              <>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    New Password (min 6 characters) *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password..."
                      className="w-full bg-[#07090e] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password..."
                      className="w-full bg-[#07090e] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Register: Role & Bio */}
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Request Access As
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRequestedRole('student')}
                      className={`p-2 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                        requestedRole === 'student'
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                          : 'bg-[#07090e] border-white/10 text-gray-400'
                      }`}
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>Student</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRequestedRole('admin')}
                      className={`p-2 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                        requestedRole === 'admin'
                          ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                          : 'bg-[#07090e] border-white/10 text-gray-400'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Instructor (Admin)</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Learning Intent (Optional)
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us what courses you want to learn..."
                    rows={2}
                    className="w-full bg-[#07090e] border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2 text-[11px] text-amber-300">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Approval Notice: Your registration will be reviewed and approved by the Administrator/Host before platform access is granted.
                  </span>
                </div>
              </>
            )}

            {/* Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all mt-2 active:scale-[0.98]"
            >
              {isLoading ? (
                <span>Processing...</span>
              ) : mode === 'login' ? (
                <>
                  <span>Sign In to Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              ) : mode === 'register' ? (
                <>
                  <span>Submit Registration for Approval</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>Verify Phone & Reset Password</span>
                  <KeyRound className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            {/* Back link in forgot mode */}
            {mode === 'forgot' && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Return to Sign In
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
