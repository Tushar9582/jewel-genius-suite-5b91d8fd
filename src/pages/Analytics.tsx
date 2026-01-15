import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, TrendingDown, Download, Calendar, PieChart, Activity } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";

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
      <div className="mb-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">
              <span className="text-gradient-gold">Analytics</span> Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Track performance, analyze trends, and make data-driven decisions
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Last 6 Months
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card variant="stat">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold text-primary">₹4.2Cr</p>
            <div className="flex items-center gap-1 text-green-500 text-sm mt-1">
              <TrendingUp className="w-3 h-3" />
              +18.5% vs last period
            </div>
          </CardContent>
        </Card>
        <Card variant="stat">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Orders</p>
            <p className="text-2xl font-bold">1,847</p>
            <div className="flex items-center gap-1 text-green-500 text-sm mt-1">
              <TrendingUp className="w-3 h-3" />
              +12.3% vs last period
            </div>
          </CardContent>
        </Card>
        <Card variant="stat">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Avg. Order Value</p>
            <p className="text-2xl font-bold">₹2.27L</p>
            <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
              <TrendingDown className="w-3 h-3" />
              -2.1% vs last period
            </div>
          </CardContent>
        </Card>
        <Card variant="stat">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Customer Retention</p>
            <p className="text-2xl font-bold">78.5%</p>
            <div className="flex items-center gap-1 text-green-500 text-sm mt-1">
              <TrendingUp className="w-3 h-3" />
              +5.2% vs last period
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Sales Chart */}
        <Card variant="elevated" className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Revenue by Metal Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
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
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `₹${v/1000000}M`} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
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
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" />
              Sales by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
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
            <div className="space-y-2 mt-4">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span>{cat.name}</span>
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
