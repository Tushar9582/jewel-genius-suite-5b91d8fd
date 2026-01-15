import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings as SettingsIcon, Store, Bell, Shield, Palette, Globe, Database, CreditCard } from "lucide-react";

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="mb-6 animate-fade-in">
        <h1 className="text-3xl font-display font-bold">
          <span className="text-gradient-gold">Settings</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Configure your store, preferences, and system settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Store Information */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="w-5 h-5 text-primary" />
                Store Information
              </CardTitle>
              <CardDescription>Basic details about your jewellery business</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input id="storeName" defaultValue="Sharma Jewellers" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gst">GST Number</Label>
                  <Input id="gst" defaultValue="27AADCS0472N1ZV" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" defaultValue="12, Jewellers Lane, Connaught Place, New Delhi - 110001" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue="+91 11 2345 6789" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="contact@sharmajewellers.com" />
                </div>
              </div>
              <Button variant="gold">Save Changes</Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Notifications
              </CardTitle>
              <CardDescription>Configure how you receive alerts and updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Low Stock Alerts</p>
                  <p className="text-sm text-muted-foreground">Get notified when items are running low</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Daily Sales Summary</p>
                  <p className="text-sm text-muted-foreground">Receive end-of-day sales reports</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Price Alerts</p>
                  <p className="text-sm text-muted-foreground">Notifications for significant gold price changes</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Customer Birthdays</p>
                  <p className="text-sm text-muted-foreground">Reminders for customer special occasions</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Security
              </CardTitle>
              <CardDescription>Manage access and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Session Timeout</p>
                  <p className="text-sm text-muted-foreground">Auto logout after 30 minutes of inactivity</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button variant="outline">Change Password</Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Quick Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Palette className="w-4 h-4" />
                Appearance
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Globe className="w-4 h-4" />
                Language & Region
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Database className="w-4 h-4" />
                Backup & Export
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <CreditCard className="w-4 h-4" />
                Billing & Plans
              </Button>
            </CardContent>
          </Card>

          <Card variant="gold">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Our support team is available 24/7 to help you with any issues.
              </p>
              <Button variant="gold" className="w-full">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
