import { useState, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart, Barcode, Search, Plus, Minus, Trash2,
  CreditCard, Banknote, Smartphone, Loader2, Calculator, Gem,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GoldRateCalculator, type ProductForCalc, type CalcResult } from "@/components/pos/GoldRateCalculator";
import { toast } from "sonner";
import { getAll, addItem, updateItem } from "@/lib/firebaseDb";

interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  metal_type: string;
  weight: number;
  unit_price: number;
  stock: number;
  status: string;
}

interface CartItem {
  id: string;
  name: string;
  weight: number;
  unit_price: number;
  stock: number;
  qty: number;
  sku: string;
  /** True if price came from gold calculator */
  calculatedPrice?: boolean;
  purity?: string;
}

const isGoldProduct = (p: Product) =>
  p.metal_type?.toLowerCase().includes("gold");

const POS = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string>("Cash");
  const [calcProduct, setCalcProduct] = useState<ProductForCalc | null>(null);
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["pos-products"],
    queryFn: async () => {
      const all = await getAll<Product>("products");
      return all.filter((p) => p.stock > 0).sort((a, b) => a.name.localeCompare(b.name));
    },
  });

  const completeSaleMutation = useMutation({
    mutationFn: async () => {
      const subtotal = cart.reduce((acc, item) => acc + item.unit_price * item.qty, 0);
      const tax = subtotal * 0.03;
      const total = subtotal + tax;
      const invoiceNumber = `INV-${Date.now()}`;

      await addItem("sales", {
        invoice_number: invoiceNumber,
        items: cart.map((item) => ({
          product_id: item.id,
          name: item.name,
          qty: item.qty,
          price: item.unit_price,
          calculated: item.calculatedPrice || false,
          purity: item.purity || null,
        })),
        subtotal,
        tax,
        discount: 0,
        total,
        payment_method: paymentMethod,
        status: "Completed",
      });

      for (const item of cart) {
        await updateItem("products", item.id, { stock: item.stock - item.qty });
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

  // Add product directly with inventory price (non-gold items)
  const addToCart = (product: Product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      if (existing.qty >= product.stock) {
        toast.error("Not enough stock available");
        return;
      }
      setCart(cart.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item)));
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          weight: product.weight,
          unit_price: product.unit_price,
          stock: product.stock,
          qty: 1,
          sku: product.sku,
        },
      ]);
    }
    toast.success(`${product.name} added to cart`);
  };

  // Add from calculator with computed gold price
  const handleCalcAddToCart = useCallback(
    (result: CalcResult) => {
      const product = products.find((p) => p.id === result.productId);
      if (!product) {
        toast.error("Product not found in inventory");
        return;
      }
      const existing = cart.find((item) => item.id === product.id);
      if (existing) {
        if (existing.qty >= product.stock) {
          toast.error("Not enough stock available");
          return;
        }
        // Update with new calculated price
        setCart(
          cart.map((item) =>
            item.id === product.id
              ? { ...item, unit_price: result.calculatedPrice, qty: item.qty + 1, calculatedPrice: true, purity: result.purity }
              : item
          )
        );
      } else {
        setCart([
          ...cart,
          {
            id: product.id,
            name: product.name,
            weight: result.weight,
            unit_price: result.calculatedPrice,
            stock: product.stock,
            qty: 1,
            sku: product.sku,
            calculatedPrice: true,
            purity: result.purity,
          },
        ]);
      }
    },
    [cart, products]
  );

  // Send gold product to calculator
  const sendToCalculator = (product: Product) => {
    setCalcProduct({
      id: product.id,
      name: product.name,
      weight: product.weight,
      metal_type: product.metal_type,
      unit_price: product.unit_price,
      sku: product.sku,
      stock: product.stock,
      category: product.category,
    });
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
        {/* Left: Products + Cart */}
        <div className="xl:col-span-2 space-y-4 sm:space-y-6">
          {/* Product Search */}
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
                  filteredProducts.slice(0, 8).map((product) => {
                    const gold = isGoldProduct(product);
                    return (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 cursor-pointer"
                        onClick={() => (gold ? sendToCalculator(product) : addToCart(product))}
                      >
                        <div className="flex items-center gap-2">
                          {gold && <Gem className="w-3.5 h-3.5 text-primary shrink-0" />}
                          <div>
                            <p className="font-medium text-sm flex items-center gap-1.5">
                              {product.name}
                              {gold && (
                                <Badge variant="outline" className="text-[9px] px-1 py-0 border-primary/30 text-primary">
                                  {product.metal_type}
                                </Badge>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {product.sku} • {product.weight}g • Stock: {product.stock}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-2">
                          <p className="font-semibold text-primary text-sm">₹{product.unit_price.toLocaleString()}</p>
                          {gold ? (
                            <Button variant="gold" size="sm" className="h-6 text-[10px] px-2">
                              <Calculator className="w-3 h-3 mr-1" /> Calculate
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" className="h-6 text-xs">
                              <Plus className="w-3 h-3 mr-1" /> Add
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>

          {/* Cart */}
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
                <p className="text-center text-muted-foreground py-8 text-sm">
                  Cart is empty. Search products above to add items.
                  <br />
                  <span className="text-xs">Gold items → Calculator • Other items → Direct add</span>
                </p>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 rounded-lg bg-muted/30 border border-border/50"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-gold/20 flex items-center justify-center shrink-0">
                          {item.calculatedPrice ? (
                            <Gem className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                          ) : (
                            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm sm:text-base truncate flex items-center gap-1.5">
                            {item.name}
                            {item.calculatedPrice && (
                              <Badge variant="outline" className="text-[9px] px-1 py-0 border-primary/30 text-primary">
                                {item.purity} Calc
                              </Badge>
                            )}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Weight: {item.weight}g
                            {item.calculatedPrice && " • Price via Calculator"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={() => updateQty(item.id, -1)}>
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-6 sm:w-8 text-center font-medium text-sm">{item.qty}</span>
                          <Button variant="outline" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={() => updateQty(item.id, 1)}>
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="font-semibold text-primary text-sm sm:text-base w-20 sm:w-24 text-right">
                          ₹{(item.unit_price * item.qty).toLocaleString()}
                        </p>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive h-8 w-8" onClick={() => removeFromCart(item.id)}>
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

        {/* Right: Calculator + Payment */}
        <div className="space-y-4 sm:space-y-6">
          {/* Gold Rate Calculator */}
          <Card variant="elevated">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                Gold Rate Calculator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <GoldRateCalculator
                selectedProduct={calcProduct}
                onAddToCart={handleCalcAddToCart}
                onProductConsumed={() => setCalcProduct(null)}
              />
            </CardContent>
          </Card>

          {/* Payment Summary */}
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
                  <Button variant={paymentMethod === "Cash" ? "default" : "outline"} className="flex-col h-14 sm:h-16 gap-1" onClick={() => setPaymentMethod("Cash")}>
                    <Banknote className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-xs">Cash</span>
                  </Button>
                  <Button variant={paymentMethod === "Card" ? "default" : "outline"} className="flex-col h-14 sm:h-16 gap-1" onClick={() => setPaymentMethod("Card")}>
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-xs">Card</span>
                  </Button>
                  <Button variant={paymentMethod === "UPI" ? "default" : "outline"} className="flex-col h-14 sm:h-16 gap-1" onClick={() => setPaymentMethod("UPI")}>
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
