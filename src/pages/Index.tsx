import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { MetalPriceCard } from "@/components/dashboard/MetalPriceCard";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { InventoryAlerts } from "@/components/dashboard/InventoryAlerts";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { QuickActions } from "@/components/dashboard/QuickActions";
import {
  IndianRupee,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  Gift,
} from "lucide-react";

const stats = [
  {
    title: "Today's Revenue",
    value: "₹8,45,200",
    change: { value: "12.5%", positive: true },
    description: "vs yesterday",
    icon: IndianRupee,
    accentColor: "gold" as const,
  },
  {
    title: "Total Sales",
    value: "24",
    change: { value: "8", positive: true },
    description: "transactions",
    icon: ShoppingBag,
    accentColor: "emerald" as const,
  },
  {
    title: "Active Customers",
    value: "1,284",
    change: { value: "4.2%", positive: true },
    description: "this month",
    icon: Users,
    accentColor: "gold" as const,
  },
  {
    title: "Inventory Value",
    value: "₹2.4Cr",
    change: { value: "2.1%", positive: true },
    description: "total stock",
    icon: Package,
    accentColor: "silver" as const,
  },
];

const Index = () => {
  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-display font-bold">
          Good Morning, <span className="text-gradient-gold">Rajesh</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening at your jewellery store today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <StatCard key={stat.title} {...stat} delay={index * 100} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Sales Chart - Takes 2 columns */}
        <SalesChart />
        
        {/* Metal Prices */}
        <MetalPriceCard />
      </div>

      {/* Lower Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2">
          <RecentTransactions />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <InventoryAlerts />
          <QuickActions />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
