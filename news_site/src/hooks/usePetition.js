import { useState, useEffect } from 'react';
import apiService from '../services/api';

export const usePetition = () => {
  const [petition, setPetition] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPetition = async () => {
    try {
      setLoading(true);
      const petitionData = await apiService.getPetition();
      setPetition(petitionData);
      
      // Fetch stats
      const statsData = await apiService.getPetitionStats(petitionData._id);
      setStats(statsData);
      
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching petition:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPetition();
  }, []);

  const refreshStats = async () => {
    if (petition) {
      try {
        const statsData = await apiService.getPetitionStats(petition._id);
        setStats(statsData);
      } catch (err) {
        console.error('Error refreshing stats:', err);
      }
    }
  };

  return {
    petition,
    stats,
    loading,
    error,
    refreshStats,
    refetch: fetchPetition
  };
};

export const useSignPetition = () => {
  const [signing, setSigning] = useState(false);
  const [signError, setSignError] = useState(null);
  const [signSuccess, setSignSuccess] = useState(false);

  const signPetition = async (formData) => {
    try {
      setSigning(true);
      setSignError(null);
      setSignSuccess(false);

      await apiService.signPetition(formData);
      setSignSuccess(true);
      
      return true;
    } catch (err) {
      setSignError(err.message);
      return false;
    } finally {
      setSigning(false);
    }
  };

  const resetSignState = () => {
    setSignError(null);
    setSignSuccess(false);
  };

  return {
    signPetition,
    signing,
    signError,
    signSuccess,
    resetSignState
  };
};