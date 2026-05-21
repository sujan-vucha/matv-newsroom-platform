import React, { useState } from 'react';
import { Building2, CheckCircle, Edit3, Users, Clock, MapPin, ChevronDown } from 'lucide-react';
import { usePetition, useSignPetition } from '../hooks/usePetition';

function App() {
  const { petition, stats, loading, error, refreshStats } = usePetition();
  const { signPetition, signing, signError, signSuccess, resetSignState } = useSignPetition();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    location: '',
    displayName: true
  });

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? e.target.checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    resetSignState();
    
    const success = await signPetition({
      ...formData,
      petitionId: petition?._id
    });
    
    if (success) {
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        location: '',
        displayName: true
      });
      
      // Refresh stats to show updated count
      setTimeout(() => {
        refreshStats();
      }, 1000);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading petition...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading petition: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const recentSigners = stats?.recentSignatures || [];
  const signatureCount = stats?.totalSignatures || petition?.currentSignatures || 784;
  const locationCount = stats?.totalLocations || 12;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
      {/* Modern Header with gradient */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="text-red-100 font-medium">Community Action</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 leading-tight">
            {petition?.title || 'Save Nimisha Priya'}
          </h1>
          <p className="text-red-100 text-lg max-w-2xl">
            {petition?.description || 'Help save the life of a Malayali nurse on death row in Yemen'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-10">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-8 h-8 text-red-600" />
                  <span className="text-3xl font-bold text-black">{signatureCount}</span>
                </div>
                <p className="text-gray-600">Signatures</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-8 h-8 text-red-600" />
                  <span className="text-3xl font-bold text-black">48</span>
                </div>
                <p className="text-gray-600">Hours Left</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-8 h-8 text-red-600" />
                  <span className="text-3xl font-bold text-black">{locationCount}</span>
                </div>
                <p className="text-gray-600">Locations</p>
              </div>
            </div>

            {/* Library Image with overlay */}
            <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl">
              <img 
                src="https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=1200" 
                alt="Justice and Legal Support"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Nimisha Priya</h3>
                <p className="text-white/90">Malayali nurse facing execution in Yemen</p>
              </div>
            </div>

            {/* Recent Signers - Modern Cards */}
            {recentSigners.length > 0 && (
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-red-100">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-red-600" />
                <h3 className="text-2xl font-bold text-black">Recent Supporters</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentSigners.map((signer, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-red-50 rounded-xl border border-red-100">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                      {signer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-black">{signer.name}</p>
                      <p className="text-sm text-gray-600">{signer.location} • {signer.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              </div>
            )}

            {/* Decision Maker - Modern Card */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-red-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Decision Maker</p>
                  <h3 className="text-xl font-bold text-black">{petition?.decisionMaker || 'Government of India & Yemen Authorities'}</h3>
                </div>
              </div>
              <p className="text-gray-700">
                The Indian government and Yemen authorities have the power to save Nimisha Priya's life through diplomatic intervention.
              </p>
            </div>

            {/* The Issue Section - Enhanced */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-red-100">
              <h2 className="text-3xl font-bold text-black mb-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                  <Edit3 className="w-5 h-5 text-white" />
                </div>
                The Issue
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                  <strong>The story so far:</strong> Malayali nurse Nimisha Priya, who is on death row at the Central prison in Yemen's capital Sanaa 
                  for the alleged murder of a Yemeni national, is scheduled to be executed on July 16, according to 
                  unconfirmed reports. The Supreme Court on July 14, 2025 (Monday) heard a plea filed by Save Nimisha 
                  Priya International Action Council, an organisation fighting to save her life from the gallows. The Centre told the apex court that "the Government of India is doing whatever is utmost possible" in the matter. Attorney General R. Venkataramani told a Supreme Court Bench that "having regard to the sensitivity and status of Yemen as a place, there is nothing much the Government of India can do."
                </p>
                
                <div className="bg-red-50 rounded-2xl p-6 mb-6 border border-red-100">
                  <h4 className="text-xl font-bold text-black mb-4">Current Situation:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                      <span className="text-gray-700">Execution scheduled for July 16</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                      <span className="text-gray-700">Supreme Court plea filed</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                      <span className="text-gray-700">Blood money (diyah) option available</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                      <span className="text-gray-700">International Action Council formed</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                      <span className="text-gray-700">Government of India involvement</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                      <span className="text-gray-700">Time-sensitive diplomatic efforts</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed text-lg">
                  The news about her reported execution emerged in the public domain after Samuel Jerome Baskaran, a member of the Save Nimisha 
                  Priya International Action Council who has been based in Yemen since 1999, told the media last week that he had received a message from the chairman of the 
                  central prison in Sanaa that Nimisha's execution has been scheduled on July 16. The counsel representing the council in the apex court had stated that the option to pay 'blood money (diyah)' to the murdered man's family and 
                  be pardoned for the crime was still open. We urge immediate diplomatic intervention to save her life.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar - Modern Sign Petition Form */}
          <div className="lg:col-span-2">
            <div className="sticky top-8">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-red-100">
                {/* Signature Counter - Modern Design */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 p-8 text-center text-white">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="text-5xl font-bold">{signatureCount}</span>
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <button className="text-white/90 hover:text-white flex items-center gap-2 mx-auto transition-colors">
                    Verified signatures
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Sign Form - Enhanced */}
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-black mb-8 text-center">Join the Movement</h2>
                  
                  {/* Success Message */}
                  {signSuccess && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                      <p className="text-green-800 text-center font-medium">
                        Thank you for signing the petition! Your voice matters.
                      </p>
                    </div>
                  )}

                  {/* Error Message */}
                  {signError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-red-800 text-center font-medium">
                        {signError}
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-black mb-2">
                          First name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-black transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-black mb-2">
                          Last name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-black transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Email address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-black transition-all"
                        required
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-black">Location</span>
                        <Edit3 className="w-4 h-4 text-gray-400" />
                      </div>
                      <textarea
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Enter your city, state/province, country"
                        rows={2}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-black text-sm resize-none transition-all"
                        required
                      />
                    </div>

                    <div className="flex items-start gap-3 pt-2">
                      <input
                        type="checkbox"
                        name="displayName"
                        checked={formData.displayName}
                        onChange={handleInputChange}
                        className="mt-1 w-5 h-5 text-red-600 border-2 border-gray-300 rounded focus:ring-red-500"
                      />
                      <label className="text-sm text-black leading-relaxed">
                        Display my name and comment on this petition
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={signing}
                      className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                    >
                      {signing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Signing...
                        </>
                      ) : (
                        <>
                          <Edit3 className="w-5 h-5" />
                          Sign Petition
                        </>
                      )}
                    </button>

                    <div className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl">
                      By signing, you accept Change.org's{' '}
                      <a href="#" className="text-red-600 hover:underline font-medium">Terms of Service</a>
                      {' '}and{' '}
                      <a href="#" className="text-red-600 hover:underline font-medium">Privacy Policy</a>
                      , and agree to receive occasional emails about campaigns. 
                      You can unsubscribe at any time.
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;