import express from 'express';
import { getSettings, updateSettings } from '../db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

// Get platform settings
router.get('/', (req, res) => {
  try {
    const settings = getSettings();
    // Mask API key for security
    const maskedKey = settings.geminiApiKey
      ? `${settings.geminiApiKey.slice(0, 4)}...${settings.geminiApiKey.slice(-4)}`
      : '';

    res.json({
      settings: {
        ...settings,
        hasGeminiApiKey: !!settings.geminiApiKey,
        geminiApiKeyMasked: maskedKey
      }
    });
  } catch (err) {
    console.error('Fetch settings error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to retrieve settings' });
  }
});

// Update settings (Admin / Host only)
router.post('/', requireAdmin, (req, res) => {
  try {
    const { geminiApiKey, requireApproval, platformName, aiVoice } = req.body;
    const updates = {};

    if (geminiApiKey !== undefined) updates.geminiApiKey = geminiApiKey.trim();
    if (requireApproval !== undefined) updates.requireApproval = !!requireApproval;
    if (platformName !== undefined) updates.platformName = platformName.trim();
    if (aiVoice !== undefined) updates.aiVoice = aiVoice;

    const updated = updateSettings(updates);

    res.json({
      message: 'Settings updated successfully',
      settings: {
        ...updated,
        hasGeminiApiKey: !!updated.geminiApiKey,
        geminiApiKeyMasked: updated.geminiApiKey
          ? `${updated.geminiApiKey.slice(0, 4)}...${updated.geminiApiKey.slice(-4)}`
          : ''
      }
    });
  } catch (err) {
    console.error('Update settings error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to update settings' });
  }
});

export default router;
