import { EmployeeLayout } from "@/components/layout/EmployeeLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Barcode, Search, Plus, Minus, Trash2, CreditCard, Banknote, Smartphone } from "lucide-react";

const cartItems = [
  { id: 1, name: "22K Gold Necklace", weight: "45.5g", price: 285000, qty: 1 },
  { id: 2, name: "Diamond Ring 0.5ct", weight: "4.2g", price: 125000, qty: 1 },
  { id: 3, name: "Silver Anklet Pair", weight: "32g", price: 4800, qty: 2 },
];

const EmployeePOS = () => {
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const tax = subtotal * 0.03;
  const total = subtotal + tax;

  return (
    <EmployeeLayout>
      <div className="animate-fade-in space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold">
            <span className="text-gradient-gold">POS</span> & Billing
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Process sales, scan items, and manage transactions
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Product Search & Scanner */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            <Card variant="elevated">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Barcode className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  Scan / Search Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Scan barcode or search..." 
                      className="pl-10"
                    />
                  </div>
                  <Button variant="gold" className="shrink-0">
                    <Barcode className="w-4 h-4 mr-2" />
                    Scan
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Cart Items */}
            <Card variant="elevated">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  Cart Items
                  <Badge variant="secondary" className="ml-2">{cartItems.length} items</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 rounded-lg bg-muted/30 border border-border/50">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-gold/20 flex items-center justify-center shrink-0">
                          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm sm:text-base truncate">{item.name}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">Weight: {item.weight}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-6 sm:w-8 text-center font-medium text-sm">{item.qty}</span>
                          <Button variant="outline" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="font-semibold text-primary text-sm sm:text-base w-20 sm:w-24 text-right">
                          ₹{(item.price * item.qty).toLocaleString()}
                        </p>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive h-8 w-8">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary */}
          <div className="space-y-4 sm:space-y-6">
            <Card variant="gold">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">GST (3%)</span>
                    <span>₹{tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="text-green-500">-₹0</span>
                  </div>
                  <div className="border-t border-border pt-2 mt-2">
                    <div className="flex justify-between font-bold text-base sm:text-lg">
                      <span>Total</span>
                      <span className="text-gradient-gold">₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" className="flex-col h-14 sm:h-16 gap-1">
                      <Banknote className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-xs">Cash</span>
                    </Button>
                    <Button variant="outline" className="flex-col h-14 sm:h-16 gap-1">
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-xs">Card</span>
                    </Button>
                    <Button variant="outline" className="flex-col h-14 sm:h-16 gap-1">
                      <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-xs">UPI</span>
                    </Button>
                  </div>
                </div>

                <Button variant="gold" className="w-full mt-4" size="lg">
                  Complete Sale
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeePOS;
