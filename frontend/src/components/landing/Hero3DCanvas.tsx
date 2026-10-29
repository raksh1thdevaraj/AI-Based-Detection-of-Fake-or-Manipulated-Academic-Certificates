import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ShieldCheck, Scan, Layers } from 'lucide-react';

/**
 * Procedural 2D Canvas Renderer for the VTU Convocation Certificate Texture.
 * Renders high-fidelity VTU emblem, security guilloche borders, candidate name,
 * USN, holographic seal, and Controller of Examinations digital stamp.
 */
export function renderVTUCertificateCanvas(ctx: CanvasRenderingContext2D): void {
  // Dark luxurious parchment background
  const bgGrad = ctx.createLinearGradient(0, 0, 1024, 1448);
  bgGrad.addColorStop(0, '#0f172a');
  bgGrad.addColorStop(0.5, '#131d36');
  bgGrad.addColorStop(1, '#0b1120');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 1448);

  // Guilloche ornate double border
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
  ctx.lineWidth = 6;
  ctx.strokeRect(36, 36, 952, 1376);

  ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(52, 52, 920, 1344);

  // Micro-pattern security corner accents
  const drawCorner = (x: number, y: number, angle: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(40, 0);
    ctx.lineTo(40, 40);
    ctx.stroke();
    ctx.restore();
  };
  drawCorner(70, 70, 0);
  drawCorner(954, 70, Math.PI / 2);
  drawCorner(954, 1378, Math.PI);
  drawCorner(70, 1378, -Math.PI / 2);

  // --- VTU EMBLEM PLACEHOLDER (Center-Top) ---
  ctx.save();
  ctx.translate(512, 175);

  // Gear cog teeth around perimeter (VTU engineering motif)
  ctx.fillStyle = 'rgba(245, 158, 11, 0.85)'; // gold
  for (let i = 0; i < 24; i++) {
    ctx.rotate((Math.PI * 2) / 24);
    ctx.fillRect(-5, -68, 10, 12);
  }

  // Outer gold circle
  ctx.beginPath();
  ctx.arc(0, 0, 64, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.9)';
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // Emerald inner border ring
  ctx.beginPath();
  ctx.arc(0, 0, 52, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.8)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Center VTU Monogram & Foundation Year
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 36px serif';
  ctx.fillText('VTU', 0, 8);
  ctx.font = 'bold 11px monospace';
  ctx.fillStyle = 'rgba(52, 211, 153, 0.9)';
  ctx.fillText('ESTD 1998', 0, 26);
  ctx.restore();

  // --- 1. INSTITUTION TITLE & SUBHEADER ---
  ctx.textAlign = 'center';

  // Primary header
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 32px serif';
  ctx.fillText('VISVESVARAYA TECHNOLOGICAL UNIVERSITY', 512, 282);

  // Subtitle / Regional headquarters
  ctx.fillStyle = 'rgba(52, 211, 153, 0.95)';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('Jnana Sangama, Belagavi, Karnataka - 590018', 512, 318);

  // Decorative divider
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(140, 355);
  ctx.lineTo(884, 355);
  ctx.stroke();

  // Diploma category subtitle
  ctx.fillStyle = 'rgba(245, 158, 11, 0.9)';
  ctx.font = 'bold 18px monospace';
  ctx.fillText('OFFICIAL DEGREE CONVOCATION CERTIFICATE', 512, 388);

  // --- 2. UNIVERSITY SEAT NUMBER (USN) FIELD ---
  ctx.save();
  const usnBoxX = 262;
  const usnBoxY = 412;
  const usnBoxW = 500;
  const usnBoxH = 68;

  // Dark emerald glass background with border
  ctx.fillStyle = 'rgba(6, 78, 59, 0.35)';
  ctx.fillRect(usnBoxX, usnBoxY, usnBoxW, usnBoxH);
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.85)';
  ctx.lineWidth = 2;
  ctx.strokeRect(usnBoxX, usnBoxY, usnBoxW, usnBoxH);

  // USN Label
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(52, 211, 153, 0.95)';
  ctx.font = 'bold 12px monospace';
  ctx.fillText('UNIVERSITY SEAT NUMBER (USN)', 512, 434);

  // USN Number Value
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 28px monospace';
  ctx.fillText('1RE22CS089', 512, 466);

  // Micro badge inside USN box
  ctx.font = 'bold 10px monospace';
  ctx.fillStyle = 'rgba(16, 185, 129, 0.9)';
  ctx.fillText('[AUTHENTICATED]', 700, 452);
  ctx.restore();

  // --- CANDIDATE CITATION ---
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(203, 213, 225, 0.9)';
  ctx.font = 'italic 23px serif';
  ctx.fillText('This is to certify that', 512, 520);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 40px sans-serif';
  ctx.fillText('RAKSHITH DEVARAJ', 512, 572);

  ctx.fillStyle = 'rgba(148, 163, 184, 0.85)';
  ctx.font = '20px sans-serif';
  ctx.fillText('has fulfilled all academic requirements and is duly admitted to the Degree of', 512, 622);

  ctx.fillStyle = 'rgba(245, 158, 11, 0.95)';
  ctx.font = 'bold 30px serif';
  ctx.fillText('BACHELOR OF ENGINEERING', 512, 668);

  ctx.fillStyle = 'rgba(6, 182, 212, 0.95)';
  ctx.font = 'bold 23px sans-serif';
  ctx.fillText('IN COMPUTER SCIENCE AND ENGINEERING', 512, 706);

  ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
  ctx.font = '16px monospace';
  ctx.fillText('FIRST CLASS WITH DISTINCTION • CGPA: 9.42 / 10.0', 512, 746);

  ctx.fillStyle = 'rgba(100, 116, 139, 0.9)';
  ctx.font = 'italic 15px serif';
  ctx.fillText('Conferred at the 24th Annual Convocation held at Jnana Sangama, Belagavi', 512, 782);

  // --- 3. HOLOGRAPHIC SECURITY SEAL (Bottom-Left) ---
  ctx.save();
  ctx.translate(260, 930);

  // Prismatic iridescent radial gradient
  const holoGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, 68);
  holoGrad.addColorStop(0, '#f472b6');   // pink
  holoGrad.addColorStop(0.2, '#38bdf8'); // cyan
  holoGrad.addColorStop(0.4, '#34d399'); // emerald
  holoGrad.addColorStop(0.6, '#fbbf24'); // gold
  holoGrad.addColorStop(0.8, '#a78bfa'); // violet
  holoGrad.addColorStop(1, '#0369a1');   // deep blue

  ctx.beginPath();
  ctx.arc(0, 0, 68, 0, Math.PI * 2);
  ctx.fillStyle = holoGrad;
  ctx.globalAlpha = 0.85;
  ctx.fill();
  ctx.globalAlpha = 1.0;

  // Concentric diffraction lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 1.5;
  for (let r = 20; r <= 60; r += 10) {
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Radiating holographic sunburst rays
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  for (let a = 0; a < 12; a++) {
    ctx.rotate(Math.PI / 6);
    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.lineTo(64, 0);
    ctx.stroke();
  }

  // Hologram Center Text & Microtext
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = 'bold 15px monospace';
  ctx.fillText('VTU SEAL', 0, -6);
  ctx.font = 'bold 9px monospace';
  ctx.fillText('GENUINE', 0, 9);
  ctx.font = 'bold 7px monospace';
  ctx.fillText('SECURITY HOLOGRAM', 0, 22);

  // Specular sheen overlay
  const sheenGrad = ctx.createLinearGradient(-50, -50, 50, 50);
  sheenGrad.addColorStop(0, 'rgba(255,255,255,0.45)');
  sheenGrad.addColorStop(0.5, 'rgba(255,255,255,0)');
  sheenGrad.addColorStop(1, 'rgba(255,255,255,0.25)');
  ctx.fillStyle = sheenGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 68, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // --- 4. DIGITAL SIGNATURE STAMP (Bottom-Right) ---
  ctx.save();
  ctx.translate(760, 930);

  // Official digital authentication stamp box
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.85)';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(-95, -60, 190, 120);

  ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-88, -53, 176, 106);

  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(6, 182, 212, 0.95)';
  ctx.font = 'bold 11px monospace';
  ctx.fillText('VTU DIGITAL SIGNATURE', 0, -35);

  // Simulated cursive signature
  ctx.fillStyle = 'rgba(241, 245, 249, 0.95)';
  ctx.font = 'italic 20px cursive';
  ctx.fillText('Dr. B. E. Rangaswamy', 0, -8);

  ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
  ctx.font = 'bold 10px monospace';
  ctx.fillText('CONTROLLER OF EXAMINATIONS', 0, 13);

  ctx.fillStyle = 'rgba(16, 185, 129, 0.95)';
  ctx.font = 'bold 9px monospace';
  ctx.fillText('PKI-ECDSA-SHA256 • VALID', 0, 31);
  ctx.fillText('KEY ID: 0x9F83A2B7 • 2026', 0, 44);
  ctx.restore();

  // Traditional signature lines
  ctx.textAlign = 'center';
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(180, 1070);
  ctx.lineTo(380, 1070);
  ctx.moveTo(644, 1070);
  ctx.lineTo(844, 1070);
  ctx.stroke();

  ctx.fillStyle = 'rgba(203, 213, 225, 0.8)';
  ctx.font = 'italic 18px cursive';
  ctx.fillText('Arthur Pendelton, Ph.D.', 280, 1055);
  ctx.fillText('Prof. S. Vidyashankar', 744, 1055);

  ctx.font = '13px monospace';
  ctx.fillStyle = 'rgba(100, 116, 139, 0.9)';
  ctx.fillText('Controller of Examinations', 280, 1092);
  ctx.fillText('Vice-Chancellor', 744, 1092);

  // --- CRYPTOGRAPHIC HASH & MERKLE LEDGER BOX ---
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
  ctx.strokeRect(100, 1140, 824, 130);
  ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
  ctx.fillRect(100, 1140, 824, 130);

  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(16, 185, 129, 0.9)';
  ctx.font = '13px monospace';
  ctx.fillText('BLOCKCHAIN HASH  : 0x9f83a2b7c4d1e8902bca47102e3b8f1d7a6e5c9b', 120, 1175);
  ctx.fillText('USN MERKLE PROOF : VTU-USN-1RE22CS089-VERIFIED-LEVEL4', 120, 1205);
  ctx.fillText('HMAC SIGNATURE   : a72f10b3e58914c6d29871fa01cb74ef62d981ba', 120, 1235);

  // Watermark Stamp
  ctx.save();
  ctx.translate(512, 1000);
  ctx.rotate(-Math.PI / 14);
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
  ctx.lineWidth = 3.5;
  ctx.strokeRect(-170, -35, 340, 70);
  ctx.fillStyle = 'rgba(16, 185, 129, 0.45)';
  ctx.font = 'bold 22px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('VTU FORENSIC INTEGRITY: 99.8%', 0, 7);
  ctx.restore();
}

