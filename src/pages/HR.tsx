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
      <div className="mb-6 animate-fade-in pt-2 sm:pt-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold">
              <span className="text-gradient-gold">HR</span> & Team Management
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Manage employees, track performance, and handle recruitment
            </p>
          </div>
          <Button variant="gold" className="shrink-0 w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <Card variant="stat">
          <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
            <div className="flex items-center gap-1 sm:gap-2">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 text-primary shrink-0" />
              <p className="text-xs sm:text-sm text-muted-foreground truncate">Total Employees</p>
            </div>
            <p className="text-xl sm:text-2xl font-bold">48</p>
          </CardContent>
        </Card>
        <Card variant="stat">
          <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
            <div className="flex items-center gap-1 sm:gap-2">
              <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 shrink-0" />
              <p className="text-xs sm:text-sm text-muted-foreground truncate">Active Today</p>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-green-500">42</p>
          </CardContent>
        </Card>
        <Card variant="stat">
          <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
            <div className="flex items-center gap-1 sm:gap-2">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 shrink-0" />
              <p className="text-xs sm:text-sm text-muted-foreground">On Leave</p>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-yellow-500">6</p>
          </CardContent>
        </Card>
        <Card variant="stat">
          <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
            <div className="flex items-center gap-1 sm:gap-2">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-primary shrink-0" />
              <p className="text-xs sm:text-sm text-muted-foreground truncate">Avg. Performance</p>
            </div>
            <p className="text-xl sm:text-2xl font-bold">4.6/5</p>
          </CardContent>
        </Card>
      </div>

      {/* Employee List */}
      <Card variant="elevated">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <UserCog className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            All Employees
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {employees.map((emp) => (
              <div 
                key={emp.id} 
                className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12 shrink-0">
                    <AvatarFallback className="bg-primary/20 text-primary font-semibold text-sm">
                      {emp.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm sm:text-base truncate">{emp.name}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">{emp.role} • {emp.department}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                  <div className="text-left sm:text-right text-xs sm:text-sm">
                    <p className="text-muted-foreground">Joined {emp.joined}</p>
                    <div className="flex items-center gap-1 sm:justify-end mt-0.5">
                      <Star className="w-3 h-3 text-primary fill-primary shrink-0" />
                      <span className="font-medium">{emp.rating}</span>
                    </div>
                  </div>
                  <Badge 
                    variant={emp.status === "Active" ? "default" : "secondary"}
                    className="text-xs whitespace-nowrap"
                  >
                    {emp.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default HR;
