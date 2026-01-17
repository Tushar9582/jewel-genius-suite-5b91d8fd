import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Mail, MessageSquare, Bell, Plus, Send, Users, TrendingUp, Calendar } from "lucide-react";

const campaigns = [
  { id: 1, name: "Diwali Gold Rush", type: "Email + SMS", status: "Active", sent: 2450, opened: 1820, converted: 156 },
  { id: 2, name: "Anniversary Discounts", type: "Push Notification", status: "Scheduled", sent: 0, opened: 0, converted: 0 },
  { id: 3, name: "New Collection Launch", type: "Email", status: "Completed", sent: 3200, opened: 2100, converted: 245 },
  { id: 4, name: "Loyalty Rewards Reminder", type: "SMS", status: "Active", sent: 1850, opened: 1650, converted: 89 },
];

const Marketing = () => {
  return (
    <DashboardLayout>
      <div className="mb-6 animate-fade-in pt-2 sm:pt-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold">
              <span className="text-gradient-gold">Marketing</span> & Campaigns
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Create campaigns, automate marketing, and track performance
            </p>
          </div>
          <Button variant="gold" className="shrink-0 w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <Card variant="stat">
          <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
            <div className="flex items-center gap-1 sm:gap-2">
              <Send className="w-3 h-3 sm:w-4 sm:h-4 text-primary shrink-0" />
              <p className="text-xs sm:text-sm text-muted-foreground truncate">Messages Sent</p>
            </div>
            <p className="text-xl sm:text-2xl font-bold">24,580</p>
          </CardContent>
        </Card>
        <Card variant="stat">
          <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
            <div className="flex items-center gap-1 sm:gap-2">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 shrink-0" />
              <p className="text-xs sm:text-sm text-muted-foreground">Open Rate</p>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-green-500">68.5%</p>
          </CardContent>
        </Card>
        <Card variant="stat">
          <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
            <div className="flex items-center gap-1 sm:gap-2">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-primary shrink-0" />
              <p className="text-xs sm:text-sm text-muted-foreground truncate">Conversion</p>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-primary">8.2%</p>
          </CardContent>
        </Card>
        <Card variant="stat">
          <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
            <div className="flex items-center gap-1 sm:gap-2">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 shrink-0" />
              <p className="text-xs sm:text-sm text-muted-foreground truncate">Active</p>
            </div>
            <p className="text-xl sm:text-2xl font-bold">4</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Campaign List */}
        <div className="xl:col-span-2">
          <Card variant="elevated">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Megaphone className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                All Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {campaigns.map((campaign) => (
                  <div 
                    key={campaign.id} 
                    className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-gold/20 flex items-center justify-center shrink-0">
                        {campaign.type.includes("Email") ? <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary" /> :
                         campaign.type.includes("SMS") ? <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-primary" /> :
                         <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm sm:text-base truncate">{campaign.name}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">{campaign.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                      <div className="text-left sm:text-right text-xs sm:text-sm">
                        <p className="font-medium">{campaign.sent.toLocaleString()} sent</p>
                        <p className="text-muted-foreground">{campaign.converted} conversions</p>
                      </div>
                      <Badge 
                        variant={
                          campaign.status === "Active" ? "default" : 
                          campaign.status === "Scheduled" ? "secondary" : "outline"
                        }
                        className="text-xs whitespace-nowrap"
                      >
                        {campaign.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card variant="elevated">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3">
            <Button variant="outline" className="w-full justify-start gap-2 h-10 sm:h-11 text-sm">
              <Mail className="w-4 h-4 shrink-0" />
              <span className="truncate">Send Email Blast</span>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 h-10 sm:h-11 text-sm">
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span className="truncate">Send SMS Campaign</span>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 h-10 sm:h-11 text-sm">
              <Bell className="w-4 h-4 shrink-0" />
              <span className="truncate">Push Notification</span>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 h-10 sm:h-11 text-sm">
              <Users className="w-4 h-4 shrink-0" />
              <span className="truncate">Segment Customers</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Marketing;
