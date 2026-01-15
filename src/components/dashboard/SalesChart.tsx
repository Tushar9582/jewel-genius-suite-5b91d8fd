import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", gold: 42000, silver: 8500, diamond: 28000 },
  { name: "Tue", gold: 38000, silver: 7200, diamond: 35000 },
  { name: "Wed", gold: 55000, silver: 9800, diamond: 42000 },
  { name: "Thu", gold: 48000, silver: 11000, diamond: 38000 },
  { name: "Fri", gold: 62000, silver: 12500, diamond: 55000 },
  { name: "Sat", gold: 85000, silver: 15000, diamond: 72000 },
  { name: "Sun", gold: 75000, silver: 13200, diamond: 65000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-elevated">
        <p className="font-medium mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground capitalize">
              {entry.dataKey}:
            </span>
            <span className="font-medium">₹{entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function SalesChart() {
  return (
    <Card variant="elevated" className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Weekly Sales Overview</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Revenue breakdown by metal type
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">Gold</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-silver" />
            <span className="text-muted-foreground">Silver</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-diamond" />
            <span className="text-muted-foreground">Diamond</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(43, 74%, 53%)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(43, 74%, 53%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="silverGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(220, 10%, 70%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(220, 10%, 70%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="diamondGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(200, 20%, 90%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(200, 20%, 90%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(30, 10%, 18%)"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fill: "hsl(40, 10%, 55%)", fontSize: 12 }}
                axisLine={{ stroke: "hsl(30, 10%, 18%)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "hsl(40, 10%, 55%)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `₹${value / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="gold"
                stroke="hsl(43, 74%, 53%)"
                strokeWidth={2}
                fill="url(#goldGradient)"
              />
              <Area
                type="monotone"
                dataKey="silver"
                stroke="hsl(220, 10%, 70%)"
                strokeWidth={2}
                fill="url(#silverGradient)"
              />
              <Area
                type="monotone"
                dataKey="diamond"
                stroke="hsl(200, 20%, 90%)"
                strokeWidth={2}
                fill="url(#diamondGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
