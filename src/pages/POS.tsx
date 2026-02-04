import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Barcode, Search, Plus, Minus, Trash2, CreditCard, Banknote, Smartphone, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Product {
  id: string;
  sku: string;
  name: string;
  weight: number;
  unit_price: number;
  stock: number;
}

interface CartItem extends Product {
  qty: number;
}

const POS = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string>("Cash");
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["pos-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, sku, name, weight, unit_price, stock")
        .gt("stock", 0)
        .order("name");
      if (error) throw error;
      return data as Product[];
    },
  });

  const completeSaleMutation = useMutation({
    mutationFn: async () => {
      const subtotal = cart.reduce((acc, item) => acc + item.unit_price * item.qty, 0);
      const tax = subtotal * 0.03;
      const total = subtotal + tax;
      const invoiceNumber = `INV-${Date.now()}`;

      // Create sale record
      const { error: saleError } = await supabase.from("sales").insert([
        {
          invoice_number: invoiceNumber,
          items: cart.map((item) => ({
            product_id: item.id,
            name: item.name,
            qty: item.qty,
            price: item.unit_price,
          })),
          subtotal,
          tax,
          discount: 0,
          total,
          payment_method: paymentMethod,
          status: "Completed",
        },
      ]);

      if (saleError) throw saleError;

      // Update stock for each item
      for (const item of cart) {
        const { error: stockError } = await supabase
          .from("products")
          .update({ stock: item.stock - item.qty })
          .eq("id", item.id);
        if (stockError) throw stockError;
      }

      return invoiceNumber;
    },
    onSuccess: (invoiceNumber) => {
      queryClient.invalidateQueries({ queryKey: ["pos-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      toast.success(`Sale completed! Invoice: ${invoiceNumber}`);
      setCart([]);
    },
    onError: (error) => {
      toast.error("Failed to complete sale: " + error.message);
    },
  });

  const addToCart = (product: Product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      if (existing.qty >= product.stock) {
        toast.error("Not enough stock available");
        return;
      }
      setCart(cart.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item)));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
    toast.success(`${product.name} added to cart`);
  };

  const updateQty = (productId: string, delta: number) => {
    setCart(
      cart
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.qty + delta;
            if (newQty > item.stock) {
              toast.error("Not enough stock");
              return item;
            }
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const subtotal = cart.reduce((acc, item) => acc + item.unit_price * item.qty, 0);
  const tax = subtotal * 0.03;
  const total = subtotal + tax;

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="mb-6 animate-fade-in pt-2 sm:pt-0">
        <h1 className="text-2xl sm:text-3xl font-display font-bold">
          <span className="text-gradient-gold">POS</span> & Sales
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Product List */}
              <div className="mt-4 max-h-48 overflow-y-auto space-y-2">
                {isLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4 text-sm">
                    {products.length === 0 ? "No products in inventory" : "No products found"}
                  </p>
                ) : (
                  filteredProducts.slice(0, 5).map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 cursor-pointer"
                      onClick={() => addToCart(product)}
                    >
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.sku} • {product.weight}g • Stock: {product.stock}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary text-sm">₹{product.unit_price.toLocaleString()}</p>
                        <Button variant="ghost" size="sm" className="h-6 text-xs">
                          <Plus className="w-3 h-3 mr-1" /> Add
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Cart Items */}
          <Card variant="elevated">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                Cart Items
                <Badge variant="secondary" className="ml-2">
                  {cart.length} items
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Cart is empty. Add products to continue.</p>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 rounded-lg bg-muted/30 border border-border/50"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-gold/20 flex items-center justify-center shrink-0">
                          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm sm:text-base truncate">{item.name}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">Weight: {item.weight}g</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 sm:h-8 sm:w-8"
                            onClick={() => updateQty(item.id, -1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-6 sm:w-8 text-center font-medium text-sm">{item.qty}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 sm:h-8 sm:w-8"
                            onClick={() => updateQty(item.id, 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="font-semibold text-primary text-sm sm:text-base w-20 sm:w-24 text-right">
                          ₹{(item.unit_price * item.qty).toLocaleString()}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive h-8 w-8"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                  <Button
                    variant={paymentMethod === "Cash" ? "default" : "outline"}
                    className="flex-col h-14 sm:h-16 gap-1"
                    onClick={() => setPaymentMethod("Cash")}
                  >
                    <Banknote className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-xs">Cash</span>
                  </Button>
                  <Button
                    variant={paymentMethod === "Card" ? "default" : "outline"}
                    className="flex-col h-14 sm:h-16 gap-1"
                    onClick={() => setPaymentMethod("Card")}
                  >
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-xs">Card</span>
                  </Button>
                  <Button
                    variant={paymentMethod === "UPI" ? "default" : "outline"}
                    className="flex-col h-14 sm:h-16 gap-1"
                    onClick={() => setPaymentMethod("UPI")}
                  >
                    <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-xs">UPI</span>
                  </Button>
                </div>
              </div>

              <Button
                variant="gold"
                className="w-full mt-4"
                size="lg"
                disabled={cart.length === 0 || completeSaleMutation.isPending}
                onClick={() => completeSaleMutation.mutate()}
              >
                {completeSaleMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
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
