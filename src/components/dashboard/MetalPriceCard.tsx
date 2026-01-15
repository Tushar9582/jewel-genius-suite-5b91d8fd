import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetalPrice {
  name: string;
  price: string;
  currency: string;
  change: number;
  unit: string;
  color: string;
}

const metalPrices: MetalPrice[] = [
  {
    name: "Gold 24K",
    price: "6,285",
    currency: "₹",
    change: 0.45,
    unit: "/gram",
    color: "text-primary",
  },
  {
    name: "Gold 22K",
    price: "5,762",
    currency: "₹",
    change: 0.42,
    unit: "/gram",
    color: "text-primary",
  },
  {
    name: "Silver",
    price: "75.50",
    currency: "₹",
    change: -0.23,
    unit: "/gram",
    color: "text-silver",
  },
  {
    name: "Platinum",
    price: "2,850",
    currency: "₹",
    change: 0.18,
    unit: "/gram",
    color: "text-platinum",
  },
];

export function MetalPriceCard() {
  return (
    <Card variant="elevated" className="overflow-hidden">
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <div>
          <h3 className="font-display font-semibold text-lg">Live Metal Prices</h3>
          <p className="text-xs text-muted-foreground">
            Last updated: 2 mins ago
          </p>
        </div>
        <button className="p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
      <CardContent className="p-0">
        <div className="divide-y divide-border/30">
          {metalPrices.map((metal) => (
            <div
              key={metal.name}
              className="flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-3 h-3 rounded-full",
                    metal.name.includes("Gold")
                      ? "bg-primary"
                      : metal.name === "Silver"
                      ? "bg-silver"
                      : "bg-platinum"
                  )}
                />
                <span className="font-medium">{metal.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className={cn("font-semibold", metal.color)}>
                    {metal.currency}
                    {metal.price}
                    <span className="text-xs text-muted-foreground ml-1">
                      {metal.unit}
                    </span>
                  </p>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-1 text-sm font-medium px-2 py-0.5 rounded-full",
                    metal.change >= 0
                      ? "text-emerald bg-emerald/10"
                      : "text-ruby bg-ruby/10"
                  )}
                >
                  {metal.change >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {Math.abs(metal.change)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
