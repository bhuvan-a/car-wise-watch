import { useRef, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
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

// Realistic Honda Accord Car Model
function CarShell() {
  return (
    <group>
      {/* Main Car Body - Dark Gray Solid */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[4.2, 1.4, 2]} />
        <meshStandardMaterial 
          color="#2a2a2a"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Hood - Slightly Raised */}
      <mesh position={[1.4, 0.9, 0]}>
        <boxGeometry args={[1.4, 0.2, 1.8]} />
        <meshStandardMaterial 
          color="#2a2a2a"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Roof */}
      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[3.8, 0.1, 1.8]} />
        <meshStandardMaterial 
          color="#262626"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      
      {/* Front Windshield */}
      <mesh position={[0.8, 1.4, 0]} rotation={[-0.1, 0, 0]}>
        <planeGeometry args={[1.6, 1.2]} />
        <meshPhysicalMaterial 
          color="#1a1a2e"
          transparent 
          opacity={0.8}
          transmission={0.9}
          thickness={0.02}
        />
      </mesh>
      
      {/* Rear Windshield */}
      <mesh position={[-0.8, 1.4, 0]} rotation={[0.1, 0, 0]}>
        <planeGeometry args={[1.6, 1.2]} />
        <meshPhysicalMaterial 
          color="#1a1a2e"
          transparent 
          opacity={0.8}
          transmission={0.9}
          thickness={0.02}
        />
      </mesh>
      
      {/* Side Windows */}
      <mesh position={[0.2, 1.2, 1.05]} rotation={[0, 0, -0.05]}>
        <planeGeometry args={[1.8, 0.8]} />
        <meshPhysicalMaterial 
          color="#1a1a2e"
          transparent 
          opacity={0.8}
          transmission={0.9}
        />
      </mesh>
      <mesh position={[0.2, 1.2, -1.05]} rotation={[0, 0, 0.05]}>
        <planeGeometry args={[1.8, 0.8]} />
        <meshPhysicalMaterial 
          color="#1a1a2e"
          transparent 
          opacity={0.8}
          transmission={0.9}
        />
      </mesh>
      
      {/* Front Bumper */}
      <mesh position={[2.2, 0.3, 0]}>
        <boxGeometry args={[0.2, 0.4, 1.6]} />
        <meshStandardMaterial 
          color="#2a2a2a"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Rear Bumper */}
      <mesh position={[-2.2, 0.3, 0]}>
        <boxGeometry args={[0.2, 0.4, 1.6]} />
        <meshStandardMaterial 
          color="#2a2a2a"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Front Grille */}
      <mesh position={[2.15, 0.7, 0]}>
        <boxGeometry args={[0.05, 0.3, 1.2]} />
        <meshStandardMaterial 
          color="#1a1a1a"
          metalness={0.3}
          roughness={0.8}
        />
      </mesh>
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
      {/* Data Lines for Digital Twin Effect */}
      <DataLines />
      {/* STANDALONE ENGINE DIGITAL TWIN - Based on Reference Image */}
      <group 
        onPointerOver={(e) => { 
          e.stopPropagation(); 
          setHovered('engine'); 
          console.log('Engine hovered - Industrial Engine Model');
        }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(null); }}
        onClick={(e) => { 
          e.stopPropagation(); 
          handleComponentClick('Engine Oil System'); 
          console.log('Engine clicked - Digital Twin Engine!');
        }}
        position={[0, 0, 0]}
        scale={hovered === 'engine' ? 1.1 : 1}
      >
        {/* Main Engine Block - Industrial Gray */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2, 1.2, 1.5]} />
          <meshStandardMaterial 
            color="#c0c0c0"
            emissive={engineStatus.emissive}
            emissiveIntensity={engineStatus.intensity}
            metalness={0.7}
            roughness={0.4}
          />
        </mesh>
        
        {/* Cylinder Head Assembly */}
        <mesh position={[0, 0.8, 0]}>
          <boxGeometry args={[1.8, 0.3, 1.3]} />
          <meshStandardMaterial 
            color="#b0b0b0"
            emissive={engineStatus.emissive}
            emissiveIntensity={engineStatus.intensity * 0.8}
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
        
        {/* Air Intake Manifold - Top Center */}
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[1.2, 0.4, 0.8]} />
          <meshStandardMaterial 
            color="#333333"
            emissive={airFilterStatus.emissive}
            emissiveIntensity={airFilterStatus.intensity}
            metalness={0.6}
            roughness={0.5}
          />
        </mesh>
        
        {/* Large Air Filter Housing - Like in reference */}
        <mesh position={[0, 1.5, 0.3]}>
          <cylinderGeometry args={[0.3, 0.3, 0.4]} />
          <meshStandardMaterial 
            color="#1a1a1a"
            emissive={airFilterStatus.emissive}
            emissiveIntensity={airFilterStatus.intensity}
            metalness={0.3}
            roughness={0.8}
          />
        </mesh>
        
        {/* Turbocharger Assembly - Right Side */}
        <group position={[1.2, 0.4, 0]}>
          {/* Turbine Housing */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.25]} />
            <meshStandardMaterial 
              color="#aa4400"
              emissive="#cc3300"
              emissiveIntensity={0.3}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          {/* Compressor Housing */}
          <mesh position={[0.3, 0, 0]}>
            <sphereGeometry args={[0.22]} />
            <meshStandardMaterial 
              color="#666666"
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
        </group>
        
        {/* Exhaust Manifolds - Multiple Pipes */}
        {Array.from({ length: 4 }, (_, i) => (
          <mesh key={`exhaust-${i}`} position={[-0.7, 0.3, -0.5 + i * 0.3]} rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.4]} />
            <meshStandardMaterial 
              color="#cc4400"
              emissive="#ff3300"
              emissiveIntensity={0.2}
              metalness={0.7}
              roughness={0.4}
            />
          </mesh>
        ))}
        
        {/* Intercooler - Front */}
        <mesh position={[1, 0, 0]}>
          <boxGeometry args={[0.2, 0.6, 1]} />
          <meshStandardMaterial 
            color="#888888"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        
        {/* Various Hoses and Connections */}
        {/* Intake Hose */}
        <mesh position={[0.5, 1.1, 0.2]} rotation={[0, 0, 0.3]}>
          <cylinderGeometry args={[0.06, 0.06, 0.8]} />
          <meshStandardMaterial 
            color="#1a1a1a"
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
        
        {/* Coolant Hoses */}
        <mesh position={[-0.3, 0.8, 0.4]} rotation={[0.5, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.6]} />
          <meshStandardMaterial 
            color="#0066cc"
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>
        
        {/* Oil Pan - Bottom */}
        <mesh position={[0, -0.7, 0]}>
          <boxGeometry args={[1.8, 0.2, 1.2]} />
          <meshStandardMaterial 
            color="#1a1a1a"
            emissive={engineStatus.emissive}
            emissiveIntensity={engineStatus.intensity}
            metalness={0.6}
            roughness={0.6}
          />
        </mesh>
        
        {/* Radiator Connection */}
        <mesh position={[0.8, 0.6, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.3]} />
          <meshStandardMaterial 
            color="#444444"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
        
        {/* Alternator */}
        <mesh position={[0.6, -0.2, -0.5]}>
          <cylinderGeometry args={[0.12, 0.12, 0.2]} />
          <meshStandardMaterial 
            color="#2a2a2a"
            metalness={0.4}
            roughness={0.7}
          />
        </mesh>
        
        {/* Starter Motor */}
        <mesh position={[-0.5, -0.3, -0.4]}>
          <cylinderGeometry args={[0.1, 0.1, 0.25]} />
          <meshStandardMaterial 
            color="#333333"
            metalness={0.5}
            roughness={0.6}
          />
        </mesh>
        
        {/* Enhanced Lighting Effects */}
        {engineStatus.glow && (
          <PulsingLight 
            position={[0, 0, 0]} 
            color={engineStatus.color} 
            intensity={engineStatus.intensity * 2}
            pulse={engineStatus.pulse}
          />
        )}
      </group>

      {/* REALISTIC AIR INTAKE SYSTEM */}
      <group 
        onPointerOver={(e) => { e.stopPropagation(); setHovered('airFilter'); }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(null); }}
        onClick={(e) => { e.stopPropagation(); handleComponentClick('Air Filter'); }}
      >
        {/* Air Filter Housing - Rectangular Box */}
        <mesh position={[0.6, 0.8, 0.4]} scale={hovered === 'airFilter' ? 1.1 : 1}>
          <boxGeometry args={[0.5, 0.2, 0.4]} />
          <meshStandardMaterial 
            color={airFilterStatus.color}
            emissive={airFilterStatus.emissive}
            emissiveIntensity={airFilterStatus.intensity}
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>
        
        {/* Air Filter Element (Paper/Cloth) */}
        <mesh position={[0.6, 0.8, 0.4]} scale={hovered === 'airFilter' ? 1.1 : 1}>
          <boxGeometry args={[0.4, 0.15, 0.3]} />
          <meshStandardMaterial 
            color={airFilterStatus.color}
            emissive={airFilterStatus.emissive}
            emissiveIntensity={airFilterStatus.intensity * 1.5}
            roughness={0.9}
            metalness={0}
          />
        </mesh>
        
        {/* Mass Air Flow Sensor */}
        <mesh position={[0.4, 0.75, 0.2]} scale={hovered === 'airFilter' ? 1.1 : 1}>
          <cylinderGeometry args={[0.04, 0.04, 0.15]} />
          <meshStandardMaterial 
            color={airFilterStatus.color}
            emissive={airFilterStatus.emissive}
            emissiveIntensity={airFilterStatus.intensity}
            metalness={0.8}
          />
        </mesh>
        
        {/* Intake Manifold */}
        <mesh position={[0.9, 0.7, 0]} rotation={[0, 0, Math.PI / 6]} scale={hovered === 'airFilter' ? 1.1 : 1}>
          <boxGeometry args={[0.4, 0.1, 0.6]} />
          <meshStandardMaterial 
            color={airFilterStatus.color}
            emissive={airFilterStatus.emissive}
            emissiveIntensity={airFilterStatus.intensity * 0.8}
            metalness={0.7}
          />
        </mesh>
        
        {/* Throttle Body */}
        <mesh position={[1.1, 0.65, 0]} scale={hovered === 'airFilter' ? 1.1 : 1}>
          <cylinderGeometry args={[0.08, 0.08, 0.12]} />
          <meshStandardMaterial 
            color={airFilterStatus.color}
            emissive={airFilterStatus.emissive}
            emissiveIntensity={airFilterStatus.intensity}
            metalness={0.8}
          />
        </mesh>
        
        {airFilterStatus.glow && (
          <PulsingLight 
            position={[0.6, 0.8, 0.4]} 
            color={airFilterStatus.color} 
            intensity={airFilterStatus.intensity * 3}
            pulse={airFilterStatus.pulse}
          />
        )}
      </group>

      {/* REALISTIC FUEL SYSTEM */}
      <group 
        onPointerOver={(e) => { e.stopPropagation(); setHovered('fuelFilter'); }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(null); }}
        onClick={(e) => { e.stopPropagation(); handleComponentClick('Fuel Filter'); }}
      >
        {/* Fuel Tank */}
        <mesh position={[-1.5, 0.1, 0]} scale={hovered === 'fuelFilter' ? 1.05 : 1}>
          <cylinderGeometry args={[0.8, 0.8, 0.3]} />
          <meshStandardMaterial 
            color="#444444"
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
        
        {/* Fuel Filter - Cylindrical */}
        <mesh position={[0, 0.25, -0.6]} scale={hovered === 'fuelFilter' ? 1.1 : 1}>
          <cylinderGeometry args={[0.06, 0.06, 0.25]} />
          <meshStandardMaterial 
            color={fuelFilterStatus.color}
            emissive={fuelFilterStatus.emissive}
            emissiveIntensity={fuelFilterStatus.intensity}
            metalness={0.4}
            roughness={0.6}
          />
        </mesh>
        
        {/* Fuel Rail */}
        <mesh position={[1.2, 0.65, 0]} rotation={[0, Math.PI / 2, 0]} scale={hovered === 'fuelFilter' ? 1.05 : 1}>
          <cylinderGeometry args={[0.03, 0.03, 0.8]} />
          <meshStandardMaterial 
            color={fuelFilterStatus.color}
            emissive={fuelFilterStatus.emissive}
            emissiveIntensity={fuelFilterStatus.intensity * 0.8}
            metalness={0.8}
          />
        </mesh>
        
        {/* Fuel Injectors */}
        {Array.from({ length: 6 }, (_, i) => (
          <mesh key={`injector-${i}`} position={[1.2, 0.5, -0.25 + i * 0.1]} scale={hovered === 'fuelFilter' ? 1.1 : 1}>
            <cylinderGeometry args={[0.02, 0.02, 0.1]} />
            <meshStandardMaterial 
              color={fuelFilterStatus.color}
              emissive={fuelFilterStatus.emissive}
              emissiveIntensity={fuelFilterStatus.intensity}
              metalness={0.9}
            />
          </mesh>
        ))}
        
        {/* Fuel Lines */}
        {[
          { from: [-1.5, 0.1, 0], to: [0, 0.25, -0.6] },
          { from: [0, 0.25, -0.6], to: [1.2, 0.65, 0] }
        ].map((line, i) => {
          const distance = Math.sqrt(
            Math.pow(line.to[0] - line.from[0], 2) +
            Math.pow(line.to[1] - line.from[1], 2) +
            Math.pow(line.to[2] - line.from[2], 2)
          );
          return (
            <mesh 
              key={`fuel-line-${i}`}
              position={[
                (line.from[0] + line.to[0]) / 2,
                (line.from[1] + line.to[1]) / 2,
                (line.from[2] + line.to[2]) / 2
              ]}
              rotation={[
                0, 
                Math.atan2(line.to[2] - line.from[2], line.to[0] - line.from[0]), 
                Math.atan2(line.to[1] - line.from[1], Math.sqrt(Math.pow(line.to[0] - line.from[0], 2) + Math.pow(line.to[2] - line.from[2], 2)))
              ]}
              scale={hovered === 'fuelFilter' ? 1.05 : 1}
            >
              <cylinderGeometry args={[0.015, 0.015, distance]} />
              <meshStandardMaterial 
                color={fuelFilterStatus.color}
                emissive={fuelFilterStatus.emissive}
                emissiveIntensity={fuelFilterStatus.intensity * 0.6}
                metalness={0.7}
              />
            </mesh>
          );
        })}
        
        {/* Fuel Pump */}
        <mesh position={[-1.3, 0.1, 0.2]} scale={hovered === 'fuelFilter' ? 1.1 : 1}>
          <boxGeometry args={[0.15, 0.1, 0.08]} />
          <meshStandardMaterial 
            color={fuelFilterStatus.color}
            emissive={fuelFilterStatus.emissive}
            emissiveIntensity={fuelFilterStatus.intensity}
            metalness={0.8}
          />
        </mesh>
        
        {fuelFilterStatus.glow && (
          <PulsingLight 
            position={[0, 0.25, -0.6]} 
            color={fuelFilterStatus.color} 
            intensity={fuelFilterStatus.intensity * 2}
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

      {/* REALISTIC WHEELS AND TIRES */}
      {[
        [1.6, -0.3, 1.1],
        [1.6, -0.3, -1.1],
        [-1.6, -0.3, 1.1],
        [-1.6, -0.3, -1.1]
      ].map((position, index) => (
        <group key={`wheel-group-${index}`}>
          {/* Tire */}
          <mesh 
            position={position as [number, number, number]} 
            rotation={[Math.PI / 2, 0, 0]}
          >
            <torusGeometry args={[0.35, 0.08]} />
            <meshStandardMaterial 
              color="#1a1a1a" 
              roughness={0.9}
              metalness={0}
            />
          </mesh>
          
          {/* Rim */}
          <mesh 
            position={position as [number, number, number]} 
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.28, 0.28, 0.12]} />
            <meshStandardMaterial 
              color="#c0c0c0" 
              metalness={0.8}
              roughness={0.1}
            />
          </mesh>
          
          {/* Brake Components visible through rim */}
          <mesh 
            position={position as [number, number, number]} 
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.22, 0.22, 0.02]} />
            <meshStandardMaterial 
              color={brakeStatus.color}
              emissive={brakeStatus.emissive}
              emissiveIntensity={brakeStatus.intensity}
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
        </group>
      ))}
      
      {/* Enhanced Headlights */}
      <mesh position={[2.2, 0.7, 0.6]}>
        <sphereGeometry args={[0.12]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          emissive="#e6f3ff" 
          emissiveIntensity={1.2} 
          transmission={0.8}
          thickness={0.1}
        />
      </mesh>
      <mesh position={[2.2, 0.7, -0.6]}>
        <sphereGeometry args={[0.12]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          emissive="#e6f3ff" 
          emissiveIntensity={1.2}
          transmission={0.8}
          thickness={0.1}
        />
      </mesh>
      
      {/* Digital HUD/Dashboard */}
      <mesh position={[0.8, 1.0, 0]} rotation={[-Math.PI / 8, 0, 0]}>
        <planeGeometry args={[1.5, 0.3]} />
        <meshBasicMaterial 
          color="#00ffff" 
          transparent 
          opacity={0.4}
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
      
      <Canvas camera={{ position: [8, 6, 8], fov: 40 }}>
        {/* Enhanced X-ray lighting setup */}
        <ambientLight intensity={0.4} color="#ffffff" />
        <directionalLight position={[10, 10, 5]} intensity={1.2} color="#ffffff" castShadow />
        <directionalLight position={[-5, 8, -5]} intensity={0.8} color="#e6f3ff" />
        
        {/* Rim lighting for transparent materials */}
        <pointLight position={[5, 5, 10]} intensity={0.6} color="#ffffff" />
        <pointLight position={[-5, 5, -10]} intensity={0.6} color="#ffffff" />
        
        {/* Bottom lighting to illuminate undercarriage */}
        <pointLight position={[0, -3, 0]} intensity={0.4} color="#0088ff" />
        
        {/* Environment lighting for metallic surfaces */}
        <hemisphereLight args={["#ffffff", "#404040"]} intensity={0.3} />
        
        <CarModel 
          health={health} 
          components={components}
          alerts={alerts}
          onComponentClick={onComponentClick}
        />
        <OrbitControls 
          enablePan={false} 
          enableZoom={true}
          minDistance={5}
          maxDistance={15}
          autoRotate
          autoRotateSpeed={0.3}
          minPolarAngle={Math.PI / 8}
          maxPolarAngle={Math.PI / 1.3}
        />
      </Canvas>
    </div>
  );
}