import React from 'react';

const AnimatedTitle = ({ text, className = '' }) => {
  const chars = text.split('');
  
  return (
    <h1 className={`animated-title ${className}`}>
      {chars.map((char, index) => (
        <span
          key={index}
          className="char"
          style={{
            animationDelay: `${index * 0.05}s`
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
      
      <style jsx>{`
        .animated-title {
          display: inline-block;
        }
        
        .char {
          display: inline-block;
          opacity: 0;
          transform: translateY(20px) rotateX(-90deg);
          animation: charReveal 0.8s ease-out forwards;
        }
        
        @keyframes charReveal {
          0% {
            opacity: 0;
            transform: translateY(20px) rotateX(-90deg);
            filter: blur(10px);
          }
          50% {
            opacity: 0.5;
            filter: blur(5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) rotateX(0deg);
            filter: blur(0px);
          }
        }
      `}</style>
    </h1>
  );
};

export default AnimatedTitle;