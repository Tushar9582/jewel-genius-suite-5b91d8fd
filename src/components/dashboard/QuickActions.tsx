import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  ShoppingCart,
  FileText,
  UserPlus,
  PackagePlus,
  Receipt,
} from "lucide-react";

const actions = [
  {
    icon: ShoppingCart,
    label: "New Sale",
    description: "Start POS transaction",
    variant: "gold" as const,
  },
  {
    icon: UserPlus,
    label: "Add Customer",
    description: "Register new customer",
    variant: "outline" as const,
  },
  {
    icon: PackagePlus,
    label: "Add Inventory",
    description: "Stock new items",
    variant: "outline" as const,
  },
  {
    icon: Receipt,
    label: "Generate Invoice",
    description: "Create billing",
    variant: "outline" as const,
  },
  {
    icon: FileText,
    label: "Reports",
    description: "View analytics",
    variant: "outline" as const,
  },
  {
    icon: Plus,
    label: "More Actions",
    description: "See all options",
    variant: "ghost" as const,
  },
];

export function QuickActions() {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.label}
              variant={action.variant}
              className="h-auto py-4 flex-col gap-2 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Icon className="w-5 h-5" />
              <div className="text-center">
                <p className="font-medium text-sm">{action.label}</p>
                <p className="text-xs opacity-70 font-normal">
                  {action.description}
                </p>
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
