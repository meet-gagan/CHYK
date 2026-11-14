import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { marathonSiteSettingsService } from '../services/api';

const MarathonSiteSettingsContext = createContext();

const CACHE_KEY = 'cached_marathon_site_is_live';

const getInitialLiveStatus = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached !== null) {
      return JSON.parse(cached);
    }
  } catch (_) {}
  return true; // Default optimistic true while fetching
};

export const MarathonSiteSettingsProvider = ({ children }) => {
  const [isLive, setIsLive] = useState(getInitialLiveStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSiteStatus = useCallback(async () => {
    try {
      const response = await marathonSiteSettingsService.getStatus();
      if (response && response.data) {
        const live = Boolean(response.data.isLive);
        setIsLive(live);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(live));
        } catch (_) {}
      }
      setError(null);
    } catch (err) {
      console.warn('[MarathonSiteSettings] Failed to fetch marathon site status, using default:', err);
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
      const response = await marathonSiteSettingsService.toggleStatus();
      if (response && response.data) {
        const live = Boolean(response.data.isLive);
        setIsLive(live);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(live));
        } catch (_) {}
        return live;
      }
    } catch (err) {
      console.error('[MarathonSiteSettings] Failed to toggle live status:', err);
      throw err;
    }
  };

  const updateLive = async (status) => {
    try {
      const response = await marathonSiteSettingsService.updateStatus(status);
      if (response && response.data) {
        const live = Boolean(response.data.isLive);
        setIsLive(live);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(live));
        } catch (_) {}
        return live;
      }
    } catch (err) {
      console.error('[MarathonSiteSettings] Failed to update live status:', err);
      throw err;
    }
  };

  return (
    <MarathonSiteSettingsContext.Provider
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
    </MarathonSiteSettingsContext.Provider>
  );
};

export const useMarathonSiteSettings = () => {
  const context = useContext(MarathonSiteSettingsContext);
  if (!context) {
    throw new Error('useMarathonSiteSettings must be used within a MarathonSiteSettingsProvider');
  }
  return context;
};

export default MarathonSiteSettingsContext;
