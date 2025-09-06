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

// VFX Grid Component
function DigitalGrid() {
  const gridRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  return (
    <group ref={gridRef}>
      {/* Horizontal grid lines */}
      {Array.from({ length: 20 }, (_, i) => (
        <line key={`h-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={new Float32Array([
                -10, 0, -10 + i,
                10, 0, -10 + i
              ])}
              count={2}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#00ffff" transparent opacity={0.1} />
        </line>
      ))}
      {/* Vertical grid lines */}
      {Array.from({ length: 20 }, (_, i) => (
        <line key={`v-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={new Float32Array([
                -10 + i, 0, -10,
                -10 + i, 0, 10
              ])}
              count={2}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#00ffff" transparent opacity={0.1} />
        </line>
      ))}
    </group>
  );
}

// Animated Data Lines Component
function DataLines() {
  const linesRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh && child.material) {
          const material = child.material as THREE.Material;
          if ('opacity' in material) {
            (material as any).opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.2;
          }
        }
      });
    }
  });

  return (
    <group ref={linesRef}>
      {/* Animated scanning lines */}
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={i} position={[-3 + i * 1.5, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
          <planeGeometry args={[0.05, 8]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function CarModel({ health, components, alerts, onComponentClick }: CarModelProps) {
  const carRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useFrame((state) => {
    if (carRef.current && !hovered) {
      carRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  // Get component health status with pulsing animation
  const getComponentStatus = (componentName: string) => {
    const component = components.find(c => 
      c.component.toLowerCase().includes(componentName.toLowerCase())
    );
    const alert = alerts.find(a => 
      a.component.toLowerCase().includes(componentName.toLowerCase())
    );
    
    if (alert?.urgency === 'high' || component?.status === 'critical') {
      return { 
        color: "#ff0033", 
        glow: true, 
        emissive: "#ff0033", 
        intensity: 0.6,
        pulse: true
      };
    }
    if (alert?.urgency === 'medium' || component?.status === 'caution') {
      return { 
        color: "#ffaa00", 
        glow: true, 
        emissive: "#ffaa00", 
        intensity: 0.4,
        pulse: true
      };
    }
    return { 
      color: "#00ffaa", 
      glow: false, 
      emissive: "#003300", 
      intensity: 0.1,
      pulse: false
    };
  };

  const handleComponentClick = useCallback((componentName: string) => {
    onComponentClick(componentName);
  }, [onComponentClick]);

  const engineStatus = getComponentStatus("Engine Oil");
  const airFilterStatus = getComponentStatus("Air Filter");
  const fuelFilterStatus = getComponentStatus("Fuel");
  const brakeStatus = getComponentStatus("Brake");

  // Pulsing effect component
  const PulsingLight = ({ position, color, intensity, pulse }: {
    position: [number, number, number];
    color: string;
    intensity: number;
    pulse: boolean;
  }) => {
    const lightRef = useRef<THREE.PointLight>(null);
    
    useFrame((state) => {
      if (lightRef.current && pulse) {
        lightRef.current.intensity = intensity + Math.sin(state.clock.elapsedTime * 3) * (intensity * 0.5);
      }
    });

    return (
      <pointLight 
        ref={lightRef}
        position={position} 
        color={color} 
        intensity={intensity} 
        distance={4} 
      />
    );
  };

  return (
    <group ref={carRef}>
      {/* VFX Elements */}
      <DigitalGrid />
      <DataLines />
      
      {/* TRANSPARENT CAR SHELL */}
      {/* Main body - transparent wireframe */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[4, 1, 1.8]} />
        <meshPhongMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.1} 
          wireframe={false}
          emissive="#001133"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Car roof - transparent */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[2.5, 0.8, 1.6]} />
        <meshPhongMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.08} 
          wireframe={false}
          emissive="#001133"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Wireframe outline */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[4, 1, 1.8]} />
        <meshBasicMaterial color="#00ffff" wireframe transparent opacity={0.3} />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[2.5, 0.8, 1.6]} />
        <meshBasicMaterial color="#00ffff" wireframe transparent opacity={0.3} />
      </mesh>

      {/* INTERNAL COMPONENTS - HIGHLY DETAILED */}
      
      {/* ENGINE BLOCK - clickable with detailed internal structure */}
      <group 
        onPointerOver={(e) => { e.stopPropagation(); setHovered('engine'); }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(null); }}
        onClick={(e) => { e.stopPropagation(); handleComponentClick('Engine Oil System'); }}
      >
        {/* Main engine block */}
        <mesh position={[1.2, 0.4, 0]} scale={hovered === 'engine' ? 1.05 : 1}>
          <boxGeometry args={[1.2, 0.8, 1]} />
          <meshPhongMaterial 
            color={engineStatus.color} 
            emissive={engineStatus.emissive}
            emissiveIntensity={engineStatus.intensity}
            transparent
            opacity={0.8}
          />
        </mesh>
        {/* Engine cylinders */}
        {Array.from({ length: 4 }, (_, i) => (
          <mesh key={i} position={[1.2, 0.8, -0.3 + i * 0.2]} scale={hovered === 'engine' ? 1.05 : 1}>
            <cylinderGeometry args={[0.08, 0.08, 0.4]} />
            <meshPhongMaterial 
              color={engineStatus.color}
              emissive={engineStatus.emissive}
              emissiveIntensity={engineStatus.intensity * 1.2}
            />
          </mesh>
        ))}
        {/* Oil pump */}
        <mesh position={[1.5, 0.2, 0.3]} scale={hovered === 'engine' ? 1.05 : 1}>
          <sphereGeometry args={[0.15]} />
          <meshPhongMaterial 
            color={engineStatus.color}
            emissive={engineStatus.emissive}
            emissiveIntensity={engineStatus.intensity}
          />
        </mesh>
        {engineStatus.glow && (
          <PulsingLight 
            position={[1.2, 0.4, 0]} 
            color={engineStatus.color} 
            intensity={engineStatus.intensity}
            pulse={engineStatus.pulse}
          />
        )}
      </group>

      {/* AIR INTAKE SYSTEM - clickable */}
      <group 
        onPointerOver={(e) => { e.stopPropagation(); setHovered('airFilter'); }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(null); }}
        onClick={(e) => { e.stopPropagation(); handleComponentClick('Air Filter'); }}
      >
        {/* Air filter housing */}
        <mesh position={[0.8, 0.9, 0]} scale={hovered === 'airFilter' ? 1.1 : 1}>
          <boxGeometry args={[0.4, 0.3, 0.6]} />
          <meshPhongMaterial 
            color={airFilterStatus.color}
            emissive={airFilterStatus.emissive}
            emissiveIntensity={airFilterStatus.intensity}
            transparent
            opacity={0.9}
          />
        </mesh>
        {/* Air intake tubes */}
        <mesh position={[0.6, 0.8, 0]} rotation={[0, 0, Math.PI / 4]} scale={hovered === 'airFilter' ? 1.1 : 1}>
          <cylinderGeometry args={[0.05, 0.08, 0.8]} />
          <meshPhongMaterial 
            color={airFilterStatus.color}
            emissive={airFilterStatus.emissive}
            emissiveIntensity={airFilterStatus.intensity * 0.8}
          />
        </mesh>
        {/* Filter element */}
        <mesh position={[0.8, 0.9, 0]} scale={hovered === 'airFilter' ? 1.1 : 1}>
          <cylinderGeometry args={[0.15, 0.15, 0.25]} />
          <meshPhongMaterial 
            color={airFilterStatus.color}
            emissive={airFilterStatus.emissive}
            emissiveIntensity={airFilterStatus.intensity * 1.5}
          />
        </mesh>
        {airFilterStatus.glow && (
          <PulsingLight 
            position={[0.8, 0.9, 0]} 
            color={airFilterStatus.color} 
            intensity={airFilterStatus.intensity * 2}
            pulse={airFilterStatus.pulse}
          />
        )}
      </group>

      {/* FUEL SYSTEM - clickable */}
      <group 
        onPointerOver={(e) => { e.stopPropagation(); setHovered('fuelFilter'); }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(null); }}
        onClick={(e) => { e.stopPropagation(); handleComponentClick('Fuel Filter'); }}
      >
        {/* Fuel filter */}
        <mesh position={[0.2, 0.3, -0.5]} scale={hovered === 'fuelFilter' ? 1.1 : 1}>
          <cylinderGeometry args={[0.08, 0.08, 0.3]} />
          <meshPhongMaterial 
            color={fuelFilterStatus.color}
            emissive={fuelFilterStatus.emissive}
            emissiveIntensity={fuelFilterStatus.intensity}
            transparent
            opacity={0.9}
          />
        </mesh>
        {/* Fuel lines */}
        {[
          { pos: [0, 0.3, -0.5], rot: [0, 0, 0] },
          { pos: [0.4, 0.3, -0.3], rot: [0, Math.PI / 4, 0] },
          { pos: [0.8, 0.4, 0], rot: [0, Math.PI / 2, 0] }
        ].map((line, i) => (
          <mesh 
            key={i}
            position={line.pos as [number, number, number]} 
            rotation={line.rot as [number, number, number]}
            scale={hovered === 'fuelFilter' ? 1.1 : 1}
          >
            <cylinderGeometry args={[0.02, 0.02, 0.4]} />
            <meshPhongMaterial 
              color={fuelFilterStatus.color}
              emissive={fuelFilterStatus.emissive}
              emissiveIntensity={fuelFilterStatus.intensity * 0.8}
            />
          </mesh>
        ))}
        {/* Fuel pump */}
        <mesh position={[-0.8, 0.1, -0.3]} scale={hovered === 'fuelFilter' ? 1.1 : 1}>
          <boxGeometry args={[0.2, 0.15, 0.1]} />
          <meshPhongMaterial 
            color={fuelFilterStatus.color}
            emissive={fuelFilterStatus.emissive}
            emissiveIntensity={fuelFilterStatus.intensity}
          />
        </mesh>
        {fuelFilterStatus.glow && (
          <PulsingLight 
            position={[0.2, 0.3, -0.5]} 
            color={fuelFilterStatus.color} 
            intensity={fuelFilterStatus.intensity * 1.5}
            pulse={fuelFilterStatus.pulse}
          />
        )}
      </group>

      {/* BRAKE SYSTEM - clickable with detailed components */}
      <group 
        onPointerOver={(e) => { e.stopPropagation(); setHovered('brakes'); }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(null); }}
        onClick={(e) => { e.stopPropagation(); handleComponentClick('Brake System'); }}
      >
        {/* Brake discs at each wheel */}
        {[
          [1.5, -0.2, 1],
          [1.5, -0.2, -1],
          [-1.5, -0.2, 1],
          [-1.5, -0.2, -1]
        ].map((position, index) => (
          <group key={index}>
            {/* Brake disc */}
            <mesh 
              position={position as [number, number, number]} 
              rotation={[Math.PI / 2, 0, 0]}
              scale={hovered === 'brakes' ? 1.05 : 1}
            >
              <cylinderGeometry args={[0.35, 0.35, 0.03]} />
              <meshPhongMaterial 
                color={brakeStatus.color}
                emissive={brakeStatus.emissive}
                emissiveIntensity={brakeStatus.intensity}
                transparent
                opacity={0.9}
              />
            </mesh>
            {/* Brake caliper */}
            <mesh 
              position={[position[0], position[1] + 0.1, position[2]]} 
              scale={hovered === 'brakes' ? 1.05 : 1}
            >
              <boxGeometry args={[0.15, 0.1, 0.08]} />
              <meshPhongMaterial 
                color={brakeStatus.color}
                emissive={brakeStatus.emissive}
                emissiveIntensity={brakeStatus.intensity * 1.2}
              />
            </mesh>
          </group>
        ))}
        {/* Brake lines */}
        {[
          { from: [1.5, -0.1, 1], to: [0, 0.2, 0.5] },
          { from: [1.5, -0.1, -1], to: [0, 0.2, -0.5] },
          { from: [-1.5, -0.1, 1], to: [0, 0.2, 0.5] },
          { from: [-1.5, -0.1, -1], to: [0, 0.2, -0.5] }
        ].map((line, i) => (
          <mesh 
            key={`brake-line-${i}`}
            position={[
              (line.from[0] + line.to[0]) / 2,
              (line.from[1] + line.to[1]) / 2,
              (line.from[2] + line.to[2]) / 2
            ]}
            rotation={[0, Math.atan2(line.to[2] - line.from[2], line.to[0] - line.from[0]), 0]}
            scale={hovered === 'brakes' ? 1.05 : 1}
          >
            <cylinderGeometry args={[0.015, 0.015, 2]} />
            <meshPhongMaterial 
              color={brakeStatus.color}
              emissive={brakeStatus.emissive}
              emissiveIntensity={brakeStatus.intensity * 0.6}
            />
          </mesh>
        ))}
        {brakeStatus.glow && (
          <>
            <PulsingLight position={[1.5, -0.2, 1]} color={brakeStatus.color} intensity={brakeStatus.intensity} pulse={brakeStatus.pulse} />
            <PulsingLight position={[1.5, -0.2, -1]} color={brakeStatus.color} intensity={brakeStatus.intensity} pulse={brakeStatus.pulse} />
            <PulsingLight position={[-1.5, -0.2, 1]} color={brakeStatus.color} intensity={brakeStatus.intensity} pulse={brakeStatus.pulse} />
            <PulsingLight position={[-1.5, -0.2, -1]} color={brakeStatus.color} intensity={brakeStatus.intensity} pulse={brakeStatus.pulse} />
          </>
        )}
      </group>

      {/* WHEELS - transparent with subtle glow */}
      {[
        [1.5, -0.2, 1],
        [1.5, -0.2, -1],
        [-1.5, -0.2, 1],
        [-1.5, -0.2, -1]
      ].map((position, index) => (
        <mesh 
          key={`wheel-${index}`}
          position={position as [number, number, number]} 
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[0.4, 0.4, 0.25]} />
          <meshPhongMaterial 
            color="#1a1a1a" 
            transparent 
            opacity={0.6}
            emissive="#001111"
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}
      
      {/* Headlights with sci-fi glow */}
      <mesh position={[2.1, 0.8, 0.6]}>
        <sphereGeometry args={[0.15]} />
        <meshPhongMaterial color="#ffffff" emissive="#aaffff" emissiveIntensity={0.8} transparent opacity={0.9} />
      </mesh>
      <mesh position={[2.1, 0.8, -0.6]}>
        <sphereGeometry args={[0.15]} />
        <meshPhongMaterial color="#ffffff" emissive="#aaffff" emissiveIntensity={0.8} transparent opacity={0.9} />
      </mesh>
      
      {/* Digital HUD elements */}
      <mesh position={[0, 2, 0]} rotation={[-Math.PI / 6, 0, 0]}>
        <planeGeometry args={[2, 0.5]} />
        <meshBasicMaterial 
          color="#00ffff" 
          transparent 
          opacity={0.3}
        />
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
    <div className="w-full h-48 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 rounded-lg overflow-hidden border border-cyan-500/30 relative">
      {/* Digital overlay effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-cyan-500/5 to-transparent pointer-events-none" />
      <div className="absolute top-2 left-2 text-xs text-cyan-400 font-mono opacity-70">
        DIGITAL TWIN v2.1
      </div>
      <div className="absolute bottom-2 right-2 text-xs text-cyan-400 font-mono opacity-70">
        PREDICTIVE ANALYSIS ACTIVE
      </div>
      
      <Canvas camera={{ position: [6, 4, 6], fov: 45 }}>
        {/* Enhanced studio lighting for X-ray effect */}
        <ambientLight intensity={0.3} color="#001133" />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#ffffff" />
        <pointLight position={[-10, 5, -10]} intensity={0.4} color="#0088ff" />
        <directionalLight position={[5, 8, 5]} intensity={0.6} color="#aaffff" />
        
        {/* Rim lighting for sci-fi effect */}
        <pointLight position={[0, 10, 0]} intensity={0.3} color="#00ffff" />
        <pointLight position={[0, -5, 0]} intensity={0.2} color="#ff4400" />
        
        <CarModel 
          health={health} 
          components={components}
          alerts={alerts}
          onComponentClick={onComponentClick}
        />
        <OrbitControls 
          enablePan={false} 
          enableZoom={true}
          minDistance={4}
          maxDistance={10}
          autoRotate
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}