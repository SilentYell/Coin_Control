import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import Card from './Card';
import { getUserTrophies } from '../services/api';

// Helper to get the icon path (SVGs in public/icons/)
const getIconUrl = (iconPath) => {
  if (!iconPath) return '';
  if (iconPath.startsWith('/')) return iconPath;
  return `/icons/${iconPath}`;
};

const CARD_WIDTH = 400;
const CARD_HEIGHT = 260;
const BADGE_SIZE = 64;

const MOCK_TROPHIES = [
  {
    trophy_id: 1,
    name: 'First Steps',
    icon_url: '/icons/first_steps.svg',
  },
  {
    trophy_id: 2,
    name: 'Consistent Logger',
    icon_url: '/icons/consistent_logger.svg',
  },
  {
    trophy_id: 3,
    name: 'Save $10',
    icon_url: '/icons/save_10.svg',
  },
  {
    trophy_id: 4,
    name: 'Save $50',
    icon_url: '/icons/save_50.svg',
  },
  {
    trophy_id: 5,
    name: 'Save $100',
    icon_url: '/icons/save_100.svg',
  },
  {
    trophy_id: 6,
    name: 'Spend $10',
    icon_url: '/icons/spend_10.svg',
  },
  {
    trophy_id: 7,
    name: 'Spend $50',
    icon_url: '/icons/spend_50.svg',
  },
  {
    trophy_id: 8,
    name: 'Spend $100',
    icon_url: '/icons/spend_100.svg',
  },
];

const TrophyPhysicsCard = ({ userId, isEditable, cardX, cardY }) => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const prevPos = useRef({ x: cardX, y: cardY });
  // Swap to mock data for now
  const [trophies, setTrophies] = React.useState(MOCK_TROPHIES);

  // Commenting out the real fetch for now
  // useEffect(() => {
  //   async function fetchTrophies() {
  //     try {
  //       const data = await getUserTrophies(userId);
  //       setTrophies(data);
  //     } catch (err) {
  //       setTrophies([]);
  //     }
  //   }
  //   fetchTrophies();
  // }, [userId]);

  useEffect(() => {
    prevPos.current = { x: cardX, y: cardY };
  }, []); // set initial position only once

  // Physics setup
  useEffect(() => {
    if (!sceneRef.current || trophies.length === 0) return;
    // Clean up previous engine
    if (engineRef.current) {
      Matter.Render.stop(engineRef.current.render);
      Matter.Runner.stop(engineRef.current.runner);
      Matter.World.clear(engineRef.current.engine.world, false);
      Matter.Engine.clear(engineRef.current.engine);
      if (engineRef.current.render.canvas.parentNode) {
        engineRef.current.render.canvas.parentNode.removeChild(engineRef.current.render.canvas);
      }
    }
    // Create engine
    const engine = Matter.Engine.create();
    const world = engine.world;
    const render = Matter.Render.create({
      element: sceneRef.current,
      engine,
      options: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        wireframes: false,
        background: 'transparent',
      },
    });
    // Static boundaries
    const ground = Matter.Bodies.rectangle(CARD_WIDTH / 2, CARD_HEIGHT + 10, CARD_WIDTH, 20, { isStatic: true });
    const leftWall = Matter.Bodies.rectangle(-10, CARD_HEIGHT / 2, 20, CARD_HEIGHT, { isStatic: true });
    const rightWall = Matter.Bodies.rectangle(CARD_WIDTH + 10, CARD_HEIGHT / 2, 20, CARD_HEIGHT, { isStatic: true });
    Matter.World.add(world, [ground, leftWall, rightWall]);
    // Add trophy/badge bodies
    const bodies = trophies.map((trophy) => {
      const x = 60 + Math.random() * (CARD_WIDTH - 120);
      const y = 30 + Math.random() * 40;
      return Matter.Bodies.circle(x, y, BADGE_SIZE / 2, {
        restitution: 0.8,
        friction: 0.2,
        render: {
          sprite: {
            texture: getIconUrl(trophy.icon_url || trophy.icon_path),
            xScale: BADGE_SIZE / 175.46, // SVGs are 175.46px
            yScale: BADGE_SIZE / 175.46,
          },
        },
        label: trophy.name,
      });
    });
    Matter.World.add(world, bodies);
    // Mouse bumping (locked mode)
    if (!isEditable) {
      const mouse = Matter.Mouse.create(render.canvas);
      Matter.Events.on(render.canvas, 'mousemove', () => {
        const mousePos = mouse.position;
        bodies.forEach((body) => {
          const dx = body.position.x - mousePos.x;
          const dy = body.position.y - mousePos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < BADGE_SIZE) {
            // Apply a small force away from the mouse
            Matter.Body.applyForce(body, body.position, {
              x: dx * 0.0005,
              y: dy * 0.0005,
            });
          }
        });
      });
    }
    // Run engine
    Matter.Render.run(render);
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    // Save bodies for later use
    engineRef.current = { engine, render, runner, bodies };
    // Clean up
    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.World.clear(engine.world, false);
      Matter.Engine.clear(engine);
      if (render.canvas.parentNode) {
        render.canvas.parentNode.removeChild(render.canvas);
      }
    };
  }, [trophies, isEditable]);

  // React to card movement (when unlocked)
  useEffect(() => {
    if (!isEditable || !engineRef.current || !engineRef.current.bodies) return;
    const prev = prevPos.current;
    const dx = cardX - prev.x;
    const dy = cardY - prev.y;
    if (dx !== 0 || dy !== 0) {
      // Apply velocity to all badge bodies
      engineRef.current.bodies.forEach(body => {
        Matter.Body.setVelocity(body, {
          x: dx * 2, // tune multiplier for effect
          y: dy * 2,
        });
      });
    }
    prevPos.current = { x: cardX, y: cardY };
  }, [cardX, cardY, isEditable]);

  return (
    <Card title="Trophy Case" isEditable={isEditable}>
      <div
        ref={sceneRef}
        style={{ width: CARD_WIDTH, height: CARD_HEIGHT, margin: '0 auto', background: 'transparent' }}
      />
    </Card>
  );
};

export default TrophyPhysicsCard;
