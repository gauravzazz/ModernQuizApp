import { useState, useEffect, useCallback } from 'react';
import { UserProfile } from '../types/profile';
import { getUserProfile } from '../services/profileService';

/**
 * Custom hook for fetching and managing user profile data
 * Provides real-time updates when profile data changes
 */
export const useProfileData = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Function to fetch profile data
  const fetchProfileData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const userProfile = await getUserProfile();
      setProfile(userProfile);
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Initial data fetch
  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);
  
  // Function to refresh profile data
  const refreshProfile = useCallback(() => {
    fetchProfileData();
  }, [fetchProfileData]);
  
  return {
    profile,
    loading,
    error,
    refreshProfile
  };
};