import { EmployeeLayout } from "@/components/layout/EmployeeLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEmployeeAuth } from "@/contexts/EmployeeAuthContext";
import { Package, ShoppingCart, Clock, User } from "lucide-react";
import { Link } from "react-router-dom";

const EmployeeDashboard = () => {
  const { employee } = useEmployeeAuth();

  return (
    <EmployeeLayout>
      <div className="animate-fade-in space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold">
            Welcome, <span className="text-gradient-gold">{employee?.name}</span>
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Employee Portal • ID: {employee?.employee_id}
          </p>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/employee/inventory">
            <Card variant="elevated" className="hover:border-primary/50 transition-colors cursor-pointer group">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                    <Package className="w-8 h-8 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Inventory</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      View and manage product inventory
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Check stock levels, search products, and view inventory details.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/employee/pos">
            <Card variant="elevated" className="hover:border-primary/50 transition-colors cursor-pointer group">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                    <ShoppingCart className="w-8 h-8 text-green-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">POS / Billing</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Process sales and transactions
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Create new sales, scan products, and process payments.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Employee Info Card */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Your Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground">Employee ID</p>
                <p className="font-medium">{employee?.employee_id}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="font-medium">{employee?.name}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium">{employee?.email || 'Not set'}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground">Department</p>
                <p className="font-medium">{employee?.department || 'Not assigned'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Info */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Access Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                As an employee, you have access to the following modules:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><strong className="text-foreground">Inventory</strong> - View product stock and details</li>
                <li><strong className="text-foreground">POS / Billing</strong> - Process sales and transactions</li>
              </ul>
              <p className="text-muted-foreground pt-2">
                For access to other modules or any issues, please contact your administrator.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeDashboard;
