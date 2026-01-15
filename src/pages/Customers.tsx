import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Search, Plus, Filter, Phone, Mail, Crown, Star } from "lucide-react";

const customers = [
  { id: 1, name: "Priya Sharma", email: "priya@email.com", phone: "+91 98765 43210", tier: "Platinum", totalSpent: "₹45,50,000", visits: 28 },
  { id: 2, name: "Rajesh Patel", email: "rajesh@email.com", phone: "+91 87654 32109", tier: "Gold", totalSpent: "₹18,25,000", visits: 15 },
  { id: 3, name: "Anjali Mehta", email: "anjali@email.com", phone: "+91 76543 21098", tier: "Silver", totalSpent: "₹8,75,000", visits: 8 },
  { id: 4, name: "Vikram Singh", email: "vikram@email.com", phone: "+91 65432 10987", tier: "Platinum", totalSpent: "₹62,00,000", visits: 42 },
  { id: 5, name: "Sneha Reddy", email: "sneha@email.com", phone: "+91 54321 09876", tier: "Gold", totalSpent: "₹22,30,000", visits: 19 },
];

const getTierColor = (tier: string) => {
  switch (tier) {
    case "Platinum": return "bg-gradient-to-r from-slate-400 to-slate-600 text-white";
    case "Gold": return "bg-gradient-gold text-primary-foreground";
    case "Silver": return "bg-gradient-to-r from-gray-300 to-gray-500 text-gray-900";
    default: return "bg-muted";
  }
};

const Customers = () => {
  return (
    <DashboardLayout>
      <div className="mb-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">
              <span className="text-gradient-gold">Customer</span> CRM
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage customer relationships, loyalty tiers, and purchase history
            </p>
          </div>
          <Button variant="gold">
            <Plus className="w-4 h-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card variant="stat">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Customers</p>
            <p className="text-2xl font-bold text-primary">1,284</p>
          </CardContent>
        </Card>
        <Card variant="stat">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-primary" />
              <p className="text-sm text-muted-foreground">Platinum Members</p>
            </div>
            <p className="text-2xl font-bold">124</p>
          </CardContent>
        </Card>
        <Card variant="stat">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">New This Month</p>
            <p className="text-2xl font-bold text-green-500">+48</p>
          </CardContent>
        </Card>
        <Card variant="stat">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Avg. Lifetime Value</p>
            <p className="text-2xl font-bold">₹15.2L</p>
          </CardContent>
        </Card>
      </div>

      {/* Customer List */}
      <Card variant="elevated">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              All Customers
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search customers..." className="pl-10 w-64" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {customers.map((customer) => (
              <div 
                key={customer.id} 
                className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                    {customer.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{customer.name}</p>
                    <Badge className={getTierColor(customer.tier)}>
                      {customer.tier === "Platinum" && <Star className="w-3 h-3 mr-1" />}
                      {customer.tier}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {customer.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {customer.phone}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">{customer.totalSpent}</p>
                  <p className="text-sm text-muted-foreground">{customer.visits} visits</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Customers;
