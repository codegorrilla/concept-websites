import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// ── World-space constants (keep in sync with geometry) ──────────────────────
const THREAD_PIVOT_Y  = 4.80;   // y where thread is pinned (top of scene)
const THREAD_LEN      = 1.35;   // string length
const BAG_HALF_H      = 0.41;   // half tea-bag height
const CUP_GROUP_Z     = 1.50;   // cup group world Z
const CUP_ROTATION_Y  = 0.28;   // cup Y-rotation (radians)
const WATER_REL_Y     = 0.40;   // water surface Y relative to cup group
const PARTICLE_COUNT  = 180;

// ── Mouse listener ──────────────────────────────────────────────────────────
function MouseListener({ mouseRef }) {
  const { gl } = useThree();
  useEffect(() => {
    const fn = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    };
    const el = gl.domElement;
    el.addEventListener('mousemove', fn);
    return () => el.removeEventListener('mousemove', fn);
  }, [gl, mouseRef]);
  return null;
}

// ── Tea Bag (pendulum) ──────────────────────────────────────────────────────
function TeaBag({ mouseRef, scrollProgress, bagAngleRef }) {
  const pivotRef = useRef();
  const bagRef   = useRef();
  const spring   = useRef({ angle: 0, vel: 0 });

  // Thread: straight line from pivot down to bag
  const threadGeo = useMemo(() => new THREE.TubeGeometry(
    new THREE.LineCurve3(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, -THREAD_LEN, 0)
    ), 10, 0.007, 5, false
  ), []);

  // Tag string: slight curve from bag top to paper tag
  const tagStringGeo = useMemo(() => new THREE.TubeGeometry(
    new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0,    0,    0),
      new THREE.Vector3(0.08, 0.12, 0),
      new THREE.Vector3(0.20, 0.26, 0)
    ), 8, 0.004, 4, false
  ), []);

  const leafShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(0.03, 0.05, 0, 0.10);
    shape.quadraticCurveTo(-0.03, 0.05, 0, 0);
    return shape;
  }, []);

  const leafShapeGeo = useMemo(() => new THREE.ShapeGeometry(leafShape), [leafShape]);

  const seamsGeometries = useMemo(() => {
    const H = 0.82;
    const R = 0.45;
    const apex = new THREE.Vector3(0, H/2, 0);
    const v0 = new THREE.Vector3(R, -H/2, 0);
    const v1 = new THREE.Vector3(-R/2, -H/2, R * Math.sqrt(3)/2);
    const v2 = new THREE.Vector3(-R/2, -H/2, -R * Math.sqrt(3)/2);

    const edges = [
      [apex, v0],
      [apex, v1],
      [apex, v2],
      [v0, v1],
      [v1, v2],
      [v2, v0]
    ];

    return edges.map(([p1, p2]) => {
      return new THREE.TubeGeometry(
        new THREE.LineCurve3(p1, p2),
        2,     // segments
        0.008, // radius of the tube (very thin)
        4,     // radial segments
        false
      );
    });
  }, []);

  const leafPositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < 45; i++) {
      const y = -0.40 + Math.random() * 0.25;
      const factor = (0.41 - y) / 0.82; // 1 at bottom, 0 at top
      const maxR = 0.22 * factor;
      const r = Math.random() * maxR;
      const theta = Math.random() * Math.PI * 2;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
      positions.push({
        position: [x, y, z],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
        scale: 0.02 + Math.random() * 0.03,
      });
    }
    return positions;
  }, []);

  useFrame(({ clock }) => {
    if (!pivotRef.current) return;
    // Spring pendulum — swings opposite to mouse
    const s = spring.current;
    const target = -mouseRef.current.x * 0.38;
    s.vel += (target - s.angle) * 0.030;
    s.vel *= 0.90;
    s.angle += s.vel;
    pivotRef.current.rotation.z = s.angle;
    if (bagAngleRef) {
      bagAngleRef.current = s.angle;
    }

    // Subtle breathing while no tea has poured yet
    if (bagRef.current && scrollProgress.current < 0.08) {
      const t = clock.getElapsedTime();
      bagRef.current.scale.set(
        1 + Math.sin(t * 1.05) * 0.013,
        1 + Math.cos(t * 0.78) * 0.009,
        1
      );
    }
  });

  return (
    <group position={[0, THREAD_PIVOT_Y, 0.5]}>
      <group ref={pivotRef}>
        {/* Thread */}
        <mesh geometry={threadGeo}>
          <meshStandardMaterial color="#C5B59F" roughness={0.96} metalness={0} />
        </mesh>

        {/* Bag body group — hangs at end of thread */}
        <group position={[0, -(THREAD_LEN + BAG_HALF_H), 0]} ref={bagRef}>
          {/* Sub-group for the tea bag contents (rotatable) */}
          <group rotation={[0, Math.PI * 0.15, 0]}>
            {/* Outer translucent pyramid */}
            <mesh castShadow receiveShadow>
              <coneGeometry args={[0.45, 0.82, 3]} />
              <meshPhysicalMaterial
                color="#FFFFFF"
                transmission={0.90}
                roughness={0.15}
                thickness={0.08}
                transparent
                opacity={0.85}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Inner wireframe for nylon mesh weave */}
            <mesh>
              <coneGeometry args={[0.451, 0.821, 3, 12, 1]} />
              <meshStandardMaterial color="#FFFFFF" wireframe transparent opacity={0.15} />
            </mesh>

            {/* Translucent physical seams along the 6 edges */}
            {seamsGeometries.map((geo, idx) => (
              <mesh key={idx} geometry={geo}>
                <meshStandardMaterial color="#FFFFFF" roughness={0.4} transparent opacity={0.5} />
              </mesh>
            ))}

            {/* Tea leaves inside the bag */}
            {leafPositions.map((p, idx) => (
              <mesh key={idx} position={p.position} rotation={p.rotation} scale={p.scale}>
                <tetrahedronGeometry args={[1, 0]} />
                <meshStandardMaterial color="#2C1A0E" roughness={0.9} />
              </mesh>
            ))}
          </group>

          {/* Tag string */}
          <mesh geometry={tagStringGeo} position={[0, 0.41, 0]}>
            <meshStandardMaterial color="#C5B59F" roughness={0.96} />
          </mesh>

          {/* Paper tag group */}
          <group position={[0.22, 0.652, 0]}>
            {/* Tag base */}
            <mesh castShadow>
              <boxGeometry args={[0.24, 0.17, 0.007]} />
              <meshStandardMaterial color="#3B6B3A" roughness={0.8} />
            </mesh>
            {/* Front logo */}
            <group position={[0, 0, 0.004]}>
              <mesh geometry={leafShapeGeo} position={[-0.02, -0.02, 0]} rotation={[0, 0, 0.35]}>
                <meshBasicMaterial color="#FFFFFF" />
              </mesh>
              <mesh geometry={leafShapeGeo} position={[0.01, -0.02, 0]} rotation={[0, 0, -0.45]}>
                <meshBasicMaterial color="#FFFFFF" />
              </mesh>
            </group>
            {/* Back logo */}
            <group position={[0, 0, -0.004]} rotation={[0, Math.PI, 0]}>
              <mesh geometry={leafShapeGeo} position={[-0.02, -0.02, 0]} rotation={[0, 0, 0.35]}>
                <meshBasicMaterial color="#FFFFFF" />
              </mesh>
              <mesh geometry={leafShapeGeo} position={[0.01, -0.02, 0]} rotation={[0, 0, -0.45]}>
                <meshBasicMaterial color="#FFFFFF" />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

