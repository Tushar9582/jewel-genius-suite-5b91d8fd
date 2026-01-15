import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Package, Search, Plus, Filter, Download, ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const inventoryItems = [
  { id: "JW001", name: "22K Gold Necklace Set", category: "Necklace", metal: "Gold 22K", weight: "45.5g", stock: 12, value: "₹34,12,500", status: "In Stock" },
  { id: "JW002", name: "Diamond Solitaire Ring", category: "Ring", metal: "Platinum", weight: "4.2g", stock: 8, value: "₹12,50,000", status: "In Stock" },
  { id: "JW003", name: "Silver Anklet Pair", category: "Anklet", metal: "Silver 925", weight: "32g", stock: 2, value: "₹48,000", status: "Low Stock" },
  { id: "JW004", name: "Gold Bangles Set (4pc)", category: "Bangle", metal: "Gold 18K", weight: "62g", stock: 0, value: "₹0", status: "Out of Stock" },
  { id: "JW005", name: "Pearl Pendant", category: "Pendant", metal: "Gold 14K", weight: "8.5g", stock: 15, value: "₹2,55,000", status: "In Stock" },
];

const Inventory = () => {
  return (
    <DashboardLayout>
      <div className="mb-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">
              <span className="text-gradient-gold">Inventory</span> Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Track stock, manage products, and monitor inventory value
            </p>
          </div>
          <Button variant="gold">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card variant="stat">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Products</p>
            <p className="text-2xl font-bold text-primary">1,284</p>
          </CardContent>
        </Card>
        <Card variant="stat">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-2xl font-bold">₹2.4Cr</p>
          </CardContent>
        </Card>
        <Card variant="stat">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Low Stock Items</p>
            <p className="text-2xl font-bold text-yellow-500">24</p>
          </CardContent>
        </Card>
        <Card variant="stat">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Out of Stock</p>
            <p className="text-2xl font-bold text-destructive">8</p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card variant="elevated">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              All Products
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search products..." className="pl-10 w-64" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer hover:text-primary">
                  SKU <ArrowUpDown className="inline w-3 h-3 ml-1" />
                </TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Metal</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryItems.map((item) => (
                <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-mono text-sm">{item.id}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.metal}</TableCell>
                  <TableCell>{item.weight}</TableCell>
                  <TableCell>{item.stock}</TableCell>
                  <TableCell className="font-semibold">{item.value}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        item.status === "In Stock" ? "default" : 
                        item.status === "Low Stock" ? "secondary" : "destructive"
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Inventory;
