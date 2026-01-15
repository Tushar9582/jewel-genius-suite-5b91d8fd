import { DashboardLayout } from "@/components/layout/DashboardLayout";
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

const POS = () => {
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const tax = subtotal * 0.03;
  const total = subtotal + tax;

  return (
    <DashboardLayout>
      <div className="mb-6 animate-fade-in">
        <h1 className="text-3xl font-display font-bold">
          <span className="text-gradient-gold">POS</span> & Sales
        </h1>
        <p className="text-muted-foreground mt-1">
          Process sales, scan items, and manage transactions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Search & Scanner */}
        <div className="lg:col-span-2 space-y-6">
          <Card variant="elevated">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Barcode className="w-5 h-5 text-primary" />
                Scan / Search Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Scan barcode or search by name, SKU..." 
                    className="pl-10"
                  />
                </div>
                <Button variant="gold">
                  <Barcode className="w-4 h-4 mr-2" />
                  Scan
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cart Items */}
          <Card variant="elevated">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                Cart Items
                <Badge variant="secondary" className="ml-2">{cartItems.length} items</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border/50">
                    <div className="w-12 h-12 rounded-lg bg-gradient-gold/20 flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Weight: {item.weight}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.qty}</span>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="font-semibold text-primary w-24 text-right">
                      ₹{(item.price * item.qty).toLocaleString()}
                    </p>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Summary */}
        <div className="space-y-6">
          <Card variant="gold">
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
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
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-gradient-gold">₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" className="flex-col h-16 gap-1">
                    <Banknote className="w-5 h-5" />
                    <span className="text-xs">Cash</span>
                  </Button>
                  <Button variant="outline" className="flex-col h-16 gap-1">
                    <CreditCard className="w-5 h-5" />
                    <span className="text-xs">Card</span>
                  </Button>
                  <Button variant="outline" className="flex-col h-16 gap-1">
                    <Smartphone className="w-5 h-5" />
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
    </DashboardLayout>
  );
};

export default POS;
