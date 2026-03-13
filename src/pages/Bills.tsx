import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Receipt, Search, Eye, IndianRupee, ShoppingBag, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAll } from "@/lib/firebaseDb";
import { format } from "date-fns";

interface SaleItem {
  name: string;
  qty: number;
  unit_price: number;
  weight?: number;
  purity?: string;
}

interface Sale {
  id: string;
  invoice_number: string;
  customer_name?: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  payment_method: string;
  status: string;
  created_at: string;
}

const Bills = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBill, setSelectedBill] = useState<Sale | null>(null);

  const { data: sales = [], isLoading } = useQuery({
    queryKey: ["bills"],
    queryFn: () => getAll("sales") as Promise<Sale[]>,
  });

  const completedSales = sales
    .filter((s) => s.status === "Completed")
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const filtered = completedSales.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.invoice_number?.toLowerCase().includes(q) ||
      s.customer_name?.toLowerCase().includes(q) ||
      s.payment_method?.toLowerCase().includes(q)
    );
  });

  const totalRevenue = completedSales.reduce((sum, s) => sum + (s.total || 0), 0);
  const todaySales = completedSales.filter(
    (s) => new Date(s.created_at).toDateString() === new Date().toDateString()
  );
  const todayRevenue = todaySales.reduce((sum, s) => sum + (s.total || 0), 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Bills</h1>
          <p className="text-muted-foreground text-sm">All completed sale invoices</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-border/50">
            <CardContent className="pt-5 pb-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Receipt className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Bills</p>
                <p className="text-xl font-bold text-foreground">{completedSales.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-5 pb-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <IndianRupee className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Revenue</p>
                <p className="text-xl font-bold text-foreground">₹{totalRevenue.toLocaleString("en-IN")}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-5 pb-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Today's Revenue</p>
                <p className="text-xl font-bold text-foreground">₹{todayRevenue.toLocaleString("en-IN")}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row justify-between gap-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Receipt className="w-5 h-5 text-primary" />
                All Invoices
              </CardTitle>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by invoice, customer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                Loading bills...
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <ShoppingBag className="w-12 h-12 mb-3 opacity-30" />
                <p>No bills found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((sale) => {
                      const items = Array.isArray(sale.items) ? sale.items : [];
                      return (
                        <TableRow key={sale.id}>
                          <TableCell className="font-mono font-medium text-primary">
                            {sale.invoice_number}
                          </TableCell>
                          <TableCell>{sale.customer_name || "Walk-in"}</TableCell>
                          <TableCell>{items.length} item(s)</TableCell>
                          <TableCell className="text-right font-semibold">
                            ₹{(sale.total || 0).toLocaleString("en-IN")}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {sale.payment_method}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs">
                            {sale.created_at
                              ? format(new Date(sale.created_at), "dd MMM yyyy, hh:mm a")
                              : "—"}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedBill(sale)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bill Detail Dialog */}
        <Dialog open={!!selectedBill} onOpenChange={() => setSelectedBill(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-primary" />
                Invoice {selectedBill?.invoice_number}
              </DialogTitle>
            </DialogHeader>
            {selectedBill && (
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Customer</span>
                  <span className="font-medium">{selectedBill.customer_name || "Walk-in"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date</span>
                  <span>
                    {selectedBill.created_at
                      ? format(new Date(selectedBill.created_at), "dd MMM yyyy, hh:mm a")
                      : "—"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment</span>
                  <Badge variant="outline">{selectedBill.payment_method}</Badge>
                </div>

                <div className="border-t border-border pt-3">
                  <p className="text-xs font-medium text-muted-foreground mb-2 uppercase">Items</p>
                  <div className="space-y-2">
                    {(Array.isArray(selectedBill.items) ? selectedBill.items : []).map(
                      (item: SaleItem, i: number) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span>
                            {item.name} × {item.qty}
                          </span>
                          <span className="font-medium">
                            ₹{((item.unit_price || 0) * (item.qty || 1)).toLocaleString("en-IN")}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="border-t border-border pt-3 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{(selectedBill.subtotal || 0).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>₹{(selectedBill.tax || 0).toLocaleString("en-IN")}</span>
                  </div>
                  {(selectedBill.discount || 0) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Discount</span>
                      <span className="text-destructive">
                        -₹{(selectedBill.discount || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-base pt-1 border-t border-border">
                    <span>Total</span>
                    <span className="text-primary">
                      ₹{(selectedBill.total || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Bills;
