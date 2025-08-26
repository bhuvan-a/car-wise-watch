import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, Wrench, MapPin } from "lucide-react";
import { useState } from "react";
import { findNearestServiceCenter, openGoogleMaps } from "@/services/serviceCenter";
import { useToast } from "@/hooks/use-toast";

interface MaintenanceAlertProps {
  component: string;
  urgency: "low" | "medium" | "high";
  message: string;
  recommendedAction: string;
  timeframe: string;
}

export function MaintenanceAlert({ 
  component, 
  urgency, 
  message, 
  recommendedAction,
  timeframe 
}: MaintenanceAlertProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleScheduleService = async () => {
    setIsLoading(true);
    try {
      toast({
        title: "Finding nearest service center...",
        description: "Please allow location access for best results.",
      });

      const serviceCenter = await findNearestServiceCenter(component);
      
      if (serviceCenter) {
        const result = await openGoogleMaps(serviceCenter);
        if (result.success) {
          toast({
            title: "Service center found!",
            description: `Opening directions to ${serviceCenter.name}`,
          });
        } else {
          try { await navigator.clipboard.writeText(result.url); } catch {}
          toast({
            title: "Navigation blocked by preview",
            description: "Maps link copied. Paste it into a new tab to open directions.",
          });
        }
      } else {
        toast({
          title: "No service centers found",
          description: "Please try again or search manually.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error finding service center",
        description: "Please try again or search manually.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const urgencyConfig = {
    low: {
      icon: Clock,
      className: "border-status-healthy bg-status-healthy/10 text-status-healthy",
      buttonVariant: "secondary" as const
    },
    medium: {
      icon: AlertTriangle,
      className: "border-status-caution bg-status-caution/10 text-status-caution",
      buttonVariant: "secondary" as const
    },
    high: {
      icon: AlertTriangle,
      className: "border-status-critical bg-status-critical/10 text-status-critical",
      buttonVariant: "destructive" as const
    }
  };

  const config = urgencyConfig[urgency];
  const Icon = config.icon;

  return (
    <Alert className={`${config.className} shadow-automotive`}>
      <Icon className="h-5 w-5" />
      <AlertTitle className="flex items-center justify-between">
        <span>{component} - {urgency.charAt(0).toUpperCase() + urgency.slice(1)} Priority</span>
        <span className="text-xs font-normal opacity-75">{timeframe}</span>
      </AlertTitle>
      <AlertDescription className="mt-3">
        <p className="mb-4">{message}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{recommendedAction}</span>
          <Button 
            size="sm" 
            variant={config.buttonVariant}
            className="ml-4"
            onClick={handleScheduleService}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <MapPin className="w-4 h-4 mr-2 animate-pulse" />
                Finding...
              </>
            ) : (
              <>
                <Wrench className="w-4 h-4 mr-2" />
                Schedule Service
              </>
            )}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}