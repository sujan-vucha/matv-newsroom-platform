import { useState, useEffect } from 'react';
import { useCommunity } from '../store/communityStore';

export function useCommunityData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { fetchCommunityData } = useCommunity();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      
      const response = await fetchCommunityData();
      
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
export function useCommunityByCategory(category) {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { fetchCommunityData, getStoriesByCategory } = useCommunity();

  useEffect(() => {
    async function loadStories() {
      setLoading(true);
      await fetchCommunityData();
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
export function useCommunityByTags(tag) {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { fetchCommunityData, searchByTags } = useCommunity();

  useEffect(() => {
    async function loadStories() {
      setLoading(true);
      await fetchCommunityData();
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