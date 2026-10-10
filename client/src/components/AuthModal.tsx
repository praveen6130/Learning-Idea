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
  CheckCircle,
  HelpCircle
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand header */}
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-base text-white">CognitiveForge AI</span>
            <div className="text-[11px] text-gray-400">Autonomous Video Learning Hub</div>
          </div>
        </div>

        {/* Tab switch (only between login and register) */}
        {mode !== 'forgot' && (
          <div className="grid grid-cols-2 p-1 bg-gray-950 rounded-2xl mb-5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`py-2 rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-gray-800 text-white shadow-sm'
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
              className={`py-2 rounded-xl transition-all ${
                mode === 'register'
                  ? 'bg-gray-800 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Request Access
            </button>
          </div>
        )}

        {/* Mode Heading for Forgot Password */}
        {mode === 'forgot' && (
          <div className="mb-5 pb-3 border-b border-gray-800">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm mb-1">
              <KeyRound className="w-4 h-4" />
              <span>Reset Forgotten Password</span>
            </div>
            <p className="text-xs text-gray-400">
              Verify your identity with your registered phone number to set a new password.
            </p>
          </div>
        )}

        {/* Unregistered email banner / Alerts */}
        {unregisteredEmail ? (
          <div className="p-4 rounded-2xl bg-amber-950/80 border border-amber-500/50 text-amber-200 text-xs mb-4 space-y-2.5">
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
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-gray-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all hover:scale-101"
            >
              <span>Click Here to Register First</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : errorMessage ? (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs mb-4">
            {errorMessage}
          </div>
        ) : null}

        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* ================= REGISTER FIELDS ================= */}
          {mode === 'register' && (
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
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
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Email field (All modes) */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
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
                className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Phone Number Field (Register & Forgot Password modes) */}
          {(mode === 'register' || mode === 'forgot') && (
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Phone Number (for security & reset) *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. +1 555-019-2834 or 9876543210"
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-0.5">
                {mode === 'forgot'
                  ? 'Must match the phone number you registered with.'
                  : 'Used to recover your account if you forget your password.'}
              </p>
            </div>
          )}

          {/* Password (Login & Register modes) */}
          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
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
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* New Password & Confirm (Forgot mode) */}
          {mode === 'forgot' && (
            <>
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
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
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
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
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </>
          )}

          {/* Register: Role & Bio */}
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Request Access As
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRequestedRole('student')}
                    className={`p-2 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                      requestedRole === 'student'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                        : 'bg-gray-950 border-gray-800 text-gray-400'
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
                        : 'bg-gray-950 border-gray-800 text-gray-400'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Instructor (Admin)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Why do you want to join? (Optional)
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us what courses you are interested in learning..."
                  rows={2}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2 text-[11px] text-amber-300">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Approval Notice: Your registration will be reviewed and approved by the Administrator/Host before platform access is granted.
                </span>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all mt-1"
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

          {/* Back to Login link when in Forgot mode */}
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
                ← Back to Sign In
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
