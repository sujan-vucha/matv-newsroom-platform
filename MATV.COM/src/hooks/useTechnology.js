import { useState, useEffect } from 'react';
import { useTechnology } from '../store/technologyStore';

export function useTechnologyData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { fetchTechnologyData } = useTechnology();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      
      const response = await fetchTechnologyData();
      
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

// Hook for getting stories by category
export function useTechnologyByCategory(category) {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { fetchTechnologyData, getStoriesByCategory } = useTechnology();

  useEffect(() => {
    async function loadStories() {
      setLoading(true);
      await fetchTechnologyData();
      const categoryStories = getStoriesByCategory(category);
      setStories(categoryStories);
      setLoading(false);
    }

    if (category) {
      loadStories();
    }
  }, [category]);

  return { stories, loading };
}

// Hook for searching stories by tags
export function useTechnologyByTags(tag) {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { fetchTechnologyData, searchByTags } = useTechnology();

  useEffect(() => {
    async function loadStories() {
      setLoading(true);
      await fetchTechnologyData();
      const taggedStories = searchByTags(tag);
      setStories(taggedStories);
      setLoading(false);
    }

    if (tag) {
      loadStories();
    }
  }, [tag]);

  return { stories, loading };
}

// Hook for trending technology stories
export function useTrendingTechnology() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { fetchTechnologyData, getTrendingStories } = useTechnology();

  useEffect(() => {
    async function loadStories() {
      setLoading(true);
      await fetchTechnologyData();
      const trendingStories = getTrendingStories();
      setStories(trendingStories);
      setLoading(false);
    }

    loadStories();
  }, []);

  return { stories, loading };
}

// Hook for technology statistics
export function useTechnologyStats() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  
  const { fetchTechnologyData, getStats } = useTechnology();

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      await fetchTechnologyData();
      const technologyStats = getStats();
      setStats(technologyStats);
      setLoading(false);
    }

    loadStats();
  }, []);

  return { stats, loading };
}