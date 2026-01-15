import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserCog, Plus, Users, Briefcase, Clock, Star } from "lucide-react";

const employees = [
  { id: 1, name: "Amit Kumar", role: "Store Manager", department: "Sales", status: "Active", joined: "Jan 2022", rating: 4.8 },
  { id: 2, name: "Sunita Devi", role: "Senior Sales Associate", department: "Sales", status: "Active", joined: "Mar 2021", rating: 4.5 },
  { id: 3, name: "Rahul Verma", role: "Inventory Manager", department: "Operations", status: "Active", joined: "Jun 2020", rating: 4.7 },
  { id: 4, name: "Meera Patel", role: "Goldsmith", department: "Production", status: "On Leave", joined: "Sep 2019", rating: 4.9 },
  { id: 5, name: "Kiran Shah", role: "Accountant", department: "Finance", status: "Active", joined: "Feb 2023", rating: 4.2 },
];

const HR = () => {
  return (
    <DashboardLayout>
      <div className="mb-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">
              <span className="text-gradient-gold">HR</span> & Team Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage employees, track performance, and handle recruitment
            </p>
          </div>
          <Button variant="gold">
            <Plus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card variant="stat">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <p className="text-sm text-muted-foreground">Total Employees</p>
            </div>
            <p className="text-2xl font-bold">48</p>
          </CardContent>
        </Card>
        <Card variant="stat">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-green-500" />
              <p className="text-sm text-muted-foreground">Active Today</p>
            </div>
            <p className="text-2xl font-bold text-green-500">42</p>
          </CardContent>
        </Card>
        <Card variant="stat">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-500" />
              <p className="text-sm text-muted-foreground">On Leave</p>
            </div>
            <p className="text-2xl font-bold text-yellow-500">6</p>
          </CardContent>
        </Card>
        <Card variant="stat">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" />
              <p className="text-sm text-muted-foreground">Avg. Performance</p>
            </div>
            <p className="text-2xl font-bold">4.6/5</p>
          </CardContent>
        </Card>
      </div>

      {/* Employee List */}
      <Card variant="elevated">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <UserCog className="w-5 h-5 text-primary" />
            All Employees
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {employees.map((emp) => (
              <div 
                key={emp.id} 
                className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                    {emp.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">{emp.name}</p>
                  <p className="text-sm text-muted-foreground">{emp.role} • {emp.department}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="text-muted-foreground">Joined {emp.joined}</p>
                  <div className="flex items-center gap-1 justify-end mt-1">
                    <Star className="w-3 h-3 text-primary fill-primary" />
                    <span className="font-medium">{emp.rating}</span>
                  </div>
                </div>
                <Badge 
                  variant={emp.status === "Active" ? "default" : "secondary"}
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

export default HR;
