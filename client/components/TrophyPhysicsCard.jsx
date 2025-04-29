import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import Card from './Card';
import { getUserTrophies } from '../services/api';

const TrophyPhysicsCard = ({ isEditable, cardX, cardY, refreshSignal, isResizing }) => {

  // Local state for trophies
  const [localTrophies, setLocalTrophies] = useState([]);
  const [containerSize, setContainerSize] = useState({ width: 420, height: 600 });
  const [isReady, setIsReady] = useState(false);

  // Update state when refreshSignal prop changes
  useEffect(() => {
    const fetchTrophies = async () => {
      try {
        const userId = 1;
        const data = await getUserTrophies(userId); // ✅ await the actual data
        setLocalTrophies(data); // ✅ now data is the array, not a Promise
      } catch (error) {
        console.error('Error fetching trophies', error);
      }
    };

    fetchTrophies();
  }, [refreshSignal]);

  useEffect(() => {
    // Delay rendering canvas until after first paint
    const timer = setTimeout(() => setIsReady(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const prevTrophiesRef = useRef([]);
  const prevPos = useRef({ x: cardX, y: cardY });
  const containerRef = useRef(null);

  useEffect(() => {
    prevPos.current = { x: cardX, y: cardY };
  }, [cardX, cardY]);

  // Responsive: observe container size
  useEffect(() => {
    if (isResizing) return; // Don't update container size during resize
    const container = containerRef.current;
    if (!container) return;
    const resizeObserver = new window.ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setContainerSize({ width: Math.round(width), height: Math.round(height) });
      }
    });
    resizeObserver.observe(container);
    // Set initial size
    setContainerSize({
      width: Math.round(container.offsetWidth),
      height: Math.round(container.offsetHeight)
    });
    return () => resizeObserver.disconnect();
  }, [isResizing]);

  // Helper to robustly get the icon url from trophy object
  function getTrophyIconUrl(trophy) {
    if (trophy.icon_path && trophy.icon_path.trim() !== '') {
      if (trophy.icon_path.endsWith('.svg') || trophy.icon_path.endsWith('.png')) return `http://localhost:3000/images/${trophy.icon_path}`;
    }
    return '';
  }

  // Preload all trophy images before creating Matter.js bodies
  function preloadImages(trophies) {
    return Promise.all(
      trophies.map(trophy => {
        return new Promise(resolve => {
          const img = new window.Image();
          img.onload = () => resolve({ ...trophy, _img: img });
          img.onerror = () => resolve(null) // skip broken images
          img.src = getTrophyIconUrl(trophy);
        });
      })
    ).then(results => results.filter(Boolean));
  }

  const trophyScaleMap = {
    'bronze.png': 1.0,
    'silver.png': 1.0,
    'gold.png': 1.0,
    'platinum.png': 1.0,
    'first_steps.svg': 1.1,
    'consistent_logger.svg': 1.1,
    'save_10.svg': 1.1,
    'save_50.svg': 1.1,
    'save_100.svg': 1.1,
    'spend_10.svg': 1.1,
    'spend_50.svg': 1.1,
    'spend_100.svg': 1.1,
    'spend_1000.svg': 1.1,
    'first_savings.png': 1.1,
    'first_transaction.png': 1.1,
    'equal_to_goal.png': 1.1,
    'save_1000.png': 1.1,
    'use_all_features.png': 1.1,
  };

  // Initalize the Matter.js engines and add trophies
  const initializePhysics = (loadedTrophies) => {
    const { width, height } = containerSize;
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

    // Create Boundaries
    const ground = Matter.Bodies.rectangle(width / 2, height + 10, width, 20, { isStatic: true });
    const leftWall = Matter.Bodies.rectangle(-10, height / 2, 20, height, { isStatic: true });
    const rightWall = Matter.Bodies.rectangle(width + 10, height / 2, 20, height, { isStatic: true });
    const topWall = Matter.Bodies.rectangle(width / 2, -10, width, 20, { isStatic: true, label: 'topWall' });
    Matter.World.add(world, [ground, leftWall, rightWall, topWall]);

    // Set up trophy scale and physics properties
    const BADGE_SIZE = Math.max(60, Math.min(width, height) / 5); // scale badge size for mobile
    const COLLISION_RADIUS = (BADGE_SIZE / 2) * 1.1;
    const margin = COLLISION_RADIUS + 1;
    const bodies = loadedTrophies.map((trophy) => {
      const iconFile = trophy.icon_path ? trophy.icon_path.split('/').pop() : '';
      const scaleFactor = trophyScaleMap[iconFile] || 1.0;

      // Use the image's natural size for scaling (works for both SVG and PNG)
      const img = trophy._img;
      const naturalWidth = img && (img.naturalWidth || img.width || BADGE_SIZE);
      const naturalHeight = img && (img.naturalHeight || img.height || BADGE_SIZE);
      const xScale = (BADGE_SIZE / naturalWidth) * scaleFactor;
      const yScale = (BADGE_SIZE / naturalHeight) * scaleFactor;
      const x = margin + Math.random() * (width - 2 * margin);
      const y = margin + Math.random() * (height - 2 * margin);

      return Matter.Bodies.circle(x, y, COLLISION_RADIUS, {
        restitution: 0.8,
        friction: 0.2,
        density: 0.005,
        mass: 2,
        render: {
          sprite: {
            texture: getTrophyIconUrl(trophy),
            xScale,
            yScale,
            img: trophy._img,
          },
        },
        label: trophy.name,
      });

    });

    // Add bodies to the Matter.js world
    Matter.World.add(world, bodies);

    // If not editable, add mouse constraint to drag trophies
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

    // Run the Matter.js engine
    Matter.Render.run(render);

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
    engineRef.current = { engine, render, runner, bodies, ground, leftWall, rightWall, topWall };

    // Cleanup function to remove Matter.js engine on coomponent unmount or when localTrophies changes
    const cleanup = () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.World.clear(engine.world, false);
      Matter.Engine.clear(engine);
      if (render.canvas.parentNode) {
        render.canvas.parentNode.removeChild(render.canvas);
      }
    };
    return cleanup;
  };

  useEffect(() => {
    let cleanup = () => {};
    let cancelled = false;
    if (!sceneRef.current || !localTrophies || localTrophies.length === 0 || !isReady || isResizing) return;

    // Clear existing engine if any
    if (engineRef.current) {
        Matter.Render.stop(engineRef.current.render);
        Matter.Runner.stop(engineRef.current.runner);
        Matter.World.clear(engineRef.current.engine.world, false);
        Matter.Engine.clear(engineRef.current.engine);
        if (engineRef.current.render.canvas.parentNode) {
          engineRef.current.render.canvas.parentNode.removeChild(engineRef.current.render.canvas);
        }
        engineRef.current = null;
    }

    preloadImages(localTrophies).then(loadedTrophies => {
      if (cancelled) return;
      if (JSON.stringify(prevTrophiesRef.current !== JSON.stringify(localTrophies))) {
        prevTrophiesRef.current = localTrophies;
        cleanup = initializePhysics(loadedTrophies)
      }
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [localTrophies, containerSize, isReady, isResizing]);

  // Dynamically add/remove MouseConstraint based on isEditable
  useEffect(() => {
    if (!engineRef.current) return;
    const { engine, render, bodies } = engineRef.current;
    // Remove all MouseConstraints first
    Matter.Composite.allConstraints(engine.world).forEach(constraint => {
      if (constraint.label === 'Mouse Constraint') {
        Matter.World.remove(engine.world, constraint);
      }
    });
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
      Matter.World.add(engine.world, mouseConstraint);
    }
  }, [isEditable]);

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
    <Card title="Collection" isEditable={isEditable}>
      {isReady && !isResizing && (
        <div ref={containerRef} style={{ width: '100%', height: '100%', minHeight: 260, margin: 0, padding: 0 }}>
          <div ref={sceneRef} style={{ width: '100%', height: '100%', boxSizing: 'border-box', margin: 0, padding: 0 }} />
        </div>
      )}
    </Card>
  );
};

export default TrophyPhysicsCard;
