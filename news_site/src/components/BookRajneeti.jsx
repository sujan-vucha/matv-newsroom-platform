import React, { useState } from 'react';
import { Calendar, Clock, User, Mail, Phone, MessageSquare, Tv } from 'lucide-react';
import AnimatedTitle from './AnimatedTitle';

const BookRajneeti = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredTime: '',
    message: '',
    expertise: '',
    whyPodcast: '',
    topicsToDiscuss: '',
    pastEngagements: '',
    portfolioUrl: '',
    socialMediaLinks: ''
  });
  const [portfolioFile, setPortfolioFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFAQ, setOpenFAQ] = useState({});

  const availableDates = [
    { date: '2024-10-25', day: 'Saturday', label: '25th Oct' },
    { date: '2024-10-27', day: 'Monday', label: '27th Oct' },
    { date: '2024-11-01', day: 'Saturday', label: '1st Nov' },
    { date: '2024-11-03', day: 'Monday', label: '3rd Nov' },
    { date: '2024-11-08', day: 'Saturday', label: '8th Nov' },
    { date: '2024-11-10', day: 'Monday', label: '10th Nov' },
    { date: '2024-11-15', day: 'Saturday', label: '15th Nov' },
    { date: '2024-11-22', day: 'Saturday', label: '22nd Nov' },
    { date: '2024-11-29', day: 'Saturday', label: '29th Nov' },
    { date: '2024-12-06', day: 'Saturday', label: '6th Dec' },
    { date: '2024-12-13', day: 'Saturday', label: '13th Dec' },
    { date: '2024-12-20', day: 'Saturday', label: '20th Dec' },
    { date: '2024-12-27', day: 'Saturday', label: '27th Dec' }
  ];

  const timeSlots = {
    saturday: [{ time: '10:00-11:00 AM', zone: 'London / 2:30-3:30 PM India' }],
    monday: [{ time: '1:00-2:00 PM', zone: 'London / 5:30-6:30 PM India' }]
  };

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPortfolioFile(file);
    }
  };

  const uploadPortfolio = async () => {
    if (!portfolioFile) return null;
    
    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('portfolio', portfolioFile);
    
    try {
      console.log('Uploading to:', `${import.meta.env.VITE_BACKEND_API_BASE_URL}/upload/portfolio`);
      console.log('FormData contents:', uploadFormData.get('portfolio'));
      
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_BASE_URL}/upload/portfolio`, {
        method: 'POST',
        body: uploadFormData,
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Upload response:', result);
        return result.url;
      } else {
        console.error('Upload failed with status:', response.status);
        const errorText = await response.text();
        console.error('Upload error:', errorText);
        return null;
      }
    } catch (error) {
      console.error('Portfolio upload failed:', error);
      return null;
    } finally {
      setUploading(false);
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Custom validation: either email or phone required
    if (!formData.email && !formData.phone) {
      alert('Please provide either an email address or WhatsApp number.');
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Upload portfolio if file is selected
      let portfolioUrl = '';
      console.log('Portfolio file selected:', portfolioFile);
      if (portfolioFile) {
        console.log('Uploading portfolio file:', portfolioFile.name);
        portfolioUrl = await uploadPortfolio();
        console.log('Portfolio uploaded, URL:', portfolioUrl);
      } else {
        console.log('No portfolio file selected');
      }

      const submissionData = {
        ...formData,
        portfolioUrl
      };
      
      console.log('Submitting data:', submissionData);

      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_BASE_URL}/rajneeti-bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit booking');
      }

      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tv className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h2>
            <p className="text-gray-600 mb-6">
              Your booking request has been submitted successfully. We will contact you soon to confirm your participation in "Rajneeti by Prashant Kumar".
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  preferredTime: '',
                  message: '',
                  expertise: '',
                  whyPodcast: '',
                  topicsToDiscuss: '',
                  pastEngagements: '',
                  portfolioUrl: '',
                  socialMediaLinks: ''
                });
                setPortfolioFile(null);
              }}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Tv className="w-8 h-8 sm:w-12 sm:h-12 text-red-600 mr-2 sm:mr-3" />
            <AnimatedTitle 
              text="Rajneeti by Prashant Kumar"
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-600 text-center leading-tight"
            />
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join our distinguished political discussion series, telecast live on MATV via Sky TV across the UK and 55 countries in Europe.
          </p>
        </div>

      </div>
      
      {/* Show Info - Full Width */}
      <div className="bg-white py-12 mb-8">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Show Information</h2>
          
          {/* Desktop Layout - Side by side */}
          <div className="hidden lg:flex items-center gap-8">
            {/* Host Image - Fixed Left */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <img
                src="/host.jpg"
                alt="Prashant Kumar - Host"
                className="w-48 h-48 rounded-full object-cover object-center shadow-lg mb-4"
                style={{ objectPosition: 'center 20%' }}
              />
              <h3 className="font-semibold text-gray-800 text-center">Prashant Kumar</h3>
              <p className="text-sm text-gray-600 text-center">Host & Conservative Councillor Candidate</p>
              <p className="text-xs text-gray-500 text-center">Rayners Lane, Harrow</p>
            </div>
            
            {/* Gallery - Takes Remaining Space */}
            <div className="flex-1 relative overflow-hidden rounded-lg h-64">
              <div className="absolute inset-0">
                <div className="flex animate-scroll-right space-x-4 h-full">
                  {[
                    'Screenshot 2025-10-24 160332.png',
                    'Screenshot 2025-10-24 160344.png',
                    'Screenshot 2025-10-24 160359.png',
                    'Screenshot 2025-10-24 160421.png',
                    'Screenshot 2025-10-24 160431.png',
                    'Screenshot 2025-10-24 160440.png',
                    'Screenshot 2025-10-24 160451.png',
                    'Screenshot 2025-10-24 160502.png',
                    'Screenshot 2025-10-24 160515.png',
                    'Screenshot 2025-10-24 160530.png'
                  ].concat([
                    'Screenshot 2025-10-24 160332.png',
                    'Screenshot 2025-10-24 160344.png',
                    'Screenshot 2025-10-24 160359.png',
                    'Screenshot 2025-10-24 160421.png',
                    'Screenshot 2025-10-24 160431.png',
                    'Screenshot 2025-10-24 160440.png',
                    'Screenshot 2025-10-24 160451.png',
                    'Screenshot 2025-10-24 160502.png',
                    'Screenshot 2025-10-24 160515.png',
                    'Screenshot 2025-10-24 160530.png'
                  ]).map((image, index) => (
                    <div key={index} className="flex-shrink-0 w-48 h-full">
                      <img
                        src={`/rajneet gallery/${image}`}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent z-10"></div>
              <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent z-10"></div>
            </div>
          </div>
          
          {/* Mobile Layout - Stacked */}
          <div className="lg:hidden space-y-6">
            {/* Host Image - Centered on Mobile */}
            <div className="flex flex-col items-center">
              <img
                src="/host.jpg"
                alt="Prashant Kumar - Host"
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover object-center shadow-lg mb-4"
                style={{ objectPosition: 'center 20%' }}
              />
              <h3 className="font-semibold text-gray-800 text-center">Prashant Kumar</h3>
              <p className="text-sm text-gray-600 text-center">Host & Conservative Councillor Candidate</p>
              <p className="text-xs text-gray-500 text-center">Rayners Lane, Harrow</p>
            </div>
            
            {/* Gallery - Below Host on Mobile */}
            <div className="relative overflow-hidden rounded-lg h-48 sm:h-56">
              <div className="absolute inset-0">
                <div className="flex animate-scroll-right space-x-3 h-full">
                  {[
                    'Screenshot 2025-10-24 160332.png',
                    'Screenshot 2025-10-24 160344.png',
                    'Screenshot 2025-10-24 160359.png',
                    'Screenshot 2025-10-24 160421.png',
                    'Screenshot 2025-10-24 160431.png',
                    'Screenshot 2025-10-24 160440.png',
                    'Screenshot 2025-10-24 160451.png',
                    'Screenshot 2025-10-24 160502.png',
                    'Screenshot 2025-10-24 160515.png',
                    'Screenshot 2025-10-24 160530.png'
                  ].concat([
                    'Screenshot 2025-10-24 160332.png',
                    'Screenshot 2025-10-24 160344.png',
                    'Screenshot 2025-10-24 160359.png',
                    'Screenshot 2025-10-24 160421.png',
                    'Screenshot 2025-10-24 160431.png',
                    'Screenshot 2025-10-24 160440.png',
                    'Screenshot 2025-10-24 160451.png',
                    'Screenshot 2025-10-24 160502.png',
                    'Screenshot 2025-10-24 160515.png',
                    'Screenshot 2025-10-24 160530.png'
                  ]).map((image, index) => (
                    <div key={index} className="flex-shrink-0 w-36 sm:w-40 h-full">
                      <img
                        src={`/rajneet gallery/${image}`}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white to-transparent z-10"></div>
              <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white to-transparent z-10"></div>
            </div>
          </div>
          
          <style jsx>{`
            @keyframes scroll-right {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }
            
            .animate-scroll-right {
              animation: scroll-right 30s linear infinite;
            }
            
            .animate-scroll-right:hover {
              animation-play-state: paused;
            }
          `}</style>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4">
        {/* Booking Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Book Your Participation</h2>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information Section */}
            <div className="relative">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter your WhatsApp number"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Either email or WhatsApp number is required
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area of Expertise
                </label>
                <input
                  type="text"
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., Politics, Economics, International Relations"
                />
              </div>
            </div>
            
            {/* Section Divider */}
            <div className="mt-8 mb-8">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
            </div>
            </div>

            {/* Show Details Section */}
            <div className="relative">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Show Details</h3>
              {/* Date and Time Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                <Clock className="w-4 h-4 inline mr-2" />
                Select Your Preferred Date & Time
              </label>
              
              {/* Date Selection */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-600 mb-3">Choose Date:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {availableDates.map((dateOption) => (
                    <button
                      key={dateOption.date}
                      type="button"
                      onClick={() => {
                        setSelectedDate(dateOption.date);
                        setSelectedTime('');
                        setFormData({...formData, preferredTime: ''});
                      }}
                      className={`p-3 rounded-lg border-2 text-center transition-all ${
                        selectedDate === dateOption.date
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
                      }`}
                    >
                      <div className="text-xs font-medium text-gray-500">{dateOption.day}</div>
                      <div className="text-sm font-semibold">{dateOption.label}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Time Selection */}
              {selectedDate && (
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-3">Choose Time:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(() => {
                      const selectedDateObj = availableDates.find(d => d.date === selectedDate);
                      const dayType = selectedDateObj?.day.toLowerCase() === 'saturday' ? 'saturday' : 'monday';
                      return timeSlots[dayType].map((slot, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            const timeValue = `${selectedDate}-${slot.time}`;
                            setSelectedTime(timeValue);
                            setFormData({...formData, preferredTime: timeValue});
                          }}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            selectedTime === `${selectedDate}-${slot.time}`
                              ? 'border-red-500 bg-red-50 text-red-700'
                              : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
                          }`}
                        >
                          <div className="font-semibold">{slot.time}</div>
                          <div className="text-sm text-gray-600">{slot.zone}</div>
                        </button>
                      ));
                    })()
                    }
                  </div>
                </div>
              )}
              
              <p className="text-sm text-gray-500 mt-4">
                Note: After 10th Nov, shows will only be on Saturdays 10:00-11:00 AM (London time)
              </p>
            </div>
            
            {/* Section Divider */}
            <div className="mt-8 mb-8">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
            </div>
            </div>

            {/* About You Section */}
            <div className="relative">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">About You</h3>
              {/* Why Podcast */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Why do you want to be on our podcast channel?
              </label>
              <textarea
                name="whyPodcast"
                value={formData.whyPodcast}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Tell us why you're interested in appearing on our show..."
              />
            </div>

            {/* Topics to Discuss */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Topics you want to discuss
              </label>
              <textarea
                name="topicsToDiscuss"
                value={formData.topicsToDiscuss}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="What topics would you like to discuss on the show?"
              />
            </div>

            {/* Past Engagements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Please share any links to past speaking engagements?
              </label>
              <textarea
                name="pastEngagements"
                value={formData.pastEngagements}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Share links to your past interviews, speeches, or media appearances..."
              />
            </div>

            {/* Social Media Links */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Social Media Links
              </label>
              <p className="text-sm text-gray-600 mb-4">
                Please include any links where you'd want listeners to find you
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">X / Twitter link</label>
                  <input
                    type="url"
                    name="twitter"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                    placeholder="https://twitter.com/..."
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Instagram link</label>
                  <input
                    type="url"
                    name="instagram"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                    placeholder="https://instagram.com/..."
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Facebook link</label>
                  <input
                    type="url"
                    name="facebook"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                    placeholder="https://facebook.com/..."
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">LinkedIn link</label>
                  <input
                    type="url"
                    name="linkedin"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                    placeholder="https://linkedin.com/..."
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">YouTube link</label>
                  <input
                    type="url"
                    name="youtube"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                    placeholder="https://youtube.com/..."
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">TikTok link</label>
                  <input
                    type="url"
                    name="tiktok"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                    placeholder="https://tiktok.com/..."
                  />
                </div>
              </div>
            </div>
              {/* Section Divider */}
              <div className="mt-8 mb-8">
                <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
              </div>
            </div>

            {/* Documents Section */}
            <div className="relative">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Documents & Additional Info</h3>
            {/* Portfolio Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Portfolio Image Upload (Optional)
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".jpg,.jpeg,.png"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  id="portfolio-upload"
                />
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-red-400 transition-colors">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="text-blue-500 hover:text-blue-600 cursor-pointer">Browse</span> or drag a file here
                    </p>
                    <p className="text-xs text-gray-400">
                      You can upload 1 image. File can be up to 10 MB.
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Upload your portfolio image (JPG, PNG)
              </p>
              {portfolioFile && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Selected: {portfolioFile.name}
                  </p>
                </div>
              )}
            </div>

            {/* Additional Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Additional Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Any other information you'd like to share..."
              />
            </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting || uploading}
                className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {uploading ? 'Uploading Portfolio...' : isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
              </button>
            </div>
          </form>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Frequently Asked Questions (FAQ)</h2>
          
          <div className="space-y-4">
            {[
              {
                q: "What is 'Rajneeti by Prashant Kumar'?",
                a: "It's a live talk series hosted by Prashant Kumar, broadcast on MATV (Sky TV) across the UK and 55 countries in Europe. The show brings together diverse voices to discuss current affairs, governance, leadership, and issues that matter to society."
              },
              {
                q: "Who can participate?",
                a: "We welcome political leaders, academics, professionals, community representatives, and social thinkers — anyone who can contribute meaningfully to the discussion."
              },
              {
                q: "Is the discussion live or pre-recorded?",
                a: "All sessions are broadcast live on MATV. However, recordings may be used later on digital and social platforms for wider reach."
              },
              {
                q: "Where will the discussion take place?",
                a: "You can join virtually or in-studio (for those in London). Virtual: A link will be shared by our team before the live broadcast once your participation is confirmed. Studio: Details will be shared upon confirmation of your slot."
              },
              {
                q: "How long is each session?",
                a: "Each session runs for approximately 60 minutes, including introductions, discussion, and closing remarks."
              },
              {
                q: "How do I confirm my participation?",
                a: "Simply fill out the form on this page with your preferred date and time slot, and our team will get in touch to confirm your availability."
              }
            ].map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setOpenFAQ(prev => ({ ...prev, [index]: !prev[index] }))}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-800">{index + 1}. {faq.q}</h3>
                  <span className="text-2xl font-bold text-red-600 ml-4">
                    {openFAQ[index] ? '−' : '+'}
                  </span>
                </button>
                {openFAQ[index] && (
                  <div className="px-4 pb-4">
                    <p className="text-gray-600">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-gray-100 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
          <p className="text-gray-700">
            <strong>Prashant Kumar</strong><br />
            Conservative Councillor Candidate - Rayners Lane, Harrow, London<br />
            Head, MATV - Rajneeti
          </p>
          <p className="text-sm text-gray-600 mt-3">
            We will contact you within 48 hours to confirm your participation and provide further details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookRajneeti;