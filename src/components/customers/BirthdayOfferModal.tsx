import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Gift, MessageCircle, Mail, Phone, Send, Eye, Cake, Loader2, Copy, Check, Sparkles, PartyPopper } from "lucide-react";
import { toast } from "sonner";
import { format, addDays } from "date-fns";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string | null;
}

interface Props {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STORE_NAME = "Rajlakshmi Jewels";
const STORE_PHONE = "+91 XXXXXXXXXX";
const STORE_ADDRESS = "Your Store Address";

function generateCouponCode(name: string): string {
  const prefix = "BDAY";
  const nameCode = name.replace(/\s/g, "").substring(0, 3).toUpperCase();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${nameCode}${rand}`;
}

export function BirthdayOfferModal({ customer, open, onOpenChange }: Props) {
  const [offerType, setOfferType] = useState<"percent" | "flat" | "making" | "custom">("percent");
  const [discountPercent, setDiscountPercent] = useState(5);
  const [discountFlat, setDiscountFlat] = useState(500);
  const [customMessage, setCustomMessage] = useState("");
  const [channels, setChannels] = useState<{ whatsapp: boolean; sms: boolean; email: boolean }>({
    whatsapp: true, sms: false, email: false,
  });
  const [showPreview, setShowPreview] = useState(false);
  const [previewTab, setPreviewTab] = useState("whatsapp");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  const expiryDate = format(addDays(new Date(), 7), "dd MMM yyyy");

  useEffect(() => {
    if (customer && open) {
      setCouponCode(generateCouponCode(customer.name));
      setSent(false);
      setShowConfetti(false);
    }
  }, [customer, open]);

  const getOfferText = useCallback(() => {
    switch (offerType) {
      case "percent": return `${discountPercent}% Discount`;
      case "flat": return `₹${discountFlat} Off`;
      case "making": return "Free Making Charges";
      case "custom": return customMessage || "Special Birthday Offer";
    }
  }, [offerType, discountPercent, discountFlat, customMessage]);

  const getDiscountValue = useCallback(() => {
    switch (offerType) {
      case "percent": return `${discountPercent}%`;
      case "flat": return `₹${discountFlat}`;
      case "making": return "Waived";
      case "custom": return "Special";
    }
  }, [offerType, discountPercent, discountFlat]);

  if (!customer) return null;

  const whatsappMessage = `🎉 *Happy Birthday, ${customer.name}!*

💎 *A Special Gift From ${STORE_NAME}*

We're celebrating your special day with an exclusive birthday offer just for you:

🎁 *Offer:* ${getOfferText()}
💰 *Discount:* ${getDiscountValue()}
🎟️ *Coupon Code:* ${couponCode}

✨ *Valid Till:* ${expiryDate}

Visit us today and make your birthday even more special.

📍 Store: ${STORE_NAME}
📞 Contact: ${STORE_PHONE}

_Warm Regards,_
_${STORE_NAME}_ 💎`;

  const smsMessage = `Happy Birthday ${customer.name}! 🎂 ${STORE_NAME} offers you ${getOfferText()}. Use code: ${couponCode}. Valid till ${expiryDate}. Visit us today!`;

  const emailSubject = `🎉 Happy Birthday ${customer.name} - Special Gift Inside!`;
  const emailBody = `Dear ${customer.name},

Happy Birthday! 🎂

We're celebrating your special day with an exclusive offer:

Offer: ${getOfferText()}
Discount: ${getDiscountValue()}
Coupon Code: ${couponCode}
Valid Till: ${expiryDate}

Visit us today at ${STORE_NAME} and make your birthday extra special!

Store: ${STORE_NAME}
Contact: ${STORE_PHONE}
Address: ${STORE_ADDRESS}

Warm Regards,
${STORE_NAME}`;

  const selectedCount = Object.values(channels).filter(Boolean).length;

  const handleSend = async () => {
    if (selectedCount === 0) {
      toast.error("Please select at least one channel");
      return;
    }

    setSending(true);

    // Simulate a brief delay for UX
    await new Promise((r) => setTimeout(r, 800));

    const results: string[] = [];

    try {
      if (channels.whatsapp) {
        const phone = customer.phone?.replace(/\D/g, "");
        const formatted = phone.startsWith("91") ? phone : "91" + phone;
        const waUrl = `https://wa.me/${formatted}?text=${encodeURIComponent(whatsappMessage)}`;
        // Use anchor click to bypass iframe restrictions
        const a = document.createElement("a");
        a.href = waUrl;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        results.push("WhatsApp");
      }

      if (channels.sms) {
        window.open(`sms:${customer.phone}?body=${encodeURIComponent(smsMessage)}`, "_blank");
        results.push("SMS");
      }

      if (channels.email && customer.email) {
        window.open(`mailto:${customer.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`, "_blank");
        results.push("Email");
      } else if (channels.email && !customer.email) {
        toast.error("Customer email not available");
      }

