import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Download, Calendar, IndianRupee, Users, CheckCircle, Clock } from "lucide-react";

const payrollData = [
  { id: 1, name: "Amit Kumar", role: "Store Manager", salary: "₹85,000", bonus: "₹12,000", deductions: "₹8,500", net: "₹88,500", status: "Paid" },
  { id: 2, name: "Sunita Devi", role: "Sr. Sales Associate", salary: "₹45,000", bonus: "₹5,000", deductions: "₹4,500", net: "₹45,500", status: "Paid" },
  { id: 3, name: "Rahul Verma", role: "Inventory Manager", salary: "₹55,000", bonus: "₹8,000", deductions: "₹5,500", net: "₹57,500", status: "Pending" },
  { id: 4, name: "Meera Patel", role: "Goldsmith", salary: "₹65,000", bonus: "₹15,000", deductions: "₹6,500", net: "₹73,500", status: "Paid" },
  { id: 5, name: "Kiran Shah", role: "Accountant", salary: "₹48,000", bonus: "₹4,000", deductions: "₹4,800", net: "₹47,200", status: "Pending" },
];

const Payroll = () => {
  return (
    <DashboardLayout>
      <div className="mb-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">
              <span className="text-gradient-gold">Payroll</span> Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Process salaries, bonuses, and manage employee compensation
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              January 2024
            </Button>
            <Button variant="gold">
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
            <div className="flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-primary" />
              <p className="text-sm text-muted-foreground">Total Payroll</p>
            </div>
            <p className="text-2xl font-bold text-primary">₹28.5L</p>
          </CardContent>
        </Card>
        <Card variant="stat">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Employees</p>
            </div>
            <p className="text-2xl font-bold">48</p>
          </CardContent>
        </Card>
        <Card variant="stat">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <p className="text-sm text-muted-foreground">Processed</p>
            </div>
            <p className="text-2xl font-bold text-green-500">42</p>
          </CardContent>
        </Card>
        <Card variant="stat">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-500" />
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
            <p className="text-2xl font-bold text-yellow-500">6</p>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Table */}
      <Card variant="elevated">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              Payroll Details
            </CardTitle>
            <Button variant="gold" size="sm">
              Process All Pending
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {payrollData.map((emp) => (
              <div 
                key={emp.id} 
                className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 border border-border/50"
              >
                <div className="flex-1">
                  <p className="font-semibold">{emp.name}</p>
                  <p className="text-sm text-muted-foreground">{emp.role}</p>
                </div>
                <div className="grid grid-cols-4 gap-8 text-sm">
                  <div>
                    <p className="text-muted-foreground">Salary</p>
                    <p className="font-medium">{emp.salary}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Bonus</p>
                    <p className="font-medium text-green-500">{emp.bonus}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Deductions</p>
                    <p className="font-medium text-red-500">{emp.deductions}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Net Pay</p>
                    <p className="font-bold text-primary">{emp.net}</p>
                  </div>
                </div>
                <Badge 
                  variant={emp.status === "Paid" ? "default" : "secondary"}
                >
                  {emp.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Payroll;
