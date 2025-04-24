import React from 'react';

const NavbarLogo = ({ size = 'small' }) => {
  // different sizes for different contexts
  const sizes = {
    small: { width: '45px', height: '45px' },
    medium: { width: '60px', height: '60px' },
    large: { width: '100px', height: '100px' },
  };

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
          fontFamily="Arial-BoldMT, Arial" fontSize="120" fontWeight="700" fill="#000000">C</text>
        <text className="nav-coin-c" x="120" y="210" 
          fontFamily="Arial-BoldMT, Arial" fontSize="120" fontWeight="700" fill="#000000">C</text>
        
        {/* vertical lines */}
        <path d="M150,55 L150,85" fill="none" stroke="#000000" strokeWidth="5" />
        <path d="M170,200 L170,230" fill="none" stroke="#000000" strokeWidth="5" />
      </svg>
    </div>
  );

};

export default NavbarLogo;
