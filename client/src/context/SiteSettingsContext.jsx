import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { siteSettingsService } from '../services/api';

const SiteSettingsContext = createContext();

const CACHE_KEY = 'cached_chinmaya_site_is_live';

const getInitialLiveStatus = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached !== null) {
      return JSON.parse(cached);
    }
  } catch (_) {}
  return true; // Default optimistic true while fetching
};

export const SiteSettingsProvider = ({ children }) => {
  const [isLive, setIsLive] = useState(getInitialLiveStatus);
  const [loading, setLoading] = useState(() => {
    try {
      return localStorage.getItem(CACHE_KEY) === null;
    } catch (_) {
      return false;
    }
  });
  const [error, setError] = useState(null);

  const fetchSiteStatus = useCallback(async () => {
    try {
      const response = await siteSettingsService.getStatus();
      if (response && response.data) {
        const live = Boolean(response.data.isLive);
        setIsLive(live);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(live));
        } catch (_) {}
      }
      setError(null);
    } catch (err) {
      console.warn('[SiteSettings] Failed to fetch site status, using default:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSiteStatus();
    // Safety fallback: Never hang on full-screen loader for more than 1.5s
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [fetchSiteStatus]);

  const toggleLive = async () => {
    try {
      const response = await siteSettingsService.toggleStatus();
      if (response && response.data) {
        const live = Boolean(response.data.isLive);
        setIsLive(live);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(live));
        } catch (_) {}
        return live;
      }
    } catch (err) {
      console.error('[SiteSettings] Failed to toggle live status:', err);
      throw err;
    }
  };

  const updateLive = async (status) => {
    try {
      const response = await siteSettingsService.updateStatus(status);
      if (response && response.data) {
        const live = Boolean(response.data.isLive);
        setIsLive(live);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(live));
        } catch (_) {}
        return live;
      }
    } catch (err) {
      console.error('[SiteSettings] Failed to update live status:', err);
      throw err;
    }
  };

  return (
    <SiteSettingsContext.Provider
      value={{
        isLive,
        loading,
        error,
        refreshSiteStatus: fetchSiteStatus,
        toggleLive,
        updateLive,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};
