import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface OverallHealthGaugeProps {
  health: number;
  vehicleModel: string;
  mileage: string;
}

export function OverallHealthGauge({ health, vehicleModel, mileage }: OverallHealthGaugeProps) {
  const getHealthStatus = (health: number) => {
    if (health >= 80) return { status: "healthy", color: "text-status-healthy", bg: "bg-gradient-status-healthy" };
    if (health >= 60) return { status: "caution", color: "text-status-caution", bg: "bg-gradient-status-caution" };
    return { status: "critical", color: "text-status-critical", bg: "bg-gradient-status-critical" };
  };

  const statusInfo = getHealthStatus(health);
  const circumference = 2 * Math.PI * 90; // radius of 90
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (health / 100) * circumference;

  return (
    <Card className="bg-gradient-card p-8 border-border shadow-automotive">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">{vehicleModel}</h2>
        <p className="text-muted-foreground">{mileage} miles</p>
      </div>

      <div className="relative flex items-center justify-center mb-6">
        <svg className="w-48 h-48 transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="96"
            cy="96"
            r="90"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="96"
            cy="96"
            r="90"
            stroke="url(#healthGradient)"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={health >= 80 ? "hsl(142 76% 36%)" : health >= 60 ? "hsl(45 93% 58%)" : "hsl(0 84% 60%)"} />
              <stop offset="100%" stopColor={health >= 80 ? "hsl(120 60% 50%)" : health >= 60 ? "hsl(35 85% 65%)" : "hsl(10 75% 55%)"} />
            </linearGradient>
          </defs>
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-4xl font-bold ${statusInfo.color} mb-1`}>
              {health}%
            </div>
            <Badge 
              variant="secondary" 
              className={`${statusInfo.color} capitalize font-semibold`}
            >
              {statusInfo.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">Overall Vehicle Health</h3>
        <p className="text-sm text-muted-foreground">
          {health >= 80 
            ? "Your vehicle is in excellent condition" 
            : health >= 60 
            ? "Some components need attention soon"
            : "Immediate maintenance required"
          }
        </p>
      </div>
    </Card>
  );
}