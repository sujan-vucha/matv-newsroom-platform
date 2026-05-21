import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-orange-950 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div>
            <h3 className="text-xl font-bold mb-4">MA<span className="text-orange-500">TV</span></h3>
            <p className="text-orange-200 mb-4">
              Your premier source for UK-focused news, delivering comprehensive coverage and insightful analysis from across the United Kingdom.
            </p>
            <div className="flex space-x-4">
              {/* <a href="#" className="text-orange-300 hover:text-white transition"><FaFacebookF /></a>
              <a href="#" className="text-orange-300 hover:text-white transition"><FaTwitter /></a>
              <a href="#" className="text-orange-300 hover:text-white transition"><FaInstagram /></a> */}
              
              <a href="https://www.youtube.com/@MATVNATIONAL" className="text-orange-300 hover:text-white transition"><FaYoutube /></a>
            
            </div>
          </div>

          {/* Navigation Links (from Header) */}
          <div>
  <h4 className="font-bold text-lg mb-4 text-orange-400">Quick Links</h4>
  <div className="grid grid-cols-2 gap-4">
    <ul className="space-y-2">
      <li><Link to="/" className="text-orange-200 hover:text-white transition">Home</Link></li>
      <li><Link to="/live" className="text-orange-200 hover:text-white transition">Live TV</Link></li>
      <li><Link to="/videos" className="text-orange-200 hover:text-white transition">Videos</Link></li>
      <li><Link to="/world" className="text-orange-200 hover:text-white transition">World</Link></li>
      <li><Link to="/viral" className="text-orange-200 hover:text-white transition">Viral</Link></li>
      <li><Link to="/latest-news" className="text-orange-200 hover:text-white transition">Latest News</Link></li>
      <li><Link to="/india-news" className="text-orange-200 hover:text-white transition">India News</Link></li>
      <li><Link to="/web-stories" className="text-orange-200 hover:text-white transition">Web Stories</Link></li>
      <li><Link to="/science-news" className="text-orange-200 hover:text-white transition">Science News</Link></li>
      <li><Link to="/opinion" className="text-orange-200 hover:text-white transition">Opinion</Link></li>
    </ul>

    <ul className="space-y-2">
      <li><Link to="/entertainment" className="text-orange-200 hover:text-white transition">Entertainment</Link></li>
      <li><Link to="/defence" className="text-orange-200 hover:text-white transition">Defence</Link></li>
      <li><Link to="/sportfit" className="text-orange-200 hover:text-white transition">SportFit</Link></li>
      <li><Link to="/matv-business" className="text-orange-200 hover:text-white transition">MATV Business</Link></li>
      <li><Link to="/education" className="text-orange-200 hover:text-white transition">Education</Link></li>
      <li><Link to="/election-news" className="text-orange-200 hover:text-white transition">Election News</Link></li>
      <li><Link to="/health" className="text-orange-200 hover:text-white transition">Health</Link></li>
      <li><Link to="/tech" className="text-orange-200 hover:text-white transition">Tech</Link></li>
     
    </ul>
  </div>
</div>

          {/* Newsletter */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-lg mb-4 text-orange-400">Newsletter</h4>
            <p className="text-orange-200 mb-4">Stay updated with the latest UK news and exclusive content.</p>
            <form className="mb-4">
              
              {/* <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="bg-orange-900 text-white px-4 py-2 rounded-l focus:outline-none w-full placeholder-orange-300"
                />
                <button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-r transition">
                  Subscribe
                </button>
              </div> */}
            </form>

            <div className="mt-6">
              <h4 className="font-bold text-lg mb-2 text-orange-400">Indian Diaspora Support</h4>
              <p className="text-orange-200 mb-3">Need assistance? We're here to help the Indian community worldwide.</p>
              <Link to="/diaspora-support" className="inline-block text-orange-300 hover:text-white transition font-medium border border-orange-300 hover:border-white px-4 py-2 rounded">
                Reach us
              </Link>
            </div>

            {/* <p className="text-sm text-orange-200">
              By subscribing, you agree to our Privacy Policy and Terms of Service.
            </p> */}
          </div>
        </div>

        <div className="border-t border-orange-900 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-orange-200 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} MATV UK. All rights reserved.
          </p>
          {/* <div className="flex flex-wrap justify-center gap-4 text-sm text-orange-200">
            <Link to="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-white transition">Terms of Service</Link>
            <Link to="/cookie-policy" className="hover:text-white transition">Cookie Policy</Link>
            <Link to="/accessibility" className="hover:text-white transition">Accessibility</Link>
            <Link to="/contact-us" className="hover:text-white transition">Contact Us</Link>
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
