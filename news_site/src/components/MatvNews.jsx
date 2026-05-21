import React, { useEffect, useState } from "react";
import { FaClock } from "react-icons/fa";
import axios from "axios";

const Matv = () => {
  const [mainStory, setMainStory] = useState(null);
  const [liveUpdates, setLiveUpdates] = useState([]);
  const [centerCard, setCenterCard] = useState(null);
  const [centerList, setCenterList] = useState([]);
  const [economicImpact, setEconomicImpact] = useState([]);
  const [mustRead, setMustRead] = useState([]);
  const [opinion, setOpinion] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/matv/latest`)


      .then((res) => {
        const data = res.data;
        setMainStory(data.mainStory || {});
        setLiveUpdates(data.liveUpdates || []);
        setCenterCard(data.centerCard || {});
        setCenterList(data.centerList || []);
        setEconomicImpact(data.economicImpact || []);
        setMustRead(data.mustRead || []);
        setOpinion(data.opinion || []);
      })
      .catch((err) => console.error("Failed to fetch MATV data", err));
  }, []);

  if (!mainStory || !centerCard) return <div className="p-4">Loading MATV content...</div>;

  return (
    <div className="w-full py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[58%_22%_20%] gap-6">
        {/* Left Section */}
        <div className="space-y-6">
          <div className="relative rounded-xl overflow-hidden shadow-lg hover-scale">
            <img
              src={mainStory?.image || "/placeholder.jpg"}
              alt="Main Story"
              className="w-full h-52 md:h-72 lg:h-[360px] object-cover"
            />
            <div className="absolute bottom-0 left-0 bg-white w-full py-4 px-4 md:px-6 rounded-t-xl">
              <div className="h-1.5 w-[60px] bg-orange-500 rounded mb-2" />
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold leading-snug">
                {mainStory?.title || "Main story headline not available"}
              </h1>
            </div>
          </div>

          <div>
            <h2 className="text-red-600 font-semibold text-sm mb-4 flex items-center gap-2">
              <FaClock className="text-[14px]" /> LIVE UPDATES
            </h2>
            <ul className="space-y-4 border-l-2 border-gray-300 pl-4 md:pl-6 text-sm">
              {liveUpdates.map((item, index) => (
                <li key={index}>
                  <span className="text-yellow-500 font-medium">{item.time}:</span> {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Center Section */}
        <div className="space-y-6 text-sm">
          <div className="space-y-3 bg-white p-4 rounded-lg shadow-md hover-scale">
            <img
              src={centerCard?.image || "/placeholder.jpg"}
              alt="Center Card"
              className="w-full h-28 md:h-[120px] object-cover rounded-md"
            />
            <h2 className="text-lg md:text-xl font-semibold leading-snug">
              {centerCard?.title || "Center card title not available"}
            </h2>
          </div>
          <ul className="space-y-3 bg-white p-4 rounded-lg shadow-md">
            {centerList.map((item, index) => (
              <li key={index} className="py-2 border-b border-gray-100 hover:text-blue-600 cursor-pointer transition">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Right Section */}
        <div className="space-y-8 text-sm">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xs font-bold text-purple-600 uppercase mb-3">Economic Impact</h3>
            <ul className="space-y-3">
              {economicImpact.map((item, index) => (
                <li key={index} className="flex items-start gap-3 pb-2 border-b border-gray-100">
                  <img src={item.image || "/placeholder.jpg"} alt="Impact" className="w-[70px] h-[50px] object-cover rounded-md" />
                  <span className="hover:text-blue-600 cursor-pointer transition">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xs font-bold text-yellow-500 uppercase mb-3">Must Read</h3>
            <ul className="space-y-4">
              {mustRead.map((item, index) => (
                <li key={index} className="flex items-start gap-3 pb-2 border-b border-gray-100">
                  <img src={item.image || "/placeholder.jpg"} alt="Must Read" className="w-[70px] h-[50px] rounded-md object-cover" />
                  <span className="hover:text-blue-600 cursor-pointer transition">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

         
        </div>
      </div>
    </div>
  );
};

export default Matv;
