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

const TrophyPhysicsCard = ({ userId, isEditable, cardX, cardY }) => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const prevPos = useRef({ x: cardX, y: cardY });
  const [trophies, setTrophies] = React.useState([]);

  useEffect(() => {
    async function fetchTrophies() {
      try {
        const data = await getUserTrophies(userId);
        setTrophies(data);
      } catch {
        setTrophies([]);
      }
    }
    fetchTrophies();
  }, [userId]);

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
      // Enable click-and-drag for badges
      const mouse = Matter.Mouse.create(render.canvas);
      const mouseConstraint = Matter.MouseConstraint.create(engine, {
        mouse,
        constraint: {
          stiffness: 0.2,
          render: { visible: false },
        },
        // Only allow dragging badge bodies
        collisionFilter: {
          mask: 0x0001,
        },
      });
      // Set all badge bodies to the same collision group
      bodies.forEach(body => { body.collisionFilter = { group: 0, category: 0x0001, mask: 0xFFFFFFFF }; });
      Matter.World.add(world, mouseConstraint);
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
