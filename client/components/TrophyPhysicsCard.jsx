import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import Card from './Card';
import { getUserTrophies } from '../services/api';

// Mock badge SVGs for TrophyPhysicsCard
const mockBadges = [
  { trophy_id: 'mock1', name: 'First Steps', icon_path: 'first_steps.svg', description: 'Add your first income or expense', percent_required: 0 },
  { trophy_id: 'mock2', name: 'Consistent Logger', icon_path: 'consistent_logger.svg', description: 'Add a transaction every day for 7 days', percent_required: 0 },
  { trophy_id: 'mock3', name: 'Save $10', icon_path: 'save_10.svg', description: 'Save $10', percent_required: 0 },
  { trophy_id: 'mock4', name: 'Save $50', icon_path: 'save_50.svg', description: 'Save $50', percent_required: 0 },
  { trophy_id: 'mock5', name: 'Save $100', icon_path: 'save_100.svg', description: 'Save $100', percent_required: 0 },
  { trophy_id: 'mock6', name: 'Spend $10', icon_path: 'spend_10.svg', description: 'Spend $10', percent_required: 0 },
  { trophy_id: 'mock7', name: 'Spend $50', icon_path: 'spend_50.svg', description: 'Spend $50', percent_required: 0 },
  { trophy_id: 'mock8', name: 'Spend $100', icon_path: 'spend_100.svg', description: 'Spend $100', percent_required: 0 },
];

