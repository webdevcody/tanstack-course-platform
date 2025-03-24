import { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text, Billboard } from "@react-three/drei";
import { Line } from "@react-three/drei";

// Configuration
const NODE_COUNT = 50;
const CONNECTION_PROBABILITY = 0.1;
const MOVEMENT_SPEED = 0.02;
const CAMERA_DISTANCE = 7;
const CAMERA_OFFSET_X = 30; // Offset camera to the right
const NODE_SIZE = 0.2;
const LINE_OPACITY = 0.3;
const GLOW_INTENSITY = 2;
const CENTER_ORB_SIZE = 2;
const CENTER_LIGHT_INTENSITY = 3;
const ROTATION_SPEED = 0.001; // Fixed rotation speed per frame
const BASE_ROTATION_SPEED = 0.0005; // Base rotation speed when no mouse movement
const MIN_ORBIT_RADIUS = 5; // Minimum distance from center
const MAX_ORBIT_RADIUS = 15; // Maximum distance from center
const BACKGROUND_STARS_COUNT = 200;
const STAR_MIN_SIZE = 0.02;
const STAR_MAX_SIZE = 0.08;
const STAR_FIELD_RADIUS = 50;

const REACT_KEYWORDS = [
  "useState",
  "useEffect",
  "useContext",
  "useRef",
  "useMemo",
  "useCallback",
  "useReducer",
  "Props",
  "State",
  "Component",
  "Fragment",
  "Portal",
  "Suspense",
  "memo",
  "Children",
  "Element",
  "Virtual DOM",
  "JSX",
  "React",
  "Hooks",
];

interface Node {
  position: THREE.Vector3;
  connections: number[];
  keyword: string;
  orbitAngle: number;
  orbitRadius: number;
  orbitSpeed: number;
  // New orbital parameters
  tiltAngle: number; // Tilt of orbital plane
  precessSpeed: number; // Speed of orbital plane precession
  eccentricity: number; // Orbit elliptical factor
  phaseOffset: number; // Starting position offset
}

function generateGraph(): Node[] {
  const nodes: Node[] = [];
  const usedKeywords = new Set<string>();

  // Create nodes with Fibonacci sphere for initial distribution
  for (let i = 0; i < NODE_COUNT; i++) {
    // Select a random unused keyword, or reuse if all are taken
    let keyword;
    const availableKeywords = REACT_KEYWORDS.filter(
      (k) => !usedKeywords.has(k)
    );
    if (availableKeywords.length > 0) {
      keyword =
        availableKeywords[Math.floor(Math.random() * availableKeywords.length)];
      usedKeywords.add(keyword);
    } else {
      keyword =
        REACT_KEYWORDS[Math.floor(Math.random() * REACT_KEYWORDS.length)];
    }

    // Calculate base orbit radius with more even distribution
    const orbitRadius =
      MIN_ORBIT_RADIUS +
      (MAX_ORBIT_RADIUS - MIN_ORBIT_RADIUS) * (0.3 + 0.7 * Math.random());

    // Random orbital parameters
    const tiltAngle = Math.random() * Math.PI * 0.5; // Tilt between 0 and π/2
    const precessSpeed = ROTATION_SPEED * (0.2 + Math.random() * 0.3); // Slow precession
    const eccentricity = Math.random() * 0.3; // Slight elliptical orbits
    const phaseOffset = Math.random() * Math.PI * 2; // Random starting position
    const orbitSpeed = ROTATION_SPEED * (0.8 + Math.random() * 0.4);

    // Initial position using Fibonacci sphere distribution
    const i2 = 2 * i - (NODE_COUNT - 1);
    const lat = Math.asin(i2 / NODE_COUNT);
    const lon = (2 * Math.PI * i) / ((1 + Math.sqrt(5)) / 2);

    // Initial Cartesian coordinates
    const x = orbitRadius * Math.cos(lat) * Math.cos(lon);
    const y = orbitRadius * Math.cos(lat) * Math.sin(lon);
    const z = orbitRadius * Math.sin(lat);

    nodes.push({
      position: new THREE.Vector3(x, y, z),
      connections: [],
      keyword,
      orbitAngle: Math.atan2(y, x),
      orbitRadius,
      orbitSpeed,
      tiltAngle,
      precessSpeed,
      eccentricity,
      phaseOffset,
    });
  }

  // Create random connections between nodes
  for (let i = 0; i < NODE_COUNT; i++) {
    for (let j = i + 1; j < NODE_COUNT; j++) {
      if (Math.random() < CONNECTION_PROBABILITY) {
        nodes[i].connections.push(j);
        nodes[j].connections.push(i);
      }
    }
  }

  return nodes;
}

