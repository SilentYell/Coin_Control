import React, { useEffect } from 'react';
import anime from 'animejs/lib/anime.es.js';

const NavbarLogo = ({ size = 'small' }) => {
  // different sizes for different contexts
  const sizes = {
    small: { width: '40px', height: '40px' },
    medium: { width: '60px', height: '60px' },
    large: { width: '100px', height: '100px' },
  };

  useEffect(() => {
    // coin animation
    const outlines = document.querySelectorAll('.nav-coin-outline');
    outlines.forEach((outline) => {
      const length = outline.getTotalLength();
      outline.style.strokeDasharray = length;
      outline.style.strokeDashoffset = length;
      anime({
        targets: outline,
        strokeDashoffset: [length, 0],
        duration: 2000,
        easing: 'easeInOutSine',
        delay: 0
      });
    });

    // letter animation
    const cLetters = document.querySelectorAll('.nav-coin-c');
    anime({
      targets: cLetters,
      opacity: [0, 1],
      duration: 1200,
      easing: 'easeInOutSine',
      delay: 500
    });
  }, []);

  return (
    <div style={sizes[size]}>
      <svg
        viewBox="0 0 300 300"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%' }}
      >
        <circle cx="150" cy="150" r="144" fill="#FFE856" />
        <circle className="nav-coin-outline" cx="150" cy="150" r="144" 
          fill="none" stroke="#000000" strokeWidth="5" />
        <circle className="nav-coin-outline" cx="150" cy="150" r="126" 
          fill="none" stroke="#000000" strokeWidth="5" />
        
        {/* letters */}
        <text className="nav-coin-c" x="100" y="175" 
          fontFamily="Arial-BoldMT, Arial" fontSize="120" fontWeight="700">C</text>
        <text className="nav-coin-c" x="120" y="210" 
          fontFamily="Arial-BoldMT, Arial" fontSize="120" fontWeight="700">C</text>
        
        {/* vertical lines */}
        <path d="M150,40 L150,70" fill="none" stroke="#000000" strokeWidth="5" />
        <path d="M170,200 L170,230" fill="none" stroke="#000000" strokeWidth="5" />
      </svg>
    </div>
  );

};

export default NavbarLogo;
