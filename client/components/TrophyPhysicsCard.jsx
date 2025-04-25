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

const TrophyPhysicsCard = ({ userId, isEditable, cardX, cardY, trophiesList }) => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const prevPos = useRef({ x: cardX, y: cardY });
  const [trophies, setTrophies] = React.useState([]);
  const width = 420;
  const height = 600;
  const containerRef = useRef(null);

  useEffect(() => {
    if (trophiesList && trophiesList.length > 0) {
      setTrophies(trophiesList);
      return;
    }
    async function fetchTrophies() {
      try {
        const data = await getUserTrophies(userId);
        setTrophies(data);
      } catch {
        setTrophies([]);
      }
    }
    fetchTrophies();
  }, [userId, trophiesList]);

  useEffect(() => {
    prevPos.current = { x: cardX, y: cardY };
  }, [cardX, cardY]);

  useEffect(() => {
    if (!sceneRef.current || trophies.length === 0) return;
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
    Matter.World.add(world, [ground, leftWall, rightWall]);
    const BADGE_SIZE = 64;
    const margin = BADGE_SIZE / 2 + 8;
    const bodies = trophies.map((trophy) => {
      const x = margin + Math.random() * (width - 2 * margin);
      const y = margin + Math.random() * (height - 2 * margin);
      return Matter.Bodies.circle(x, y, BADGE_SIZE / 2, {
        restitution: 0.8,
        friction: 0.2,
        render: {
          sprite: {
            texture: getIconUrl(trophy.icon_url || trophy.icon_path),
            xScale: BADGE_SIZE / 175.46,
            yScale: BADGE_SIZE / 175.46,
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
    Matter.Render.run(render);
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    engineRef.current = { engine, render, runner, bodies, ground, leftWall, rightWall };
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

  useEffect(() => {
    function updateCanvasBorder() {
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
    }
    // Call immediately on mount
    updateCanvasBorder();
    window.addEventListener('resize', updateCanvasBorder);
    return () => {
      window.removeEventListener('resize', updateCanvasBorder);
    };
  }, []);

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
      <div ref={containerRef} style={{ width: width, height: height, overflow: 'hidden', boxSizing: 'border-box', margin: '0 auto' }}>
        <div ref={sceneRef} style={{ width: '100%', height: '100%', boxSizing: 'border-box' }} />
      </div>
    </Card>
  );
};

export default TrophyPhysicsCard;
