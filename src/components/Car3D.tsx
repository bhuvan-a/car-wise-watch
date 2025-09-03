import { useRef, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface ComponentData {
  component: string;
  health: number;
  status: 'healthy' | 'caution' | 'critical';
  nextMaintenance: string;
  description: string;
}

interface AlertData {
  component: string;
  urgency: 'low' | 'medium' | 'high';
  message: string;
  recommendedAction: string;
  timeframe: string;
}

interface CarModelProps {
  health: number;
  components: ComponentData[];
  alerts: AlertData[];
  onComponentClick: (componentName: string) => void;
}

function CarModel({ health, components, alerts, onComponentClick }: CarModelProps) {
  const carRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useFrame((state) => {
    if (carRef.current && !hovered) {
      carRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  // Get component health status
  const getComponentStatus = (componentName: string) => {
    const component = components.find(c => 
      c.component.toLowerCase().includes(componentName.toLowerCase())
    );
    const alert = alerts.find(a => 
      a.component.toLowerCase().includes(componentName.toLowerCase())
    );
    
    if (alert?.urgency === 'high' || component?.status === 'critical') {
      return { color: "#ef4444", glow: true, emissive: "#ef4444", intensity: 0.3 };
    }
    if (alert?.urgency === 'medium' || component?.status === 'caution') {
      return { color: "#eab308", glow: true, emissive: "#eab308", intensity: 0.2 };
    }
    return { color: "#666666", glow: false, emissive: "#000000", intensity: 0 };
  };

  const getCarColor = (health: number) => {
    if (health >= 80) return "#4a5568"; // dark gray
    if (health >= 60) return "#2d3748"; // darker gray
    return "#1a202c"; // darkest gray
  };

  const handleComponentClick = useCallback((componentName: string) => {
    onComponentClick(componentName);
  }, [onComponentClick]);

  const carColor = getCarColor(health);
  const engineStatus = getComponentStatus("Engine Oil");
  const airFilterStatus = getComponentStatus("Air Filter");
  const fuelFilterStatus = getComponentStatus("Fuel");
  const brakeStatus = getComponentStatus("Brake");

  return (
    <group 
      ref={carRef}
      onPointerOver={() => setHovered('car')}
      onPointerOut={() => setHovered(null)}
      scale={hovered ? 1.02 : 1}
    >
      {/* Car body - main structure */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[4, 1, 1.8]} />
        <meshPhongMaterial color={carColor} />
      </mesh>
      
      {/* Car roof */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[2.5, 0.8, 1.6]} />
        <meshPhongMaterial color={carColor} />
      </mesh>
      
      {/* ENGINE COMPONENT - clickable */}
      <group 
        onPointerOver={(e) => { e.stopPropagation(); setHovered('engine'); }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(null); }}
        onClick={(e) => { e.stopPropagation(); handleComponentClick('Engine Oil System'); }}
      >
        <mesh position={[1.5, 0.5, 0]} scale={hovered === 'engine' ? 1.1 : 1}>
          <boxGeometry args={[1, 0.8, 1.4]} />
          <meshPhongMaterial 
            color={engineStatus.color} 
            emissive={engineStatus.emissive}
            emissiveIntensity={engineStatus.intensity}
          />
        </mesh>
        {engineStatus.glow && (
          <pointLight 
            position={[1.5, 0.5, 0]} 
            color={engineStatus.color} 
            intensity={0.5} 
            distance={3} 
          />
        )}
      </group>

      {/* AIR FILTER COMPONENT - clickable */}
      <group 
        onPointerOver={(e) => { e.stopPropagation(); setHovered('airFilter'); }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(null); }}
        onClick={(e) => { e.stopPropagation(); handleComponentClick('Air Filter'); }}
      >
        <mesh position={[2, 1, 0]} scale={hovered === 'airFilter' ? 1.1 : 1}>
          <cylinderGeometry args={[0.3, 0.3, 0.6]} />
          <meshPhongMaterial 
            color={airFilterStatus.color}
            emissive={airFilterStatus.emissive}
            emissiveIntensity={airFilterStatus.intensity}
          />
        </mesh>
        {airFilterStatus.glow && (
          <pointLight 
            position={[2, 1, 0]} 
            color={airFilterStatus.color} 
            intensity={0.6} 
            distance={3} 
          />
        )}
      </group>

      {/* FUEL FILTER COMPONENT - clickable */}
      <group 
        onPointerOver={(e) => { e.stopPropagation(); setHovered('fuelFilter'); }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(null); }}
        onClick={(e) => { e.stopPropagation(); handleComponentClick('Fuel Filter'); }}
      >
        <mesh position={[0.5, 0.2, 0]} scale={hovered === 'fuelFilter' ? 1.1 : 1}>
          <cylinderGeometry args={[0.15, 0.15, 0.8]} />
          <meshPhongMaterial 
            color={fuelFilterStatus.color}
            emissive={fuelFilterStatus.emissive}
            emissiveIntensity={fuelFilterStatus.intensity}
          />
        </mesh>
        {fuelFilterStatus.glow && (
          <pointLight 
            position={[0.5, 0.2, 0]} 
            color={fuelFilterStatus.color} 
            intensity={0.4} 
            distance={2} 
          />
        )}
      </group>

      {/* BRAKE COMPONENTS - clickable */}
      <group 
        onPointerOver={(e) => { e.stopPropagation(); setHovered('brakes'); }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(null); }}
        onClick={(e) => { e.stopPropagation(); handleComponentClick('Brake System'); }}
      >
        {/* Brake discs */}
        {[
          [1.5, -0.2, 1],
          [1.5, -0.2, -1],
          [-1.5, -0.2, 1],
          [-1.5, -0.2, -1]
        ].map((position, index) => (
          <mesh 
            key={index}
            position={position as [number, number, number]} 
            rotation={[Math.PI / 2, 0, 0]}
            scale={hovered === 'brakes' ? 1.05 : 1}
          >
            <cylinderGeometry args={[0.35, 0.35, 0.05]} />
            <meshPhongMaterial 
              color={brakeStatus.color}
              emissive={brakeStatus.emissive}
              emissiveIntensity={brakeStatus.intensity}
            />
          </mesh>
        ))}
        {brakeStatus.glow && (
          <>
            <pointLight position={[1.5, -0.2, 1]} color={brakeStatus.color} intensity={0.3} distance={2} />
            <pointLight position={[1.5, -0.2, -1]} color={brakeStatus.color} intensity={0.3} distance={2} />
            <pointLight position={[-1.5, -0.2, 1]} color={brakeStatus.color} intensity={0.3} distance={2} />
            <pointLight position={[-1.5, -0.2, -1]} color={brakeStatus.color} intensity={0.3} distance={2} />
          </>
        )}
      </group>

      {/* Wheels (tires) */}
      {[
        [1.5, -0.2, 1],
        [1.5, -0.2, -1],
        [-1.5, -0.2, 1],
        [-1.5, -0.2, -1]
      ].map((position, index) => (
        <mesh 
          key={`tire-${index}`}
          position={position as [number, number, number]} 
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[0.4, 0.4, 0.25]} />
          <meshPhongMaterial color="#1a1a1a" />
        </mesh>
      ))}
      
      {/* Front bumper */}
      <mesh position={[2.2, 0.3, 0]}>
        <boxGeometry args={[0.4, 0.6, 1.6]} />
        <meshPhongMaterial color="#333333" />
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
  components: ComponentData[];
  alerts: AlertData[];
  onComponentClick: (componentName: string) => void;
}

export function Car3D({ health, components, alerts, onComponentClick }: Car3DProps) {
  return (
    <div className="w-full h-48 bg-gradient-subtle rounded-lg overflow-hidden border border-border">
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <CarModel 
          health={health} 
          components={components}
          alerts={alerts}
          onComponentClick={onComponentClick}
        />
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