// Custom shader material for glowing effect with surface lighting
const glowMaterial = {
  uniforms: {
    color: { value: new THREE.Color(0x00ff00) },
    glowColor: { value: new THREE.Color(0x44ff44) },
    intensity: { value: GLOW_INTENSITY },
    lightPosition: { value: new THREE.Vector3(100, 100, 100) },
    time: { value: 0 },
    pulseOffset: { value: 0 },
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color;
    uniform vec3 glowColor;
    uniform float intensity;
    uniform vec3 lightPosition;
    uniform float time;
    uniform float pulseOffset;
    
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    
    void main() {
      // Calculate light direction
      vec3 lightDir = normalize(lightPosition - vWorldPosition);
      
      // Basic diffuse lighting
      float diff = max(dot(vNormal, lightDir), 0.0);
      
      // Ambient light
      float ambient = 0.3;
      
      // Much more dramatic pulsing effect
      float pulse = 0.5 + 0.5 * sin(time * 5.0 + pulseOffset);
      
      // Rim lighting (edge glow) with strong pulse
      float rimPower = 3.0;
      vec3 viewDir = normalize(-vWorldPosition);
      float rim = 1.0 - max(dot(viewDir, vNormal), 0.0);
      rim = pow(rim, rimPower);
      
      // Specular highlight with strong pulse
      vec3 reflectDir = reflect(-lightDir, vNormal);
      float spec = pow(max(dot(viewDir, reflectDir), 0.0), 64.0);
      
      // Combine all lighting components with very strong pulsing
      vec3 finalColor = color * (ambient + diff * 0.7) * (0.5 + 0.5 * pulse) + 
                       glowColor * rim * intensity * (0.2 + 0.8 * pulse) +
                       vec3(0.8, 1.0, 0.8) * spec * (0.3 + 0.7 * pulse);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
};

// Custom shader for the center orb
const centerOrbMaterial = {
  uniforms: { time: { value: 0 }, color: { value: new THREE.Color(0x00ff44) } },
  vertexShader: `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color;
    uniform float time;
    varying vec3 vNormal;
    
    void main() {
      float pulse = 0.5 + 0.5 * sin(time * 2.0);
      vec3 glow = color * (0.8 + 0.4 * pulse);
      float strength = 0.5 + 0.5 * (1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)));
      vec3 finalColor = mix(glow, vec3(1.0), pow(strength, 3.0));
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
};

const starMaterial = {
  uniforms: { color: { value: new THREE.Color(0xffffff) }, time: { value: 0 } },
  vertexShader: `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color;
    uniform float time;
    varying vec3 vNormal;
    
    void main() {
      float pulse = 0.7 + 0.3 * sin(time * 1.5);
      vec3 glow = color * pulse;
      float strength = 0.5 + 0.5 * (1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)));
      vec3 finalColor = mix(glow, vec3(1.0), pow(strength, 3.0));
      gl_FragColor = vec4(finalColor, 0.7);
    }
  `,
};

function BackgroundStars() {
  const stars = useMemo(() => {
    const starPositions: Array<{
      position: [number, number, number];
      size: number;
    }> = [];
    for (let i = 0; i < BACKGROUND_STARS_COUNT; i++) {
      // Use spherical coordinates for better distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = STAR_FIELD_RADIUS * (0.3 + Math.random() * 0.7); // Vary the radius

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      const size =
        STAR_MIN_SIZE + Math.random() * (STAR_MAX_SIZE - STAR_MIN_SIZE);
      starPositions.push({ position: [x, y, z], size });
    }
    return starPositions;
  }, []);

  const meshRefs = useRef<THREE.Mesh[]>([]);

  useFrame(({ clock }) => {
    // Update time uniform for all stars
    stars.forEach((_, index) => {
      const mesh = meshRefs.current[index];
      if (mesh?.material && "uniforms" in mesh.material) {
        (mesh.material as THREE.ShaderMaterial).uniforms.time.value =
          clock.getElapsedTime() + index;
      }
    });
  });

  return (
    <>
      {stars.map((star, index) => (
        <mesh
          key={index}
          ref={(el) => {
            if (el) meshRefs.current[index] = el;
          }}
          position={star.position}
        >
          <sphereGeometry args={[star.size, 8, 8]} />
          <shaderMaterial
            attach="material"
            {...starMaterial}
            transparent
            uniforms={{ ...starMaterial.uniforms, time: { value: index } }}
          />
        </mesh>
      ))}
    </>
  );
}

function Graph() {
  const [nodes] = useState(() => generateGraph());
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ x: 0, y: 0 });
  const lineRefs = useRef<{ [key: string]: THREE.LineSegments }>({});

  useEffect(() => {
    // Set initial camera position
    camera.position.set(CAMERA_OFFSET_X, 0, CAMERA_DISTANCE);
    camera.lookAt(camera.position.x + CAMERA_DISTANCE, 0, 0);
  }, [camera]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;

    // Update rotation based on mouse position
    const targetRotationY = mouseRef.current.x * Math.PI * 0.5; // Half PI rotation max
    const targetRotationX = mouseRef.current.y * Math.PI * 0.25; // Quarter PI rotation max

    // Smooth rotation with base rotation speed
    // First apply the mouse-based rotation
    rotationRef.current.y += (targetRotationY - rotationRef.current.y) * 0.05;
    rotationRef.current.x += (targetRotationX - rotationRef.current.x) * 0.05;

    // Then add the continuous rotation
    rotationRef.current.y += BASE_ROTATION_SPEED;

    // Apply rotation to the entire group
    groupRef.current.rotation.y = rotationRef.current.y;
    groupRef.current.rotation.x = rotationRef.current.x;

    // Update node positions with complex orbital motion
    nodes.forEach((node, index) => {
      const time = performance.now() * 0.001;

      // Calculate the varying radius for elliptical orbit
      const r =
        (node.orbitRadius * (1 - node.eccentricity * node.eccentricity)) /
        (1 +
          node.eccentricity *
            Math.cos(node.orbitSpeed * time + node.phaseOffset));

      // Calculate orbital position with precession
      const theta = node.orbitSpeed * time + node.phaseOffset;
      const precessAngle = node.precessSpeed * time;

      // Calculate new position with tilted, precessing, elliptical orbit
      const x =
        r *
        (Math.cos(theta) * Math.cos(precessAngle) -
          Math.sin(theta) * Math.sin(precessAngle) * Math.cos(node.tiltAngle));
      const y =
        r *
        (Math.cos(theta) * Math.sin(precessAngle) +
          Math.sin(theta) * Math.cos(precessAngle) * Math.cos(node.tiltAngle));
      const z = r * Math.sin(theta) * Math.sin(node.tiltAngle);

      // Update node position (without camera offset as it's now applied to the group)
      node.position.set(x, y, z);

      // Update the mesh position
      const nodeGroup = groupRef.current?.children.find(
        (child) => child.name === `node-${index}`
      ) as THREE.Group;
      if (nodeGroup) {
        nodeGroup.position.copy(node.position);
      }
    });

    // Update line positions
    nodes.forEach((node, index) => {
      node.connections.forEach((targetIndex) => {
        if (targetIndex > index) {
          const targetNode = nodes[targetIndex];
          const lineKey = `${index}-${targetIndex}`;
          const line = lineRefs.current[lineKey];

          if (line) {
            const positions = line.geometry.attributes.position
              .array as Float32Array;
            positions[0] = node.position.x;
            positions[1] = node.position.y;
            positions[2] = node.position.z;
            positions[3] = targetNode.position.x;
            positions[4] = targetNode.position.y;
            positions[5] = targetNode.position.z;
            line.geometry.attributes.position.needsUpdate = true;
          }
        }
      });
    });
  });

  return (
    <group ref={groupRef} position={[CAMERA_OFFSET_X, 0, 0]}>
      <BackgroundStars />
      {/* Center Orb */}
      <mesh name="centerOrb" position={[0, 0, 0]}>
        <sphereGeometry args={[CENTER_ORB_SIZE, 32, 32]} />
        <shaderMaterial
          attach="material"
          {...centerOrbMaterial}
          transparent
          uniforms={centerOrbMaterial.uniforms}
        />
      </mesh>

      {/* Center Light Source - move with the orb */}
      <pointLight
        position={[0, 0, 0]}
        intensity={CENTER_LIGHT_INTENSITY}
        distance={50}
        decay={2}
        color="#00ff44"
      />

      {/* Draw nodes */}
      {nodes.map((node, index) => (
        <group key={index} name={`node-${index}`} position={node.position}>
          <mesh>
            <sphereGeometry args={[NODE_SIZE, 32, 32]} />
            <shaderMaterial
              attach="material"
              {...glowMaterial}
              transparent
              uniforms={{
                ...glowMaterial.uniforms,
                lightPosition: { value: new THREE.Vector3(0, 0, 0) },
              }}
            />
          </mesh>
          <Billboard>
            <Text
              color="#00ff00"
              fontSize={0.4}
              maxWidth={200}
              lineHeight={1}
              letterSpacing={0.02}
              textAlign="center"
              anchorY="bottom"
              anchorX="center"
              position={[0, NODE_SIZE + 0.2, 0]}
              outlineWidth={0.02}
              outlineColor="#003300"
            >
              {node.keyword}
            </Text>
          </Billboard>
        </group>
      ))}

      {/* Draw connections */}
      {nodes.map((node, index) =>
        node.connections.map((targetIndex) => {
          if (targetIndex > index) {
            const targetNode = nodes[targetIndex];
            const points: [number, number, number][] = [
              [node.position.x, node.position.y, node.position.z],
              [
                targetNode.position.x,
                targetNode.position.y,
                targetNode.position.z,
              ],
            ];
            return (
              <Line
                key={`${index}-${targetIndex}`}
                points={points}
                color="#00ff00"
                opacity={LINE_OPACITY}
                transparent
              />
            );
          }
          return null;
        })
      )}
    </group>
  );
}

export function GraphVisualization() {
  return (
    <div className="absolute w-full h-full">
      <Canvas
        camera={{ position: [CAMERA_OFFSET_X, 0, CAMERA_DISTANCE], fov: 75 }}
        style={{ background: "black" }}
      >
        <ambientLight intensity={0.2} />
        <group position={[CAMERA_OFFSET_X, 0, 0]}>
          <Graph />
        </group>
      </Canvas>
    </div>
  );
}
