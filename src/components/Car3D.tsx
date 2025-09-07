import { useRef, useState, useCallback, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { DiagnosticPanel } from './DiagnosticPanel';

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

// 3D Model Viewer Component
function EngineModel({ modelPath, onComponentHighlight }: { 
  modelPath: string; 
  onComponentHighlight: (componentName: string | null) => void;
}) {
  const { scene } = useGLTF(modelPath);
  const [highlightedPart, setHighlightedPart] = useState<THREE.Object3D | null>(null);
  const modelRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (scene) {
      // Search for air filter or intake components
      const findAirFilterComponent = (object: THREE.Object3D): THREE.Object3D | null => {
        if (object.name.toLowerCase().includes('air_filter') || 
            object.name.toLowerCase().includes('intake') ||
            object.name.toLowerCase().includes('filter') ||
            object.name.toLowerCase().includes('air')) {
          return object;
        }
        
        for (const child of object.children) {
          const found = findAirFilterComponent(child);
          if (found) return found;
        }
        return null;
      };

      const airFilterPart = findAirFilterComponent(scene);
      if (airFilterPart) {
        setHighlightedPart(airFilterPart);
        onComponentHighlight(airFilterPart.name || 'Air Filter');
      }
    }
  }, [scene, onComponentHighlight]);

  // Pulsing red highlight effect
  useFrame((state) => {
    if (highlightedPart && highlightedPart instanceof THREE.Mesh) {
      const material = highlightedPart.material as THREE.MeshStandardMaterial;
      if (material) {
        const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.5 + 0.5;
        material.emissive.setRGB(1 * pulse, 0, 0);
        material.emissiveIntensity = pulse * 0.8;
      }
    }
  });

  return (
    <group ref={modelRef}>
      <primitive object={scene} scale={2} position={[0, -1, 0]} />
    </group>
  );
}

// Preload the GLTF model
useGLTF.preload('/models/engine-v6.glb');

function CarModel({ health, components, alerts, onComponentClick }: CarModelProps) {
  const [highlightedComponent, setHighlightedComponent] = useState<string | null>(null);

  const handleComponentHighlight = useCallback((componentName: string | null) => {
    setHighlightedComponent(componentName);
    if (componentName) {
      onComponentClick(componentName);
    }
  }, [onComponentClick]);

  return (
    <group>
      <EngineModel 
        modelPath="/models/engine-v6.glb" 
        onComponentHighlight={handleComponentHighlight}
      />
      {highlightedComponent && (
        <group position={[0, 2, 0]}>
          <mesh>
            <planeGeometry args={[3, 0.5]} />
            <meshBasicMaterial color="#ff0000" transparent opacity={0.8} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[2.8, 0.4]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.9} />
          </mesh>
        </group>
      )}
    </group>
  );
}

interface Car3DProps {
  health: number;
  components: ComponentData[];
  alerts: AlertData[];
  onComponentClick?: (componentName: string) => void;
}

export function Car3D({ health, components, alerts, onComponentClick }: Car3DProps) {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  const handleComponentClick = useCallback((componentName: string) => {
    setSelectedComponent(componentName);
    onComponentClick?.(componentName);
  }, [onComponentClick]);

  return (
    <div className="flex flex-col lg:flex-row h-full gap-4">
      <div className="flex-1 bg-transparent rounded-xl overflow-hidden relative">
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 border border-cyan-500/30">
            <p className="text-cyan-400 text-sm font-medium">3D Engine Viewer</p>
            <p className="text-white font-bold">
              {health >= 90 ? "Excellent" : health >= 70 ? "Good" : health >= 50 ? "Fair" : "Critical"}
            </p>
          </div>
        </div>
        
        <Canvas 
          camera={{ position: [3, 2, 5], fov: 75 }}
          gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight 
            position={[5, 5, 5]} 
            intensity={1.5} 
            castShadow 
          />
          <pointLight position={[-5, 5, -5]} intensity={0.8} />
          <CarModel 
            health={health} 
            components={components} 
            alerts={alerts}
            onComponentClick={handleComponentClick}
          />
          <OrbitControls 
            enablePan={true} 
            enableZoom={true} 
            enableRotate={true}
            minDistance={2}
            maxDistance={15}
            autoRotate={false}
          />
        </Canvas>
      </div>
      
      <DiagnosticPanel 
        selectedComponent={selectedComponent}
      />
    </div>
  );
}