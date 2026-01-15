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
      <div className="mb-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">
              <span className="text-gradient-gold">Marketing</span> & Campaigns
            </h1>
            <p className="text-muted-foreground mt-1">
              Create campaigns, automate marketing, and track performance
            </p>
          </div>
          <Button variant="gold">
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card variant="stat">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-primary" />
              <p className="text-sm text-muted-foreground">Messages Sent</p>
            </div>
            <p className="text-2xl font-bold">24,580</p>
          </CardContent>
        </Card>
        <Card variant="stat">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-green-500" />
              <p className="text-sm text-muted-foreground">Open Rate</p>
            </div>
            <p className="text-2xl font-bold text-green-500">68.5%</p>
          </CardContent>
        </Card>
        <Card variant="stat">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
            </div>
            <p className="text-2xl font-bold text-primary">8.2%</p>
          </CardContent>
        </Card>
        <Card variant="stat">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <p className="text-sm text-muted-foreground">Active Campaigns</p>
            </div>
            <p className="text-2xl font-bold">4</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign List */}
        <div className="lg:col-span-2">
          <Card variant="elevated">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-primary" />
                All Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {campaigns.map((campaign) => (
                  <div 
                    key={campaign.id} 
                    className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-gold/20 flex items-center justify-center">
                      {campaign.type.includes("Email") ? <Mail className="w-5 h-5 text-primary" /> :
                       campaign.type.includes("SMS") ? <MessageSquare className="w-5 h-5 text-primary" /> :
                       <Bell className="w-5 h-5 text-primary" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{campaign.name}</p>
                      <p className="text-sm text-muted-foreground">{campaign.type}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-medium">{campaign.sent.toLocaleString()} sent</p>
                      <p className="text-muted-foreground">{campaign.converted} conversions</p>
                    </div>
                    <Badge 
                      variant={
                        campaign.status === "Active" ? "default" : 
                        campaign.status === "Scheduled" ? "secondary" : "outline"
                      }
                    >
                      {campaign.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-2">
              <Mail className="w-4 h-4" />
              Send Email Blast
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <MessageSquare className="w-4 h-4" />
              Send SMS Campaign
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Bell className="w-4 h-4" />
              Push Notification
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Users className="w-4 h-4" />
              Segment Customers
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Marketing;