export const Hero3DCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isWebGLAvailable, setIsWebGLAvailable] = useState<boolean>(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setIsWebGLAvailable(false);
        return;
      }
    } catch {
      setIsWebGLAvailable(false);
      return;
    }

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0f19, 0.12);

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // --- PROCEDURAL CERTIFICATE TEXTURE ---
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1448; // Standard A4 aspect ratio
    const ctx = canvas.getContext('2d');
    if (ctx) {
      renderVTUCertificateCanvas(ctx);
    }

    const certificateTexture = new THREE.CanvasTexture(canvas);
    certificateTexture.minFilter = THREE.LinearMipmapLinearFilter;
    certificateTexture.magFilter = THREE.LinearFilter;

    // --- CERTIFICATE 3D MESH ---
    const certWidth = 2.0;
    const certHeight = 2.82; // 1 : 1.414 ratio
    const certGeometry = new THREE.BoxGeometry(certWidth, certHeight, 0.02);

    // Front: Certificate Texture, Back/Sides: Dark Sleek Slate
    const sideMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.5,
      metalness: 0.8,
    });
    const frontMaterial = new THREE.MeshStandardMaterial({
      map: certificateTexture,
      roughness: 0.3,
      metalness: 0.2,
      emissive: 0x064e3b,
      emissiveIntensity: 0.05,
    });

    const materials = [
      sideMaterial, // right
      sideMaterial, // left
      sideMaterial, // top
      sideMaterial, // bottom
      frontMaterial, // front
      sideMaterial, // back
    ];

    const certificateMesh = new THREE.Mesh(certGeometry, materials);
    certificateMesh.castShadow = true;
    certificateMesh.receiveShadow = true;

    // Outer Glowing Frame / Shield Ring
    const frameGeometry = new THREE.RingGeometry(1.65, 1.68, 64);
    const frameMaterial = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const outerRing = new THREE.Mesh(frameGeometry, frameMaterial);
    outerRing.position.z = -0.05;

    // --- SCANNING LASER PLANE ---
    const laserGeometry = new THREE.PlaneGeometry(certWidth * 1.15, 0.08);
    const laserMaterial = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const laserBeam = new THREE.Mesh(laserGeometry, laserMaterial);
    laserBeam.position.z = 0.03;

    // Laser glow aura
    const auraGeometry = new THREE.PlaneGeometry(certWidth * 1.15, 0.4);
    const auraMaterial = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const laserAura = new THREE.Mesh(auraGeometry, auraMaterial);
    laserAura.position.z = 0.025;

    const laserGroup = new THREE.Group();
    laserGroup.add(laserBeam);
    laserGroup.add(laserAura);

    // --- POINT CLOUD FORENSIC VERTICES ---
    const particleCount = 280;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const emerald = new THREE.Color(0x10b981);
    const cyan = new THREE.Color(0x06b6d4);
    const amber = new THREE.Color(0xf59e0b);

    for (let i = 0; i < particleCount; i++) {
      // Points distributed across certificate bounds representing OCR tokens and ELA anchors
      particlePositions[i * 3] = (Math.random() - 0.5) * (certWidth * 0.95);
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * (certHeight * 0.95);
      particlePositions[i * 3 + 2] = 0.03 + Math.random() * 0.08;

      const col = Math.random() > 0.3 ? emerald : Math.random() > 0.5 ? cyan : amber;
      particleColors[i * 3] = col.r;
      particleColors[i * 3 + 1] = col.g;
      particleColors[i * 3 + 2] = col.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.035,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);

    // Master Diploma Group
    const diplomaGroup = new THREE.Group();
    diplomaGroup.add(certificateMesh);
    diplomaGroup.add(outerRing);
    diplomaGroup.add(laserGroup);
    diplomaGroup.add(particles);
    diplomaGroup.rotation.y = -0.15;
    diplomaGroup.rotation.x = 0.1;
    scene.add(diplomaGroup);

    // Background floating ambient cyber nodes
    const ambientCount = 120;
    const ambientGeometry = new THREE.BufferGeometry();
    const ambientPositions = new Float32Array(ambientCount * 3);

    for (let i = 0; i < ambientCount; i++) {
      ambientPositions[i * 3] = (Math.random() - 0.5) * 10;
      ambientPositions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      ambientPositions[i * 3 + 2] = -1 - Math.random() * 4;
    }
    ambientGeometry.setAttribute('position', new THREE.BufferAttribute(ambientPositions, 3));
    const ambientParticles = new THREE.Points(
      ambientGeometry,
      new THREE.PointsMaterial({
        color: 0x334155,
        size: 0.025,
        transparent: true,
        opacity: 0.5,
      })
    );
    scene.add(ambientParticles);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x10b981, 2.5, 8);
    pointLight.position.set(1.5, 2, 2);
    scene.add(pointLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 2, 8);
    cyanLight.position.set(-1.5, -1.5, 2);
    scene.add(cyanLight);

    // Mouse Interaction Parallax with Lerp
    let targetRotationX = 0.08;
    let targetRotationY = -0.12;
    let currentRotationX = 0.08;
    let currentRotationY = -0.12;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      targetRotationY = x * 0.35;
      targetRotationX = -y * 0.25;
    };

    const handleMouseEnter = () => {};
    const handleMouseLeave = () => {
      targetRotationX = 0.08;
      targetRotationY = -0.12;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Lerp mouse parallax smoothing
      currentRotationX += (targetRotationX - currentRotationX) * 0.06;
      currentRotationY += (targetRotationY - currentRotationY) * 0.06;

      diplomaGroup.rotation.x = currentRotationX;
      diplomaGroup.rotation.y = currentRotationY;

      // Gentle floating levitation
      diplomaGroup.position.y = Math.sin(elapsedTime * 1.8) * 0.08;

      // Scanning Laser Movement (sweeping up and down)
      const laserY = Math.sin(elapsedTime * 2.2) * (certHeight * 0.45);
      laserGroup.position.y = laserY;

      // Rotate outer holographic ring
      outerRing.rotation.z = elapsedTime * 0.15;

      // Particle vertex pulse
      particleMaterial.size = 0.032 + Math.sin(elapsedTime * 3) * 0.008;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);

      renderer.dispose();
      certGeometry.dispose();
      frameGeometry.dispose();
      laserGeometry.dispose();
      auraGeometry.dispose();
      particleGeometry.dispose();
      ambientGeometry.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[420px] sm:h-[500px] lg:h-[560px] flex items-center justify-center">
      {/* Three.js canvas container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing relative z-10"
        title="Interactive 3D Diploma: Move mouse to tilt parallax, inspect laser scanner"
      />

      {/* Floating HUD status cards */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/60 backdrop-blur-md text-[11px] font-mono text-emerald-400">
        <Scan className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
        <span>LASER OCR SWEEP: ACTIVE</span>
      </div>

      <div className="absolute bottom-6 right-4 z-20 pointer-events-none hidden sm:flex flex-col space-y-1 p-3 rounded-2xl bg-slate-900/85 border border-slate-700/60 backdrop-blur-md text-[10px] font-mono text-slate-300 shadow-xl">
        <div className="flex items-center space-x-1.5 text-cyan-400 font-semibold">
          <Layers className="w-3.5 h-3.5" />
          <span>Point-Cloud Feature Mesh</span>
        </div>
        <div className="text-slate-400 flex justify-between gap-4">
          <span>OCR Bounding Vertices</span>
          <span className="text-emerald-400 font-bold">280 nodes</span>
        </div>
        <div className="text-slate-400 flex justify-between gap-4">
          <span>ELA Difference Map</span>
          <span className="text-cyan-400 font-bold">Multi-Scale DCT</span>
        </div>
        <div className="text-slate-400 flex justify-between gap-4">
          <span>Homography Alignment</span>
          <span className="text-emerald-400 font-bold">SIFT / ORB</span>
        </div>
      </div>

      {/* Non-WebGL Fallback */}
      {!isWebGLAvailable && (
        <div
          data-testid="hero-vtu-certificate-fallback"
          className="absolute inset-0 flex flex-col items-center justify-between p-6 text-center bg-slate-900/95 rounded-3xl border border-emerald-500/40 backdrop-blur-md shadow-2xl overflow-hidden"
        >
          {/* Top: VTU Emblem & Institution Header */}
          <div className="space-y-1 w-full">
            <div className="w-12 h-12 rounded-full border-2 border-amber-400 bg-slate-950/80 mx-auto flex items-center justify-center text-amber-400 font-bold font-serif text-sm shadow-lg shadow-amber-400/20">
              VTU
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-100 font-serif">
              Visvesvaraya Technological University
            </h3>
            <p className="text-[11px] font-mono text-cyan-400">
              Jnana Sangama, Belagavi, Karnataka - 590018
            </p>
          </div>

          {/* Middle: USN Field & Candidate citation */}
          <div className="w-full max-w-xs space-y-2 py-2">
            <div className="px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-center">
              <span className="text-[9px] font-mono text-emerald-300 block uppercase">
                University Seat Number (USN)
              </span>
              <span className="text-base font-mono font-bold text-cyan-300">
                1RE22CS089
              </span>
            </div>
            <p className="text-sm font-bold text-white tracking-wide">
              RAKSHITH DEVARAJ
            </p>
            <p className="text-xs font-semibold text-slate-200">
              Bachelor of Engineering in Computer Science and Engineering
            </p>
          </div>

          {/* Bottom: Holographic Seal & Digital Stamp Badges */}
          <div className="w-full flex items-center justify-between pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400">
            <div className="flex items-center space-x-1.5 text-pink-400">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-pink-400 via-cyan-400 to-amber-400" />
              <span>Holographic Security Seal</span>
            </div>
            <div className="flex items-center space-x-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Controller of Examinations Digital Stamp</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
