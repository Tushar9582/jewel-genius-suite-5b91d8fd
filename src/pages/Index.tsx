import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { MetalPriceCard } from "@/components/dashboard/MetalPriceCard";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { InventoryAlerts } from "@/components/dashboard/InventoryAlerts";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { CustomerInsights } from "@/components/dashboard/CustomerInsights";
import { BusinessHealth } from "@/components/dashboard/BusinessHealth";
import {
  IndianRupee,
  ShoppingBag,
  Users,
  Package,
  Gem,
  UserCog,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserData } from "@/hooks/useUserData";
import { Loader2 } from "lucide-react";

interface Sale {
  id: string;
  total: number;
  created_at: string;
  payment_method: string;
  customer_name: string | null;
  invoice_number: string;
  items: any;
  status: string;
}
interface Product {
  id: string;
  name: string;
  category: string;
  metal_type: string;
  unit_price: number;
  stock: number;
  weight: number;
  status: string;
}
interface Customer {
  id: string;
  name: string;
  total_purchases: number;
  loyalty_points: number;
  city: string | null;
  created_at: string;
}
interface Employee {
  id: string;
  name: string;
  department: string | null;
  is_active: boolean;
}
interface Investment {
  id: string;
  invested_amount: number;
  current_value: number;
  status: string;
  metal_type: string;
}

const fmt = (v: number) => {
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)}Cr`;
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
  if (v >= 1000) return `₹${(v / 1000).toFixed(1)}K`;
  return `₹${v.toLocaleString("en-IN")}`;
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
};

const Index = () => {
  const { user } = useAuth();
  const { getAll } = useUserData();
  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";

  const { data: sales = [], isLoading: sL } = useQuery({ queryKey: ["dash-sales"], queryFn: () => getAll<Sale>("sales"), enabled: !!user });
  const { data: products = [], isLoading: pL } = useQuery({ queryKey: ["dash-products"], queryFn: () => getAll<Product>("products") });
  const { data: customers = [], isLoading: cL } = useQuery({ queryKey: ["dash-customers"], queryFn: () => getAll<Customer>("customers") });
  const { data: employees = [], isLoading: eL } = useQuery({ queryKey: ["dash-employees"], queryFn: () => getAll<Employee>("employees") });
  const { data: investments = [], isLoading: iL } = useQuery({ queryKey: ["dash-investments"], queryFn: () => getAll<Investment>("investments") });

  const isLoading = sL || pL || cL || eL || iL;

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const todaySales = sales.filter(s => new Date(s.created_at).toDateString() === today);
    const todayRevenue = todaySales.reduce((a, s) => a + Number(s.total || 0), 0);
    const totalRevenue = sales.reduce((a, s) => a + Number(s.total || 0), 0);
    const inventoryValue = products.reduce((a, p) => a + (Number(p.unit_price || 0) * Number(p.stock || 0)), 0);
    const totalStock = products.reduce((a, p) => a + Number(p.stock || 0), 0);
    const activeCustomers = customers.filter(c => Number(c.total_purchases || 0) > 0).length;
    const activeEmployees = employees.filter(e => e.is_active !== false).length;
    const investmentValue = investments.reduce((a, inv) => a + Number(inv.current_value || 0), 0);
    const totalWeight = products.reduce((a, p) => a + (Number(p.weight || 0) * Number(p.stock || 0)), 0);

    return [
      { title: "Today's Revenue", value: fmt(todayRevenue), change: { value: `${todaySales.length} sales`, positive: todayRevenue > 0 }, description: "today", icon: IndianRupee, accentColor: "gold" as const },
      { title: "Total Revenue", value: fmt(totalRevenue), change: { value: `${sales.length} orders`, positive: true }, description: "all time", icon: ShoppingBag, accentColor: "emerald" as const },
      { title: "Customers", value: customers.length.toString(), change: { value: `${activeCustomers} active`, positive: true }, description: "buyers", icon: Users, accentColor: "gold" as const },
      { title: "Inventory Value", value: fmt(inventoryValue), change: { value: `${totalStock} items • ${totalWeight.toFixed(0)}g`, positive: true }, description: "in stock", icon: Package, accentColor: "silver" as const },
      { title: "Employees", value: `${activeEmployees}/${employees.length}`, change: { value: "active", positive: true }, description: "staff", icon: UserCog, accentColor: "emerald" as const },
      { title: "Investments", value: fmt(investmentValue), change: { value: `${investments.filter(i => i.status === "Active").length} active`, positive: true }, description: "portfolio", icon: Gem, accentColor: "gold" as const },
    ];
  }, [sales, products, customers, employees, investments]);

  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <div className="mb-6 sm:mb-8 animate-fade-in pt-2 sm:pt-0">
        <h1 className="text-2xl sm:text-3xl font-display font-bold">
          {getGreeting()}, <span className="text-gradient-gold">{displayName}</span>
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Here's what's happening at your jewellery store today.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Stats Grid - 6 cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
            {stats.map((stat, index) => (
              <StatCard key={stat.title} {...stat} delay={index * 80} />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 mb-6">
            <div className="xl:col-span-2">
              <SalesChart sales={sales} />
            </div>
            <MetalPriceCard />
          </div>

          {/* Middle Section - Business Health + Customer Insights */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <BusinessHealth sales={sales} products={products} customers={customers} investments={investments} />
            <CustomerInsights customers={customers} sales={sales} />
          </div>

          {/* Lower Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
            <div className="xl:col-span-2">
              <RecentTransactions sales={sales} />
            </div>
            <div className="space-y-4 sm:space-y-6">
              <InventoryAlerts products={products} />
              <QuickActions />
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default Index;
