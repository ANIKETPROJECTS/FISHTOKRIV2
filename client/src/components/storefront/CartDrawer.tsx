import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  CheckCircle2, Minus, Plus, ShoppingBag, Trash2,
  MapPin, Banknote, CreditCard, ChevronRight, ClipboardList
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCreateOrder } from "@/hooks/use-orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import fishImg from "@assets/Gemini_Generated_Image_w6wqkkw6wqkkw6wq_(1)_1772713077919.png";
import prawnsImg from "@assets/Gemini_Generated_Image_5xy0sd5xy0sd5xy0_1772713090650.png";
import chickenImg from "@assets/Gemini_Generated_Image_g0ecb4g0ecb4g0ec_1772713219972.png";
import muttonImg from "@assets/Gemini_Generated_Image_8fq0338fq0338fq0_1772713565349.png";
import masalaImg from "@assets/Gemini_Generated_Image_4e60a64e60a64e60_1772713888468.png";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export interface SavedAddress {
  id: string;
  name: string;
  phone: string;
  pincode: string;
  state: string;
  address: string;
  locality: string;
  city: string;
  landmark: string;
  type: "home" | "office" | "other";
  label: string;
  instructions: string;
}

const DUMMY_ADDRESSES: SavedAddress[] = [
  {
    id: "dummy-1",
    name: "Rahul Sharma",
    phone: "9876543210",
    pincode: "400053",
    state: "Maharashtra",
    address: "Seaview Apartments, Wing B, Flat 402",
    locality: "Lokhandwala Complex",
    city: "Mumbai",
    landmark: "Near D-Mart",
    type: "home",
    label: "Home",
    instructions: "Call before delivery",
  },
  {
    id: "dummy-2",
    name: "Rahul Sharma",
    phone: "9876543210",
    pincode: "400064",
    state: "Maharashtra",
    address: "Tech Park, Tower 3, Floor 5",
    locality: "Marve Road",
    city: "Mumbai",
    landmark: "Opposite Metro Station",
    type: "office",
    label: "Office",
    instructions: "Leave at reception",
  },
];

const addressTypeColors: Record<string, string> = {
  home: "bg-blue-100 text-blue-700",
  office: "bg-purple-100 text-purple-700",
  other: "bg-amber-100 text-amber-700",
};