const TrophyPhysicsCard = ({ userId, isEditable, cardX, cardY, trophiesList }) => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const prevPos = useRef({ x: cardX, y: cardY });
  const [trophies, setTrophies] = React.useState([]);
  const [score, setScore] = React.useState(0);
  const width = 420;
  const height = 600;
  const containerRef = useRef(null);

  useEffect(() => {
    let didCancel = false;
    async function fetchTrophies() {
      try {
        let data = [];
        if (trophiesList && trophiesList.length > 0) {
          data = trophiesList;
        } else {
          data = await getUserTrophies(userId);
        }
        if (!didCancel) {
          // Log backend trophies for debugging
          console.log('TrophyPhysicsCard: backend trophies:', data);
          setTrophies((data && data.length > 0) ? data : mockBadges);
        }
      } catch {
        if (!didCancel) setTrophies(mockBadges);
      }
    }
    fetchTrophies();
    return () => { didCancel = true; };
  }, [userId, trophiesList]);

  useEffect(() => {
    prevPos.current = { x: cardX, y: cardY };
  }, [cardX, cardY]);

  // Helper to robustly get the icon url from trophy object
  function getTrophyIconUrl(trophy) {
    // Prefer icon_url if present and not empty
    if (trophy.icon_url && trophy.icon_url.trim() !== '') {
      if (trophy.icon_url.startsWith('/')) return trophy.icon_url;
      if (trophy.icon_url.endsWith('.svg') || trophy.icon_url.endsWith('.png')) return `/icons/${trophy.icon_url}`;
      return `/images/trophies/${trophy.icon_url}`;
    }
    // Fallback to icon_path
    if (trophy.icon_path && trophy.icon_path.trim() !== '') {
      if (trophy.icon_path.startsWith('/')) return trophy.icon_path;
      if (trophy.icon_path.endsWith('.svg') || trophy.icon_path.endsWith('.png')) return `/icons/${trophy.icon_path}`;
      return `/images/trophies/${trophy.icon_path}`;
    }
    return '';
  }

  useEffect(() => {
    // Preload all trophy images before creating Matter.js bodies
    function preloadImages(trophies) {
      return Promise.all(
        trophies.map(trophy => {
          return new Promise(resolve => {
            const img = new window.Image();
            img.onload = () => resolve({ ...trophy, _img: img });
            img.onerror = () => resolve(null); // skip broken images
            img.src = getTrophyIconUrl(trophy);
          });
        })
      ).then(results => results.filter(Boolean));
    }

    let cleanup = () => {};
    if (!sceneRef.current || trophies.length === 0) return;
    let cancelled = false;
    preloadImages(trophies).then(loadedTrophies => {
      if (cancelled) return;
      if (engineRef.current) {
        Matter.Render.stop(engineRef.current.render);
        Matter.Runner.stop(engineRef.current.runner);
        Matter.World.clear(engineRef.current.engine.world, false);
        Matter.Engine.clear(engineRef.current.engine);
        if (engineRef.current.render.canvas.parentNode) {
          engineRef.current.render.canvas.parentNode.removeChild(engineRef.current.render.canvas);
        }
      }
      const engine = Matter.Engine.create();
      const world = engine.world;
      const render = Matter.Render.create({
        element: sceneRef.current,
        engine,
        options: {
          width,
          height,
          wireframes: false,
          background: '#ececec',
        },
      });
      const ground = Matter.Bodies.rectangle(width / 2, height + 10, width, 20, { isStatic: true });
      const leftWall = Matter.Bodies.rectangle(-10, height / 2, 20, height, { isStatic: true });
      const rightWall = Matter.Bodies.rectangle(width + 10, height / 2, 20, height, { isStatic: true });
      // Move hoop lower and add left/right collision (rim)
      const HOOP_WIDTH = 100;
      const HOOP_HEIGHT = 20;
      const HOOP_X = width / 2;
      const HOOP_Y = 200; // Lowered hoop
      // Rim sides (raise them and match hoop color)
      const RIM_THICKNESS = 10;
      const RIM_HEIGHT = 20; // Raised rim
      const rimColor = 'orange';
      const rimLeft = Matter.Bodies.rectangle(
        HOOP_X - HOOP_WIDTH / 2 + RIM_THICKNESS / 2,
        HOOP_Y - RIM_HEIGHT / 2 + 10, // Raise rim
        RIM_THICKNESS,
        RIM_HEIGHT,
        { isStatic: true, render: { fillStyle: rimColor }, label: 'rim' }
      );
      const rimRight = Matter.Bodies.rectangle(
        HOOP_X + HOOP_WIDTH / 2 - RIM_THICKNESS / 2,
        HOOP_Y - RIM_HEIGHT / 2 + 10, // Raise rim
        RIM_THICKNESS,
        RIM_HEIGHT,
        { isStatic: true, render: { fillStyle: rimColor }, label: 'rim' }
      );
      // Hoop sensor (scoring area) with border radius
      const hoop = Matter.Bodies.rectangle(HOOP_X, HOOP_Y, HOOP_WIDTH, HOOP_HEIGHT, {
        isStatic: true,
        isSensor: true,
        render: {
          fillStyle: rimColor,
          strokeStyle: 'black',
          lineWidth: 3,
          // Custom property for border radius (visual only, not physics)
          borderRadius: 50,
        },
        label: 'hoop',
      });
      // Add top boundary
      const topWall = Matter.Bodies.rectangle(width / 2, -10, width, 20, { isStatic: true, label: 'topWall' });
      Matter.World.add(world, [ground, leftWall, rightWall, topWall, hoop, rimLeft, rimRight]);
      const BADGE_SIZE = 64;
      const margin = BADGE_SIZE / 2 + 8;
      const bodies = loadedTrophies.map((trophy) => {
        const x = margin + Math.random() * (width - 2 * margin);
        const y = margin + Math.random() * (height - 2 * margin);
        return Matter.Bodies.circle(x, y, BADGE_SIZE / 2, {
          restitution: 0.8,
          friction: 0.2,
          density: 0.005, // Add some weight
          mass: 2,        // Add some weight
          render: {
            sprite: {
              texture: getTrophyIconUrl(trophy),
              xScale: BADGE_SIZE / 175.46,
              yScale: BADGE_SIZE / 175.46,
              img: trophy._img,
            },
          },
          label: trophy.name,
        });
      });
      Matter.World.add(world, bodies);
      if (!isEditable) {
        const mouse = Matter.Mouse.create(render.canvas);
        const mouseConstraint = Matter.MouseConstraint.create(engine, {
          mouse,
          constraint: {
            stiffness: 0.2,
            render: { visible: false },
          },
          collisionFilter: {
            mask: 0x0001,
          },
        });
        bodies.forEach(body => { body.collisionFilter = { group: 0, category: 0x0001, mask: 0xFFFFFFFF }; });
        Matter.World.add(world, mouseConstraint);
      }
      Matter.Events.on(engine, 'collisionStart', function(event) {
        event.pairs.forEach(pair => {
          const labels = [pair.bodyA.label, pair.bodyB.label];
          if (labels.includes('hoop')) {
            const trophyBody = pair.bodyA.label === 'hoop' ? pair.bodyB : pair.bodyA;
            if (trophyBody.label && trophyBody.label !== 'hoop') {
              setScore(prev => prev + 1);
            }
          }
        });
      });
      Matter.Render.run(render);
      // Fix: ensure border is applied after canvas is rendered
      setTimeout(() => {
        if (sceneRef.current) {
          const canvas = sceneRef.current.querySelector('canvas');
          if (canvas) {
            canvas.style.border = '3px solid #1a237e';
            canvas.style.borderRadius = '18px';
            canvas.style.boxShadow = '0 2px 12px rgba(26,35,126,0.3)';
            canvas.style.display = 'block';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.width = width;
            canvas.height = height;
          }
        }
      }, 0);
      const runner = Matter.Runner.create();
      Matter.Runner.run(runner, engine);
      engineRef.current = { engine, render, runner, bodies, ground, leftWall, rightWall, hoop, rimLeft, rimRight, topWall };
      cleanup = () => {
        Matter.Render.stop(render);
        Matter.Runner.stop(runner);
        Matter.World.clear(engine.world, false);
        Matter.Engine.clear(engine);
        if (render.canvas.parentNode) {
          render.canvas.parentNode.removeChild(render.canvas);
        }
      };
    });
    return () => {
      cancelled = true;
      cleanup();
    };
  }, [trophies, isEditable]);

  useEffect(() => {
    if (!isEditable || !engineRef.current || !engineRef.current.bodies) return;
    const prev = prevPos.current;
    const dx = cardX - prev.x;
    const dy = cardY - prev.y;
    if (dx !== 0 || dy !== 0) {
      engineRef.current.bodies.forEach(body => {
        Matter.Body.setVelocity(body, {
          x: dx * 2,
          y: dy * 2,
        });
      });
    }
    prevPos.current = { x: cardX, y: cardY };
  }, [cardX, cardY, isEditable]);

  return (
    <Card title="Trophy Case" isEditable={isEditable}>
      {/* Score overlay */}
      <div style={{ position: 'absolute', left: 20, top: 20, zIndex: 2, fontWeight: 'bold', fontSize: 24, color: '#1a237e', textShadow: '1px 1px 4px #fff' }}>
        Score: {score}
      </div>
      <div ref={containerRef} style={{ width: width, height: height, overflow: 'hidden', boxSizing: 'border-box', margin: '0 auto', position: 'relative' }}>
        <div ref={sceneRef} style={{ width: '100%', height: '100%', boxSizing: 'border-box' }} />
      </div>
    </Card>
  );
};

export default TrophyPhysicsCard;
