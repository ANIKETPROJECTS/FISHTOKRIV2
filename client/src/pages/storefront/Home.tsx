import { useState } from "react";
import { format } from "date-fns";
import { Header } from "@/components/storefront/Header";
import { ProductCard } from "@/components/storefront/ProductCard";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { useProducts } from "@/hooks/use-products";
import { Skeleton } from "@/components/ui/skeleton";

import fishImg from "@assets/Gemini_Generated_Image_w6wqkkw6wqkkw6wq_(1)_1772713077919.png";
import prawnsImg from "@assets/Gemini_Generated_Image_5xy0sd5xy0sd5xy0_1772713090650.png";
import chickenImg from "@assets/Gemini_Generated_Image_g0ecb4g0ecb4g0ec_1772713219972.png";
import muttonImg from "@assets/Gemini_Generated_Image_8fq0338fq0338fq0_1772713565349.png";
import masalaImg from "@assets/Gemini_Generated_Image_4e60a64e60a64e60_1772713888468.png";
import allImg from "@assets/Gemini_Generated_Image_s0odfms0odfms0od_1772714896015.png";

const CATEGORIES = [
  { name: "All", image: allImg },
  { name: "Fish", image: fishImg },
  { name: "Prawns", image: prawnsImg },
  { name: "Chicken", image: chickenImg },
  { name: "Mutton", image: muttonImg },
  { name: "Masalas", image: masalaImg },
];

export default function Home() {
  const { data: products, isLoading } = useProducts();
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts = products?.filter((p) => {
    if (p.isArchived) return false;
    if (activeCategory === "All") return true;
    return p.category === activeCategory;
  }) || [];

  const todayStr = format(new Date(), "EEEE, MMMM do");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground p-8 sm:p-12 mb-12 shadow-2xl shadow-primary/20">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              Fresh on {todayStr}
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 leading-tight">
              Fresh Catch,<br/>Delivered.
            </h1>
            <p className="text-primary-foreground/90 text-lg sm:text-xl max-w-md font-medium">
              Premium quality seafood and meats delivered straight to your door.
            </p>
          </div>
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-20 -mb-20 w-64 h-64 bg-gradient-to-tr from-accent/30 to-transparent rounded-full blur-3xl"></div>
        </div>

        {/* Category Cards - 2x2 on mobile, responsive grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`group relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                activeCategory === cat.name
                  ? "border-accent ring-4 ring-accent/20 scale-[1.02] shadow-xl"
                  : "border-transparent grayscale hover:grayscale-0 hover:border-accent/30"
              }`}
            >
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-center pb-4">
                <span className="text-white font-display font-bold text-lg sm:text-xl drop-shadow-md">
                  {cat.name}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card rounded-3xl p-4 border flex flex-col">
                <Skeleton className="w-full aspect-square rounded-2xl mb-4" />
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-8 w-full mb-4" />
                <div className="flex justify-between mt-auto">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center flex flex-col items-center">
            <div className="text-6xl mb-4 opacity-50 filter grayscale">🎣</div>
            <h3 className="text-2xl font-display font-semibold text-foreground mb-2">No items found</h3>
            <p className="text-muted-foreground">Check back later for fresh stock in this category.</p>
          </div>
        )}
      </main>

      <CartDrawer />
    </div>
  );
}