      if (results.length > 0) {
        setSent(true);
        setShowConfetti(true);
        toast.success(`🎉 Birthday offer sent via ${results.join(", ")}!`);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    } catch {
      toast.error("Failed to send offer. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText(couponCode);
    toast.success("Coupon code copied!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto border-primary/30 bg-gradient-to-b from-background to-background/95">
        {/* Confetti overlay */}
        {showConfetti && (
          <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
            <div className="animate-bounce text-6xl">🎉</div>
            <PartyPopper className="absolute top-4 left-8 w-8 h-8 text-yellow-400 animate-ping" />
            <PartyPopper className="absolute top-8 right-12 w-6 h-6 text-pink-400 animate-ping delay-100" />
            <Sparkles className="absolute bottom-12 left-12 w-6 h-6 text-primary animate-pulse" />
            <Sparkles className="absolute bottom-8 right-8 w-8 h-8 text-yellow-500 animate-pulse delay-200" />
          </div>
        )}

        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Gift className="w-5 h-5 text-pink-500" />
            Send Birthday Offer
            <Badge className="bg-gradient-to-r from-pink-500 to-orange-400 text-white text-[10px] ml-auto">
              <Cake className="w-3 h-3 mr-0.5" /> {customer.name}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Offer Type */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Offer Type</Label>
            <div className="grid grid-cols-2 gap-2">
              {([
                { value: "percent" as const, label: "Discount %", icon: "%" },
                { value: "flat" as const, label: "Flat ₹ Off", icon: "₹" },
                { value: "making" as const, label: "Free Making", icon: "🛠" },
                { value: "custom" as const, label: "Custom Offer", icon: "✍" },
              ]).map((opt) => (
                <Button
                  key={opt.value}
                  variant={offerType === opt.value ? "default" : "outline"}
                  size="sm"
                  className="text-xs gap-1.5 h-9"
                  onClick={() => setOfferType(opt.value)}
                >
                  <span>{opt.icon}</span> {opt.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Offer Value */}
          {offerType === "percent" && (
            <div className="space-y-1.5">
              <Label className="text-xs">Discount Percentage</Label>
              <div className="flex items-center gap-2">
                <Input type="number" min={1} max={50} value={discountPercent} onChange={(e) => setDiscountPercent(Number(e.target.value))} className="w-24" />
                <span className="text-sm text-muted-foreground">%</span>
                <div className="flex gap-1 ml-auto">
                  {[5, 10, 15, 20].map((v) => (
                    <Button key={v} variant={discountPercent === v ? "default" : "outline"} size="sm" className="h-7 text-[10px] px-2" onClick={() => setDiscountPercent(v)}>
                      {v}%
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {offerType === "flat" && (
            <div className="space-y-1.5">
              <Label className="text-xs">Flat Discount Amount</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">₹</span>
                <Input type="number" min={100} value={discountFlat} onChange={(e) => setDiscountFlat(Number(e.target.value))} />
              </div>
            </div>
          )}

          {offerType === "custom" && (
            <div className="space-y-1.5">
              <Label className="text-xs">Custom Offer Message</Label>
              <Textarea placeholder="e.g., Buy 1 Get 1 Free on Silver items..." value={customMessage} onChange={(e) => setCustomMessage(e.target.value)} rows={3} />
            </div>
          )}

          {offerType === "making" && (
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm text-center">
              <p className="font-medium text-primary">🛠 Free Making Charges</p>
              <p className="text-xs text-muted-foreground mt-1">Making charges will be waived on birthday purchase</p>
            </div>
          )}

          {/* Coupon Code */}
          <div className="flex items-center gap-2 p-2.5 rounded-lg border border-dashed border-primary/40 bg-primary/5">
            <span className="text-xs font-semibold text-muted-foreground">🎟️ Coupon:</span>
            <code className="text-sm font-bold text-primary tracking-widest">{couponCode}</code>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-auto" onClick={handleCopyCoupon}>
              <Copy className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2" onClick={() => setCouponCode(generateCouponCode(customer.name))}>
              Regenerate
            </Button>
          </div>

          {/* Expiry */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>⏰ Auto Expiry:</span>
            <Badge variant="outline" className="text-[10px]">{expiryDate}</Badge>
            <span className="text-muted-foreground/60">(7 days from today)</span>
          </div>

          {/* Send Channels - Multi Select */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Send Via (select multiple)</Label>
            <div className="grid grid-cols-3 gap-2">
              <label className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all ${channels.whatsapp ? "border-green-500 bg-green-500/10 shadow-sm shadow-green-500/20" : "border-border hover:border-green-500/50"}`}>
                <Checkbox checked={channels.whatsapp} onCheckedChange={(c) => setChannels((p) => ({ ...p, whatsapp: !!c }))} />
                <MessageCircle className="w-3.5 h-3.5 text-green-500" />
                <span className="text-xs font-medium">WhatsApp</span>
              </label>
              <label className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all ${channels.sms ? "border-blue-500 bg-blue-500/10 shadow-sm shadow-blue-500/20" : "border-border hover:border-blue-500/50"}`}>
                <Checkbox checked={channels.sms} onCheckedChange={(c) => setChannels((p) => ({ ...p, sms: !!c }))} />
                <Phone className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-xs font-medium">SMS</span>
              </label>
              <label className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all ${channels.email ? "border-purple-500 bg-purple-500/10 shadow-sm shadow-purple-500/20" : "border-border hover:border-purple-500/50"} ${!customer.email ? "opacity-50 pointer-events-none" : ""}`}>
                <Checkbox checked={channels.email} onCheckedChange={(c) => setChannels((p) => ({ ...p, email: !!c }))} disabled={!customer.email} />
                <Mail className="w-3.5 h-3.5 text-purple-500" />
                <span className="text-xs font-medium">Email</span>
              </label>
            </div>
            {!customer.email && <p className="text-[10px] text-muted-foreground">Email not available for this customer</p>}
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs" onClick={() => setShowPreview(!showPreview)}>
              <Eye className="w-3.5 h-3.5" /> {showPreview ? "Hide Preview" : "Preview Messages"}
            </Button>

            {showPreview && (
              <Tabs value={previewTab} onValueChange={setPreviewTab} className="w-full">
                <TabsList className="w-full grid grid-cols-3 h-8">
                  <TabsTrigger value="whatsapp" className="text-[10px] gap-1"><MessageCircle className="w-3 h-3" />WhatsApp</TabsTrigger>
                  <TabsTrigger value="sms" className="text-[10px] gap-1"><Phone className="w-3 h-3" />SMS</TabsTrigger>
                  <TabsTrigger value="email" className="text-[10px] gap-1"><Mail className="w-3 h-3" />Email</TabsTrigger>
                </TabsList>

                <TabsContent value="whatsapp" className="mt-2">
                  <div className="p-3 rounded-xl bg-[#DCF8C6] dark:bg-[#1a3a1a] text-sm whitespace-pre-line border border-green-200 dark:border-green-900 max-h-48 overflow-y-auto text-foreground">
                    {whatsappMessage}
                  </div>
                </TabsContent>

                <TabsContent value="sms" className="mt-2">
                  <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-sm border border-blue-200 dark:border-blue-900 max-h-48 overflow-y-auto text-foreground">
                    {smsMessage}
                  </div>
                </TabsContent>

                <TabsContent value="email" className="mt-2">
                  <div className="rounded-xl border border-purple-200 dark:border-purple-900 overflow-hidden max-h-64 overflow-y-auto">
                    {/* Email Header */}
                    <div className="bg-gradient-to-r from-primary/90 to-primary p-3 text-center">
                      <p className="text-primary-foreground font-bold text-sm">💎 {STORE_NAME}</p>
                    </div>
                    {/* Email Banner */}
                    <div className="bg-gradient-to-r from-pink-500/20 to-orange-400/20 p-4 text-center">
                      <p className="text-2xl mb-1">🎂</p>
                      <p className="font-bold text-base">Happy Birthday, {customer.name}!</p>
                      <p className="text-xs text-muted-foreground mt-1">We have a special gift for you</p>
                    </div>
                    {/* Offer Card */}
                    <div className="p-4 space-y-3">
                      <div className="p-3 rounded-lg border-2 border-dashed border-primary/40 bg-primary/5 text-center">
                        <p className="text-xs text-muted-foreground">Your Exclusive Offer</p>
                        <p className="text-lg font-bold text-primary">{getOfferText()}</p>
                        <p className="text-xs mt-1">Code: <span className="font-mono font-bold">{couponCode}</span></p>
                        <p className="text-[10px] text-muted-foreground mt-1">Valid till {expiryDate}</p>
                      </div>
                      <div className="text-center">
                        <div className="inline-block px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                          ✨ Claim Your Offer
                        </div>
                      </div>
                      <div className="text-center text-xs text-muted-foreground border-t pt-3 space-y-0.5">
                        <p className="font-medium">{STORE_NAME}</p>
                        <p>📞 {STORE_PHONE}</p>
                        <p>📍 {STORE_ADDRESS}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>

          {/* Sent Status */}
          {sent && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400">
              <Check className="w-4 h-4" />
              <span className="text-xs font-medium">Offer sent successfully!</span>
              <Badge variant="outline" className="ml-auto text-[10px] border-green-500/40 text-green-600 dark:text-green-400">Delivered</Badge>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0 flex-wrap pt-2">
          <Button
            variant="default"
            size="sm"
            className="w-full gap-1.5 bg-gradient-to-r from-primary to-yellow-600 hover:from-primary/90 hover:to-yellow-600/90 text-primary-foreground shadow-lg shadow-primary/25"
            onClick={handleSend}
            disabled={sending || selectedCount === 0}
          >
            {sending ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending...</>
            ) : sent ? (
              <><Check className="w-3.5 h-3.5" /> Sent! Send Again</>
            ) : (
              <><Send className="w-3.5 h-3.5" /> Send Offer ({selectedCount} channel{selectedCount !== 1 ? "s" : ""})</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
