import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, TrendingDown, Download, Calendar, PieChart, Activity, Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Sale {
  id: string;
  total: number;
  created_at: string;
  items: unknown;
}

interface Product {
  id: string;
  category: string;
  unit_price: number;
  stock: number;
}

const Analytics = () => {
  const { data: sales = [], isLoading: salesLoading } = useQuery({
    queryKey: ["analytics-sales"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sales")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Sale[];
    },
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["analytics-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, category, unit_price, stock");
      if (error) throw error;
      return data as Product[];
    },
  });

  const isLoading = salesLoading || productsLoading;

  // Calculate stats
  const totalRevenue = sales.reduce((acc, s) => acc + Number(s.total), 0);
  const totalOrders = sales.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Group sales by month for chart
  const monthlySales: Record<string, { gold: number; silver: number; diamond: number }> = {};
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  sales.forEach((sale) => {
    const date = new Date(sale.created_at);
    const monthKey = months[date.getMonth()];
    if (!monthlySales[monthKey]) {
      monthlySales[monthKey] = { gold: 0, silver: 0, diamond: 0 };
    }
    monthlySales[monthKey].gold += Number(sale.total);
  });

  const salesData = months.slice(0, 6).map((month) => ({
    month,
    gold: monthlySales[month]?.gold || 0,
    silver: monthlySales[month]?.silver || 0,
    diamond: monthlySales[month]?.diamond || 0,
  }));

  // Calculate category distribution from products
  const categoryCount: Record<string, number> = {};
  products.forEach((p) => {
    categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
  });

  const totalProducts = products.length || 1;
  const colors = ["hsl(43, 74%, 49%)", "hsl(43, 74%, 60%)", "hsl(43, 74%, 70%)", "hsl(43, 74%, 80%)", "hsl(43, 74%, 90%)"];
  const categoryData = Object.entries(categoryCount)
    .slice(0, 5)
    .map(([name, count], index) => ({
      name,
      value: Math.round((count / totalProducts) * 100),
      color: colors[index % colors.length],
    }));

  // Add default data if no categories
  const displayCategoryData = categoryData.length > 0 ? categoryData : [
    { name: "Necklaces", value: 35, color: "hsl(43, 74%, 49%)" },
    { name: "Rings", value: 25, color: "hsl(43, 74%, 60%)" },
    { name: "Bangles", value: 20, color: "hsl(43, 74%, 70%)" },
    { name: "Earrings", value: 15, color: "hsl(43, 74%, 80%)" },
    { name: "Others", value: 5, color: "hsl(43, 74%, 90%)" },
  ];

  const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    return `₹${value.toLocaleString()}`;
  };

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

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <Card variant="stat">
              <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
                <p className="text-xs sm:text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-xl sm:text-2xl font-bold text-primary">{formatCurrency(totalRevenue)}</p>
                <div className="flex items-center gap-1 text-green-500 text-xs sm:text-sm mt-1">
                  <TrendingUp className="w-3 h-3" />
                  <span className="truncate">Live Data</span>
                </div>
              </CardContent>
            </Card>
            <Card variant="stat">
              <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
                <p className="text-xs sm:text-sm text-muted-foreground">Total Orders</p>
                <p className="text-xl sm:text-2xl font-bold">{totalOrders}</p>
                <div className="flex items-center gap-1 text-green-500 text-xs sm:text-sm mt-1">
                  <TrendingUp className="w-3 h-3" />
                  <span className="truncate">Live Data</span>
                </div>
              </CardContent>
            </Card>
            <Card variant="stat">
              <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Avg. Order</p>
                <p className="text-xl sm:text-2xl font-bold">{formatCurrency(avgOrderValue)}</p>
                <div className="flex items-center gap-1 text-muted-foreground text-xs sm:text-sm mt-1">
                  <TrendingDown className="w-3 h-3" />
                  <span className="truncate">Calculated</span>
                </div>
              </CardContent>
            </Card>
            <Card variant="stat">
              <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Products</p>
                <p className="text-xl sm:text-2xl font-bold">{products.length}</p>
                <div className="flex items-center gap-1 text-green-500 text-xs sm:text-sm mt-1">
                  <TrendingUp className="w-3 h-3" />
                  <span className="truncate">In Stock</span>
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
                  Revenue by Month
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
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => formatCurrency(v)} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                        formatter={(v: number) => formatCurrency(v)}
                      />
                      <Area type="monotone" dataKey="gold" stroke="hsl(43, 74%, 49%)" fill="url(#goldGradient)" strokeWidth={2} name="Revenue" />
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
                  Products by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 sm:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={displayCategoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {displayCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-1.5 sm:space-y-2 mt-4">
                  {displayCategoryData.map((cat) => (
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
        </>
      )}
    </DashboardLayout>
  );
};

export default Analytics;
