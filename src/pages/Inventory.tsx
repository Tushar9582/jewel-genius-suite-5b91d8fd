import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Package, Search, Plus, Filter, Download, ArrowUpDown, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getAll, addItem } from "@/lib/firebaseDb";

interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  metal_type: string;
  weight: number;
  stock: number;
  unit_price: number;
  status: string;
}

const Inventory = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "", category: "Necklace", metal_type: "Gold 22K", weight: "", stock: "", unit_price: "",
  });
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => getAll<Product>("products"),
  });

  const addProductMutation = useMutation({
    mutationFn: async (newProduct: Omit<Product, "id">) => {
      return addItem("products", newProduct);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product added successfully!");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => toast.error("Failed to add product: " + error.message),
  });

  const resetForm = () => setFormData({ name: "", category: "Necklace", metal_type: "Gold 22K", weight: "", stock: "", unit_price: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stock = parseInt(formData.stock);
    const status = stock === 0 ? "Out of Stock" : stock <= 5 ? "Low Stock" : "In Stock";
    // Auto-generate SKU from metal type + timestamp
    const metalPrefix = formData.metal_type.replace(/\s/g, "").substring(0, 3).toUpperCase();
    const sku = `${metalPrefix}-${Date.now().toString(36).toUpperCase()}`;
    addProductMutation.mutate({
      sku, name: formData.name, category: formData.category, metal_type: formData.metal_type,
      weight: parseFloat(formData.weight), stock, unit_price: parseFloat(formData.unit_price), status,
    });
  };

  const filteredProducts = products.filter(
    (p) => p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalProducts: products.length,
    totalValue: products.reduce((acc, p) => acc + (p.unit_price || 0) * (p.stock || 0), 0),
    lowStock: products.filter((p) => p.status === "Low Stock").length,
    outOfStock: products.filter((p) => p.status === "Out of Stock").length,
  };

  const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    return `₹${value.toLocaleString()}`;
  };

  return (
    <DashboardLayout>
      <div className="mb-6 animate-fade-in pt-2 sm:pt-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold">
              <span className="text-gradient-gold">Inventory</span> Management
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">Track stock, manage products, and monitor inventory value</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gold" className="shrink-0 w-full sm:w-auto"><Plus className="w-4 h-4 mr-2" />Add Product</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader><DialogTitle>Add New Product</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="sku">SKU</Label><Input id="sku" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} placeholder="JW001" required /></div>
                  <div className="space-y-2"><Label htmlFor="name">Product Name</Label><Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Gold Necklace" required /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Category</Label><Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Necklace">Necklace</SelectItem><SelectItem value="Ring">Ring</SelectItem><SelectItem value="Bangle">Bangle</SelectItem><SelectItem value="Earring">Earring</SelectItem><SelectItem value="Pendant">Pendant</SelectItem><SelectItem value="Anklet">Anklet</SelectItem><SelectItem value="Chain">Chain</SelectItem></SelectContent></Select></div>
                  <div className="space-y-2"><Label>Metal Type</Label><Select value={formData.metal_type} onValueChange={(v) => setFormData({ ...formData, metal_type: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Gold 24K">Gold 24K</SelectItem><SelectItem value="Gold 22K">Gold 22K</SelectItem><SelectItem value="Gold 18K">Gold 18K</SelectItem><SelectItem value="Gold 14K">Gold 14K</SelectItem><SelectItem value="Silver 925">Silver 925</SelectItem><SelectItem value="Platinum">Platinum</SelectItem></SelectContent></Select></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2"><Label htmlFor="weight">Weight (g)</Label><Input id="weight" type="number" step="0.01" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} placeholder="45.5" required /></div>
                  <div className="space-y-2"><Label htmlFor="stock">Stock</Label><Input id="stock" type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} placeholder="10" required /></div>
                  <div className="space-y-2"><Label htmlFor="price">Price (₹)</Label><Input id="price" type="number" value={formData.unit_price} onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })} placeholder="50000" required /></div>
                </div>
                <Button type="submit" variant="gold" className="w-full" disabled={addProductMutation.isPending}>
                  {addProductMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Add Product
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <Card variant="stat"><CardContent className="pt-4 sm:pt-6 px-3 sm:px-6"><p className="text-xs sm:text-sm text-muted-foreground">Total Products</p><p className="text-xl sm:text-2xl font-bold text-primary">{stats.totalProducts}</p></CardContent></Card>
        <Card variant="stat"><CardContent className="pt-4 sm:pt-6 px-3 sm:px-6"><p className="text-xs sm:text-sm text-muted-foreground">Total Value</p><p className="text-xl sm:text-2xl font-bold">{formatCurrency(stats.totalValue)}</p></CardContent></Card>
        <Card variant="stat"><CardContent className="pt-4 sm:pt-6 px-3 sm:px-6"><p className="text-xs sm:text-sm text-muted-foreground">Low Stock</p><p className="text-xl sm:text-2xl font-bold text-yellow-500">{stats.lowStock}</p></CardContent></Card>
        <Card variant="stat"><CardContent className="pt-4 sm:pt-6 px-3 sm:px-6"><p className="text-xs sm:text-sm text-muted-foreground">Out of Stock</p><p className="text-xl sm:text-2xl font-bold text-destructive">{stats.outOfStock}</p></CardContent></Card>
      </div>

      <Card variant="elevated">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg"><Package className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />All Products</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:flex-none"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search..." className="pl-10 w-full sm:w-48 md:w-64" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
              <Button variant="outline" size="icon" className="shrink-0 h-9 w-9 sm:h-10 sm:w-10"><Filter className="w-4 h-4" /></Button>
              <Button variant="outline" size="icon" className="shrink-0 h-9 w-9 sm:h-10 sm:w-10"><Download className="w-4 h-4" /></Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">{products.length === 0 ? "No products yet. Add your first product!" : "No products found."}</div>
          ) : (
            <Table>
              <TableHeader><TableRow>
                <TableHead className="cursor-pointer hover:text-primary whitespace-nowrap">SKU <ArrowUpDown className="inline w-3 h-3 ml-1" /></TableHead>
                <TableHead className="whitespace-nowrap">Product Name</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden lg:table-cell">Metal</TableHead>
                <TableHead className="hidden sm:table-cell">Weight</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="hidden sm:table-cell">Price</TableHead>
                <TableHead>Status</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {filteredProducts.map((item) => (
                  <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-mono text-xs sm:text-sm">{item.sku}</TableCell>
                    <TableCell className="font-medium text-sm max-w-[150px] truncate">{item.name}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{item.category}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm">{item.metal_type}</TableCell>
                    <TableCell className="hidden sm:table-cell text-sm">{item.weight}g</TableCell>
                    <TableCell className="text-sm">{item.stock}</TableCell>
                    <TableCell className="hidden sm:table-cell font-semibold text-sm">₹{item.unit_price?.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === "In Stock" ? "default" : item.status === "Low Stock" ? "secondary" : "destructive"} className="text-xs whitespace-nowrap">{item.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Inventory;
