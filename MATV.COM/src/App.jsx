// File: src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React, { useState } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import MainPage from "./components/MainPage";
import UpdateHomepage from "./pages/UpdateHomepage";
import AdminDashboard from "./pages/AdminDashboard";
import UpdateMatv from "./pages/UpdateMatv";
import UpdateDeepDive from "./pages/UpdateDeepDive";
import DeepDiveArticle from "./components/DeepDiveArticle";
import AllVideos from "./components/AllVideos";
import LiveTv from "./components/LiveTv";
import WorldNews from "./components/WorldNews";
import WorldNewsDetail from "./components/WorldNewsDetail";
import UpdateWorldNews from "./pages/UpdateWorldNews";
import UpdateViralNews from "./pages/UpdateViralNews";
import ViralNews from "./components/ViralNews";
import ViralNewsDetail from "./components/ViralNewsDetail";
import UpdateLatestNews from "./pages/UpdateLatestNews";
import LatestNews from "./components/LatestNews";
import LatestNewsDetail from "./components/LatestNewsDetails";
import UpdateIndiaNews from "./pages/UpdateIndiaNews";
import IndiaNews from './components/IndiaNews'
import IndiaNewsDetails from './components/IndiaNewsDetails'
import WebStories from './components/WebStories'
import WebStoriesDetail from './components/WebStoriesDetail'
import UpdateWebStories from './pages/UpdateWebStories'
import ScienceNews from './components/ScienceNews';
import ScienceNewsDetail from './components/ScienceNewsDetail';
import UpdateScienceNews from './pages/UpdateScienceNews';
import Opinion from './components/Opinion';
import OpinionDetail from './components/OpinionDetail';
import UpdateOpinion from './pages/UpdateOpinion';
import Entertainment from './components/Entertainment';
import EntertainmentDetail from './components/EntertainmentDetail';
import UpdateEntertainment from './pages/UpdateEntertainment';
import Defence from './components/Defence';
import DefenceDetail from './components/DefenceDetail';
import UpdateDefence from './pages/UpdateDefence';
import Sportfit from './components/Sportfit';
import SportfitDetail from './components/SportfitDetail';
import UpdateSportfit from './pages/UpdateSportfit';
import Education from './components/Education';
import EducationDetail from './components/EducationDetail';
import UpdateEducation from './pages/UpdateEducation'
import ElectionNews from './components/ElectionNews';
import ElectionNewsDetail from './components/ElectionNewsDetail';
import UpdateElectionNews from './pages/UpdateElectionNews';
import Health from './components/Health';
import HealthDetail from './components/HealthDetail';
import UpdateHealth from './pages/UpdateHealth';
import Tech from './components/Tech';
import TechDetail from './components/TechDetail';
import UpdateTech from './pages/UpdateTech';
import Initiatives from "./components/Initiatives";
import InitiativesDetail from "./components/InitiativesDetail";
import UpdateInitiatives from "./pages/UpdateInitiatives";
import BlogDetail from "./components/BlogDetail";
import ArticleDetail from "./components/ArticleDetail";
import About from "./components/About"
import PetitionForm from "./components/PetitionForm"
import DiasporaSupport from "./components/DiasporaSupport"
import BookRajneeti from "./components/BookRajneeti"



import AuthorProfile from './components/AuthorProfile';
import AuthorPage from './pages/AuthorPage';
import { useNews } from './hooks/useNews';







