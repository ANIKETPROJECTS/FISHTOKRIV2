import { useParams, useLocation } from "wouter";
import { useCart } from "@/context/CartContext";
import { Header } from "@/components/storefront/Header";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Tag, ShoppingBag, Check, Flame, Utensils } from "lucide-react";
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
    nutrition: [
      { label: "Calories", value: "180 kcal", icon: "🔥" },
      { label: "Protein", value: "28g", icon: "💪" },
      { label: "Fat", value: "6g", icon: "🫙" },
      { label: "Omega-3", value: "High", icon: "🐟" },
      { label: "Sodium", value: "75mg", icon: "🧂" },
      { label: "Iron", value: "2mg", icon: "⚡" },
    ],
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
    nutrition: [
      { label: "Calories", value: "220 kcal", icon: "🔥" },
      { label: "Protein", value: "32g", icon: "💪" },
      { label: "Fat", value: "10g", icon: "🫙" },
      { label: "Calcium", value: "18mg", icon: "🦴" },
      { label: "Sodium", value: "95mg", icon: "🧂" },
      { label: "Iron", value: "3mg", icon: "⚡" },
    ],
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
    nutrition: [
      { label: "Calories", value: "195 kcal", icon: "🔥" },
      { label: "Protein", value: "30g", icon: "💪" },
      { label: "Fat", value: "7g", icon: "🫙" },
      { label: "Omega-3", value: "Very High", icon: "🐟" },
      { label: "Sodium", value: "80mg", icon: "🧂" },
      { label: "Iron", value: "2.5mg", icon: "⚡" },
    ],
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
    nutrition: [
      { label: "Calories", value: "165 kcal", icon: "🔥" },
      { label: "Protein", value: "27g", icon: "💪" },
      { label: "Fat", value: "4g", icon: "🫙" },
      { label: "Carbs", value: "3g", icon: "🌾" },
      { label: "Sodium", value: "65mg", icon: "🧂" },
      { label: "Iron", value: "1.5mg", icon: "⚡" },
    ],
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
    nutrition: [
      { label: "Calories", value: "150 kcal", icon: "🔥" },
      { label: "Protein", value: "26g", icon: "💪" },
      { label: "Fat", value: "3g", icon: "🫙" },
      { label: "Omega-3", value: "High", icon: "🐟" },
      { label: "Sodium", value: "90mg", icon: "🧂" },
      { label: "Iron", value: "2mg", icon: "⚡" },
    ],
  },
];

export default function ComboDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { addToCart, setIsCartOpen } = useCart();
  const [added, setAdded] = useState(false);

  const combo = COMBOS_DATA.find(c => c.id === id);
  if (!combo) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <Header />
      <p className="text-muted-foreground text-lg">Combo not found.</p>
      <Button onClick={() => navigate("/")}>Go Home</Button>
      <CartDrawer />
    </div>
  );

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
    <div className="min-h-screen bg-background font-sans">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Back */}
        <button
          onClick={() => navigate("/" as any)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to store
        </button>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14">
          {/* LEFT – Stacked images */}
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden border border-border/20 shadow-lg bg-muted/10 flex items-center justify-center">
              <div className="flex items-center justify-center">
                {combo.images.map((img, i) => (
                  <div
                    key={i}
                    className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0"
                    style={{ marginLeft: i > 0 ? -44 : 0, zIndex: combo.images.length - i }}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
              {combo.tags.map(tag => (
                <span key={tag} className="text-xs font-bold bg-primary text-white px-3 py-1 rounded-full shadow-sm">{tag}</span>
              ))}
            </div>
          </div>

          {/* RIGHT – Details */}
          <div className="flex flex-col gap-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary/70 mb-1 block">Combo Pack</span>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">{combo.name}</h1>
            </div>

            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">{combo.fullDescription}</p>

            {/* Stats */}
            <div className="flex items-center gap-0 divide-x divide-border border border-border/40 rounded-2xl overflow-hidden bg-muted/20">
              {[
                { label: "Serves", value: combo.serves, icon: "🍽️" },
                { label: "Weight", value: combo.weight, icon: "⚖️" },
                { label: "Items", value: `${combo.includes.length} items`, icon: "📦" },
              ].map(({ label, value, icon }) => (
                <div key={label} className="flex-1 flex flex-col items-center py-4 px-2">
                  <span className="text-xl mb-1">{icon}</span>
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <span className="text-sm font-semibold text-foreground mt-0.5 text-center">{value}</span>
                </div>
              ))}
            </div>

            {/* What's included */}
            <div>
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Utensils className="w-4 h-4 text-accent" /> What's Included
              </h3>
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

            {/* Price */}
            <div className="bg-muted/30 border border-border/30 rounded-2xl px-5 py-4">
              <div className="flex items-end gap-3 mb-1">
                <span className="text-3xl font-bold text-foreground">₹{combo.discountedPrice}</span>
                <span className="text-base text-muted-foreground line-through mb-0.5">₹{combo.originalPrice}</span>
                <span className="text-sm font-semibold text-green-600 mb-0.5">{combo.discount}% off</span>
              </div>
              <p className="text-xs text-muted-foreground">Inclusive of all taxes. Free delivery on orders above ₹499.</p>
            </div>

            {/* Savings */}
            <div className="flex items-center gap-3 bg-accent/5 border border-accent/20 rounded-2xl p-4">
              <Tag className="w-5 h-5 text-accent flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">You save ₹{combo.originalPrice - combo.discountedPrice} ({combo.discount}% off)</p>
                <p className="text-xs text-muted-foreground">vs buying each item separately</p>
              </div>
            </div>

            {/* Add to Cart */}
            <Button
              onClick={handleAddToCart}
              className={`h-12 rounded-full font-bold text-base flex items-center justify-center gap-2 transition-all ${
                added ? "bg-emerald-500 text-white" : "bg-primary text-white shadow-lg shadow-primary/20"
              }`}
              data-testid="button-add-combo-to-cart"
            >
              {added ? (
                <><Check className="w-5 h-5" /> Added to Cart!</>
              ) : (
                <><ShoppingBag className="w-5 h-5" /> Add to Cart — ₹{combo.discountedPrice}</>
              )}
            </Button>
          </div>
        </div>

        {/* Nutritional Information */}
        <section className="mb-14">
          <div className="flex items-center gap-2 mb-5">
            <Flame className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-bold text-foreground">Nutritional Information</h2>
            <span className="text-xs text-muted-foreground ml-1">(per 100 g)</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {combo.nutrition.map(({ label, value, icon }) => (
              <div
                key={label}
                className="bg-card border border-border/30 rounded-2xl p-4 flex flex-col items-center gap-2 text-center hover:shadow-sm transition-shadow"
              >
                <span className="text-3xl">{icon}</span>
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className="text-sm font-bold text-foreground">{value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <CartDrawer />
    </div>
  );
}
