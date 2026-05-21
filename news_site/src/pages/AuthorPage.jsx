import React from 'react';
import { useParams } from 'react-router-dom';
import AuthorProfile from '../components/AuthorProfile';

const AuthorPage = () => {
  const { authorName } = useParams();
  
  return (
    <AuthorProfile 
      author={authorName} 
      onBack={() => window.history.back()}
    />
  );
};

export default AuthorPage;