export function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, updateInstruction, totalPrice, clearCart } = useCart();
  const { mutate: createOrder, isPending } = useCreateOrder();
  const [, navigate] = useLocation();
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [expandedInstructions, setExpandedInstructions] = useState<Record<number, boolean>>({});

  const loadAddresses = () => {
    const stored = localStorage.getItem("fishtokri_addresses");
    let parsed: SavedAddress[] = stored ? JSON.parse(stored) : [];
    if (parsed.length === 0) {
      parsed = DUMMY_ADDRESSES;
      localStorage.setItem("fishtokri_addresses", JSON.stringify(parsed));
    }
    setSavedAddresses(parsed);
    if (parsed.length > 0) setSelectedAddressId(s => s || parsed[0].id);
  };

  useEffect(() => {
    if (isCartOpen) loadAddresses();
  }, [isCartOpen]);

  const getFallbackImage = (category: string) => {
    switch (category) {
      case "Prawns": return prawnsImg;
      case "Chicken": return chickenImg;
      case "Mutton": return muttonImg;
      case "Masalas": return masalaImg;
      case "Combo": return fishImg;
      default: return fishImg;
    }
  };

  const placeOrder = () => {
    const selected = savedAddresses.find(a => a.id === selectedAddressId);
    if (!selected) return;
    const fullAddress = [selected.address, selected.locality, selected.city, selected.state, selected.pincode].filter(Boolean).join(", ");
    const orderItems = items.map(i => ({ productId: i.id, quantity: i.quantity, name: i.name, price: i.price }));
    createOrder(
      { customerName: selected.name, phone: selected.phone, deliveryArea: selected.city, address: fullAddress, notes: selected.instructions, items: orderItems },
      { onSuccess: () => { setIsSuccess(true); clearCart(); } }
    );
  };

  const handleClose = (open: boolean) => {
    if (!open && isSuccess) setTimeout(() => setIsSuccess(false), 300);
    setIsCartOpen(open);
  };

  const savedTotal = items.reduce((acc, item) => {
    const original = Math.round(item.price / 0.9);
    return acc + (original - item.price) * item.quantity;
  }, 0);

  const goAddAddress = () => {
    setIsCartOpen(false);
    navigate("/add-address");
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full bg-white border-l border-border/30 p-0 overflow-hidden font-sans">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Order Placed!</h2>
            <p className="text-muted-foreground text-base mb-8 max-w-[260px]">
              Thank you! We'll contact you shortly to confirm your delivery.
            </p>
            <Button onClick={() => handleClose(false)} size="lg" className="w-full max-w-[220px] rounded-xl font-semibold bg-primary text-white">
              Back to Store
            </Button>
          </div>
        ) : (
          <>
            <SheetHeader className="px-5 py-4 border-b border-border/30 bg-white sticky top-0 z-10">
              <SheetTitle className="flex items-center gap-2 text-xl font-bold text-foreground">
                <ShoppingBag className="w-5 h-5 text-primary" />
                Order Summary
              </SheetTitle>
            </SheetHeader>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
                <ShoppingBag className="w-16 h-16 mb-4 opacity-10" />
                <p className="text-lg font-medium">Your cart is empty</p>
                <p className="text-sm mt-1 mb-6">Add some fresh items to get started</p>
                <Button variant="outline" onClick={() => setIsCartOpen(false)} className="rounded-xl">
                  Continue Browsing
                </Button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto scrollbar-hide">
                  {savedTotal > 0 && (
                    <div className="mx-4 mt-4 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 text-center">
                      <p className="text-emerald-700 text-sm font-semibold">🎉 Congratulations! You've saved ₹{savedTotal}</p>
                    </div>
                  )}

                  <div className="px-4 pt-4 space-y-3">
                    {items.map(item => (
                      <div key={item.id} className="bg-white rounded-2xl border border-border/40 shadow-sm overflow-hidden" data-testid={`cart-item-${item.id}`}>
                        <div className="flex items-center gap-3 p-3">
                          <div className="w-14 h-14 rounded-xl bg-slate-50 overflow-hidden flex-shrink-0 border border-slate-100 p-1 flex items-center justify-center">
                            <img src={item.imageUrl || getFallbackImage(item.category)} alt={item.name} className="w-full h-full object-contain" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground text-sm truncate">{item.name}</h4>
                            <p className="text-xs text-muted-foreground">{item.unit}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm font-bold text-primary">₹{item.price}</span>
                              {!item.isCombo && (
                                <>
                                  <span className="text-xs text-muted-foreground line-through">₹{Math.round(item.price / 0.9)}</span>
                                  <span className="text-[10px] font-semibold text-emerald-600">10% off</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 bg-slate-50 rounded-full px-2 py-1 border border-slate-100">
                            <button className="h-6 w-6 rounded-full hover:bg-white flex items-center justify-center" onClick={() => updateQuantity(item.id, item.quantity - 1)} data-testid={`button-decrease-${item.id}`}>
                              {item.quantity === 1 ? <Trash2 className="w-3 h-3 text-red-500" /> : <Minus className="w-3 h-3 text-slate-600" />}
                            </button>
                            <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
                            <button className="h-6 w-6 rounded-full hover:bg-white flex items-center justify-center" onClick={() => updateQuantity(item.id, item.quantity + 1)} data-testid={`button-increase-${item.id}`}>
                              <Plus className="w-3 h-3 text-slate-600" />
                            </button>
                          </div>
                        </div>
                        {expandedInstructions[item.id] ? (
                          <div className="px-3 pb-3">
                            <Input
                              value={item.instruction || ""}
                              onChange={e => updateInstruction(item.id, e.target.value)}
                              placeholder="e.g. Thin sliced, curry cut, remove skin..."
                              className="h-8 text-xs rounded-lg border-border/50 bg-slate-50"
                              autoFocus
                              data-testid={`input-instruction-${item.id}`}
                            />
                          </div>
                        ) : (
                          <button
                            className="w-full px-3 pb-2.5 flex items-center gap-1.5 text-xs text-primary/70 hover:text-primary font-medium"
                            onClick={() => setExpandedInstructions(p => ({ ...p, [item.id]: true }))}
                            data-testid={`button-add-instruction-${item.id}`}
                          >
                            <ClipboardList className="w-3 h-3" />
                            {item.instruction
                              ? <span className="text-muted-foreground truncate">"{item.instruction}"</span>
                              : "+ Add cooking instructions"}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mx-4 mt-4 border border-dashed border-border/60 rounded-2xl p-4 space-y-2.5">
                    <h3 className="font-semibold text-foreground text-sm mb-3">Bill Details</h3>
                    {items.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground truncate mr-2">{item.name} × {item.quantity}</span>
                        <span className="font-medium flex-shrink-0">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-dashed border-border/40 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">₹{totalPrice}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Delivery fee</span>
                        <span className="font-semibold text-emerald-600">FREE</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-border/40 flex justify-between items-center">
                      <span className="font-bold text-foreground">Total</span>
                      <span className="text-lg font-bold text-primary">₹{totalPrice}</span>
                    </div>
                  </div>

                  <div className="px-4 mt-5 mb-2">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-primary" /> Shipping Address
                      </h3>
                      <Button size="sm" onClick={goAddAddress} className="rounded-full h-8 px-3 text-xs bg-primary text-white gap-1">
                        <Plus className="w-3 h-3" /> Add Address
                      </Button>
                    </div>

                    {savedAddresses.length === 0 ? (
                      <button onClick={goAddAddress} className="w-full border-2 border-dashed border-border/50 rounded-2xl p-4 text-center text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors">
                        <MapPin className="w-6 h-6 mx-auto mb-1 opacity-40" />
                        <p className="text-sm font-medium">+ Add delivery address</p>
                      </button>
                    ) : (
                      <div className="space-y-2">
                        {savedAddresses.map(addr => (
                          <button
                            key={addr.id}
                            type="button"
                            onClick={() => setSelectedAddressId(addr.id)}
                            className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all ${selectedAddressId === addr.id ? "border-primary bg-primary/5" : "border-border/40 bg-white hover:border-primary/30"}`}
                            data-testid={`address-option-${addr.id}`}
                          >
                            <div className="flex items-start gap-2.5">
                              <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedAddressId === addr.id ? "border-primary" : "border-slate-300"}`}>
                                {selectedAddressId === addr.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="font-semibold text-sm text-foreground">{addr.name}</span>
                                  <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full ${addressTypeColors[addr.type] || "bg-slate-100 text-slate-500"}`}>
                                    {addr.label}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground">{addr.phone}</p>
                                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                                  {[addr.address, addr.locality, addr.city, addr.state, addr.pincode].filter(Boolean).join(", ")}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="px-4 mt-5 mb-4 space-y-3">
                    <h3 className="font-semibold text-foreground text-sm">Payment Method</h3>
                    <div className="space-y-2">
                      {[
                        { value: "cod", icon: <Banknote className="w-4 h-4 text-muted-foreground" />, label: "Cash on Delivery" },
                        { value: "online", icon: <CreditCard className="w-4 h-4 text-muted-foreground" />, label: "PhonePe / UPI / Cards / Net Banking" },
                      ].map(opt => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setPaymentMethod(opt.value as "cod" | "online")}
                          className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left ${paymentMethod === opt.value ? "border-primary bg-primary/5" : "border-border/40 bg-white hover:border-primary/30"}`}
                          data-testid={`payment-${opt.value}`}
                        >
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === opt.value ? "border-primary" : "border-slate-300"}`}>
                            {paymentMethod === opt.value && <div className="w-2 h-2 rounded-full bg-primary" />}
                          </div>
                          {opt.icon}
                          <span className="text-sm font-medium text-foreground">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-4 py-4 border-t border-border/30 bg-white sticky bottom-0 z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Total</p>
                      <p className="text-xl font-bold text-primary">₹{totalPrice}</p>
                    </div>
                    <Button
                      onClick={placeOrder}
                      disabled={isPending || savedAddresses.length === 0}
                      className="h-12 px-8 rounded-xl font-bold bg-primary text-white hover:bg-primary/95 shadow-lg shadow-primary/20 flex items-center gap-2"
                      data-testid="button-place-order"
                    >
                      {isPending ? "Placing..." : <>Proceed <ChevronRight className="w-4 h-4" /></>}
                    </Button>
                  </div>
                  {savedAddresses.length === 0 && (
                    <p className="text-xs text-center text-muted-foreground mt-2">Please add a delivery address to proceed</p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
