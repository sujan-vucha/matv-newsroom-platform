// File: src/pages/MainPage.jsx
import React from 'react';
import DeepDive from './DeepDive';
import Blog from './Blog';
import TopStories from './TopStories';
import LatestVideo from './LatestVideo';
import Community from './Community';
import Sports from './Sports';
import Technology from './Technology';
import MoreToExplore from './MoreToExplore'




function MainPage() {
  return (
    <div className="min-h-screen  py-4">
    <div className="max-w-[1200px] mx-auto bg-white">
      
     
   <MoreToExplore/>
      <DeepDive/>
      <Blog />
      <LatestVideo />
     
      <hr className="border-t-2 border-gray-300 my-2" />

      <div className="flex flex-col lg:flex-row px-4">
   
       
          <TopStories />
       

     
      </div>

      <Community/>
    
   
      {/* <Money/> */}
      <Sports/>
      <Technology/> 
   
     
    </div>
  </div>
  );
}

export default MainPage;