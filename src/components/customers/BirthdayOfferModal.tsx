import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Gift, MessageCircle, Mail, Phone, Send, Eye, Save, Cake } from "lucide-react";
import { toast } from "sonner";

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

export function BirthdayOfferModal({ customer, open, onOpenChange }: Props) {
  const [offerType, setOfferType] = useState<"percent" | "flat" | "making" | "custom">("percent");
  const [discountPercent, setDiscountPercent] = useState(5);
  const [discountFlat, setDiscountFlat] = useState(500);
  const [customMessage, setCustomMessage] = useState("");
  const [sendVia, setSendVia] = useState<"whatsapp" | "sms" | "email">("whatsapp");
  const [showPreview, setShowPreview] = useState(false);

  if (!customer) return null;

  const getOfferText = () => {
    switch (offerType) {
      case "percent": return `${discountPercent}% Discount`;
      case "flat": return `₹${discountFlat} Off`;
      case "making": return "Free Making Charges";
      case "custom": return customMessage || "Special Birthday Offer";
    }
  };

  const generateMessage = () => {
    const offer = getOfferText();
    return `🎂 Happy Birthday, ${customer.name}! 🎉\n\nWishing you a wonderful birthday from our jewellery family!\n\n🎁 Special Birthday Offer: ${offer}\n\nVisit us today to avail your exclusive birthday offer!\n\nTerms & conditions apply.`;
  };

  const handleSend = () => {
    const message = generateMessage();
    if (sendVia === "whatsapp") {
      const phone = customer.phone?.replace(/\D/g, "");
      window.open(`https://wa.me/${phone.startsWith("91") ? phone : "91" + phone}?text=${encodeURIComponent(message)}`, "_blank");
    } else if (sendVia === "email" && customer.email) {
      window.open(`mailto:${customer.email}?subject=🎂 Happy Birthday ${customer.name}!&body=${encodeURIComponent(message)}`, "_blank");
    } else if (sendVia === "sms") {
      window.open(`sms:${customer.phone}?body=${encodeURIComponent(message)}`, "_blank");
    }
    toast.success(`Birthday offer sent to ${customer.name} via ${sendVia}!`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-pink-500" />
            Send Birthday Offer
            <Badge className="bg-gradient-to-r from-pink-500 to-orange-400 text-white text-[10px]">
              <Cake className="w-3 h-3 mr-0.5" /> {customer.name}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Offer Type */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Offer Type</Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "percent" as const, label: "Discount %", icon: "%" },
                { value: "flat" as const, label: "Flat ₹ Off", icon: "₹" },
                { value: "making" as const, label: "Free Making", icon: "🛠" },
                { value: "custom" as const, label: "Custom Offer", icon: "✍" },
              ].map((opt) => (
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

          {/* Send Via */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Send Via</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button variant={sendVia === "whatsapp" ? "default" : "outline"} size="sm" className="text-xs gap-1.5 h-9" onClick={() => setSendVia("whatsapp")}>
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
              </Button>
              <Button variant={sendVia === "sms" ? "default" : "outline"} size="sm" className="text-xs gap-1.5 h-9" onClick={() => setSendVia("sms")}>
                <Phone className="w-3.5 h-3.5" /> SMS
              </Button>
              <Button variant={sendVia === "email" ? "default" : "outline"} size="sm" className="text-xs gap-1.5 h-9" onClick={() => setSendVia("email")} disabled={!customer.email}>
                <Mail className="w-3.5 h-3.5" /> Email
              </Button>
            </div>
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="p-3 rounded-lg border border-border/50 bg-muted/20 text-sm whitespace-pre-line">
              {generateMessage()}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0 flex-wrap">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="w-3.5 h-3.5" /> {showPreview ? "Hide" : "Preview"}
          </Button>
          <Button variant="gold" size="sm" className="gap-1.5" onClick={handleSend}>
            <Send className="w-3.5 h-3.5" /> Send Offer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
