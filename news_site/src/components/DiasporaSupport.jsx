import React, { useState, useEffect, useRef } from 'react';
import { Building2, Send, Upload, MapPin, Phone, Mail, FileText, AlertCircle } from 'lucide-react';
import intlTelInput from 'intl-tel-input';
import 'intl-tel-input/build/css/intlTelInput.css';

function DiasporaSupport() {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    country: '',
    state: '',
    city: '',
    context: '',
    issueDescription: '',
    attachments: []
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const phoneInputRef = useRef(null);
  const itiRef = useRef(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));



    if (name === 'country') {
      setStates([]);
      setCities([]);
      setFormData(prev => ({ ...prev, state: '', city: '' }));
      if (value) fetchStates(value);
    }
    
    if (name === 'state') {
      setCities([]);
      setFormData(prev => ({ ...prev, city: '' }));
      if (value) fetchCities(formData.country, value);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await fetch('https://countriesnow.space/api/v0.1/countries/positions');
      const data = await response.json();
      setCountries(data.data || []);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const fetchStates = async (country) => {
    setLoadingStates(true);
    try {
      const response = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country })
      });
      const data = await response.json();
      setStates(data.data?.states || []);
    } catch (error) {
      console.error('Error fetching states:', error);
    }
    setLoadingStates(false);
  };

  const fetchCities = async (country, state) => {
    setLoadingCities(true);
    try {
      const response = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country, state })
      });
      const data = await response.json();
      setCities(data.data || []);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
    setLoadingCities(false);
  };

  useEffect(() => {
    fetchCountries();
    
    // Initialize intl-tel-input
    if (phoneInputRef.current) {
      itiRef.current = intlTelInput(phoneInputRef.current, {
        initialCountry: 'auto',
        geoIpLookup: function(callback) {
          fetch('https://ipapi.co/json')
            .then(res => res.json())
            .then(data => callback(data.country_code))
            .catch(() => callback('us'));
        },
        utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js'
      });
    }
    
    return () => {
      if (itiRef.current) {
        itiRef.current.destroy();
      }
    };
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('country', formData.country);
      formDataToSend.append('state', formData.state);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('context', formData.context);
      formDataToSend.append('issueDescription', formData.issueDescription);
      
      // Get phone number from intl-tel-input before submission
      if (itiRef.current) {
        formDataToSend.set('phone', itiRef.current.getNumber());
      }
      
      // Add files
      formData.attachments.forEach((file) => {
        formDataToSend.append('attachments', file);
      });

      const response = await fetch(`${import.meta.env.VITE_API_AUTHOR_BASE_URL || 'http://localhost:5003'}/api/diaspora-support`, {
        method: 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setFormData({
          email: '',
          phone: '',
          country: '',
          state: '',
          city: '',
          context: '',
          issueDescription: '',
          attachments: []
        });
        
        // Reset file input and intl-tel-input
        const fileInput = document.getElementById('file-upload');
        if (fileInput) fileInput.value = '';
        if (itiRef.current) {
          itiRef.current.setNumber('');
        }
        
        // Scroll to contact form start
        const formElement = document.querySelector('.bg-white.rounded-3xl.shadow-2xl');
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        const errorData = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorData}`);
      }
      
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError(`Failed to submit your request: ${error.message}`);
      // Scroll to contact form start to show error
      const formElement = document.querySelector('.bg-white.rounded-3xl.shadow-2xl');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="text-red-100 font-medium">Indian Diaspora Support</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 leading-tight">
            Reach Out to Us
          </h1>
          <p className="text-red-100 text-lg max-w-2xl">
            We're here to help the Indian diaspora community. Share your concerns and we'll do our best to provide support and assistance.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Terms & Conditions Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-amber-800 mb-2">Important Notice</h3>
              <p className="text-amber-700 leading-relaxed">
                We will try our best to provide support and assistance for your matter. However, please note that we cannot guarantee the resolution of all issues. Our team will review your submission and respond within a reasonable timeframe based on the nature and complexity of your request.
              </p>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-red-100">
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-2">Contact Form</h2>
            <p className="text-red-100">Fill out the form below and we'll get back to you</p>
          </div>

          <div className="p-8">
            {/* Success Message */}
            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-green-800 text-center font-medium">
                  Thank you for reaching out! We have received your submission and will review it shortly.
                </p>
              </div>
            )}

            {/* Error Message */}
            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-800 text-center font-medium">
                  {submitError}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-black flex items-center gap-2">
                  <Mail className="w-5 h-5 text-red-600" />
                  Contact Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={(e) => {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        setEmailError(e.target.value && !emailRegex.test(e.target.value) ? 'Please enter a valid email address' : '');
                      }}
                      onFocus={() => setEmailError('')}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 bg-white text-black transition-all ${
                        emailError ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-red-500 focus:border-red-500'
                      }`}
                      required
                    />
                    {emailError && (
                      <p className="text-red-500 text-sm mt-1">{emailError}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Phone Number
                    </label>
                    <input
                      ref={phoneInputRef}
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => {
                        handleInputChange(e);
                        if (itiRef.current) {
                          setFormData(prev => ({ ...prev, phone: itiRef.current.getNumber() }));
                        }
                      }}
                      onBlur={() => {
                        if (itiRef.current && formData.phone) {
                          setPhoneError(!itiRef.current.isValidNumber() ? 'Please enter a valid phone number' : '');
                        } else {
                          setPhoneError('');
                        }
                      }}
                      onFocus={() => {
                        setPhoneError('');
                        if (itiRef.current) {
                          setFormData(prev => ({ ...prev, phone: itiRef.current.getNumber() }));
                        }
                      }}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 bg-white text-black transition-all ${
                        phoneError ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-red-500 focus:border-red-500'
                      }`}
                    />
                    {phoneError && (
                      <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-black flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-600" />
                  Location
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Country *
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-black transition-all"
                      required
                    >
                      <option value="">Select Country</option>
                      {countries.map((country) => (
                        <option key={country.name} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      State/Province *
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      disabled={!formData.country || loadingStates}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-black transition-all disabled:bg-gray-100"
                      required
                    >
                      <option value="">{loadingStates ? 'Loading...' : 'Select State'}</option>
                      {states.map((state) => (
                        <option key={state.name} value={state.name}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      City/District *
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={!formData.state || loadingCities}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-black transition-all disabled:bg-gray-100"
                      required
                    >
                      <option value="">{loadingCities ? 'Loading...' : 'Select City'}</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Issue Description */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-black flex items-center gap-2">
                  <FileText className="w-5 h-5 text-red-600" />
                  Issue Description
                </h3>
                
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Context/Subject *
                  </label>
                  <input
                    type="text"
                    name="context"
                    value={formData.context}
                    onChange={handleInputChange}
                    placeholder="Brief context or subject of your request"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-black transition-all"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Please describe your issue or concern in detail *
                  </label>
                  <textarea
                    name="issueDescription"
                    value={formData.issueDescription}
                    onChange={handleInputChange}
                    rows={6}
                    placeholder="Please provide as much detail as possible about your situation, including any relevant dates, locations, and circumstances..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-black resize-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* File Attachments */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-black flex items-center gap-2">
                  <Upload className="w-5 h-5 text-red-600" />
                  Attachments (Optional)
                </h3>
                
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Upload relevant documents or files
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-red-400 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <input
                      type="file"
                      id="file-upload"
                      multiple
                      onChange={(e) => {
                        handleFileChange(e);
                        e.target.value = ''; // Reset input to allow same file again
                      }}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer text-red-600 hover:text-red-700 font-medium"
                    >
                      Click to upload files
                    </label>
                    <p className="text-sm text-gray-500 mt-1">
                      PDF, DOC, DOCX, JPG, PNG, TXT (Max 10MB each)
                    </p>
                    {formData.attachments.length > 0 && (
                      <div className="mt-3 text-left">
                        <p className="text-sm font-medium text-black mb-2">Selected files:</p>
                        {formData.attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between text-sm text-gray-600 py-1">
                            <span>• {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                            <button
                              type="button"
                              onClick={() => {
                                const newFiles = formData.attachments.filter((_, i) => i !== index);
                                setFormData(prev => ({ ...prev, attachments: newFiles }));
                              }}
                              className="text-gray-400 hover:text-red-500 ml-2"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Request
                  </>
                )}
              </button>

              {/* Terms Notice */}
              <div className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl">
                By submitting this form, you acknowledge that MATV will make reasonable efforts to assist with your request but cannot guarantee specific outcomes. 
                We respect your privacy and will handle your information in accordance with our privacy policy. 
                Response times may vary based on the complexity of your request.
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiasporaSupport;
