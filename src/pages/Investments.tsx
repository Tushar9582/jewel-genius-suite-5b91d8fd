import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Coins, BarChart3, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";

const investments = [
  { id: 1, customer: "Priya Sharma", type: "Gold", amount: "100g", invested: "₹6,50,000", current: "₹7,25,000", profit: "+11.5%", positive: true },
  { id: 2, customer: "Vikram Singh", type: "Silver", amount: "5kg", invested: "₹4,25,000", current: "₹4,10,000", profit: "-3.5%", positive: false },
  { id: 3, customer: "Rajesh Patel", type: "Platinum", amount: "50g", invested: "₹2,15,000", current: "₹2,35,000", profit: "+9.3%", positive: true },
  { id: 4, customer: "Anjali Mehta", type: "Gold", amount: "250g", invested: "₹16,25,000", current: "₹18,12,500", profit: "+11.5%", positive: true },
];

const metalPrices = [
  { metal: "Gold 24K", price: "₹7,250/g", change: "+1.2%", positive: true },
  { metal: "Gold 22K", price: "₹6,640/g", change: "+1.1%", positive: true },
  { metal: "Silver", price: "₹85/g", change: "-0.5%", positive: false },
  { metal: "Platinum", price: "₹3,120/g", change: "+0.8%", positive: true },
];

const Investments = () => {
  return (
    <DashboardLayout>
      <div className="mb-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">
              <span className="text-gradient-gold">Investment</span> Portfolio
            </h1>
            <p className="text-muted-foreground mt-1">
              Track customer investments in precious metals and jewellery
            </p>
          </div>
          <Button variant="gold">
            <Coins className="w-4 h-4 mr-2" />
            New Investment
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card variant="stat">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Investments</p>
            <p className="text-2xl font-bold text-primary">₹4.2Cr</p>
          </CardContent>
        </Card>
        <Card variant="stat">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Current Value</p>
            <p className="text-2xl font-bold">₹4.85Cr</p>
          </CardContent>
        </Card>
        <Card variant="stat">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Profit</p>
            <p className="text-2xl font-bold text-green-500">+₹65L</p>
          </CardContent>
        </Card>
        <Card variant="stat">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Active Investors</p>
            <p className="text-2xl font-bold">312</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Investment List */}
        <div className="lg:col-span-2">
          <Card variant="elevated">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                Active Investments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {investments.map((inv) => (
                  <div 
                    key={inv.id} 
                    className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 border border-border/50"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-gold/20 flex items-center justify-center">
                      <Coins className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{inv.customer}</p>
                      <p className="text-sm text-muted-foreground">
                        {inv.type} • {inv.amount}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{inv.current}</p>
                      <p className="text-sm text-muted-foreground">Invested: {inv.invested}</p>
                    </div>
                    <Badge 
                      variant={inv.positive ? "default" : "destructive"}
                      className="flex items-center gap-1"
                    >
                      {inv.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {inv.profit}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Metal Prices */}
        <Card variant="gold">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Live Metal Prices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metalPrices.map((metal) => (
                <div key={metal.metal} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <div>
                    <p className="font-medium">{metal.metal}</p>
                    <p className="text-lg font-bold">{metal.price}</p>
                  </div>
                  <Badge 
                    variant={metal.positive ? "default" : "destructive"}
                    className="flex items-center gap-1"
                  >
                    {metal.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {metal.change}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Investments;
