import { Bell, Search, User, Globe, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Header() {
  return (
    <header className="sticky top-0 z-30 h-14 sm:h-16 bg-background/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-4 sm:px-6">
      {/* Left Section - Store info (hidden on mobile, shown on tablet+) */}
      <div className="hidden sm:flex items-center gap-4">
        <div className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg bg-secondary/50 text-xs sm:text-sm">
          <Store className="w-4 h-4 text-primary shrink-0" />
          <span className="font-medium truncate">Main Store</span>
          <span className="text-muted-foreground hidden md:inline">• Mumbai</span>
        </div>
      </div>

      {/* Search - Responsive width */}
      <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md mx-2 sm:mx-4 lg:mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-10 bg-secondary/30 border-border/50 focus:bg-secondary/50 text-sm h-9 sm:h-10"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Language Selector - Hidden on mobile */}
        <Button variant="ghost" size="icon" className="text-muted-foreground hidden sm:flex h-9 w-9">
          <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="text-muted-foreground relative h-9 w-9">
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-2 h-2 rounded-full bg-primary animate-pulse" />
        </Button>

        {/* User Profile */}
        <Button variant="ghost" className="gap-2 ml-1 sm:ml-2 px-2 sm:px-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-gold flex items-center justify-center shrink-0">
            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-foreground" />
          </div>
          <div className="text-left hidden md:block">
            <p className="text-sm font-medium leading-tight">Rajesh Kumar</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
        </Button>
      </div>
    </header>
  );
}
