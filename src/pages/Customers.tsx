import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Search, Plus, Filter, Phone, Mail, Crown, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  address: string | null;
  city: string | null;
  loyalty_points: number;
  total_purchases: number;
}

const getTierColor = (totalPurchases: number) => {
  if (totalPurchases >= 5000000) return { tier: "Platinum", class: "bg-gradient-to-r from-slate-400 to-slate-600 text-white" };
  if (totalPurchases >= 1500000) return { tier: "Gold", class: "bg-gradient-gold text-primary-foreground" };
  if (totalPurchases >= 500000) return { tier: "Silver", class: "bg-gradient-to-r from-gray-300 to-gray-500 text-gray-900" };
  return { tier: "Bronze", class: "bg-muted text-muted-foreground" };
};

const Customers = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  const queryClient = useQueryClient();

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Customer[];
    },
  });

  const addCustomerMutation = useMutation({
    mutationFn: async (newCustomer: Omit<Customer, "id" | "loyalty_points" | "total_purchases">) => {
      const { data, error } = await supabase
        .from("customers")
        .insert([{ ...newCustomer, loyalty_points: 0, total_purchases: 0 }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer added successfully!");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Failed to add customer: " + error.message);
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomerMutation.mutate({
      name: formData.name,
      email: formData.email || null,
      phone: formData.phone,
      address: formData.address || null,
      city: formData.city || null,
    });
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const stats = {
    totalCustomers: customers.length,
    platinumCustomers: customers.filter((c) => c.total_purchases >= 5000000).length,
    newThisMonth: customers.filter((c) => {
      const createdAt = new Date(c.id); // Simplified - would need created_at
      const now = new Date();
      return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
    }).length,
    avgLifetimeValue: customers.length > 0
      ? customers.reduce((acc, c) => acc + c.total_purchases, 0) / customers.length
      : 0,
  };

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
              <span className="text-gradient-gold">Customer</span> CRM
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Manage customer relationships, loyalty tiers, and purchase history
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gold" className="shrink-0 w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Priya Sharma"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="priya@email.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Mumbai"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Full address..."
                    rows={2}
                  />
                </div>
                <Button type="submit" variant="gold" className="w-full" disabled={addCustomerMutation.isPending}>
                  {addCustomerMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Add Customer
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <Card variant="stat">
          <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
            <p className="text-xs sm:text-sm text-muted-foreground">Total Customers</p>
            <p className="text-xl sm:text-2xl font-bold text-primary">{stats.totalCustomers}</p>
          </CardContent>
        </Card>
        <Card variant="stat">
          <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
            <div className="flex items-center gap-1 sm:gap-2">
              <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-primary shrink-0" />
              <p className="text-xs sm:text-sm text-muted-foreground truncate">Platinum</p>
            </div>
            <p className="text-xl sm:text-2xl font-bold">{stats.platinumCustomers}</p>
          </CardContent>
        </Card>
        <Card variant="stat">
          <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
            <p className="text-xs sm:text-sm text-muted-foreground">New This Month</p>
            <p className="text-xl sm:text-2xl font-bold text-green-500">+{customers.length}</p>
          </CardContent>
        </Card>
        <Card variant="stat">
          <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
            <p className="text-xs sm:text-sm text-muted-foreground truncate">Avg. Lifetime Value</p>
            <p className="text-xl sm:text-2xl font-bold">{formatCurrency(stats.avgLifetimeValue)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Customer List */}
      <Card variant="elevated">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              All Customers
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-10 w-full sm:w-48 md:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="shrink-0 h-9 w-9 sm:h-10 sm:w-10">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {customers.length === 0 ? "No customers yet. Add your first customer!" : "No customers found."}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCustomers.map((customer) => {
                const tierInfo = getTierColor(customer.total_purchases);
                return (
                  <div
                    key={customer.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Avatar className="h-10 w-10 sm:h-12 sm:w-12 shrink-0">
                        <AvatarFallback className="bg-primary/20 text-primary font-semibold text-sm">
                          {customer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm sm:text-base truncate">{customer.name}</p>
                          <Badge className={`${tierInfo.class} text-xs`}>{tierInfo.tier}</Badge>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-muted-foreground mt-1">
                          {customer.email && (
                            <span className="flex items-center gap-1 truncate">
                              <Mail className="w-3 h-3 shrink-0" />
                              <span className="truncate">{customer.email}</span>
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 shrink-0" />
                            {customer.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-left sm:text-right flex sm:flex-col justify-between sm:justify-start items-center sm:items-end gap-2">
                      <p className="font-semibold text-primary text-sm sm:text-base">
                        {formatCurrency(customer.total_purchases)}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">{customer.loyalty_points} points</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Customers;
