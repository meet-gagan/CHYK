import MarathonSiteSettings from '../models/MarathonSiteSettings.js';

/**
 * Helper to ensure a marathon site settings document exists in the DB.
 */
const getOrCreateMarathonSettings = async () => {
  let settings = await MarathonSiteSettings.findOne({ key: 'marathon' });
  if (!settings) {
    settings = await MarathonSiteSettings.create({
      key: 'marathon',
      isLive: true, // Default to true so existing live visitors aren't blocked until explicitly changed in DB
    });
  }
  return settings;
};

/**
 * GET /api/marathon-site-settings (and /api/marathon-site-status)
 * Public endpoint returning ONLY isLive status for marathon portal.
 */
export const getMarathonSiteSettings = async (req, res) => {
  try {
    const settings = await getOrCreateMarathonSettings();
    return res.status(200).json({
      success: true,
      isLive: Boolean(settings.isLive),
    });
  } catch (error) {
    console.error('[MarathonSiteSettings] Error fetching settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve marathon site settings',
      error: error.message,
    });
  }
};

/**
 * PUT /api/marathon-site-settings (and POST /api/marathon-site-settings)
 * Update isLive status for marathon portal.
 */
export const updateMarathonSiteSettings = async (req, res) => {
  try {
    const { isLive } = req.body;
    let settings = await getOrCreateMarathonSettings();

    if (typeof isLive === 'boolean' || isLive === 'true' || isLive === 'false') {
      settings.isLive = isLive === true || isLive === 'true';
    }

    await settings.save();
    console.log(`[MarathonSiteSettings] Marathon isLive updated to: ${settings.isLive}`);

    return res.status(200).json({
      success: true,
      message: `Marathon site status updated. isLive is now ${settings.isLive}`,
      isLive: settings.isLive,
    });
  } catch (error) {
    console.error('[MarathonSiteSettings] Error updating settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update marathon site settings',
      error: error.message,
    });
  }
};

/**
 * POST /api/marathon-site-settings/toggle
 * Toggle isLive between true and false for marathon portal.
 */
export const toggleMarathonSiteSettings = async (req, res) => {
  try {
    const settings = await getOrCreateMarathonSettings();
    settings.isLive = !settings.isLive;
    await settings.save();

    console.log(`[MarathonSiteSettings] Marathon isLive toggled to: ${settings.isLive}`);

    return res.status(200).json({
      success: true,
      message: `Toggled marathon site status. isLive is now ${settings.isLive}`,
      isLive: settings.isLive,
    });
  } catch (error) {
    console.error('[MarathonSiteSettings] Error toggling settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to toggle marathon site settings',
      error: error.message,
    });
  }
};