// ── Glass Tea Cup ────────────────────────────────────────────────────────────
function GlassCup({ scrollProgress, cupY }) {
  const liquidRef  = useRef();

  const texture = useTexture('/assets/images/cup_image.png');

  useFrame(() => {
    if (!liquidRef.current) return;
    const p = THREE.MathUtils.clamp(
      (scrollProgress.current - 0.04) / 0.88, 0, 1
    );

    // Deep amber tea color
    liquidRef.current.material.color.setRGB(0.38, 0.16, 0.04);
    // Fade in opacity from 0 (clear water) to 0.85 (deep brewed tea)
    liquidRef.current.material.opacity = THREE.MathUtils.lerp(0.0, 0.85, p);
  });

  return (
    <group
      position={[0, cupY, CUP_GROUP_Z]}
      rotation={[-0.07, CUP_ROTATION_Y, 0]}
    >
      {/* 2D Photorealistic Cup Image with Transparent Background */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[1.80, 1.80]} />
        <meshBasicMaterial
          map={texture}
          transparent
          depthWrite={false}
        />
      </mesh>

      {/* Tea liquid (overlays the top opening of the cup) */}
      {/* Centered at X = 0, Y = 0.40, scaled vertically to 0.23 to match the wide opening */}
      <mesh ref={liquidRef} position={[0, 0.40, 0.005]} scale={[1.0, 0.23, 1.0]}>
        <circleGeometry args={[0.81, 64]} />
        <meshBasicMaterial
          transparent
          opacity={0.0}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ── Tea Particles (leaves + seeds falling from bag into cup) ─────────────────
function TeaParticles({ scrollProgress, bagAngleRef, waterWorldY, waterWorldX, waterWorldZ }) {
  const meshRef = useRef();
  const dummy   = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    dissolved:  false,
    active:     false,
    // Each particle activates at a different scroll position (spread 4%–86%)
    spawnAt:    0.04 + (i / PARTICLE_COUNT) * 0.82,
    // Random offset within bag width
    ox: (Math.random() - 0.5) * 0.32,
    oz: (Math.random() - 0.5) * 0.32,
    // Physics state
    x: 0, y: THREAD_PIVOT_Y - (THREAD_LEN + 2 * BAG_HALF_H), z: 0.5,
    vx: (Math.random() - 0.5) * 0.012,
    vy: -(0.006 + Math.random() * 0.016),
    vz: (Math.random() - 0.5) * 0.006,
    // Visual
    rotX: Math.random() * Math.PI * 2,
    rotY: Math.random() * Math.PI * 2,
    rotSX: (Math.random() - 0.5) * 0.07,
    rotSY: (Math.random() - 0.5) * 0.09,
    scale:   0.022 + Math.random() * 0.038,
    opacity: 0,
  })), []);

  useFrame(() => {
    if (!meshRef.current) return;
    const progress = scrollProgress.current;
    const angle = bagAngleRef ? bagAngleRef.current : 0;
    const L = THREAD_LEN + 2 * BAG_HALF_H;

    particles.forEach((p, i) => {
      if (p.dissolved) {
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
        return;
      }

      // Activate when scroll reaches particle's threshold
      if (!p.active && progress >= p.spawnAt) {
        p.active = true;
        p.y  = THREAD_PIVOT_Y - L * Math.cos(angle);
        p.x  = -L * Math.sin(angle) + p.ox;
        p.z  = 0.5 + p.oz;          // near bag Z
        p.vy = -(0.006 + Math.random() * 0.016);
        p.opacity = 0;
        
        // Save initial coordinates for smooth 3D path interpolation
        p.startY = p.y;
        p.startX = p.x;
        p.startZ = p.z;
      }

      if (p.active) {
        p.vy -= 0.00048;             // gravity
        p.y  += p.vy;
        p.x  += p.vx;
        p.vx *= 0.997;
        p.rotX += p.rotSX;
        p.rotY += p.rotSY;
        p.opacity = Math.min(1, p.opacity + 0.08);

        // Smoothly interpolate X and Z towards the cup water surface center as it falls
        const totalYDiff = p.startY - waterWorldY;
        const currentYDiff = p.startY - p.y;
        const factor = totalYDiff > 0.001 ? THREE.MathUtils.clamp(currentYDiff / totalYDiff, 0, 1) : 1;

        const targetX = waterWorldX + (p.ox * 0.4); // slightly reduce dispersion inside cup
        const targetZ = waterWorldZ + (p.oz * 0.4);

        const currentX = THREE.MathUtils.lerp(p.startX, targetX, factor);
        const currentZ = THREE.MathUtils.lerp(p.startZ, targetZ, factor);

        // Dissolve when reaching water surface
        if (p.y < waterWorldY) {
          p.vy *= 0.78;
          p.vx *= 0.82;
          p.opacity -= 0.07;
          if (p.opacity <= 0) p.dissolved = true;
        }

        const s = p.scale * Math.max(0, p.opacity);
        dummy.position.set(currentX, p.y, currentZ);
        dummy.rotation.set(p.rotX, p.rotY, 0);
        dummy.scale.setScalar(s);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      } else {
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, PARTICLE_COUNT]}>
      <tetrahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#3E2008" roughness={0.88} />
    </instancedMesh>
  );
}

// ── Steam Wisps ──────────────────────────────────────────────────────────────
function Steam({ waterWorldY, waterWorldX, waterWorldZ }) {
  const meshRef = useRef();
  const dummy   = useMemo(() => new THREE.Object3D(), []);
  const N = 22;

  const steamData = useMemo(() => Array.from({ length: N }, () => ({
    x:     (Math.random() - 0.5) * 0.72,
    z:     (Math.random() - 0.5) * 0.28,
    y:     Math.random() * 1.2,
    speed: 0.005 + Math.random() * 0.009,
    phase: Math.random() * Math.PI * 2,
    size:  0.035 + Math.random() * 0.055,
  })), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    steamData.forEach((p, i) => {
      p.y += p.speed;
      if (p.y > 1.3) p.y = 0;

      const drift = Math.sin(t * 0.35 + p.phase) * 0.055;
      const a = 1 - p.y / 1.3;
      const s = Math.max(0, p.size * (1 + p.y * 1.8) * a * 0.75);

      // Position over cup water surface (accounting for cup group transform)
      dummy.position.set(
        waterWorldX + p.x + drift,
        waterWorldY + p.y + 0.05,
        waterWorldZ + p.z
      );
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, N]}>
      <sphereGeometry args={[1, 5, 5]} />
      <meshBasicMaterial color="#FFFFFF" transparent opacity={0.055} depthWrite={false} />
    </instancedMesh>
  );
}

// ── Scene assembly ───────────────────────────────────────────────────────────
function Scene({ scrollProgress }) {
  const mouseRef = useRef({ x: 0 });
  const bagAngleRef = useRef(0);

  const { camera, viewport } = useThree();
  // Get viewport height at CUP_GROUP_Z = 1.50
  const viewportAtCup = viewport.getCurrentViewport(camera, new THREE.Vector3(0, 0, CUP_GROUP_Z));
  // Y position of the cup group to place the cup bottom (at Y=-0.65) exactly at the bottom of the screen
  const cupY = camera.position.y - viewportAtCup.height / 2 + 0.65;

  // Compute water world coordinates including Y-rotation and local shifts
  const waterLocalX = 0;
  const waterLocalY = WATER_REL_Y;
  const waterLocalZ = 0.005;

  const waterWorldX = waterLocalX * Math.cos(CUP_ROTATION_Y) + waterLocalZ * Math.sin(CUP_ROTATION_Y);
  const waterWorldY = cupY + waterLocalY;
  const waterWorldZ = CUP_GROUP_Z - waterLocalX * Math.sin(CUP_ROTATION_Y) + waterLocalZ * Math.cos(CUP_ROTATION_Y);

  return (
    <>
      <MouseListener mouseRef={mouseRef} />

      {/* Lighting */}
      <ambientLight intensity={0.55} color="#FFE8CC" />
      <pointLight
        position={[4, 6, 5]} intensity={2.8} color="#FF9A38"
        castShadow shadow-mapSize={[512, 512]}
      />
      <pointLight position={[-3, 3, 2]} intensity={0.45} color="#C9922A" />
      <pointLight position={[0, -1, 5]} intensity={0.28} color="#FFE4B5" />
      <spotLight
        position={[0.5, 8, 3]} angle={0.30} penumbra={0.6}
        intensity={1.0} color="#FFF6EE" castShadow
      />

      {/* Environment (needed by MeshTransmissionMaterial for refraction) */}
      <Environment preset="sunset" />

      <GlassCup scrollProgress={scrollProgress} cupY={cupY} />
      <TeaBag   mouseRef={mouseRef} scrollProgress={scrollProgress} bagAngleRef={bagAngleRef} />
      <TeaParticles 
        scrollProgress={scrollProgress} 
        bagAngleRef={bagAngleRef} 
        waterWorldY={waterWorldY} 
        waterWorldX={waterWorldX}
        waterWorldZ={waterWorldZ}
      />
      <Steam waterWorldY={waterWorldY} waterWorldX={waterWorldX} waterWorldZ={waterWorldZ} />
    </>
  );
}

// ── Canvas export ────────────────────────────────────────────────────────────
export default function HeroScene({ scrollProgress }) {
  return (
    <Canvas
      camera={{ position: [0, 0.8, 10], fov: 48, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      shadows
      dpr={[1, 1.5]}
      style={{ background: 'transparent' }}
    >
      <Scene scrollProgress={scrollProgress} />
    </Canvas>
  );
}

useTexture.preload('/assets/images/cup_image.png');
