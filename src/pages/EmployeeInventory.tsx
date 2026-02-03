import { EmployeeLayout } from "@/components/layout/EmployeeLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Package, Search, Filter, ArrowUpDown } from "lucide-react";
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

const EmployeeInventory = () => {
  return (
    <EmployeeLayout>
      <div className="animate-fade-in space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold">
            <span className="text-gradient-gold">Inventory</span> View
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            View product stock and inventory details
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card variant="stat">
            <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
              <p className="text-xs sm:text-sm text-muted-foreground">Total Products</p>
              <p className="text-xl sm:text-2xl font-bold text-primary">1,284</p>
            </CardContent>
          </Card>
          <Card variant="stat">
            <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
              <p className="text-xs sm:text-sm text-muted-foreground">Total Value</p>
              <p className="text-xl sm:text-2xl font-bold">₹2.4Cr</p>
            </CardContent>
          </Card>
          <Card variant="stat">
            <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
              <p className="text-xs sm:text-sm text-muted-foreground">Low Stock</p>
              <p className="text-xl sm:text-2xl font-bold text-yellow-500">24</p>
            </CardContent>
          </Card>
          <Card variant="stat">
            <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
              <p className="text-xs sm:text-sm text-muted-foreground">Out of Stock</p>
              <p className="text-xl sm:text-2xl font-bold text-destructive">8</p>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Table */}
        <Card variant="elevated">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                All Products
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search..." className="pl-10 w-full sm:w-48 md:w-64" />
                </div>
                <Button variant="outline" size="icon" className="shrink-0 h-9 w-9 sm:h-10 sm:w-10">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer hover:text-primary whitespace-nowrap">
                    SKU <ArrowUpDown className="inline w-3 h-3 ml-1" />
                  </TableHead>
                  <TableHead className="whitespace-nowrap">Product Name</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="hidden lg:table-cell">Metal</TableHead>
                  <TableHead className="hidden sm:table-cell">Weight</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="hidden sm:table-cell">Value</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryItems.map((item) => (
                  <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-mono text-xs sm:text-sm">{item.id}</TableCell>
                    <TableCell className="font-medium text-sm max-w-[150px] truncate">{item.name}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{item.category}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm">{item.metal}</TableCell>
                    <TableCell className="hidden sm:table-cell text-sm">{item.weight}</TableCell>
                    <TableCell className="text-sm">{item.stock}</TableCell>
                    <TableCell className="hidden sm:table-cell font-semibold text-sm">{item.value}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          item.status === "In Stock" ? "default" : 
                          item.status === "Low Stock" ? "secondary" : "destructive"
                        }
                        className="text-xs whitespace-nowrap"
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
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeInventory;
