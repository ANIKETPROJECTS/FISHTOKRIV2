import { Link } from "wouter";
import { ShoppingBag, User } from "lucide-react";
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

        <div className="flex items-center gap-2 sm:gap-6">
          <Link href="/admin">
            <Button variant="ghost" size="icon" className="text-foreground hover:bg-accent/10 rounded-full">
              <User className="w-6 h-6" />
            </Button>
          </Link>
          
          <Button
            onClick={() => setIsCartOpen(true)}
            variant="ghost"
            size="icon"
            className="relative text-foreground hover:bg-accent/10 rounded-full"
          >
            <ShoppingBag className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-md animate-in zoom-in">
                {totalItems}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
