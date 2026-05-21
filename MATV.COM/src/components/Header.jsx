import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  Home,
  Tv,
  Play,
  Globe,
  Flame,
  Zap,
  Flag,
  Microscope,
  MessageCircle,
  Clapperboard,
  Shield,
  Activity,
  GraduationCap,
  Vote,
  Heart,
  Laptop,
  Rocket,
} from 'lucide-react';

const Header = () => {
  const [showMore, setShowMore] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-red-900 to-red-800 text-white text-xs border-b border-red-700">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-2 md:space-x-4">
            <span className="text-gray-300 text-xs md:text-sm">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>

          <div className="flex items-center space-x-3 md:space-x-6">
            <Link to="/book-rajneeti" className="text-gray-300 hover:text-white transition-colors duration-200 text-xs md:text-sm">
              Book Show
            </Link>
            <Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-200 text-xs md:text-sm">
              About Us
            </Link>
          </div>
        </div>
      </div>

      {/* Logo */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
          <div className="flex items-center flex-1">
            <Link to="/" className="flex items-center group">
              <img
                src="/logo.jpg"
                alt="Republic Logo"
                className="h-[60px] md:h-[110px] object-contain transition-transform duration-200 group-hover:scale-105"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Nav */}
      <nav className="hidden md:block bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-2">
            <Link
              to="/"
              className={`whitespace-nowrap px-4 py-2 text-sm font-medium ${
                location.pathname === '/'
                  ? 'text-gray-900 border-b-2 border-red-600'
                  : 'text-gray-700'
              } hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 flex items-center gap-1`}
            >
              <Home className="w-4 h-4" /> Home
            </Link>
            <Link
              to="/live"
              className={`whitespace-nowrap px-4 py-2 text-sm font-medium ${
                location.pathname === '/live'
                  ? 'text-gray-900 border-b-2 border-red-600'
                  : 'text-gray-700'
              } hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 flex items-center gap-1`}
            >
              <Tv className="w-4 h-4" /> Live TV
            </Link>
            <Link
              to="/videos"
              className={`whitespace-nowrap px-4 py-2 text-sm font-medium ${
                location.pathname === '/videos'
                  ? 'text-gray-900 border-b-2 border-red-600'
                  : 'text-gray-700'
              } hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 flex items-center gap-1`}
            >
              <Play className="w-4 h-4" /> Videos
            </Link>
            <Link
              to="/world"
              className={`whitespace-nowrap px-4 py-2 text-sm font-medium ${
                location.pathname === '/world'
                  ? 'text-gray-900 border-b-2 border-red-600'
                  : 'text-gray-700'
              } hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 flex items-center gap-1`}
            >
              <Globe className="w-4 h-4" /> World
            </Link>
            <Link
              to="/viral"
              className={`whitespace-nowrap px-4 py-2 text-sm font-medium ${
                location.pathname === '/viral'
                  ? 'text-gray-900 border-b-2 border-red-600'
                  : 'text-gray-700'
              } hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 flex items-center gap-1`}
            >
              <Flame className="w-4 h-4" /> Viral
            </Link>
            <Link
              to="/latest-news"
              className={`whitespace-nowrap px-4 py-2 text-sm font-medium ${
                location.pathname === '/latest-news'
                  ? 'text-gray-900 border-b-2 border-red-600'
                  : 'text-gray-700'
              } hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 flex items-center gap-1`}
            >
              <Zap className="w-4 h-4" /> Latest News
            </Link>
            <Link
              to="/india-news"
              className={`whitespace-nowrap px-4 py-2 text-sm font-medium ${
                location.pathname === '/india-news'
                  ? 'text-gray-900 border-b-2 border-red-600'
                  : 'text-gray-700'
              } hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 flex items-center gap-1`}
            >
              <Flag className="w-4 h-4" /> India News
            </Link>

            {/* Entertainment stays after India */}
            <Link
              to="/entertainment"
              className={`whitespace-nowrap px-4 py-2 text-sm font-medium ${
                location.pathname === '/entertainment'
                  ? 'text-gray-900 border-b-2 border-red-600'
                  : 'text-gray-700'
              } hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 flex items-center gap-1`}
            >
              <Clapperboard className="w-4 h-4" /> Entertainment
            </Link>

            {/* SportFit stays in main row (replaced Web Stories earlier) */}
            <Link
              to="/sportfit"
              className={`whitespace-nowrap px-4 py-2 text-sm font-medium ${
                location.pathname === '/sportfit'
                  ? 'text-gray-900 border-b-2 border-red-600'
                  : 'text-gray-700'
              } hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 flex items-center gap-1`}
            >
              <Activity className="w-4 h-4" /> SportFit
            </Link>

            {/* More */}
            <button
              onClick={() => setShowMore(!showMore)}
              className={`whitespace-nowrap px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 ${
                showMore
                  ? 'bg-white text-gray-900 border-2 border-red-600 shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
              }`}
            >
              More
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  showMore ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav */}
      <nav className="md:hidden bg-white border-b border-gray-200 shadow-sm">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex items-center px-4 py-2 gap-2 min-w-max">
            <Link
              to="/"
              className={`whitespace-nowrap px-3 py-2 text-xs font-medium ${
                location.pathname === '/'
                  ? 'text-gray-900 border-b-2 border-red-600'
                  : 'text-gray-700'
              } hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 flex-shrink-0 flex items-center gap-1`}
            >
              <Home className="w-3 h-3" /> Home
            </Link>
            <Link
              to="/live"
              className={`whitespace-nowrap px-3 py-2 text-xs font-medium ${
                location.pathname === '/live'
                  ? 'text-gray-900 border-b-2 border-red-600'
                  : 'text-gray-700'
              } hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 flex-shrink-0 flex items-center gap-1`}
            >
              <Tv className="w-3 h-3" /> Live
            </Link>
            <Link
              to="/videos"
              className={`whitespace-nowrap px-3 py-2 text-xs font-medium ${
                location.pathname === '/videos'
                  ? 'text-gray-900 border-b-2 border-red-600'
                  : 'text-gray-700'
              } hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 flex-shrink-0 flex items-center gap-1`}
            >
              <Play className="w-3 h-3" /> Videos
            </Link>
            <Link
              to="/world"
              className={`whitespace-nowrap px-3 py-2 text-xs font-medium ${
                location.pathname === '/world'
                  ? 'text-gray-900 border-b-2 border-red-600'
                  : 'text-gray-700'
              } hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 flex-shrink-0 flex items-center gap-1`}
            >
              <Globe className="w-3 h-3" /> World
            </Link>
            <Link
              to="/viral"
              className={`whitespace-nowrap px-3 py-2 text-xs font-medium ${
                location.pathname === '/viral'
                  ? 'text-gray-900 border-b-2 border-red-600'
                  : 'text-gray-700'
              } hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 flex-shrink-0 flex items-center gap-1`}
            >
              <Flame className="w-3 h-3" /> Viral
            </Link>
            <Link
              to="/latest-news"
              className={`whitespace-nowrap px-3 py-2 text-xs font-medium ${
                location.pathname === '/latest-news'
                  ? 'text-gray-900 border-b-2 border-red-600'
                  : 'text-gray-700'
              } hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 flex-shrink-0 flex items-center gap-1`}
            >
              <Zap className="w-3 h-3" /> Latest
            </Link>
            <Link
              to="/india-news"
              className={`whitespace-nowrap px-3 py-2 text-xs font-medium ${
                location.pathname === '/india-news'
                  ? 'text-gray-900 border-b-2 border-red-600'
                  : 'text-gray-700'
              } hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 flex-shrink-0 flex items-center gap-1`}
            >
              <Flag className="w-3 h-3" /> India
            </Link>
            <Link
              to="/entertainment"
              className={`whitespace-nowrap px-3 py-2 text-xs font-medium ${
                location.pathname === '/entertainment'
                  ? 'text-gray-900 border-b-2 border-red-600'
                  : 'text-gray-700'
              } hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 flex-shrink-0 flex items-center gap-1`}
            >
              <Clapperboard className="w-3 h-3" /> Entertainment
            </Link>
            <Link
              to="/sportfit"
              className={`whitespace-nowrap px-3 py-2 text-xs font-medium ${
                location.pathname === '/sportfit'
                  ? 'text-gray-900 border-b-2 border-red-600'
                  : 'text-gray-700'
              } hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 flex-shrink-0 flex items-center gap-1`}
            >
              <Activity className="w-3 h-3" /> SportFit
            </Link>

            <button
              onClick={() => setShowMore(!showMore)}
              className={`whitespace-nowrap px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-1 flex-shrink-0 ${
                showMore
                  ? 'bg-white text-gray-900 border-2 border-red-600 shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
              }`}
            >
              More
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-200 ${
                  showMore ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* More Links - Desktop */}
      {showMore && (
        <div className="hidden md:block bg-gray-50 border-b border-gray-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center flex-wrap justify-center gap-4 text-sm font-medium">
            <Link
              to="/defence"
              className={`${location.pathname === '/defence' ? 'text-red-600 bg-white' : 'text-gray-700'} hover:text-red-600 hover:bg-white px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-1`}
            >
              <Shield className="w-4 h-4" /> Defence
            </Link>
            <Link
              to="/education"
              className={`${location.pathname === '/education' ? 'text-red-600 bg-white' : 'text-gray-700'} hover:text-red-600 hover:bg-white px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-1`}
            >
              <GraduationCap className="w-4 h-4" /> Education
            </Link>
            <Link
              to="/election-news"
              className={`${location.pathname === '/election-news' ? 'text-red-600 bg-white' : 'text-gray-700'} hover:text-red-600 hover:bg-white px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-1`}
            >
              <Vote className="w-4 h-4" /> Election News
            </Link>
            <Link
              to="/health"
              className={`${location.pathname === '/health' ? 'text-red-600 bg-white' : 'text-gray-700'} hover:text-red-600 hover:bg-white px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-1`}
            >
              <Heart className="w-4 h-4" /> Health
            </Link>
            <Link
              to="/tech"
              className={`${location.pathname === '/tech' ? 'text-red-600 bg-white' : 'text-gray-700'} hover:text-red-600 hover:bg-white px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-1`}
            >
              <Laptop className="w-4 h-4" /> Tech
            </Link>
            <Link
              to="/initiatives"
              className={`${location.pathname === '/initiatives' ? 'text-red-600 bg-white' : 'text-gray-700'} hover:text-red-600 hover:bg-white px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-1`}
            >
              <Rocket className="w-4 h-4" /> Initiatives
            </Link>

            {/* Moved here: Science News & Opinion */}
            <Link
              to="/science-news"
              className={`${location.pathname === '/science-news' ? 'text-red-600 bg-white' : 'text-gray-700'} hover:text-red-600 hover:bg-white px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-1`}
            >
              <Microscope className="w-4 h-4" /> Science News
            </Link>
            <Link
              to="/opinion"
              className={`${location.pathname === '/opinion' ? 'text-red-600 bg-white' : 'text-gray-700'} hover:text-red-600 hover:bg-white px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-1`}
            >
              <MessageCircle className="w-4 h-4" /> Opinion
            </Link>
          </div>
        </div>
      )}

      {/* More Links - Mobile */}
      {showMore && (
        <div className="md:hidden bg-gray-50 border-b border-gray-200 shadow-lg">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex items-center px-4 py-3 gap-2 min-w-max text-xs font-medium">
              <Link
                to="/defence"
                className={`${location.pathname === '/defence' ? 'text-red-600 bg-white' : 'text-gray-700'} hover:text-red-600 hover:bg-white px-2 py-1 rounded-lg transition-all duration-200 flex items-center gap-1`}
              >
                <Shield className="w-3 h-3" /> Defence
              </Link>
              <Link
                to="/education"
                className={`${location.pathname === '/education' ? 'text-red-600 bg-white' : 'text-gray-700'} hover:text-red-600 hover:bg-white px-2 py-1 rounded-lg transition-all duration-200 flex items-center gap-1`}
              >
                <GraduationCap className="w-3 h-3" /> Education
              </Link>
              <Link
                to="/election-news"
                className={`${location.pathname === '/election-news' ? 'text-red-600 bg-white' : 'text-gray-700'} hover:text-red-600 hover:bg-white px-2 py-1 rounded-lg transition-all duration-200 flex items-center gap-1`}
              >
                <Vote className="w-3 h-3" /> Election
              </Link>
              <Link
                to="/health"
                className={`${location.pathname === '/health' ? 'text-red-600 bg-white' : 'text-gray-700'} hover:text-red-600 hover:bg-white px-2 py-1 rounded-lg transition-all duration-200 flex items-center gap-1`}
              >
                <Heart className="w-3 h-3" /> Health
              </Link>
              <Link
                to="/tech"
                className={`${location.pathname === '/tech' ? 'text-red-600 bg-white' : 'text-gray-700'} hover:text-red-600 hover:bg-white px-2 py-1 rounded-lg transition-all duration-200 flex items-center gap-1`}
              >
                <Laptop className="w-3 h-3" /> Tech
              </Link>
              <Link
                to="/initiatives"
                className={`${location.pathname === '/initiatives' ? 'text-red-600 bg-white' : 'text-gray-700'} hover:text-red-600 hover:bg-white px-2 py-1 rounded-lg transition-all duration-200 flex items-center gap-1`}
              >
                <Rocket className="w-3 h-3" /> Initiatives
              </Link>

              {/* Moved here: Science & Opinion */}
              <Link
                to="/science-news"
                className={`${location.pathname === '/science-news' ? 'text-red-600 bg-white' : 'text-gray-700'} hover:text-red-600 hover:bg-white px-2 py-1 rounded-lg transition-all duration-200 flex items-center gap-1`}
              >
                <Microscope className="w-3 h-3" /> Science
              </Link>
              <Link
                to="/opinion"
                className={`${location.pathname === '/opinion' ? 'text-red-600 bg-white' : 'text-gray-700'} hover:text-red-600 hover:bg-white px-2 py-1 rounded-lg transition-all duration-200 flex items-center gap-1`}
              >
                <MessageCircle className="w-3 h-3" /> Opinion
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
