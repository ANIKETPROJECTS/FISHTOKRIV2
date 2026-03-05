import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Header } from "@/components/storefront/Header";
import { ProductCard } from "@/components/storefront/ProductCard";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { useProducts } from "@/hooks/use-products";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";

import fishImg from "@assets/Gemini_Generated_Image_w6wqkkw6wqkkw6wq_(1)_1772713077919.png";
import prawnsImg from "@assets/Gemini_Generated_Image_5xy0sd5xy0sd5xy0_1772713090650.png";
import chickenImg from "@assets/Gemini_Generated_Image_g0ecb4g0ecb4g0ec_1772713219972.png";
import muttonImg from "@assets/Gemini_Generated_Image_8fq0338fq0338fq0_1772713565349.png";
import masalaImg from "@assets/Gemini_Generated_Image_4e60a64e60a64e60_1772713888468.png";
import allImg from "@assets/Gemini_Generated_Image_s0odfms0odfms0od_1772714896015.png";
import banner1 from "@assets/Gemini_Generated_Image_1kjxqr1kjxqr1kjx_1772718118287.png";
import banner2 from "@assets/Gemini_Generated_Image_npjzn2npjzn2npjz_1772718125998.png";

const CATEGORIES = [
  { name: "All", image: allImg },
  { name: "Fish", image: fishImg },
  { name: "Prawns", image: prawnsImg },
  { name: "Chicken", image: chickenImg },
  { name: "Mutton", image: muttonImg },
  { name: "Masalas", image: masalaImg },
];

const BANNERS = [banner1, banner2];

export default function Home() {
  const { data: products, isLoading } = useProducts();
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentBanner, setCurrentBanner] = useState(0);
  const [view, setView] = useState<"home" | "category">("home");

  useEffect(() => {
    if (view === "home") {
      const timer = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % BANNERS.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [view]);

  const handleCategoryClick = (catName: string) => {
    setActiveCategory(catName);
    setView("category");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredProducts = products?.filter((p) => {
    if (p.isArchived) return false;
    if (activeCategory === "All") return true;
    return p.category === activeCategory;
  }) || [];

  const getSectionProducts = (category: string) => {
    return products?.filter(p => !p.isArchived && (category === "Today's Special" ? true : p.category === category)).slice(0, 6) || [];
  };

  if (view === "category") {
    return (
      <div className="min-h-screen bg-background flex flex-col font-sans">
        <Header />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={() => setView("home")} className="rounded-full">
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <h2 className="text-3xl font-bold text-foreground">{activeCategory} Selection</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isLoading ? [1,2,3,4,5,6,7,8].map(i => <Skeleton key={i} className="aspect-[3/4] rounded-3xl" />) :
              filteredProducts.map(product => <ProductCard key={product.id} product={product} />)
            }
          </div>
        </main>
        <CartDrawer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Banner Carousel */}
        <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-8 shadow-lg group">
          {BANNERS.map((banner, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentBanner ? 'opacity-100' : 'opacity-0'}`}
            >
              <img src={banner} alt={`Banner ${index + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* Category Grid - 2x2 on mobile, colorful cards with text below */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 mb-12">
          {CATEGORIES.map((cat) => (
            <div key={cat.name} className="flex flex-col items-center group">
              <button
                onClick={() => handleCategoryClick(cat.name)}
                className="relative aspect-square w-full rounded-2xl overflow-hidden border-2 border-transparent transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
              </button>
              <span className="mt-2 font-bold text-base sm:text-lg text-foreground">
                {cat.name}
              </span>
            </div>
          ))}
        </div>

        {/* Today's Special Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground uppercase tracking-wide">FishTokri Today's Special</h2>
          </div>
          <div className="flex overflow-x-auto pb-4 gap-4 sm:gap-6 scrollbar-hide snap-x">
            {isLoading ? [1,2,3,4,5,6].map(i => <Skeleton key={i} className="min-w-[240px] sm:min-w-[280px] h-[340px] sm:h-[380px] rounded-3xl" />) :
              getSectionProducts("Today's Special").map(product => (
                <div key={product.id} className="min-w-[240px] sm:min-w-[280px] snap-start">
                  <ProductCard product={product} />
                </div>
              ))
            }
          </div>
        </section>

        {/* Category Specials */}
        {["Fish", "Prawns", "Chicken", "Mutton"].map((category) => (
          <section key={category} className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground uppercase tracking-wide">{category} Specials</h2>
              <Button variant="link" onClick={() => handleCategoryClick(category)} className="text-accent font-bold p-0">View More</Button>
            </div>
            <div className="flex overflow-x-auto pb-4 gap-4 sm:gap-6 scrollbar-hide snap-x">
              {isLoading ? [1,2,3,4,5,6].map(i => <Skeleton key={i} className="min-w-[240px] sm:min-w-[280px] h-[340px] sm:h-[380px] rounded-3xl" />) :
                getSectionProducts(category).map(product => (
                  <div key={product.id} className="min-w-[240px] sm:min-w-[280px] snap-start">
                    <ProductCard product={product} />
                  </div>
                ))
              }
            </div>
          </section>
        ))}
      </main>

      <CartDrawer />
    </div>
  );
}
