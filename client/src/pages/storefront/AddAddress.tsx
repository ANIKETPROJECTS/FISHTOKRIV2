import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Header } from "@/components/storefront/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { SavedAddress } from "@/components/storefront/CartDrawer";
import { ChevronLeft } from "lucide-react";

export default function AddAddress() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: "", phone: "", pincode: "", state: "",
    address: "", locality: "", city: "", landmark: "",
    type: "home" as "home" | "office" | "other",
    label: "", instructions: "",
  });
  const [profileData, setProfileData] = useState<{ name: string; phone: string } | null>(null);

  useEffect(() => {
    const profile = localStorage.getItem("fishtokri_profile");
    if (profile) {
      const p = JSON.parse(profile);
      setProfileData({ name: p.name || "", phone: p.phone || "" });
    }
  }, []);

  const f = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const save = () => {
    if (!form.name || !form.phone || !form.address || !form.pincode) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    const label = form.type === "other" ? (form.label || "Other") : form.type === "home" ? "Home" : "Office";
    const newAddr: SavedAddress = { ...form, label, id: Date.now().toString() };
    const existing: SavedAddress[] = JSON.parse(localStorage.getItem("fishtokri_addresses") || "[]");
    localStorage.setItem("fishtokri_addresses", JSON.stringify([...existing, newAddr]));
    toast({ title: "Address saved!" });
    navigate(-1 as any);
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="sticky top-0 z-50 bg-white border-b border-border/30 px-4 py-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1 as any)} className="rounded-full border border-border/40">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold text-foreground">Add Delivery Address</h1>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Full Name *</Label>
            <Input value={form.name} onChange={f("name")} placeholder="Full Name" className="rounded-xl h-11 border-border/60" data-testid="input-addr-name" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Phone *</Label>
            <Input value={form.phone} onChange={f("phone")} placeholder="Phone" type="tel" className="rounded-xl h-11 border-border/60" data-testid="input-addr-phone" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Pincode *</Label>
            <Input value={form.pincode} onChange={f("pincode")} placeholder="Pincode" type="tel" maxLength={6} className="rounded-xl h-11 border-border/60" data-testid="input-addr-pincode" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">State *</Label>
            <Input value={form.state} onChange={f("state")} placeholder="State" className="rounded-xl h-11 border-border/60" data-testid="input-addr-state" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Address *</Label>
          <Input value={form.address} onChange={f("address")} placeholder="Building, Floor, Street" className="rounded-xl h-11 border-border/60" data-testid="input-addr-address" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Locality *</Label>
            <Input value={form.locality} onChange={f("locality")} placeholder="Locality / Area" className="rounded-xl h-11 border-border/60" data-testid="input-addr-locality" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">City *</Label>
            <Input value={form.city} onChange={f("city")} placeholder="City" className="rounded-xl h-11 border-border/60" data-testid="input-addr-city" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Landmark (Optional)</Label>
          <Input value={form.landmark} onChange={f("landmark")} placeholder="Near a landmark" className="rounded-xl h-11 border-border/60" data-testid="input-addr-landmark" />
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Address Type</Label>
          <div className="flex gap-5">
            {(["home", "office", "other"] as const).map(t => (
              <label key={t} className="flex items-center gap-1.5 cursor-pointer text-sm font-medium text-foreground">
                <input type="radio" name="addr-type" value={t} checked={form.type === t} onChange={() => setForm(prev => ({ ...prev, type: t }))} className="accent-primary" data-testid={`radio-addr-type-${t}`} />
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </label>
            ))}
          </div>
        </div>

        {form.type === "other" && (
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Save Address As *</Label>
            <Input value={form.label} onChange={f("label")} placeholder="e.g. Room, Gym, Parents Home" className="rounded-xl h-11 border-border/60" />
          </div>
        )}

        <Button onClick={save} className="w-full h-12 rounded-2xl font-bold bg-primary text-white shadow-lg shadow-primary/20 mt-2" data-testid="button-save-address">
          Save Address
        </Button>
      </div>
    </div>
  );
}
