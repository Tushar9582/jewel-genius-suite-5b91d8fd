import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import POS from "./pages/POS";
import Inventory from "./pages/Inventory";
import Customers from "./pages/Customers";
import Investments from "./pages/Investments";
import Marketing from "./pages/Marketing";
import Analytics from "./pages/Analytics";
import HR from "./pages/HR";
import Payroll from "./pages/Payroll";
import Branches from "./pages/Branches";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/pos" element={<POS />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/investments" element={<Investments />} />
          <Route path="/marketing" element={<Marketing />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/hr" element={<HR />} />
          <Route path="/payroll" element={<Payroll />} />
          <Route path="/branches" element={<Branches />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
