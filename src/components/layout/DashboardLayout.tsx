import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-secondary/20 pointer-events-none" />
      
      <Sidebar />
      <div className="pl-64 transition-all duration-300 relative">
        <Header />
        <main className="p-6 max-w-[1800px]">{children}</main>
      </div>
      
      {/* Ambient glow effects */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none opacity-30" 
           style={{ background: 'radial-gradient(ellipse at center, hsl(43, 74%, 53%, 0.15), transparent 70%)' }} />
      <div className="fixed bottom-0 right-0 w-[600px] h-[300px] pointer-events-none opacity-20" 
           style={{ background: 'radial-gradient(ellipse at center, hsl(15, 60%, 55%, 0.15), transparent 70%)' }} />
    </div>
  );
}
