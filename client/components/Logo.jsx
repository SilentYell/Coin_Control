import React, { useEffect } from 'react';
import anime from 'animejs/lib/anime.es.js';

const Logo = () => {
  useEffect(() => {
    // Animate both coin outlines
    const outlines = document.querySelectorAll('.st0');
    outlines.forEach((outline) => {
      const length = outline.getTotalLength();
      outline.style.strokeDasharray = length;
      outline.style.strokeDashoffset = length;
      anime({
        targets: outline,
        strokeDashoffset: [length, 0],
        duration: 2000,
        easing: 'easeInOutSine',
        delay: 0,
        loop: false,
        direction: 'normal',
      });
    });

    // Animate the large "C" letters (fade-in effect)
    const cLetters = document.querySelectorAll('.st4');
    anime({
      targets: cLetters,
      opacity: [0, 1],
      duration: 1200,
      easing: 'easeInOutSine',
      delay: 500,
      loop: false,
    });

    // Animate the vertical lines (stroke then fill)
    const verticalLines = document.querySelectorAll('.st2');
    verticalLines.forEach((line) => {
      const length = line.getTotalLength();
      line.style.strokeDasharray = length;
      line.style.strokeDashoffset = length;
      anime({
        targets: line,
        strokeDashoffset: [length, 0],
        duration: 1200,
        easing: 'easeInOutSine',
        delay: 500,
        loop: false,
        direction: 'normal',
        complete: () => {
          // Fill the line with black after stroke animation
          anime({
            targets: line,
            fill: ['none', '#000000'],
            duration: 600,
            easing: 'easeOutQuad',
          });
        },
      });
    });

    // Animate the text paths (draw once)
    const textPaths = document.querySelectorAll('.st3 path');
    textPaths.forEach((path, i) => {
      const length = path.getTotalLength();
      path.style.stroke = '#FFD700';
      path.style.fill = 'none';
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      anime({
        targets: path,
        strokeDashoffset: [length, 0],
        duration: 1800,
        delay: 200 + i * 100,
        easing: 'easeInOutSine',
        direction: 'normal',
        loop: false,
        complete: () => {
          // After the last path animates, fade in all text
          if (i === textPaths.length - 1) {
            setTimeout(() => {
              textPaths.forEach((p) => {
                anime({
                  targets: p,
                  opacity: [0, 1],
                  fill: ['#FFD700'],
                  duration: 600,
                  easing: 'easeOutQuad',
                });
              });
            }, 200);
          }
        },
      });
    });
  }, []);

  return (
    <div style={{ width: '60%', maxWidth: 500, margin: '0 auto' }}>
      <svg
        version="1.1"
        id="Coin_Control"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 840.3 478.6"
        style={{ enableBackground: 'new 0 0 840.3 478.6' }}
        xmlSpace="preserve"
      >
        <style type="text/css">{`
          .st0 { fill: none; stroke: #000000; stroke-width: 5; stroke-miterlimit: 10; }
          .st2 { fill: none; stroke:rgb(0, 0, 0); stroke-width: 5; stroke-miterlimit: 10; }
          .st3 { fill: #FFD700; }
          .st4 { font-family: Arial-BoldMT, Arial; font-size: 120.3px; font-weight: 700; fill: #000000; }
        `}</style>
        <g id="Coin_Control-2">
          <g id="Coin">
            <g>
              <defs>
                <circle id="SVGID_1_" cx="427.6" cy="149.1" r="144.1" />
              </defs>
              <use xlinkHref="#SVGID_1_" style={{ overflow: 'visible', fill: '#FFE856' }} />
              <clipPath id="SVGID_00000090283407465915540280000003485204244605183618_">
                <use xlinkHref="#SVGID_1_" style={{ overflow: 'visible' }} />
              </clipPath>
            </g>
            <circle className="st0" cx="427.6" cy="149.1" r="144.1" />
            <g>
              <defs>
                <circle id="SVGID_00000087393330643556594760000014413158236641276563_" cx="428" cy="149.7" r="126.5" />
              </defs>
              <clipPath id="SVGID_00000114779203500404086650000007098674584311641745_">
                <use xlinkHref="#SVGID_00000087393330643556594760000014413158236641276563_" style={{ overflow: 'visible' }} />
              </clipPath>
              <g style={{ clipPath: 'url(#SVGID_00000114779203500404086650000007098674584311641745_)' }}>
                <g>
                  <defs>
                    <rect id="SVGID_00000103257481898567778470000011736520461905854119_" x="296.5" y="18.2" width="263" height="263" />
                  </defs>
                  <clipPath id="SVGID_00000067216344448436424760000001298085917937015945_">
                    <use xlinkHref="#SVGID_00000103257481898567778470000011736520461905854119_" style={{ overflow: 'visible' }} />
                  </clipPath>
                </g>
              </g>
            </g>
            <circle className="st0" cx="428" cy="149.7" r="126.5" />
            {/* Large "C" letters */}
            <text className="st4" transform="translate(377.02 173.12)">
              <tspan x="0" y="0">C</tspan>
            </text>
            <text className="st4" transform="translate(399.12 207.87)">
              <tspan x="0" y="0">C</tspan>
            </text>
            {/* Vertical lines */}
            <path
              className="st2"
              d="m424.45,66l-.1,26.72c-.15,4.6-6.84,4.62-7,0,0,0-.1-26.71-.1-26.71.13-4.76,7.06-4.78,7.19,0h0Z"
            />
            <path
              className="st2"
              d="m446.16,201.7l.16,26.72c-.12,4.86-7.2,4.87-7.33,0,0,0,.16-26.71.16-26.71.16-4.59,6.83-4.61,7,0h0Z"
              />
          </g>
          <g>
            <g className="st3">
              <path d="M48,427.3c-7.4,0-13.9-1.6-19.5-4.9c-5.6-3.3-9.9-7.9-13-13.9c-3.1-6-4.6-12.9-4.6-20.9v-29.2c0-8,1.5-15,4.6-20.9 c3.1-6,7.4-10.6,13-13.9c5.6-3.3,12.1-4.9,19.5-4.9c6.2,0,11.8,1.3,16.9,4c5.1,2.6,9.4,6.3,12.8,11.1c3.4,4.7,5.8,10.3,7,16.6 H69.4c-0.9-3.4-2.5-6.4-4.7-9c-2.2-2.6-4.7-4.6-7.7-6c-2.9-1.4-6-2.1-9.1-2.1c-6.5,0-11.8,2.3-15.8,6.9c-4,4.6-6,10.7-6,18.3 v29.2c0,7.6,2,13.6,6,18.2c4,4.6,9.2,6.9,15.8,6.9c4.6,0,9-1.5,13.1-4.4s6.9-7.2,8.3-12.7h15.3c-1.2,6.3-3.6,11.9-7,16.6 c-3.5,4.7-7.7,8.4-12.8,11.1C59.8,426,54.2,427.3,48,427.3z" />
              <path d="M133.7,427.3c-10,0-17.7-2.9-23.1-8.7c-5.5-5.8-8.2-13.9-8.2-24.4v-12.4c0-10.4,2.7-18.5,8.2-24.2 c5.5-5.7,13.2-8.6,23.1-8.6s17.7,2.9,23.1,8.6c5.5,5.7,8.2,13.8,8.2,24.2v12.6c0,10.4-2.7,18.5-8.2,24.3 C151.3,424.4,143.6,427.3,133.7,427.3z M133.7,413.1c5.2,0,9.3-1.6,12.1-4.9c2.9-3.3,4.3-7.9,4.3-13.8v-12.6 c0-5.9-1.4-10.5-4.3-13.7s-6.9-4.8-12.1-4.8c-5.2,0-9.2,1.6-12.1,4.8c-2.9,3.2-4.3,7.8-4.3,13.7v12.6c0,5.9,1.4,10.5,4.3,13.8 C124.5,411.4,128.5,413.1,133.7,413.1z" />
              <path d="M186.3,334.6v-14.9h14.9v14.9H186.3z M186.3,426.2v-76h14.9v76H186.3z" />
              <path d="M223.9,426.2v-76h14.9v76H223.9z M270,426.2v-46.1c0-5.4-1.4-9.5-4.1-12.5c-2.8-2.9-6.7-4.4-11.8-4.4 c-4.9,0-8.7,1.3-11.3,3.9c-2.7,2.6-4,6.2-4,10.9l-1.5-14.6c2.3-4.6,5.4-8.1,9.2-10.6c3.8-2.5,8-3.7,12.6-3.7 c8.3,0,14.6,2.7,19.2,8.1c4.5,5.4,6.8,13,6.8,22.9v46.1H270z" />
              <path d="M384.3,427.3c-7.4,0-13.9-1.6-19.5-4.9c-5.6-3.3-9.9-7.9-13-13.9c-3.1-6-4.6-12.9-4.6-20.9v-29.2c0-8,1.5-15,4.6-20.9 c3.1-6,7.4-10.6,13-13.9c5.6-3.3,12.1-4.9,19.5-4.9c6.2,0,11.8,1.3,16.9,4c5.1,2.6,9.4,6.3,12.8,11.1c3.4,4.7,5.8,10.3,7,16.6 h-15.3c-0.9-3.4-2.5-6.4-4.7-9c-2.2-2.6-4.7-4.6-7.7-6c-2.9-1.4-6-2.1-9.1-2.1c-6.5,0-11.8,2.3-15.8,6.9c-4,4.6-6,10.7-6,18.3 v29.2c0,7.6,2,13.6,6,18.2c4,4.6,9.2,6.9,15.8,6.9c4.6,0,9-1.5,13.1-4.4s6.9-7.2,8.3-12.7H421c-1.2,6.3-3.6,11.9-7,16.6 c-3.5,4.7-7.7,8.4-12.8,11.1C396.1,426,390.5,427.3,384.3,427.3z" />
              <path d="M469.9,427.3c-10,0-17.7-2.9-23.1-8.7c-5.5-5.8-8.2-13.9-8.2-24.4v-12.4c0-10.4,2.7-18.5,8.2-24.2 c5.5-5.7,13.2-8.6,23.1-8.6s17.7,2.9,23.1,8.6c5.5,5.7,8.2,13.8,8.2,24.2v12.6c0,10.4-2.7,18.5-8.2,24.3 C487.6,424.4,479.9,427.3,469.9,427.3z M469.9,413.1c5.2,0,9.3-1.6,12.1-4.9c2.9-3.3,4.3-7.9,4.3-13.8v-12.6 c0-5.9-1.4-10.5-4.3-13.7c-2.9-3.2-6.9-4.8-12.1-4.8c-5.2,0-9.2,1.6-12.1,4.8c-2.9,3.2-4.3,7.8-4.3,13.7v12.6 c0,5.9,1.4,10.5,4.3,13.8C460.7,411.4,464.7,413.1,469.9,413.1z" />
              <path d="M522.5,426.2v-76h14.9v76H522.5z M568.7,426.2v-46.1c0-5.4-1.4-9.5-4.1-12.5c-2.8-2.9-6.7-4.4-11.8-4.4 c-4.9,0-8.7,1.3-11.3,3.9c-2.7,2.6-4,6.2-4,10.9l-1.5-14.6c2.3-4.6,5.4-8.1,9.2-10.6c3.8-2.5,8-3.7,12.6-3.7 c8.3,0,14.6,2.7,19.2,8.1c4.5,5.4,6.8,13,6.8,22.9v46.1H568.7z" />
              <path d="M600.4,363.6v-13.5h34.3v13.5H600.4z M626.1,426.6c-6.3,0-10.8-1.7-13.6-5.2c-2.8-3.5-4.2-8.4-4.2-14.9V328h14.9v78.5 c0,1.8,0.4,3.2,1.1,4.2s1.8,1.5,3.2,1.5h7.2v14.2H626.1z" />
            </g>
          </g>
          <g>
            <g className="st3">
              <path d="M655.2,426.2v-76h14.9v76H655.2z M697,368.2c-1.3-1.6-3-2.8-5-3.7c-2-0.8-4.3-1.2-7-1.2c-4.7,0-8.4,1.3-11,3.9 c-2.6,2.6-3.9,6.2-3.9,10.9l-1.5-14.6c2.3-4.5,5.3-8,9-10.5c3.7-2.5,7.8-3.8,12.3-3.8c3.5,0,6.6,0.5,9.4,1.5 c2.8,1,5.3,2.5,7.4,4.4L697,368.2z" />
            </g>
          </g>
          <g>
            <g className="st3">
              <path d="M746.9,427.3c-10,0-17.7-2.9-23.1-8.7c-5.5-5.8-8.2-13.9-8.2-24.4v-12.4c0-10.4,2.7-18.5,8.2-24.2 c5.5-5.7,13.2-8.6,23.1-8.6s17.7,2.9,23.1,8.6c5.5,5.7,8.2,13.8,8.2,24.2v12.6c0,10.4-2.7,18.5-8.2,24.3 C764.6,424.4,756.9,427.3,746.9,427.3z M746.9,413.1c5.2,0,9.3-1.6,12.1-4.9c2.9-3.3,4.3-7.9,4.3-13.8v-12.6 c0-5.9-1.4-10.5-4.3-13.7s-6.9-4.8-12.1-4.8c-5.2,0-9.2,1.6-12.1,4.8c-2.9,3.2-4.3,7.8-4.3,13.7v12.6 c0,5.9,1.4,10.5,4.3,13.8C737.7,411.4,741.7,413.1,746.9,413.1z" />
              <path d="M814.4,319.7v86.9c0,1.8,0.4,3.2,1.2,4.2s1.9,1.5,3.4,1.5h7v14.2h-8.8c-5.6,0-10-1.8-13.1-5.3c-3.1-3.5-4.7-8.5-4.7-14.9 v-86.7H814.4z" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default Logo;