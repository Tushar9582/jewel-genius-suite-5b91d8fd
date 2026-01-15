import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  type: "sale" | "purchase" | "return";
  customer: string;
  item: string;
  amount: string;
  time: string;
  status: "completed" | "pending" | "processing";
}

const transactions: Transaction[] = [
  {
    id: "TXN001",
    type: "sale",
    customer: "Priya Sharma",
    item: "22K Gold Necklace Set",
    amount: "₹2,45,800",
    time: "10 mins ago",
    status: "completed",
  },
  {
    id: "TXN002",
    type: "sale",
    customer: "Amit Patel",
    item: "Diamond Engagement Ring",
    amount: "₹1,85,000",
    time: "25 mins ago",
    status: "completed",
  },
  {
    id: "TXN003",
    type: "purchase",
    customer: "Gold Supplier Co.",
    item: "24K Gold Bars (100g)",
    amount: "₹6,28,500",
    time: "1 hour ago",
    status: "processing",
  },
  {
    id: "TXN004",
    type: "sale",
    customer: "Neha Gupta",
    item: "Platinum Bangles Set",
    amount: "₹95,400",
    time: "2 hours ago",
    status: "completed",
  },
  {
    id: "TXN005",
    type: "return",
    customer: "Rahul Mehta",
    item: "Silver Anklet",
    amount: "₹8,500",
    time: "3 hours ago",
    status: "pending",
  },
];

export function RecentTransactions() {
  return (
    <Card variant="elevated">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Recent Transactions</CardTitle>
        <button className="text-sm text-primary hover:underline">
          View All
        </button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/30">
          {transactions.map((txn, index) => (
            <div
              key={txn.id}
              className="flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "p-2 rounded-xl",
                    txn.type === "sale"
                      ? "bg-emerald/10 text-emerald"
                      : txn.type === "purchase"
                      ? "bg-primary/10 text-primary"
                      : "bg-ruby/10 text-ruby"
                  )}
                >
                  {txn.type === "sale" || txn.type === "return" ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownLeft className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{txn.customer}</p>
                  <p className="text-sm text-muted-foreground">{txn.item}</p>
                </div>
              </div>
              <div className="text-right flex items-center gap-4">
                <div>
                  <p
                    className={cn(
                      "font-semibold",
                      txn.type === "sale"
                        ? "text-emerald"
                        : txn.type === "purchase"
                        ? "text-primary"
                        : "text-ruby"
                    )}
                  >
                    {txn.type === "purchase" ? "-" : "+"}
                    {txn.amount}
                  </p>
                  <p className="text-xs text-muted-foreground">{txn.time}</p>
                </div>
                <Badge
                  variant={
                    txn.status === "completed"
                      ? "default"
                      : txn.status === "processing"
                      ? "secondary"
                      : "outline"
                  }
                  className={cn(
                    "text-xs",
                    txn.status === "completed" && "bg-emerald/20 text-emerald border-emerald/30"
                  )}
                >
                  {txn.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
