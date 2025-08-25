import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface VehicleHealthCardProps {
  component: string;
  health: number;
  status: "healthy" | "caution" | "critical";
  nextMaintenance?: string;
  description: string;
}

const statusConfig = {
  healthy: {
    icon: CheckCircle,
    gradient: "bg-gradient-status-healthy",
    shadow: "shadow-glow-healthy",
    textColor: "text-status-healthy"
  },
  caution: {
    icon: AlertTriangle,
    gradient: "bg-gradient-status-caution",
    shadow: "shadow-glow-caution",
    textColor: "text-status-caution"
  },
  critical: {
    icon: XCircle,
    gradient: "bg-gradient-status-critical",
    shadow: "shadow-glow-critical",
    textColor: "text-status-critical"
  }
};

export function VehicleHealthCard({
  component,
  health,
  status,
  nextMaintenance,
  description
}: VehicleHealthCardProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Card className={`bg-gradient-card p-6 border-border transition-all duration-300 hover:${config.shadow} hover:scale-105`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${config.gradient}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{component}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <Badge variant="secondary" className={`${config.textColor} font-bold`}>
          {health}%
        </Badge>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Health Status</span>
          <span className={`text-sm font-medium ${config.textColor} capitalize`}>
            {status}
          </span>
        </div>
        
        {/* Health Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${config.gradient} transition-all duration-500`}
            style={{ width: `${health}%` }}
          />
        </div>
        
        {nextMaintenance && (
          <div className="flex justify-between items-center pt-2 border-t border-border">
            <span className="text-sm text-muted-foreground">Next Service</span>
            <span className="text-sm font-medium text-foreground">
              {nextMaintenance}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}