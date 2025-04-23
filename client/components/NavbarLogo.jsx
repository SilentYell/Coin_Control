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

};
