import { useParams } from "wouter";
import { useCart } from "@/context/CartContext";
import { Header } from "@/components/storefront/Header";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Tag, ShoppingBag, Check } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import fishImg from "@assets/Gemini_Generated_Image_w6wqkkw6wqkkw6wq_(1)_1772713077919.png";
import prawnsImg from "@assets/Gemini_Generated_Image_5xy0sd5xy0sd5xy0_1772713090650.png";
import chickenImg from "@assets/Gemini_Generated_Image_g0ecb4g0ecb4g0ec_1772713219972.png";
import muttonImg from "@assets/Gemini_Generated_Image_8fq0338fq0338fq0_1772713565349.png";
import masalaImg from "@assets/Gemini_Generated_Image_4e60a64e60a64e60_1772713888468.png";

export const COMBOS_DATA = [
  {
    id: "c1",
    cartId: -1001,
    name: "Sea Treasure Pack",
    description: "Silver Pomfret 500g + White Prawns 500g",
    fullDescription: "A premium seafood combo featuring freshly cleaned Silver Pomfret (500g) and White Prawns (500g). Both are cleaned and ready to cook. Perfect for a family meal.",
    originalPrice: 1900,
    discountedPrice: 1599,
    discount: 16,
    serves: "3–4 people",
    weight: "1 kg total",
    images: [fishImg, prawnsImg],
    includes: ["Silver Pomfret 500g – cleaned & cut", "White Prawns 500g – deveined"],
    tags: ["Bestseller", "Fresh"],
  },
  {
    id: "c2",
    cartId: -1002,
    name: "Family Feast Combo",
    description: "Chicken Curry Cut 1kg + Goat Curry Cut 500g",
    fullDescription: "The ultimate non-veg feast combo. Includes Chicken Curry Cut (1kg) for a rich, hearty curry and Goat Curry Cut (500g) for a special mutton dish. Both are cleaned and ready to marinate.",
    originalPrice: 1100,
    discountedPrice: 899,
    discount: 18,
    serves: "4–5 people",
    weight: "1.5 kg total",
    images: [chickenImg, muttonImg],
    includes: ["Chicken Curry Cut 1kg – cleaned", "Goat Curry Cut 500g – cleaned"],
    tags: ["Family Size", "Value"],
  },
  {
    id: "c3",
    cartId: -1003,
    name: "Weekend Special",
    description: "Surmai 500g + Tiger Prawns 250g + Masala",
    fullDescription: "Make your weekend extra special with premium Surmai (King Fish) and Tiger Prawns paired with our special Koliwada Masala. A complete meal experience.",
    originalPrice: 2200,
    discountedPrice: 1799,
    discount: 18,
    serves: "3–4 people",
    weight: "~800g + masala",
    images: [fishImg, prawnsImg, masalaImg],
    includes: ["Surmai 500g – steaked", "Tiger Prawns 250g – deveined", "Koliwada Masala 1 pack"],
    tags: ["Premium", "Weekend Pick"],
  },
  {
    id: "c4",
    cartId: -1004,
    name: "Quick Meal Combo",
    description: "Chicken Boneless 500g + Fish Fry Masala",
    fullDescription: "Perfect for a quick weekday meal. Boneless chicken cubes (500g) paired with our signature Fish Fry Masala. Ready in under 20 minutes!",
    originalPrice: 500,
    discountedPrice: 399,
    discount: 20,
    serves: "2–3 people",
    weight: "~550g",
    images: [chickenImg, masalaImg],
    includes: ["Chicken Boneless Cubes 500g", "Fish Fry Masala 1 pack"],
    tags: ["Quick", "Weekday"],
  },
  {
    id: "c5",
    cartId: -1005,
    name: "Prawns Delight",
    description: "Tiger Prawns 500g + Koliwada Masala",
    fullDescription: "Indulge in the finest Tiger Prawns (500g) paired with our popular Koliwada Masala. Perfect for a coastal-style prawn fry or curry.",
    originalPrice: 1370,
    discountedPrice: 1099,
    discount: 20,
    serves: "2–3 people",
    weight: "~520g",
    images: [prawnsImg, masalaImg],
    includes: ["Tiger Prawns 500g – cleaned & deveined", "Koliwada Masala 1 pack"],
    tags: ["Popular", "Coastal Style"],
  },
];

