import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Package, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  type: "low-stock" | "reorder" | "trending";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

const alerts: Alert[] = [
  {
    id: "1",
    type: "low-stock",
    title: "22K Gold Chains",
    description: "Only 5 units remaining • Reorder recommended",
    priority: "high",
  },
  {
    id: "2",
    type: "trending",
    title: "Diamond Studs",
    description: "High demand • 45% increase in sales this week",
    priority: "medium",
  },
  {
    id: "3",
    type: "reorder",
    title: "Silver Bangles",
    description: "Stock depleted • Order placed with supplier",
    priority: "low",
  },
  {
    id: "4",
    type: "low-stock",
    title: "Platinum Rings",
    description: "8 units left • Below safety stock level",
    priority: "medium",
  },
];

const priorityStyles = {
  high: "border-l-ruby bg-ruby/5",
  medium: "border-l-primary bg-primary/5",
  low: "border-l-silver bg-secondary/30",
};

const iconMap = {
  "low-stock": AlertTriangle,
  reorder: Package,
  trending: TrendingUp,
};

export function InventoryAlerts() {
  return (
    <Card variant="elevated">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-primary" />
          Inventory Alerts
        </CardTitle>
        <span className="text-sm text-muted-foreground">
          {alerts.filter((a) => a.priority === "high").length} urgent
        </span>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/30">
          {alerts.map((alert, index) => {
            const Icon = iconMap[alert.type];
            return (
              <div
                key={alert.id}
                className={cn(
                  "p-4 border-l-4 hover:bg-secondary/20 transition-colors cursor-pointer animate-fade-in",
                  priorityStyles[alert.priority]
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-3">
                  <Icon
                    className={cn(
                      "w-5 h-5 mt-0.5",
                      alert.priority === "high"
                        ? "text-ruby"
                        : alert.priority === "medium"
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  />
                  <div>
                    <p className="font-medium">{alert.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {alert.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
