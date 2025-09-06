import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

interface DiagnosticPanelProps {
  selectedComponent?: string;
}

interface Blueprint {
  name: string;
  svg: string;
  color: string;
}

const blueprints: Record<string, Blueprint> = {
  'Air Filter': {
    name: 'Engine Air Intake System',
    color: '#ff0033',
    svg: `
      <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
        <!-- Air Filter Housing -->
        <rect x="50" y="120" width="80" height="60" fill="none" stroke="currentColor" strokeWidth="2"/>
        <text x="90" y="145" textAnchor="middle" fontSize="10" fill="currentColor">AIR FILTER</text>
        <text x="90" y="157" textAnchor="middle" fontSize="8" fill="currentColor">HOUSING</text>
        
        <!-- Air Filter Element -->
        <rect x="60" y="130" width="60" height="40" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2"/>
        <text x="90" y="152" textAnchor="middle" fontSize="8" fill="currentColor">ELEMENT</text>
        
        <!-- Intake Tube -->
        <line x1="130" y1="150" x2="200" y2="150" stroke="currentColor" strokeWidth="3"/>
        <text x="165" y="145" textAnchor="middle" fontSize="8" fill="currentColor">INTAKE TUBE</text>
        
        <!-- Mass Air Flow Sensor -->
        <rect x="170" y="140" width="30" height="20" fill="none" stroke="currentColor" strokeWidth="2"/>
        <text x="185" y="135" textAnchor="middle" fontSize="8" fill="currentColor">MAF</text>
        <text x="185" y="175" textAnchor="middle" fontSize="8" fill="currentColor">SENSOR</text>
        
        <!-- Throttle Body -->
        <circle cx="220" cy="150" r="25" fill="none" stroke="currentColor" strokeWidth="2"/>
        <text x="220" y="145" textAnchor="middle" fontSize="8" fill="currentColor">THROTTLE</text>
        <text x="220" y="157" textAnchor="middle" fontSize="8" fill="currentColor">BODY</text>
        
        <!-- Intake Manifold -->
        <rect x="245" y="130" width="100" height="40" fill="none" stroke="currentColor" strokeWidth="2"/>
        <text x="295" y="145" textAnchor="middle" fontSize="10" fill="currentColor">INTAKE</text>
        <text x="295" y="157" textAnchor="middle" fontSize="10" fill="currentColor">MANIFOLD</text>
        
        <!-- Engine Cylinders -->
        <circle cx="280" cy="190" r="12" fill="none" stroke="currentColor" strokeWidth="2"/>
        <circle cx="310" cy="190" r="12" fill="none" stroke="currentColor" strokeWidth="2"/>
        <circle cx="280" cy="220" r="12" fill="none" stroke="currentColor" strokeWidth="2"/>
        <circle cx="310" cy="220" r="12" fill="none" stroke="currentColor" strokeWidth="2"/>
        
        <!-- Connecting Lines -->
        <line x1="295" y1="170" x2="280" y2="178" stroke="currentColor" strokeWidth="1"/>
        <line x1="295" y1="170" x2="310" y2="178" stroke="currentColor" strokeWidth="1"/>
        <line x1="295" y1="170" x2="280" y2="208" stroke="currentColor" strokeWidth="1"/>
        <line x1="295" y1="170" x2="310" y2="208" stroke="currentColor" strokeWidth="1"/>
        
        <!-- Air Flow Arrows -->
        <path d="M 30 150 L 45 150 M 40 145 L 45 150 L 40 155" stroke="currentColor" strokeWidth="2" fill="none"/>
        <text x="35" y="140" textAnchor="middle" fontSize="8" fill="currentColor">AIR IN</text>
        
        <!-- Grid Background -->
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)"/>
      </svg>
    `
  },
  'Fuel Filter': {
    name: 'Fuel Delivery System',
    color: '#ffaa00',
    svg: `
      <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
        <!-- Fuel Tank -->
        <ellipse cx="80" cy="200" rx="50" ry="30" fill="none" stroke="currentColor" strokeWidth="2"/>
        <text x="80" y="195" textAnchor="middle" fontSize="10" fill="currentColor">FUEL</text>
        <text x="80" y="207" textAnchor="middle" fontSize="10" fill="currentColor">TANK</text>
        
        <!-- Fuel Pump -->
        <rect x="70" y="180" width="20" height="15" fill="none" stroke="currentColor" strokeWidth="2"/>
        <text x="80" y="175" textAnchor="middle" fontSize="8" fill="currentColor">PUMP</text>
        
        <!-- Fuel Lines -->
        <path d="M 130 200 Q 180 180 220 160" fill="none" stroke="currentColor" strokeWidth="3"/>
        <text x="175" y="175" textAnchor="middle" fontSize="8" fill="currentColor">FUEL LINE</text>
        
        <!-- Fuel Filter -->
        <ellipse cx="220" cy="160" rx="25" ry="15" fill="none" stroke="currentColor" strokeWidth="2"/>
        <rect x="205" y="152" width="30" height="16" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="1,1"/>
        <text x="220" y="145" textAnchor="middle" fontSize="8" fill="currentColor">FUEL FILTER</text>
        <text x="220" y="185" textAnchor="middle" fontSize="8" fill="currentColor">ELEMENT</text>
        
        <!-- Fuel Rail -->
        <rect x="270" y="155" width="80" height="10" fill="none" stroke="currentColor" strokeWidth="2"/>
        <text x="310" y="145" textAnchor="middle" fontSize="8" fill="currentColor">FUEL RAIL</text>
        
        <!-- Fuel Injectors -->
        <rect x="280" y="165" width="8" height="20" fill="none" stroke="currentColor" strokeWidth="1"/>
        <rect x="300" y="165" width="8" height="20" fill="none" stroke="currentColor" strokeWidth="1"/>
        <rect x="320" y="165" width="8" height="20" fill="none" stroke="currentColor" strokeWidth="1"/>
        <rect x="340" y="165" width="8" height="20" fill="none" stroke="currentColor" strokeWidth="1"/>
        <text x="310" y="200" textAnchor="middle" fontSize="8" fill="currentColor">INJECTORS</text>
        
        <!-- Engine Cylinders -->
        <circle cx="284" cy="210" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
        <circle cx="304" cy="210" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
        <circle cx="324" cy="210" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
        <circle cx="344" cy="210" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
        
        <!-- Connecting Lines -->
        <line x1="245" y1="160" x2="270" y2="160" stroke="currentColor" strokeWidth="3"/>
        <line x1="284" y1="185" x2="284" y2="200" stroke="currentColor" strokeWidth="1"/>
        <line x1="304" y1="185" x2="304" y2="200" stroke="currentColor" strokeWidth="1"/>
        <line x1="324" y1="185" x2="324" y2="200" stroke="currentColor" strokeWidth="1"/>
        <line x1="344" y1="185" x2="344" y2="200" stroke="currentColor" strokeWidth="1"/>
        
        <!-- Pressure Regulator -->
        <circle cx="350" cy="140" r="12" fill="none" stroke="currentColor" strokeWidth="2"/>
        <text x="350" y="125" textAnchor="middle" fontSize="8" fill="currentColor">PRESSURE</text>
        <text x="350" y="160" textAnchor="middle" fontSize="8" fill="currentColor">REGULATOR</text>
        <line x1="350" y1="155" x2="350" y2="152" stroke="currentColor" strokeWidth="2"/>
        
        <!-- Return Line -->
        <path d="M 350 128 Q 300 100 150 120 Q 100 130 80 170" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3,3"/>
        <text x="220" y="110" textAnchor="middle" fontSize="8" fill="currentColor">RETURN LINE</text>
        
        <!-- Grid Background -->
        <defs>
          <pattern id="fuelGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#fuelGrid)"/>
      </svg>
    `
  }
};

