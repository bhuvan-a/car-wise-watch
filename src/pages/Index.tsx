import { OverallHealthGauge } from "@/components/OverallHealthGauge";
import { VehicleHealthCard } from "@/components/VehicleHealthCard";
import { MaintenanceAlert } from "@/components/MaintenanceAlert";
import { Car3D } from "@/components/Car3D";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Gauge, Settings, Bell } from "lucide-react";
import heroImage from "@/assets/automotive-hero.jpg";

const mockVehicleData = {
  model: "2022 Honda Accord",
  mileage: "45,230",
  overallHealth: 78,
  components: [
    {
      component: "Engine Oil System",
      health: 85,
      status: "healthy" as const,
      nextMaintenance: "2,500 km",
      description: "Oil pump and filter status"
    },
    {
      component: "Fuel Filter",
      health: 45,
      status: "caution" as const,
      nextMaintenance: "800 km",
      description: "Fuel delivery system"
    },
    {
      component: "Air Filter",
      health: 32,
      status: "critical" as const,
      nextMaintenance: "Overdue",
      description: "Engine air intake system"
    },
    {
      component: "Brake System",
      health: 92,
      status: "healthy" as const,
      nextMaintenance: "8,000 km",
      description: "Brake pads and fluid"
    }
  ],
  alerts: [
    {
      component: "Air Filter",
      urgency: "high" as const,
      message: "Air filter health is critically low at 32%. Engine performance may be affected.",
      recommendedAction: "Replace air filter immediately",
      timeframe: "Within 100 km"
    },
    {
      component: "Fuel Filter",
      urgency: "medium" as const,
      message: "Fuel filter showing signs of wear. Replacement recommended soon.",
      recommendedAction: "Schedule fuel filter replacement",
      timeframe: "Within 800 km"
    }
  ]
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={heroImage}
          alt="Automotive dashboard"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background">
          <div className="container mx-auto px-6 h-full flex items-center">
            <div className="text-left">
              <div className="flex items-center gap-3 mb-4">
                <Car className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  AutoHealth Pro
                </h1>
              </div>
              <p className="text-xl text-muted-foreground">
                Predictive Maintenance for Your Vehicle
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Status Overview */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
            <OverallHealthGauge 
              health={mockVehicleData.overallHealth}
              vehicleModel={mockVehicleData.model}
              mileage={mockVehicleData.mileage}
            />
            <Car3D health={mockVehicleData.overallHealth} />
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-gradient-card p-4 border-border text-center">
                <Gauge className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">78%</div>
                <div className="text-sm text-muted-foreground">Health Score</div>
              </Card>
              <Card className="bg-gradient-card p-4 border-border text-center">
                <Settings className="h-6 w-6 text-status-caution mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">2</div>
                <div className="text-sm text-muted-foreground">Issues</div>
              </Card>
              <Card className="bg-gradient-card p-4 border-border text-center">
                <Bell className="h-6 w-6 text-status-critical mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">1</div>
                <div className="text-sm text-muted-foreground">Urgent</div>
              </Card>
            </div>

            {/* Alerts Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Active Alerts
              </h3>
              {mockVehicleData.alerts.map((alert, index) => (
                <MaintenanceAlert key={index} {...alert} />
              ))}
            </div>
          </div>
        </div>

        {/* Component Health Cards */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Gauge className="h-6 w-6 text-primary" />
            Component Health Status
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockVehicleData.components.map((component, index) => (
              <VehicleHealthCard key={index} {...component} />
            ))}
          </div>
        </div>

        {/* CarPlay Ready Notice */}
        <Card className="bg-gradient-primary p-6 text-center border-0">
          <div className="text-white">
            <h3 className="text-xl font-semibold mb-2">CarPlay Ready</h3>
            <p className="opacity-90">
              This interface is optimized for Apple CarPlay integration - 
              monitor your vehicle health directly from your dashboard.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;