export default function ComboDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { addToCart, setIsCartOpen } = useCart();
  const [added, setAdded] = useState(false);

  const combo = COMBOS_DATA.find(c => c.id === id);
  if (!combo) return <div className="p-8 text-center text-muted-foreground">Combo not found.</div>;

  const handleAddToCart = () => {
    addToCart({
      id: combo.cartId,
      name: combo.name,
      price: combo.discountedPrice,
      category: "Combo",
      status: "available",
      unit: combo.weight,
      imageUrl: null,
      isArchived: false,
      updatedAt: new Date(),
      limitedStockNote: null,
      isCombo: true,
    } as any);
    setAdded(true);
    setTimeout(() => { setAdded(false); setIsCartOpen(true); }, 800);
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="sticky top-0 z-50 bg-white border-b border-border/30 px-4 py-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1 as any)} className="rounded-full border border-border/40">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold text-foreground flex-1 truncate">{combo.name}</h1>
        <span className="text-xs font-bold text-white bg-accent px-3 py-1 rounded-full">{combo.discount}% OFF</span>
      </div>

      {/* Stacked Images */}
      <div className="bg-slate-50 py-10 flex flex-col items-center">
        <div className="flex items-center justify-center">
          {combo.images.map((img, i) => (
            <div
              key={i}
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg"
              style={{ marginLeft: i > 0 ? -32 : 0, zIndex: combo.images.length - i }}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-6 flex-wrap justify-center px-4">
          {combo.tags.map(tag => (
            <span key={tag} className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">{tag}</span>
          ))}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Title and price */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">{combo.name}</h2>
          <p className="text-sm text-muted-foreground mt-1">{combo.description}</p>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-3xl font-bold text-primary">₹{combo.discountedPrice}</span>
            <span className="text-lg text-muted-foreground line-through">₹{combo.originalPrice}</span>
            <span className="text-sm font-bold text-emerald-600">Save ₹{combo.originalPrice - combo.discountedPrice}</span>
          </div>
          <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
            <span>🍽 Serves {combo.serves}</span>
            <span>⚖️ {combo.weight}</span>
          </div>
        </div>

        {/* About */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <h3 className="text-sm font-bold text-foreground mb-2">About This Combo</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{combo.fullDescription}</p>
        </div>

        {/* What's Included */}
        <div>
          <h3 className="text-sm font-bold text-foreground mb-3">What's Included</h3>
          <div className="space-y-2">
            {combo.includes.map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm font-medium text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Savings note */}
        <div className="flex items-center gap-3 bg-accent/5 border border-accent/20 rounded-2xl p-4">
          <Tag className="w-5 h-5 text-accent flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">You save ₹{combo.originalPrice - combo.discountedPrice} ({combo.discount}% off)</p>
            <p className="text-xs text-muted-foreground">vs buying each item separately</p>
          </div>
        </div>
      </div>

      {/* Sticky Add to Cart */}
      <div className="sticky bottom-0 bg-white border-t border-border/30 px-4 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <Button
          onClick={handleAddToCart}
          className={`w-full h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
            added ? "bg-emerald-500 text-white" : "bg-primary text-white shadow-lg shadow-primary/20"
          }`}
          data-testid="button-add-combo-to-cart"
        >
          {added ? (
            <><Check className="w-5 h-5" /> Added to Order!</>
          ) : (
            <><ShoppingBag className="w-5 h-5" /> Add Combo — ₹{combo.discountedPrice}</>
          )}
        </Button>
      </div>
      <CartDrawer />
    </div>
  );
}
