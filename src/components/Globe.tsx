
"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { TerraEvent } from '@/lib/events-data';

interface GlobeProps {
  events: TerraEvent[];
  onEventClick: (event: TerraEvent) => void;
  hoveredEventId?: string | null;
}

const Globe: React.FC<GlobeProps> = ({ events, onEventClick, hoveredEventId }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const hotspotsRef = useRef<{ [key: string]: THREE.Mesh }>({});

  useEffect(() => {
    if (!mountRef.current) return;

    // Initialization
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Globe
    const radius = 5;
    const segments = 64;
    const globeGeometry = new THREE.SphereGeometry(radius, segments, segments);
    
    // Wireframe atmosphere/outline
    const globeMaterial = new THREE.MeshPhongMaterial({
      color: 0x3679DC,
      transparent: true,
      opacity: 0.2,
      wireframe: true,
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);

    // Solid inner core
    const coreGeometry = new THREE.SphereGeometry(radius * 0.99, segments, segments);
    const coreMaterial = new THREE.MeshPhongMaterial({
      color: 0x131416,
      transparent: false,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(core);

    // Grid lines
    const gridHelper = new THREE.PolarGridHelper(radius * 1.5, 16, 8, 64, 0x47E1E5, 0x131416);
    gridHelper.rotation.x = Math.PI / 2;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.05;
    scene.add(gridHelper);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x47E1E5, 2, 50);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    camera.position.z = 15;

    // Hotspot logic
    const createHotspot = (event: TerraEvent) => {
      const phi = (90 - event.lat) * (Math.PI / 180);
      const theta = (event.lon + 180) * (Math.PI / 180);

      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);

      const hotspotGeo = new THREE.SphereGeometry(0.12, 16, 16);
      let color = 0x47E1E5; // cyan/weather
      if (event.category === 'news') color = 0x3679DC; // blue
      if (event.category === 'social') color = 0x22c55e; // green

      const hotspotMat = new THREE.MeshPhongMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 1.5,
      });
      const hotspot = new THREE.Mesh(hotspotGeo, hotspotMat);
      hotspot.position.set(x, y, z);
      hotspot.userData = { event };
      
      // Ring around hotspot
      const ringGeo = new THREE.RingGeometry(0.15, 0.2, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.lookAt(new THREE.Vector3(0, 0, 0));
      hotspot.add(ring);

      scene.add(hotspot);
      hotspotsRef.current[event.id] = hotspot;
    };

    events.forEach(createHotspot);

    // Raycaster for clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children);

      for (const intersect of intersects) {
        if (intersect.object.userData.event) {
          onEventClick(intersect.object.userData.event);
          break;
        }
      }
    };

    window.addEventListener('click', onMouseClick);

    // Resize handling
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      globe.rotation.y += 0.0015;
      core.rotation.y += 0.0015;
      
      // Update hotspot rotations to face outward and pulse
      const time = Date.now() * 0.002;
      Object.values(hotspotsRef.current).forEach((hotspot) => {
        // Find rotation to match globe
        const pos = hotspot.position.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.0015);
        hotspot.position.copy(pos);
        
        // Pulse effect
        const scale = 1 + Math.sin(time) * 0.1;
        hotspot.scale.set(scale, scale, scale);
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('click', onMouseClick);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [events]);

  // Update hotspot visuals when hovered
  useEffect(() => {
    Object.entries(hotspotsRef.current).forEach(([id, mesh]) => {
      if (id === hoveredEventId) {
        mesh.scale.set(2, 2, 2);
        (mesh.material as THREE.MeshPhongMaterial).emissiveIntensity = 3;
      } else {
        mesh.scale.set(1, 1, 1);
        (mesh.material as THREE.MeshPhongMaterial).emissiveIntensity = 1.5;
      }
    });
  }, [hoveredEventId]);

  return <div ref={mountRef} className="canvas-container" />;
};

export default Globe;