export function DiagnosticPanel({ selectedComponent }: DiagnosticPanelProps) {
  const [scanComplete, setScanComplete] = useState(false);
  const blueprint = selectedComponent ? blueprints[selectedComponent] : null;

  useEffect(() => {
    if (selectedComponent) {
      setScanComplete(false);
      // Start scan animation
      const timer = setTimeout(() => setScanComplete(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [selectedComponent]);

  return (
    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-cyan-500/30 h-full min-h-[300px] relative overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-cyan-500/20">
        <h3 className="text-lg font-semibold text-cyan-400 font-mono">
          Component Analysis
        </h3>
        <div className="text-xs text-cyan-300/70 mt-1">
          {blueprint ? 'DIAGNOSTIC VIEW ACTIVE' : 'AWAITING SELECTION'}
        </div>
      </div>

      {/* Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />
      </div>

      {/* Content */}
      <div className="p-4 h-full relative z-10">
        {blueprint ? (
          <div className="h-full flex flex-col">
            {/* Blueprint Title */}
            <div className="mb-4">
              <div className="text-sm font-mono text-cyan-300 mb-1">
                {blueprint.name}
              </div>
              <div className="text-xs text-cyan-400/60">
                Real-time diagnostic schematic
              </div>
            </div>

            {/* Blueprint Container */}
            <div className="flex-1 relative bg-slate-900/50 rounded border border-cyan-500/20 p-4">
              {/* Blueprint SVG */}
              <div 
                className={`w-full h-full transition-all duration-1000 ${
                  scanComplete ? 'opacity-100' : 'opacity-70'
                }`}
                style={{ color: blueprint.color }}
              >
                <div dangerouslySetInnerHTML={{ __html: blueprint.svg }} />
              </div>

              {/* Scan Line Animation */}
              {selectedComponent && !scanComplete && (
                <div className="absolute inset-0 pointer-events-none">
                  <div 
                    className="h-full w-1 bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-slide-in-right"
                    style={{
                      animation: 'scanLine 1s ease-out',
                      boxShadow: '0 0 20px rgba(0, 255, 255, 0.8)'
                    }}
                  />
                </div>
              )}

              {/* Scanning Status */}
              {selectedComponent && !scanComplete && (
                <div className="absolute bottom-4 left-4 text-xs text-cyan-400 font-mono animate-pulse">
                  SCANNING... {Math.floor(Math.random() * 100)}%
                </div>
              )}

              {/* Analysis Complete */}
              {selectedComponent && scanComplete && (
                <div className="absolute bottom-4 right-4 text-xs text-green-400 font-mono">
                  ANALYSIS COMPLETE
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-cyan-400/50">
              <div className="text-sm font-mono mb-2">No Component Selected</div>
              <div className="text-xs">Click on an alert to view diagnostic schematic</div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}