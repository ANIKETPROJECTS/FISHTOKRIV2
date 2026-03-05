import { Link } from "wouter";
import { ShoppingBag, Fish, LayoutDashboard } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";

import logoImg from "@assets/image_1772715110268.png";

export function Header() {
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <img src={logoImg} alt="FishTokri Logo" className="w-12 h-12 object-contain" />
          <span className="text-2xl font-display font-bold text-foreground">
            Fish<span className="text-accent">Tokri</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/admin" className="hidden sm:inline-flex">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Admin
            </Button>
          </Link>
          
          <Button
            onClick={() => setIsCartOpen(true)}
            variant="outline"
            className="relative border-primary/20 hover:border-primary/40 bg-white/50"
          >
            <ShoppingBag className="w-5 h-5 text-primary mr-2" />
            <span className="font-semibold text-foreground">Order</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-accent text-white text-xs font-bold flex items-center justify-center rounded-full shadow-md animate-in zoom-in">
                {totalItems}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
