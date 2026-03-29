import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/storefront/Header";
import { CartDrawer, type SavedAddress } from "@/components/storefront/CartDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { OrderRequest } from "@shared/schema";
import {
  User, MapPin, Plus, Pencil, Trash2,
  CheckCircle2, ChevronLeft, Home, Briefcase, Tag, Navigation,
  ShoppingBag, Clock, Truck, PackageCheck, ChevronDown, ChevronUp,
  Receipt, Package, AlertCircle
} from "lucide-react";

interface ProfileData {
  name: string;
  phone: string;
  email: string;
  dob: string;
}

interface OrderItem {
  productId: number;
  quantity: number;
  name: string;
  price: number;
}

const TYPE_OPTIONS = [
  { value: "house" as const, icon: <Home className="w-3.5 h-3.5" />, label: "House" },
  { value: "office" as const, icon: <Briefcase className="w-3.5 h-3.5" />, label: "Office" },
  { value: "other" as const, icon: <Tag className="w-3.5 h-3.5" />, label: "Other" },
];

const addressTypeColors: Record<string, string> = {
  house: "bg-pink-100 text-pink-700",
  office: "bg-purple-100 text-purple-700",
  other: "bg-amber-100 text-amber-700",
};

const emptyAddress: Omit<SavedAddress, "id"> = {
  name: "", phone: "", building: "", street: "", area: "",
  pincode: "", type: "house", label: "Home", instructions: "",
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending:          { label: "Order Placed",      color: "bg-yellow-100 text-yellow-700 border-yellow-200",  icon: <Clock className="w-3.5 h-3.5" /> },
  confirmed:        { label: "Confirmed",          color: "bg-blue-100 text-blue-700 border-blue-200",        icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  out_for_delivery: { label: "Out for Delivery",   color: "bg-orange-100 text-orange-700 border-orange-200",  icon: <Truck className="w-3.5 h-3.5" /> },
  delivered:        { label: "Delivered",          color: "bg-green-100 text-green-700 border-green-200",     icon: <PackageCheck className="w-3.5 h-3.5" /> },
  cancelled:        { label: "Cancelled",          color: "bg-red-100 text-red-700 border-red-200",           icon: <AlertCircle className="w-3.5 h-3.5" /> },
};

const DEMO_ORDERS = [
  {
    id: 1001,
    customerName: "Rahul Sharma",
    phone: "9876543210",
    deliveryArea: "Thane West",
    address: "Wing B, Flat 402, Shree Nagar CHS, Gokhale Road",
    items: [
      { productId: 1, quantity: 1, name: "Silver Pomfret", price: 1200 },
      { productId: 2, quantity: 1, name: "White Prawn 500g", price: 700 },
    ],
    status: "out_for_delivery",
    notes: "Please clean and cut the fish",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 1002,
    customerName: "Rahul Sharma",
    phone: "9876543210",
    deliveryArea: "Thane West",
    address: "Wing B, Flat 402, Shree Nagar CHS, Gokhale Road",
    items: [
      { productId: 3, quantity: 1, name: "Chicken Curry Cut", price: 250 },
      { productId: 4, quantity: 1, name: "Goat Curry Cut", price: 850 },
      { productId: 5, quantity: 2, name: "Fish Curry Masala", price: 50 },
    ],
    status: "confirmed",
    notes: null,
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: 1003,
    customerName: "Rahul Sharma",
    phone: "9876543210",
    deliveryArea: "Thane West",
    address: "Wing B, Flat 402, Shree Nagar CHS, Gokhale Road",
    items: [
      { productId: 6, quantity: 1, name: "Surmai (King Fish)", price: 900 },
      { productId: 7, quantity: 1, name: "Tiger Prawn", price: 1200 },
      { productId: 8, quantity: 1, name: "Goat Biryani Cut", price: 850 },
    ],
    status: "delivered",
    notes: null,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: 1004,
    customerName: "Rahul Sharma",
    phone: "9876543210",
    deliveryArea: "Thane West",
    address: "Wing B, Flat 402, Shree Nagar CHS, Gokhale Road",
    items: [
      { productId: 9, quantity: 2, name: "Rawas (Indian Salmon)", price: 950 },
      { productId: 10, quantity: 1, name: "Lobsters", price: 2500 },
    ],
    status: "delivered",
    notes: "Deliver before 10am please",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: 1005,
    customerName: "Rahul Sharma",
    phone: "9876543210",
    deliveryArea: "Thane West",
    address: "Wing B, Flat 402, Shree Nagar CHS, Gokhale Road",
    items: [
      { productId: 11, quantity: 1, name: "Black Pomfret", price: 1100 },
      { productId: 12, quantity: 1, name: "Chicken Boneless Cubes", price: 400 },
      { productId: 13, quantity: 3, name: "Fish Fry Masala", price: 50 },
      { productId: 14, quantity: 1, name: "Goat Kheema", price: 950 },
    ],
    status: "delivered",
    notes: null,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  },
];

const TABS = ["Profile & Addresses", "My Orders"] as const;
type Tab = typeof TABS[number];
type OrdersSubTab = "current" | "previous";

function OrderCard({ order }: { order: OrderRequest }) {
  const [expanded, setExpanded] = useState(false);
  const items: OrderItem[] = Array.isArray(order.items) ? order.items as OrderItem[] : [];
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = subtotal >= 500 ? 0 : 49;
  const total = subtotal + deliveryFee;
  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
  }) : "";

  return (
    <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden" data-testid={`card-order-${order.id}`}>
      {/* Order header */}
      <div className="px-4 py-3 flex items-center justify-between gap-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Package className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground">Order #{order.id}</p>
            <p className="text-xs text-muted-foreground">{date}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-semibold shrink-0 ${status.color}`}>
          {status.icon}
          {status.label}
        </div>
      </div>

      {/* Items summary */}
      <div className="px-4 py-3 space-y-1.5">
        {items.slice(0, expanded ? items.length : 2).map((item, i) => (
          <div key={i} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-xs flex items-center justify-center text-muted-foreground font-semibold flex-shrink-0">
                {item.quantity}
              </span>
              <span className="text-sm text-foreground truncate">{item.name}</span>
            </div>
            <span className="text-sm font-semibold text-foreground shrink-0">₹{(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
        {!expanded && items.length > 2 && (
          <p className="text-xs text-muted-foreground">+{items.length - 2} more item{items.length - 2 > 1 ? "s" : ""}</p>
        )}
      </div>

      {/* Delivery address */}
      <div className="px-4 pb-3 flex items-start gap-2">
        <MapPin className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">{order.address}, {order.deliveryArea}</p>
      </div>

      {/* Total row + expand */}
      <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="text-base font-bold text-foreground">₹{total.toLocaleString()}</span>
        </div>
        <button
          onClick={() => setExpanded(v => !v)}
          className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
          data-testid={`button-invoice-${order.id}`}
        >
          <Receipt className="w-3.5 h-3.5" />
          {expanded ? "Hide Invoice" : "View Invoice"}
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Invoice detail */}
      {expanded && (
        <div className="border-t border-slate-100">
          <div className="px-4 py-4 space-y-3">
            {/* Invoice header */}
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-xs font-bold text-foreground uppercase tracking-widest">Tax Invoice</p>
                <p className="text-[11px] text-muted-foreground">FishTokri · Mumbai</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-foreground">#{String(order.id).padStart(6, "0")}</p>
                <p className="text-[11px] text-muted-foreground">{date}</p>
              </div>
            </div>

            {/* Bill to */}
            <div className="bg-slate-50 rounded-xl p-3 space-y-0.5">
              <p className="text-[11px] text-muted-foreground uppercase font-semibold tracking-wide">Bill To</p>
              <p className="text-sm font-semibold text-foreground">{order.customerName}</p>
              <p className="text-xs text-muted-foreground">{order.phone}</p>
              <p className="text-xs text-muted-foreground">{order.address}, {order.deliveryArea}</p>
            </div>

            {/* Items table */}
            <div>
              <div className="flex text-[11px] font-semibold text-muted-foreground uppercase tracking-wide pb-1.5 border-b border-slate-100">
                <span className="flex-1">Item</span>
                <span className="w-10 text-center">Qty</span>
                <span className="w-20 text-right">Rate</span>
                <span className="w-20 text-right">Amount</span>
              </div>
              <div className="space-y-0">
                {items.map((item, i) => (
                  <div key={i} className="flex items-center py-2 border-b border-slate-50 text-sm">
                    <span className="flex-1 text-foreground">{item.name}</span>
                    <span className="w-10 text-center text-muted-foreground">{item.quantity}</span>
                    <span className="w-20 text-right text-muted-foreground">₹{item.price.toLocaleString()}</span>
                    <span className="w-20 text-right font-semibold text-foreground">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? <span className="text-green-600">FREE</span> : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>GST (5%)</span>
                <span>Included</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-foreground pt-2 border-t border-slate-200">
                <span>Total Paid</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="bg-amber-50 rounded-lg p-2.5">
                <p className="text-[11px] font-semibold text-amber-700 mb-0.5">Order Notes</p>
                <p className="text-xs text-amber-600">{order.notes}</p>
              </div>
            )}

            <p className="text-[11px] text-center text-muted-foreground pt-1">Thank you for shopping with FishTokri! 🐟</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Profile() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>("Profile & Addresses");
  const [ordersSubTab, setOrdersSubTab] = useState<OrdersSubTab>("current");

  const [profile, setProfile] = useState<ProfileData>({ name: "", phone: "", email: "", dob: "" });
  const [editingProfile, setEditingProfile] = useState(false);
  const [draftProfile, setDraftProfile] = useState<ProfileData>(profile);

  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);
  const [addressForm, setAddressForm] = useState<Omit<SavedAddress, "id">>(emptyAddress);
  const [useAccountDetails, setUseAccountDetails] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("fishtokri_profile");
    if (saved) { const p = JSON.parse(saved); setProfile(p); setDraftProfile(p); }
    const savedAddr = localStorage.getItem("fishtokri_addresses");
    if (savedAddr) setAddresses(JSON.parse(savedAddr));
  }, []);

  // Fetch orders by phone
  const { data: orders, isLoading: ordersLoading } = useQuery<OrderRequest[]>({
    queryKey: ["/api/orders/by-phone", profile.phone],
    queryFn: async () => {
      if (!profile.phone) return [];
      const res = await fetch(`/api/orders/by-phone/${encodeURIComponent(profile.phone)}`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!profile.phone && activeTab === "My Orders",
  });

  const allOrders = [...(orders || []), ...(DEMO_ORDERS as any[])];
  const currentOrders = allOrders.filter(o => ["pending", "confirmed", "out_for_delivery"].includes(o.status));
  const previousOrders = allOrders.filter(o => ["delivered", "cancelled"].includes(o.status));

  const saveProfile = () => {
    setProfile(draftProfile);
    localStorage.setItem("fishtokri_profile", JSON.stringify(draftProfile));
    setEditingProfile(false);
    toast({ title: "Profile updated" });
  };

  const openAddForm = () => {
    setEditingAddress(null);
    setAddressForm(emptyAddress);
    setUseAccountDetails(false);
    setShowAddressForm(true);
  };

  const openEditForm = (addr: SavedAddress) => {
    setEditingAddress(addr);
    setAddressForm({
      name: addr.name, phone: addr.phone, building: addr.building,
      street: addr.street, area: addr.area, pincode: addr.pincode || "",
      type: addr.type, label: addr.label, instructions: addr.instructions,
    });
    setUseAccountDetails(false);
    setShowAddressForm(true);
  };

  const cancelForm = () => {
    setShowAddressForm(false);
    setEditingAddress(null);
    setAddressForm(emptyAddress);
    setUseAccountDetails(false);
  };

  const handleUseAccountDetails = (v: boolean) => {
    setUseAccountDetails(v);
    if (v) setAddressForm(f => ({ ...f, name: profile.name, phone: profile.phone }));
  };

  const saveAddress = () => {
    if (!addressForm.name || !addressForm.phone || !addressForm.building || !addressForm.area) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    const label = addressForm.type === "other"
      ? (addressForm.label || "Other")
      : addressForm.type === "house" ? "Home" : "Office";
    const entry: SavedAddress = {
      ...addressForm, label,
      id: editingAddress ? editingAddress.id : Date.now().toString(),
    };
    const updated = editingAddress
      ? addresses.map(a => a.id === editingAddress.id ? entry : a)
      : [...addresses, entry];
    setAddresses(updated);
    localStorage.setItem("fishtokri_addresses", JSON.stringify(updated));
    setShowAddressForm(false);
    setEditingAddress(null);
    setAddressForm(emptyAddress);
    toast({ title: editingAddress ? "Address updated" : "Address added" });
  };

  const deleteAddress = (id: string) => {
    const updated = addresses.filter(a => a.id !== id);
    setAddresses(updated);
    localStorage.setItem("fishtokri_addresses", JSON.stringify(updated));
    toast({ title: "Address removed" });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Back + Title */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="rounded-full border border-border/50 bg-white">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl p-1 border border-border/40 shadow-sm mb-6">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-testid={`tab-${tab.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {tab === "Profile & Addresses" && <User className="w-3.5 h-3.5" />}
              {tab === "My Orders" && <ShoppingBag className="w-3.5 h-3.5" />}
              {tab}
            </button>
          ))}
        </div>

        {/* ── Profile & Addresses Tab ── */}
        {activeTab === "Profile & Addresses" && (
          <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-border/50 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-foreground" />
                <h2 className="text-base font-bold text-foreground">Profile Details</h2>
              </div>
              {!editingProfile && (
                <Button variant="ghost" size="icon" onClick={() => { setDraftProfile(profile); setEditingProfile(true); }} className="rounded-full text-muted-foreground hover:text-primary" data-testid="button-edit-profile">
                  <Pencil className="w-4 h-4" />
                </Button>
              )}
            </div>

            {editingProfile ? (
              <div className="space-y-3">
                {([
                  { field: "name" as const, label: "Full Name", placeholder: "Your name" },
                  { field: "phone" as const, label: "Phone Number", placeholder: "+91 00000 00000" },
                  { field: "email" as const, label: "Email", placeholder: "you@example.com" },
                ] as const).map(({ field, label, placeholder }) => (
                  <div key={field} className="space-y-1">
                    <Label className="text-xs text-muted-foreground">{label}</Label>
                    <Input value={draftProfile[field]} onChange={e => setDraftProfile(p => ({ ...p, [field]: e.target.value }))} placeholder={placeholder} className="rounded-xl border-border/60" data-testid={`input-profile-${field}`} />
                  </div>
                ))}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Date of Birth</Label>
                  <Input type="date" value={draftProfile.dob} onChange={e => setDraftProfile(p => ({ ...p, dob: e.target.value }))} className="rounded-xl border-border/60" data-testid="input-profile-dob" />
                </div>
                <div className="flex gap-2 pt-1">
                  <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setEditingProfile(false)}>Cancel</Button>
                  <Button className="flex-1 rounded-xl bg-primary text-white" onClick={saveProfile} data-testid="button-save-profile">Save</Button>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {[
                  { label: "Phone", value: profile.phone, verified: !!profile.phone },
                  { label: "Name", value: profile.name },
                  { label: "Email", value: profile.email },
                  {
                    label: "Date of Birth",
                    value: profile.dob
                      ? new Date(profile.dob).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" })
                      : "",
                  },
                ].map(({ label, value, verified }) => (
                  <div key={label} className="py-3">
                    <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                    {value
                      ? <p className="font-bold text-foreground">{value}</p>
                      : <p className="font-normal italic text-muted-foreground text-sm">Not set</p>}
                    {verified && <p className="text-xs text-emerald-600 flex items-center gap-1 mt-0.5"><CheckCircle2 className="w-3 h-3" /> Verified</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Addresses section — inside Profile & Addresses tab */}
          <div className="bg-white rounded-2xl border border-border/50 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-foreground" />
                <h2 className="text-base font-bold text-foreground">Saved Addresses</h2>
              </div>
              {!showAddressForm ? (
                <Button onClick={openAddForm} size="sm" className="rounded-full bg-primary text-white text-xs px-4 gap-1 h-8 hover:bg-primary/90" data-testid="button-add-address">
                  <Plus className="w-3.5 h-3.5" /> Add New
                </Button>
              ) : (
                <Button variant="ghost" size="sm" onClick={cancelForm} className="text-muted-foreground hover:text-foreground text-xs h-8 rounded-full" data-testid="button-cancel-address">
                  Cancel
                </Button>
              )}
            </div>

            {showAddressForm && (
              <div className="mb-5 pb-5 border-b border-border/30 space-y-4">
                <p className="text-sm font-semibold">{editingAddress ? "Edit Address" : "Add New Address"}</p>
                {profile.name && (
                  <div className="flex items-start gap-3 bg-slate-50 rounded-xl p-3 border border-border/40">
                    <Checkbox id="use-account-profile" checked={useAccountDetails} onCheckedChange={v => handleUseAccountDetails(!!v)} className="mt-0.5" />
                    <div>
                      <label htmlFor="use-account-profile" className="text-sm font-semibold cursor-pointer">Use my account details</label>
                      <p className="text-xs text-muted-foreground mt-0.5">{profile.name}{profile.phone && `, ${profile.phone}`}</p>
                    </div>
                  </div>
                )}
                {!useAccountDetails && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Full Name *</Label>
                      <Input value={addressForm.name} onChange={e => setAddressForm(f => ({ ...f, name: e.target.value }))} placeholder="Recipient name" className="rounded-xl border-border/60" data-testid="input-addr-name" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Phone *</Label>
                      <Input value={addressForm.phone} onChange={e => setAddressForm(f => ({ ...f, phone: e.target.value }))} placeholder="10-digit mobile" className="rounded-xl border-border/60" data-testid="input-addr-phone" />
                    </div>
                  </div>
                )}
                <div className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Navigation className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold">Set your location on map</p>
                    <p className="text-xs text-muted-foreground">Tap to pin your exact delivery location</p>
                  </div>
                  <Button type="button" variant="outline" size="sm" className="rounded-lg border-primary/30 text-primary text-xs shrink-0 h-7 px-3">Open Map</Button>
                </div>
                <div className="flex gap-2">
                  {TYPE_OPTIONS.map(opt => (
                    <button key={opt.value} type="button" onClick={() => setAddressForm(f => ({ ...f, type: opt.value }))}
                      className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-medium border-2 transition-all ${
                        addressForm.type === opt.value ? "bg-foreground text-white border-foreground" : "bg-white text-muted-foreground border-border/50 hover:border-foreground/30"
                      }`}>
                      {opt.icon} {opt.label}
                    </button>
                  ))}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Building / Floor *</Label>
                  <Input value={addressForm.building} onChange={e => setAddressForm(f => ({ ...f, building: e.target.value }))} placeholder="e.g. Kairali Park, Wing A, Floor 3" className="rounded-xl border-border/60" data-testid="input-addr-building" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Street</Label>
                  <Input value={addressForm.street} onChange={e => setAddressForm(f => ({ ...f, street: e.target.value }))} placeholder="e.g. 205, MG Road" className="rounded-xl border-border/60" data-testid="input-addr-street" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Area *</Label>
                    <Input value={addressForm.area} onChange={e => setAddressForm(f => ({ ...f, area: e.target.value }))} placeholder="e.g. Thane West" className="rounded-xl border-border/60" data-testid="input-addr-area" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Pincode</Label>
                    <Input value={addressForm.pincode} onChange={e => setAddressForm(f => ({ ...f, pincode: e.target.value }))} placeholder="400001" type="tel" maxLength={6} className="rounded-xl border-border/60" data-testid="input-addr-pincode" />
                  </div>
                </div>
                {addressForm.type === "other" && (
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Save address as *</Label>
                    <Input value={addressForm.label} onChange={e => setAddressForm(f => ({ ...f, label: e.target.value }))} placeholder="e.g. Room, Gym, Parents Home" className="rounded-xl border-border/60" />
                  </div>
                )}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Delivery Instructions</Label>
                  <Textarea value={addressForm.instructions} onChange={e => setAddressForm(f => ({ ...f, instructions: e.target.value }))} placeholder="Instructions to reach (e.g. Take the first left near red gate)" className="rounded-xl border-border/60 resize-none min-h-[64px] text-sm" maxLength={100} />
                  <p className="text-right text-xs text-muted-foreground">{(addressForm.instructions || "").length}/100</p>
                </div>
                <Button onClick={saveAddress} className="rounded-xl bg-primary text-white px-6 h-9 text-sm font-semibold" data-testid="button-save-address">
                  {editingAddress ? "Update Address" : "Save Address"}
                </Button>
              </div>
            )}

            {addresses.length === 0 && !showAddressForm ? (
              <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                <MapPin className="w-10 h-10 mb-3 opacity-20" />
                <p className="text-sm">No saved addresses yet</p>
                <Button variant="link" onClick={openAddForm} className="mt-1 text-primary text-sm">+ Add your first address</Button>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map(addr => (
                  <div key={addr.id} className="bg-slate-50 border border-slate-100 rounded-xl p-4" data-testid={`card-address-${addr.id}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{addr.name}</span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${addressTypeColors[addr.type] || "bg-slate-100 text-slate-600"}`}>{addr.label}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{addr.phone}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                          {[addr.building, addr.street, addr.area, addr.pincode].filter(Boolean).join(", ")}
                        </p>
                        {addr.instructions && <p className="text-xs text-muted-foreground/70 italic mt-1">"{addr.instructions}"</p>}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button variant="outline" size="sm" className="h-7 px-3 rounded-lg border-slate-200 text-muted-foreground hover:text-primary hover:border-primary/30 text-xs" onClick={() => openEditForm(addr)} data-testid={`button-edit-address-${addr.id}`}>Edit</Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-muted-foreground hover:text-red-500" onClick={() => deleteAddress(addr.id)} data-testid={`button-delete-address-${addr.id}`}><Trash2 className="w-3.5 h-3.5" /></Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          </div>
        )}

        {/* ── My Orders Tab ── */}
        {activeTab === "My Orders" && (
          <div className="space-y-4">
            {/* Sub-tabs */}
            <div className="flex gap-1 bg-white rounded-2xl p-1 border border-border/40 shadow-sm">
              <button
                onClick={() => setOrdersSubTab("current")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition-all ${ordersSubTab === "current" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                data-testid="tab-current-orders"
              >
                <div className={`w-1.5 h-1.5 rounded-full ${ordersSubTab === "current" ? "bg-white animate-pulse" : "bg-orange-400 animate-pulse"}`} />
                Current Orders
                {currentOrders.length > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${ordersSubTab === "current" ? "bg-white/20 text-white" : "bg-orange-100 text-orange-700"}`}>{currentOrders.length}</span>
                )}
              </button>
              <button
                onClick={() => setOrdersSubTab("previous")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition-all ${ordersSubTab === "previous" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                data-testid="tab-previous-orders"
              >
                <PackageCheck className="w-3.5 h-3.5" />
                Previous Orders
                {previousOrders.length > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${ordersSubTab === "previous" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>{previousOrders.length}</span>
                )}
              </button>
            </div>

            {ordersLoading ? (
              <div className="space-y-4">
                {[1, 2].map(i => <Skeleton key={i} className="h-40 rounded-2xl" />)}
              </div>
            ) : ordersSubTab === "current" ? (
              currentOrders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-border/40 p-8 text-center">
                  <ShoppingBag className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-20" />
                  <p className="text-sm font-medium text-muted-foreground">No active orders right now</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Orders you place will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentOrders.map(order => <OrderCard key={order.id} order={order} />)}
                </div>
              )
            ) : (
              previousOrders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-border/40 p-8 text-center">
                  <PackageCheck className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-20" />
                  <p className="text-sm font-medium text-muted-foreground">No previous orders yet</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Completed & cancelled orders show here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {previousOrders.map(order => <OrderCard key={order.id} order={order} />)}
                </div>
              )
            )}
          </div>
        )}
      </main>
      <CartDrawer />
    </div>
  );
}
