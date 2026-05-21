import { useEffect } from 'react';
import { useAuthorStore } from '../store/authorStore';

export const useAuthor = (authorName) => {
  const {
    currentAuthor,
    loading,
    error,
    fetchAuthorByName,
    fetchAuthorById,
    fetchAuthorArticles,
    followAuthor,
    unfollowAuthor,
    setCurrentAuthor,
    clearError,
  } = useAuthorStore();

  // Fetch author data when authorName changes
  useEffect(() => {

    
    if (authorName && (!currentAuthor || currentAuthor.name !== authorName)) {
      // Fetch author data if not already loaded or if author name changed
      fetchAuthorByName(authorName);
    }
  }, [authorName, currentAuthor, fetchAuthorByName]);

  return {
    // State
    author: currentAuthor,
    loading,
    error,
    
    // Actions
    fetchAuthorByName,
    fetchAuthorById,
    fetchAuthorArticles,
    followAuthor,
    unfollowAuthor,
    setCurrentAuthor,
    clearError,
  };
};