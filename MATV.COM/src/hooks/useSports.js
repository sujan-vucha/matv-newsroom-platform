import { useState, useEffect } from 'react';
import { useSports } from '../store/sportsStore';

export function useSportsData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { fetchSportsData } = useSports();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      
      const response = await fetchSportsData();
      
      if (response.data && !response.error) {
        setData(response.data);
      } else {
        setError(response.error);
        setData(response.data);
      }
      
      setLoading(false);
    }

    loadData();
  }, []);

  const refetch = async () => {
    await loadData();
  };

  return { data, loading, error, refetch };
}

// Hook for getting news by category
export function useSportsByCategory(category) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { fetchSportsData, getNewsByCategory } = useSports();

  useEffect(() => {
    async function loadNews() {
      setLoading(true);
      await fetchSportsData();
      const categoryNews = getNewsByCategory(category);
      setNews(categoryNews);
      setLoading(false);
    }

    if (category) {
      loadNews();
    }
  }, [category]);

  return { news, loading };
}

// Hook for live scores with real-time updates
export function useLiveScores() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { fetchSportsData, getLiveScores, updateLiveScores } = useSports();

  useEffect(() => {
    async function loadScores() {
      setLoading(true);
      await fetchSportsData();
      const liveScores = getLiveScores();
      setScores(liveScores);
      setLoading(false);
    }

    loadScores();

    // Update live scores every 30 seconds
    const interval = setInterval(() => {
      updateLiveScores();
      const updatedScores = getLiveScores();
      setScores([...updatedScores]);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return { scores, loading };
}

// Hook for searching sports news by tags
export function useSportsByTags(tag) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { fetchSportsData, searchByTags } = useSports();

  useEffect(() => {
    async function loadNews() {
      setLoading(true);
      await fetchSportsData();
      const taggedNews = searchByTags(tag);
      setNews(taggedNews);
      setLoading(false);
    }

    if (tag) {
      loadNews();
    }
  }, [tag]);

  return { news, loading };
}

// Hook for sports statistics
export function useSportsStats() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  
  const { fetchSportsData, getStats } = useSports();

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      await fetchSportsData();
      const sportsStats = getStats();
      setStats(sportsStats);
      setLoading(false);
    }

    loadStats();
  }, []);

  return { stats, loading };
}