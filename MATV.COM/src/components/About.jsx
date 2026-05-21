import React from 'react';
import { Tv, Globe, Users, Calendar, MapPin, Award, Phone, Mail, Facebook, Twitter, Youtube, Linkedin, Play, Star, Zap, Heart, Mic, Radio, Video, Shield, Clock, Target } from 'lucide-react';

function App() {
  const features = [
    {
      icon: <Tv className="w-8 h-8" />,
      title: 'BSkyB Platform Channel 709',
      description: 'Satellite Channel operating on BSkyB platform in UK & Europe as Channel no. 709'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Free to Air Across Europe',
      description: 'Available free to air to all satellite homes in Europe from Norway to Turkey'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Community Channel for Asians',
      description: 'Dedicated community channel for Asians outside Asia with maximum programming'
    },
    {
      icon: <Radio className="w-8 h-8" />,
      title: 'Maximum Live Shows',
      description: 'MATV Channel does maximum live shows in Europe with live debate shows'
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: 'Cultural Event Coverage',
      description: 'Covers community events - Holi, Diwali, EID, Vaisakhi, Christmas, Durga Pooja'
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: 'Live from Anywhere',
      description: 'Can go live from anywhere in Europe - London, Birmingham, Glasgow, and beyond'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Voice for European Asians',
      description: 'Programming on all issues affecting Asians in Europe with live debate shows'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Free Community Coverage',
      description: 'Covers local community events free of cost for the diaspora'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Hindi Language Promotion',
      description: 'Working hard to promote our national language Hindi in Europe'
    }
  ];

  const partnerships = [
    {
      title: 'Nehru Centre',
      description: 'Covers all valued programmes done by Nehru Centre'
    },
    {
      title: 'HCI UK',
      description: 'Works very closely with HCI UK for any community related events'
    },
    {
      title: 'Bhartiya Vidhya Bhavan',
      description: 'Covers all important events at Bhartiya Vidhya Bhavan'
    }
  ];

  const europeanCountries = [
    'Poland', 'Germany', 'Netherlands', 'Norway', 'Sweden', 
    'Italy', 'France', 'Belgium', 'Denmark', 'Switzerland'
  ];

  const liveEventCountries = [
    'France', 'Germany', 'Belgium', 'Italy'
  ];

  const highlights = [
    'Satellite Channel operating on BSkyB platform as Channel 709',
    'Free to air availability across all European satellite homes',
    'Community channel dedicated to Asians outside Asia',
    'Maximum live shows programming in Europe',
    'Maximum programming for all Asian communities',
    'Coverage of all issues affecting Asians in Europe',
    'Filling the void for Indians living away from India',
    'Free coverage of local community events',
    'Promoting Hindi language across Europe',
    'Partnership with Nehru Centre for valued programmes',
    'Close collaboration with HCI UK for community events',
    'Recognized as local channel by British Indians',
    'Frontline coverage of all Indian events',
    'Complete coverage of Bhartiya Vidhya Bhavan events',
    'Live broadcasts from India on Republic Day and Independence Day'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      

      {/* Hero Section */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-12">
            <h1 className="text-6xl md:text-8xl font-black mb-6 text-black">
              <span className="text-red-600">MAT</span>V
            </h1>
            <div className="w-32 h-2 bg-red-600 mx-auto mb-8"></div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-black">
              CHANNEL OF CHOICE
            </h2>
            <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed">
              The definitive voice for the Asian Diaspora across Europe since 2000
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="bg-red-600 text-white p-8 rounded-2xl">
              <div className="text-4xl font-black mb-2">2000</div>
              <div className="text-sm uppercase tracking-wider">Started</div>
            </div>
            <div className="bg-black text-white p-8 rounded-2xl">
              <div className="text-4xl font-black mb-2">709</div>
              <div className="text-sm uppercase tracking-wider">BSkyB Channel</div>
            </div>
            <div className="bg-red-600 text-white p-8 rounded-2xl">
              <div className="text-4xl font-black mb-2">24+</div>
              <div className="text-sm uppercase tracking-wider">Years</div>
            </div>
            <div className="bg-black text-white p-8 rounded-2xl">
              <div className="text-4xl font-black mb-2">FREE</div>
              <div className="text-sm uppercase tracking-wider">To Air</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-black mb-6">
              OUR <span className="text-red-600">JOURNEY</span>
            </h2>
            <div className="w-24 h-2 bg-red-600 mx-auto mb-8"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
            <div>
              <div className="space-y-8">
                <div className="border-l-4 border-red-600 pl-8">
                  <h3 className="text-2xl font-bold text-black mb-4">2000 - The Beginning</h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    MATV Channel of Choice was first started in year 2000 as a <strong>Terrestrial Channel of Leicestershire</strong> operating out of Leicester. Since it was a terrestrial channel, it was visible to the majority of Asian Diaspora in and around Leicestershire only till 2003.
                  </p>
                </div>

                <div className="border-l-4 border-black pl-8">
                  <h3 className="text-2xl font-bold text-black mb-4">2004 - Satellite Evolution</h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    It grew to become a <strong>Satellite Channel in year 2004</strong>. Since then MATV Channel has not looked back.
                  </p>
                </div>

                <div className="border-l-4 border-red-600 pl-8">
                  <h3 className="text-2xl font-bold text-black mb-4">2008 - London Expansion</h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    It was moved to the <strong>London facility in Year 2008</strong> and since then Channel has grown from strength to strength to become the Channel of Asian Diaspora.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-xl border-2 border-gray-100">
              <div className="text-center">
                <div className="bg-red-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Globe className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-black mb-4">European Coverage</h3>
                <p className="text-gray-700 mb-6 text-lg">
                  As one of the oldest Asian channels in Europe, our viewership is very wide and entire Europe from <strong>Norway to Turkey</strong> watches MATV.
                </p>
                <div className="bg-black text-white p-4 rounded-xl">
                  <p className="font-semibold">
                    Be it a Bollywood event in London or a community event in Birmingham or as far as Glasgow, MATV can go live from anywhere in Europe.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Live Calls Section */}
          <div className="bg-white rounded-3xl p-12 shadow-xl border-2 border-gray-100">
            <h3 className="text-3xl font-bold text-black text-center mb-8">Live Calls Across Europe</h3>
            <p className="text-xl text-gray-700 text-center mb-8">
              We regularly receive live calls on our various shows from countries including:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {europeanCountries.map((country, index) => (
                <div key={index} className="bg-red-600 text-white p-4 rounded-xl text-center font-semibold">
                  {country}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-black mb-6">
              SALIENT <span className="text-red-600">FEATURES</span>
            </h2>
            <div className="w-24 h-2 bg-red-600 mx-auto mb-8"></div>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Following are the salient features of MATV Channel
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-xl border-2 border-gray-100 hover:border-red-600 transition-all duration-300 hover:-translate-y-2 group">
                <div className="bg-red-600 w-16 h-16 rounded-xl flex items-center justify-center text-white mb-6 group-hover:bg-black transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-black mb-4">{feature.title}</h3>
                <p className="text-gray-700 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Programming Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-black mb-6">
              SPECIAL <span className="text-red-600">PROGRAMMING</span>
            </h2>
            <div className="w-24 h-2 bg-red-600 mx-auto mb-8"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-100">
              <div className="bg-red-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Mic className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Live Debate Shows</h3>
              <p className="text-gray-700 mb-6">
                MATV runs lot of live debate shows which gives voice to the European Asians and not to forget the Indians.
              </p>
              <div className="bg-black text-white p-4 rounded-xl">
                <p className="font-semibold">Giving voice to European Asian community</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-100">
              <div className="bg-black w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Star className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Live from India</h3>
              <p className="text-gray-700 mb-6">
                We bring in Live Broadcast from India on our Republic Day and Independence Day every year.
              </p>
              <div className="bg-red-600 text-white p-4 rounded-xl">
                <p className="font-semibold">Connecting diaspora with homeland</p>
              </div>
            </div>
          </div>

          {/* Live Events Coverage */}
          <div className="mt-16 bg-white rounded-3xl p-12 shadow-xl border-2 border-gray-100">
            <h3 className="text-3xl font-bold text-black text-center mb-8">Live Community Events Coverage</h3>
            <p className="text-xl text-gray-700 text-center mb-8">
              MATV has done Live Community events from various European destinations including:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {liveEventCountries.map((country, index) => (
                <div key={index} className="bg-black text-white p-6 rounded-xl text-center">
                  <Video className="w-8 h-8 mx-auto mb-3 text-red-600" />
                  <div className="font-bold text-lg">{country}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partnerships Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-black mb-6">
              OUR <span className="text-red-600">PARTNERSHIPS</span>
            </h2>
            <div className="w-24 h-2 bg-red-600 mx-auto mb-8"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {partnerships.map((partnership, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 text-center border-2 border-gray-100 hover:border-red-600 transition-all duration-300">
                <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-4">{partnership.title}</h3>
                <p className="text-gray-700">{partnership.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why-us" className="py-20 px-6 bg-red-800 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-6">
              WHY CHOOSE <span className="text-black">MATV?</span>
            </h2>
            <div className="w-24 h-2 bg-white mx-auto mb-8"></div>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              The definitive choice for Indians and Asians across Europe
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {highlights.map((highlight, index) => (
              <div key={index} className="flex items-start space-x-4 p-6 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors">
                <div className="w-3 h-3 bg-white rounded-full mt-2 flex-shrink-0"></div>
                <p className="leading-relaxed">{highlight}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="bg-white text-black py-12 px-12 rounded-3xl shadow-2xl max-w-2xl mx-auto">
              <Star className="w-16 h-16 mx-auto mb-6 text-red-600" />
              <h3 className="text-4xl font-black mb-4">IN SHORT</h3>
              <p className="text-2xl font-bold text-red-600">
                MATV CHANNEL IS THE CHOICE FOR INDIANS IN EUROPE
              </p>
            </div>
          </div>
        </div>
      </section>

     

    
    </div>
  );
}

export default App;