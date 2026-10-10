import React, { useState, useEffect } from 'react';
import { settingsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Key, 
  Settings, 
  Save, 
  Sparkles, 
  ShieldCheck, 
  Volume2, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { isAdmin } = useAuth();
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [hasExistingKey, setHasExistingKey] = useState(false);
  const [maskedKey, setMaskedKey] = useState('');
  const [requireApproval, setRequireApproval] = useState(true);
  const [platformName, setPlatformName] = useState('CognitiveForge AI Learning Hub');
  const [aiVoice, setAiVoice] = useState('Nova (Warm AI Educator)');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const fetchSettings = async () => {
      try {
        const res = await settingsApi.getSettings();
        if (res.settings) {
          setHasExistingKey(res.settings.hasGeminiApiKey);
          setMaskedKey(res.settings.geminiApiKeyMasked || '');
          setRequireApproval(res.settings.requireApproval ?? true);
          setPlatformName(res.settings.platformName || 'CognitiveForge AI Learning Hub');
          setAiVoice(res.settings.aiVoice || 'Nova (Warm AI Educator)');
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      }
    };
    fetchSettings();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);

    try {
      const payload: any = {
        requireApproval,
        platformName,
        aiVoice
      };
      if (geminiApiKey.trim()) {
        payload.geminiApiKey = geminiApiKey.trim();
      }

      await settingsApi.updateSettings(payload);
      setStatusMessage('Settings saved successfully!');
      setTimeout(() => setStatusMessage(null), 3000);
      setGeminiApiKey('');
    } catch (err: any) {
      setStatusMessage(err.message || 'Failed to update settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
            <Settings className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white">Platform & AI Settings</h3>
            <p className="text-[11px] text-gray-400">Configure AI models, Host policies and voice synthesis</p>
          </div>
        </div>

        {statusMessage && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{statusMessage}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {/* Gemini API Key */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-blue-400" />
                <span>Google Gemini API Key</span>
              </label>
              {hasExistingKey && (
                <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  Active ({maskedKey})
                </span>
              )}
            </div>

            <input
              type="password"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              placeholder={hasExistingKey ? "Enter new API key to replace current" : "AIzaSy..."}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 font-mono"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Optional. If not provided, the platform uses its high-fidelity dynamic generative engine that produces roadmaps & videos out of the box!
            </p>
          </div>

          {/* Voice Personality */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Default AI Video Voice
            </label>
            <select
              value={aiVoice}
              onChange={(e) => setAiVoice(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            >
              <option value="Nova (Warm AI Educator)">Nova (Warm & Engaging Educator)</option>
              <option value="Orion (Deep Tech Lead)">Orion (Deep Tech Architect)</option>
              <option value="Echo (Analytical Guide)">Echo (Analytical & Concise)</option>
            </select>
          </div>

          {/* Gatekeeper policy */}
          {isAdmin && (
            <div className="pt-2 border-t border-gray-800/80">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Require Host Approval</div>
                  <div className="text-[11px] text-gray-400">
                    Students cannot use the platform until Host approves their account
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={requireApproval}
                  onChange={(e) => setRequireApproval(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
