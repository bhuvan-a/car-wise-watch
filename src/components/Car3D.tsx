import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function CarModel({ health }: { health: number }) {
  const carRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (carRef.current && !hovered) {
      carRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  // Get color based on health
  const getCarColor = (health: number) => {
    if (health >= 80) return "#22c55e"; // green
    if (health >= 60) return "#eab308"; // yellow
    return "#ef4444"; // red
  };

  const carColor = getCarColor(health);

  return (
    <group 
      ref={carRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.1 : 1}
    >
      {/* Car body */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[4, 1, 1.8]} />
        <meshPhongMaterial color={carColor} />
      </mesh>
      
      {/* Car roof */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[2.5, 0.8, 1.6]} />
        <meshPhongMaterial color={carColor} />
      </mesh>
      
      {/* Front bumper */}
      <mesh position={[2.2, 0.3, 0]}>
        <boxGeometry args={[0.4, 0.6, 1.6]} />
        <meshPhongMaterial color="#333333" />
      </mesh>
      
      {/* Wheels */}
      <mesh position={[1.5, -0.2, 1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.3]} />
        <meshPhongMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[1.5, -0.2, -1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.3]} />
        <meshPhongMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[-1.5, -0.2, 1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.3]} />
        <meshPhongMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[-1.5, -0.2, -1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.3]} />
        <meshPhongMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Headlights */}
      <mesh position={[2.1, 0.8, 0.6]}>
        <sphereGeometry args={[0.15]} />
        <meshPhongMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[2.1, 0.8, -0.6]}>
        <sphereGeometry args={[0.15]} />
        <meshPhongMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
      </mesh>
      
      {/* Windows */}
      <mesh position={[0.5, 1.2, 0]}>
        <boxGeometry args={[1.8, 0.6, 1.4]} />
        <meshPhongMaterial color="#87ceeb" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

interface Car3DProps {
  health: number;
}

export function Car3D({ health }: Car3DProps) {
  return (
    <div className="w-full h-48 bg-gradient-subtle rounded-lg overflow-hidden border border-border">
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <CarModel health={health} />
        <OrbitControls 
          enablePan={false} 
          enableZoom={false}
          autoRotate
          autoRotateSpeed={1}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}