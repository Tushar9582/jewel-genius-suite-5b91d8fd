import { Bell, Search, User, Globe, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Header() {
  return (
    <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-6">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 text-sm">
          <Store className="w-4 h-4 text-primary" />
          <span className="font-medium">Main Store</span>
          <span className="text-muted-foreground">• Mumbai</span>
        </div>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search inventory, customers, orders..."
            className="pl-10 bg-secondary/30 border-border/50 focus:bg-secondary/50"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Language Selector */}
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Globe className="w-5 h-5" />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="text-muted-foreground relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-pulse" />
        </Button>

        {/* User Profile */}
        <Button variant="ghost" className="gap-2 ml-2">
          <div className="w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="text-left hidden lg:block">
            <p className="text-sm font-medium">Rajesh Kumar</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
        </Button>
      </div>
    </header>
  );
}
