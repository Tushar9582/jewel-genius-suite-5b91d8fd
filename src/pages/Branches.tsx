import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, MapPin, Users, TrendingUp, Phone } from "lucide-react";

const branches = [
  { id: 1, name: "Main Store - Connaught Place", city: "New Delhi", manager: "Amit Kumar", employees: 15, revenue: "₹1.2Cr", status: "Active" },
  { id: 2, name: "South Extension Branch", city: "New Delhi", manager: "Priya Sharma", employees: 10, revenue: "₹85L", status: "Active" },
  { id: 3, name: "Gurugram Showroom", city: "Gurugram", manager: "Vikram Singh", employees: 8, revenue: "₹62L", status: "Active" },
  { id: 4, name: "Noida Mall Kiosk", city: "Noida", manager: "Sneha Reddy", employees: 5, revenue: "₹28L", status: "Active" },
  { id: 5, name: "Jaipur Flagship", city: "Jaipur", manager: "Rajesh Patel", employees: 12, revenue: "₹95L", status: "Opening Soon" },
];

const Branches = () => {
  return (
    <DashboardLayout>
      <div className="mb-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">
              <span className="text-gradient-gold">Branch</span> Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage all store locations, track performance, and sync inventory
            </p>
          </div>
          <Button variant="gold">
            <Plus className="w-4 h-4 mr-2" />
            Add Branch
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card variant="stat">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" />
              <p className="text-sm text-muted-foreground">Total Branches</p>
            </div>
            <p className="text-2xl font-bold">5</p>
          </CardContent>
        </Card>
        <Card variant="stat">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Total Staff</p>
            </div>
            <p className="text-2xl font-bold">50</p>
          </CardContent>
        </Card>
        <Card variant="stat">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <p className="text-sm text-muted-foreground">Combined Revenue</p>
            </div>
            <p className="text-2xl font-bold text-primary">₹3.9Cr</p>
          </CardContent>
        </Card>
        <Card variant="stat">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-500" />
              <p className="text-sm text-muted-foreground">Cities</p>
            </div>
            <p className="text-2xl font-bold">4</p>
          </CardContent>
        </Card>
      </div>

      {/* Branch List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {branches.map((branch) => (
          <Card key={branch.id} variant="elevated" className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{branch.name}</CardTitle>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {branch.city}
                  </p>
                </div>
                <Badge 
                  variant={branch.status === "Active" ? "default" : "secondary"}
                >
                  {branch.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <p className="text-sm text-muted-foreground">Manager</p>
                  <p className="font-medium">{branch.manager}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Staff</p>
                  <p className="font-medium">{branch.employees}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="font-bold text-primary">{branch.revenue}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  <Phone className="w-3 h-3 mr-1" />
                  Contact
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Branches;