function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function App() {



const [selectedArticle, setSelectedArticle] = useState(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [showAuthorProfile, setShowAuthorProfile] = useState(false);

  // Use the news store hook
  const { articles, featuredArticle, trendingTopics, loading, error, fetchArticles } = useNews();

  // Force fetch articles if they're empty
  React.useEffect(() => {
    if (articles.length === 0 && !loading) {
      fetchArticles();
    }
  }, [articles.length, loading, fetchArticles]);

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    setIsArticleModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsArticleModalOpen(false);
    setSelectedArticle(null);
  };

  const handleAuthorClick = (authorName) => {
    setSelectedAuthor({ name: authorName });
    setShowAuthorProfile(true);
    setIsArticleModalOpen(false);
  };

  const handleBackToNews = () => {
    setShowAuthorProfile(false);
    setSelectedAuthor(null);
  };

  // Show author profile page
  if (showAuthorProfile) {
    return (
      <AuthorProfile 
        author={selectedAuthor}
        onBack={handleBackToNews}
      />
    );
  }













  return (
    <Router>
      <Header />
      <Routes>
        
        <Route path="/petition" element={<PetitionForm/>} />
        <Route path="/diaspora-support" element={<DiasporaSupport/>} />
        <Route path="/about" element={<About/>}/>
        <Route path="/book-rajneeti" element={<BookRajneeti/>}/>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/deep-dive/:id" element={<DeepDiveArticle />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/articles/:slug" element={<ArticleDetail />} />
        <Route path="/videos" element={<AllVideos />} />
        <Route path="/live" element={<LiveTv />} />
        <Route path="/world" element={<WorldNews />} />
        <Route path="/world/:id" element={<WorldNewsDetail />} />

        <Route path="/viral" element={<ViralNews />} />
        <Route path="/viral/:id" element={<ViralNewsDetail />} />
        
        <Route path="/latest-news" element={<LatestNews />} />
        <Route path="/latest-news/:id" element={<LatestNewsDetail />} />

         <Route path="/india-news" element={<IndiaNews />} />
        <Route path="/india-news/:id" element={<IndiaNewsDetails />} />

        <Route path="/web-stories" element={<WebStories />} />
        <Route path="/web-stories/:id" element={<WebStoriesDetail />} />

        <Route path="/science-news" element={<ScienceNews />} />
        <Route path="/science-news/:id" element={<ScienceNewsDetail />} />

        <Route path="/opinion" element={<Opinion />} />
        <Route path="/opinion/:id" element={<OpinionDetail />} />

        <Route path="/entertainment" element={<Entertainment />} />
        <Route path="/entertainment/:id" element={<EntertainmentDetail />} />

        <Route path="/defence" element={<Defence />} />
        <Route path="/defence/:id" element={<DefenceDetail />} />

        
        <Route path="/sportfit" element={<Sportfit />} />
        <Route path="/sportfit/:id" element={<SportfitDetail />} />


        <Route path="/education" element={<Education />} />
        <Route path="/education/:id" element={<EducationDetail />} />


      <Route path="/election-news" element={<ElectionNews />} />
        <Route path="/election-news/:id" element={<ElectionNewsDetail />} />


        <Route path="/health" element={<Health />} />
        <Route path="/health/:id" element={<HealthDetail />} />


        <Route path="/tech" element={<Tech />} />
        <Route path="/tech/:id" element={<TechDetail />} />

        <Route path="/initiatives" element={<Initiatives />} />
        <Route path="/initiatives/:id" element={<InitiativesDetail />} />
        
        <Route path="/author/:authorName" element={<AuthorPage />} />









        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/update-homepage"
          element={
            <PrivateRoute>
              <UpdateHomepage />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/update-matv"
          element={
            <PrivateRoute>
              <UpdateMatv />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/update-deep-dive"
          element={
            <PrivateRoute>
              <UpdateDeepDive />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/update-world-news"
          element={
            <PrivateRoute>
              <UpdateWorldNews />
            </PrivateRoute>
          }
        />

      <Route
        path="/admin/update-viral-news"
        element={
          <PrivateRoute>
            <UpdateViralNews />
          </PrivateRoute>
        }
      />
       <Route
        path="/admin/update-latest-news"
        element={
          <PrivateRoute>
            <UpdateLatestNews />
          </PrivateRoute>
        }
      />

        <Route
        path="/admin/update-india-news"
        element={
          <PrivateRoute>
            <UpdateIndiaNews />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/update-web-stories"
        element={
          <PrivateRoute>
            <UpdateWebStories />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/update-science-news"
        element={
          <PrivateRoute>
            <UpdateScienceNews />
          </PrivateRoute>
        }
      />


      <Route
        path="/admin/update-opinion"
        element={
          <PrivateRoute>
            <UpdateOpinion />
          </PrivateRoute>
        }
      />


      <Route
        path="/admin/update-entertainment"
        element={
          <PrivateRoute>
            <UpdateEntertainment />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/update-defence"
        element={
          <PrivateRoute>
            <UpdateDefence />
          </PrivateRoute>
        }
      />


      <Route
        path="/admin/update-sportfit"
        element={
          <PrivateRoute>
            <UpdateSportfit />
          </PrivateRoute>
        }
      />


      <Route
      path="/admin/update-education"
      element={
        <PrivateRoute>
          <UpdateEducation />
        </PrivateRoute>
      }
    />


      <Route
        path="/admin/update-election-news"
        element={
          <PrivateRoute>
            <UpdateElectionNews />
          </PrivateRoute>
        }
      />


      <Route
        path="/admin/update-health"
        element={
          <PrivateRoute>
            <UpdateHealth />
          </PrivateRoute>
        }
      />


      <Route
        path="/admin/update-tech"
        element={
          <PrivateRoute>
            <UpdateTech />
          </PrivateRoute>
        }
      />



      <Route
        path="/admin/update-initiatives"
        element={
          <PrivateRoute>
            <UpdateInitiatives />
          </PrivateRoute>
        }
      />


        <Route path="*" element={<Login />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
