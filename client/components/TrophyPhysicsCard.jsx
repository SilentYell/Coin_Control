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

const TrophyPhysicsCard = ({ userId, isEditable, cardX, cardY, gridW = 2, gridH = 4, rowHeight = 70 }) => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const prevPos = useRef({ x: cardX, y: cardY });
  const [trophies, setTrophies] = React.useState([]);
  const [dimensions, setDimensions] = React.useState({ width: 400, height: 260 });
  const containerRef = useRef(null);

  // Only create engine and bodies once, update boundaries/canvas on resize
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

  // Setup engine and bodies only once (or when trophies change)
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
    // Use initial dimensions
    const { width, height } = dimensions;
    const engine = Matter.Engine.create();
    const world = engine.world;
    const render = Matter.Render.create({
      element: sceneRef.current,
      engine,
      options: {
        width,
        height,
        wireframes: false,
        background: 'transparent',
      },
    });
    // Boundaries (will be updated on resize)
    const ground = Matter.Bodies.rectangle(width / 2, height + 10, width, 20, { isStatic: true });
    const leftWall = Matter.Bodies.rectangle(-10, height / 2, 20, height, { isStatic: true });
    const rightWall = Matter.Bodies.rectangle(width + 10, height / 2, 20, height, { isStatic: true });
    Matter.World.add(world, [ground, leftWall, rightWall]);
    // Add trophy/badge bodies
    const BADGE_SIZE = 64;
    const bodies = trophies.map((trophy) => {
      const x = 60 + Math.random() * (width - 120);
      const y = 30 + Math.random() * 40;
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
    // Mouse bumping (locked mode)
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

  // ResizeObserver: update canvas size and move boundaries, but do NOT recreate engine
  useEffect(() => {
    function updateDimensions() {
      if (containerRef.current && engineRef.current) {
        const width = containerRef.current.offsetWidth;
        const height = containerRef.current.offsetHeight;
        setDimensions({ width, height });
        // Update renderer size
        engineRef.current.render.options.width = width;
        engineRef.current.render.options.height = height;
        engineRef.current.render.canvas.width = width;
        engineRef.current.render.canvas.height = height;
        // Move boundaries
        Matter.Body.setPosition(engineRef.current.ground, { x: width / 2, y: height + 10 });
        Matter.Body.setVertices(engineRef.current.ground, Matter.Vertices.fromPath(`0 ${height},${width} ${height},${width} ${height+20},0 ${height+20}`));
        Matter.Body.setPosition(engineRef.current.leftWall, { x: -10, y: height / 2 });
        Matter.Body.setVertices(engineRef.current.leftWall, Matter.Vertices.fromPath(`-10 0,10 0,10 ${height},-10 ${height}`));
        Matter.Body.setPosition(engineRef.current.rightWall, { x: width + 10, y: height / 2 });
        Matter.Body.setVertices(engineRef.current.rightWall, Matter.Vertices.fromPath(`${width-10} 0,${width+10} 0,${width+10} ${height},${width-10} ${height}`));
      }
    }
    updateDimensions();
    let observer;
    if (containerRef.current && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(updateDimensions);
      observer.observe(containerRef.current);
    }
    window.addEventListener('resize', updateDimensions);
    return () => {
      window.removeEventListener('resize', updateDimensions);
      if (observer && containerRef.current) observer.disconnect();
    };
  }, []);

  // Apply border styling directly to canvas
  useEffect(() => {
    function updateCanvasBorder() {
      if (sceneRef.current) {
        // Find the canvas element inside sceneRef
        const canvas = sceneRef.current.querySelector('canvas');
        if (canvas) {
          canvas.style.border = '3px solid #1a237e';
          canvas.style.borderRadius = '18px';
          canvas.style.boxShadow = '0 2px 12px rgba(26,35,126,0.12)';
        }
      }
    }
    updateCanvasBorder();
    let observer;
    if (containerRef.current && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(updateCanvasBorder);
      observer.observe(containerRef.current);
    }
    window.addEventListener('resize', updateCanvasBorder);
    return () => {
      window.removeEventListener('resize', updateCanvasBorder);
      if (observer && containerRef.current) observer.disconnect();
    };
  }, []);

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
      <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
        <div ref={sceneRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </Card>
  );
};

export default TrophyPhysicsCard;
