import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, TrendingDown, Download, Calendar, PieChart, Activity } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from "recharts";

const salesData = [
  { month: "Jan", gold: 4500000, silver: 850000, diamond: 2100000 },
  { month: "Feb", gold: 5200000, silver: 920000, diamond: 2400000 },
  { month: "Mar", gold: 4800000, silver: 780000, diamond: 2800000 },
  { month: "Apr", gold: 6100000, silver: 1100000, diamond: 3200000 },
  { month: "May", gold: 5800000, silver: 950000, diamond: 2900000 },
  { month: "Jun", gold: 7200000, silver: 1250000, diamond: 3800000 },
];

const categoryData = [
  { name: "Necklaces", value: 35, color: "hsl(43, 74%, 49%)" },
  { name: "Rings", value: 25, color: "hsl(43, 74%, 60%)" },
  { name: "Bangles", value: 20, color: "hsl(43, 74%, 70%)" },
  { name: "Earrings", value: 15, color: "hsl(43, 74%, 80%)" },
  { name: "Others", value: 5, color: "hsl(43, 74%, 90%)" },
];

const Analytics = () => {
  return (
    <DashboardLayout>
      <div className="mb-6 animate-fade-in pt-2 sm:pt-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold">
              <span className="text-gradient-gold">Analytics</span> Dashboard
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Track performance, analyze trends, and make data-driven decisions
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Last 6 Months</span>
              <span className="sm:hidden">6M</span>
            </Button>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <Card variant="stat">
          <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
            <p className="text-xs sm:text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-xl sm:text-2xl font-bold text-primary">₹4.2Cr</p>
            <div className="flex items-center gap-1 text-green-500 text-xs sm:text-sm mt-1">
              <TrendingUp className="w-3 h-3" />
              <span className="truncate">+18.5%</span>
            </div>
          </CardContent>
        </Card>
        <Card variant="stat">
          <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
            <p className="text-xs sm:text-sm text-muted-foreground">Total Orders</p>
            <p className="text-xl sm:text-2xl font-bold">1,847</p>
            <div className="flex items-center gap-1 text-green-500 text-xs sm:text-sm mt-1">
              <TrendingUp className="w-3 h-3" />
              <span className="truncate">+12.3%</span>
            </div>
          </CardContent>
        </Card>
        <Card variant="stat">
          <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
            <p className="text-xs sm:text-sm text-muted-foreground truncate">Avg. Order</p>
            <p className="text-xl sm:text-2xl font-bold">₹2.27L</p>
            <div className="flex items-center gap-1 text-red-500 text-xs sm:text-sm mt-1">
              <TrendingDown className="w-3 h-3" />
              <span className="truncate">-2.1%</span>
            </div>
          </CardContent>
        </Card>
        <Card variant="stat">
          <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
            <p className="text-xs sm:text-sm text-muted-foreground truncate">Retention</p>
            <p className="text-xl sm:text-2xl font-bold">78.5%</p>
            <div className="flex items-center gap-1 text-green-500 text-xs sm:text-sm mt-1">
              <TrendingUp className="w-3 h-3" />
              <span className="truncate">+5.2%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 mb-6">
        {/* Sales Chart */}
        <Card variant="elevated" className="xl:col-span-2">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              Revenue by Metal Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(43, 74%, 49%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(43, 74%, 49%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="silverGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(220, 9%, 46%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(220, 9%, 46%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="diamondGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(200, 80%, 60%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(200, 80%, 60%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `₹${v/1000000}M`} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }} 
                    formatter={(v: number) => `₹${(v/100000).toFixed(1)}L`}
                  />
                  <Area type="monotone" dataKey="gold" stroke="hsl(43, 74%, 49%)" fill="url(#goldGradient)" strokeWidth={2} />
                  <Area type="monotone" dataKey="silver" stroke="hsl(220, 9%, 46%)" fill="url(#silverGradient)" strokeWidth={2} />
                  <Area type="monotone" dataKey="diamond" stroke="hsl(200, 80%, 60%)" fill="url(#diamondGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card variant="elevated">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <PieChart className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              Sales by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 sm:space-y-2 mt-4">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="truncate">{cat.name}</span>
                  </div>
                  <span className="font-medium">{cat.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
