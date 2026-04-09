
"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TerraEvent } from '@/lib/events-data';

interface GlobeProps {
  events: TerraEvent[];
  onEventClick: (event: TerraEvent) => void;
  hoveredEventId?: string | null;
}

const Globe: React.FC<GlobeProps> = ({ events, onEventClick, hoveredEventId }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const globeGroupRef = useRef<THREE.Group>(new THREE.Group());
  const hotspotsRef = useRef<{ [key: string]: THREE.Mesh }>({});
  const controlsRef = useRef<OrbitControls | null>(null);

  const radius = 5;

  // Initialize scene
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.minDistance = 7;
    controls.maxDistance = 25;
    controls.enablePan = false; 
    controlsRef.current = controls;

    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg');
    const earthNormalMap = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg');
    const earthSpecularMap = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg');

    const globeGroup = globeGroupRef.current;
    scene.add(globeGroup);

    const segments = 64;
    const globeGeometry = new THREE.SphereGeometry(radius, segments, segments);
    const globeMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      normalMap: earthNormalMap,
      specularMap: earthSpecularMap,
      specular: new THREE.Color(0x333333),
      shininess: 5,
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    globeGroup.add(globe);

    // Clouds
    const cloudGeometry = new THREE.SphereGeometry(radius + 0.05, segments, segments);
    const cloudTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png');
    const cloudMaterial = new THREE.MeshPhongMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.4,
    });
    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    globeGroup.add(clouds);

    // Glow
    const glowGeometry = new THREE.SphereGeometry(radius * 1.15, segments, segments);
    const glowMaterial = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        glowColor: { value: new THREE.Color(0x3679DC) },
        viewVector: { value: camera.position }
      },
      vertexShader: `
        varying float intensity;
        void main() {
          vec3 vNormal = normalize( normalMatrix * normal );
          vec3 vNormel = normalize( normalMatrix * vec3(0.0, 0.0, 1.0) );
          intensity = pow( 0.6 - dot(vNormal, vNormel), 2.0 );
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying float intensity;
        void main() {
          vec3 glow = glowColor * intensity;
          gl_FragColor = vec4( glow, intensity );
        }
      `,
      side: THREE.BackSide
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(5, 3, 5);
    scene.add(mainLight);

    const backLight = new THREE.DirectionalLight(0x3679DC, 0.5);
    backLight.position.set(-5, -3, -5);
    scene.add(backLight);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let mouseDownTime = 0;

    const onMouseDown = () => { mouseDownTime = Date.now(); };
    const onMouseUp = (e: MouseEvent) => {
      if (Date.now() - mouseDownTime > 250) return;
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(globeGroup.children, true);
      for (const intersect of intersects) {
        let obj = intersect.object;
        while (obj && !obj.userData.event && obj.parent) { obj = obj.parent; }
        if (obj && obj.userData.event) {
          onEventClick(obj.userData.event);
          break;
        }
      }
    };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      clouds.rotation.y += 0.0002;
      const time = Date.now() * 0.003;
      Object.values(hotspotsRef.current).forEach((hotspot) => {
        const scale = 1 + Math.sin(time) * 0.15;
        hotspot.scale.set(scale, scale, scale);
      });
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  // Update hotspots when events change
  useEffect(() => {
    const globeGroup = globeGroupRef.current;
    
    // Clear old hotspots
    Object.values(hotspotsRef.current).forEach(h => globeGroup.remove(h));
    hotspotsRef.current = {};

    const createHotspot = (event: TerraEvent) => {
      const phi = (90 - event.lat) * (Math.PI / 180);
      const theta = (event.lon + 180) * (Math.PI / 180);

      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);

      const hotspotGeo = new THREE.SphereGeometry(0.12, 16, 16);
      let color = 0x47E1E5; 
      if (event.category === 'news') color = 0x3679DC;
      if (event.category === 'social') color = 0x22c55e;
      if (event.category === 'politics') color = 0xef4444;
      if (event.category === 'trends') color = 0xec4899;

      const hotspotMat = new THREE.MeshPhongMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 1.5,
      });
      const hotspot = new THREE.Mesh(hotspotGeo, hotspotMat);
      hotspot.position.set(x, y, z);
      hotspot.userData = { event };
      
      const ringGeo = new THREE.RingGeometry(0.15, 0.22, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.lookAt(new THREE.Vector3(0, 0, 0));
      hotspot.add(ring);

      globeGroup.add(hotspot);
      hotspotsRef.current[event.id] = hotspot;
    };

    events.forEach(createHotspot);
  }, [events]);

  // Update visual state of hovered/selected hotspot
  useEffect(() => {
    Object.entries(hotspotsRef.current).forEach(([id, mesh]) => {
      if (id === hoveredEventId) {
        mesh.scale.set(2.5, 2.5, 2.5);
        (mesh.material as THREE.MeshPhongMaterial).emissiveIntensity = 4;
      } else {
        mesh.scale.set(1, 1, 1);
        (mesh.material as THREE.MeshPhongMaterial).emissiveIntensity = 1.5;
      }
    });
  }, [hoveredEventId]);

  return <div ref={mountRef} className="canvas-container" />;
};

export default Globe;
