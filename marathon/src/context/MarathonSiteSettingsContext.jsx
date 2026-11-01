import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { marathonSiteSettingsService } from '../services/api';

const MarathonSiteSettingsContext = createContext();

export const MarathonSiteSettingsProvider = ({ children }) => {
  const [isLive, setIsLive] = useState(true); // Default optimistic true while fetching
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSiteStatus = useCallback(async () => {
    try {
      const response = await marathonSiteSettingsService.getStatus();
      if (response && response.data) {
        setIsLive(Boolean(response.data.isLive));
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
  }, [fetchSiteStatus]);

  const toggleLive = async () => {
    try {
      const response = await marathonSiteSettingsService.toggleStatus();
      if (response && response.data) {
        setIsLive(Boolean(response.data.isLive));
        return response.data.isLive;
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
        setIsLive(Boolean(response.data.isLive));
        return response.data.isLive;
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

