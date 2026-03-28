import { useRoute, useLocation } from "wouter";
import { Header } from "@/components/storefront/Header";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { getDummyDetail } from "@/lib/productDummyData";
import { ChevronLeft, Clock, Users, ChefHat, Flame, CheckCircle2 } from "lucide-react";

export default function RecipeDetail() {
  const [, params] = useRoute("/recipe/:category/:index");
  const [, setLocation] = useLocation();

  const category = decodeURIComponent(params?.category ?? "Fish");
  const index = Number(params?.index ?? 0);
  const dummy = getDummyDetail(category);
  const recipe = dummy.recipes[index];

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Recipe not found.</p>
        </div>
        <CartDrawer />
      </div>
    );
  }

  const diffColor =
    recipe.difficulty === "Easy"
      ? "bg-green-100 text-green-700"
      : recipe.difficulty === "Hard"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

        {/* Back */}
        <button
          onClick={() => history.back()}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to product
        </button>

        {/* Hero Image */}
        <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-lg mb-8">
          <img
            src={recipe.image}
            alt={recipe.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title + Stats */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-3">{recipe.name}</h1>
          <p className="text-muted-foreground text-base mb-5 leading-relaxed">{recipe.description}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: <Clock className="w-5 h-5 text-accent" />, label: "Total Time", value: recipe.totalTime },
              { icon: <Flame className="w-5 h-5 text-orange-500" />, label: "Prep Time", value: recipe.prepTime },
              { icon: <ChefHat className="w-5 h-5 text-primary" />, label: "Cook Time", value: recipe.cookTime },
              { icon: <Users className="w-5 h-5 text-blue-500" />, label: "Servings", value: `${recipe.servings} people` },
            ].map(({ icon, label, value }) => (
              <div
                key={label}
                className="bg-muted/30 border border-border/30 rounded-2xl p-4 flex flex-col items-center text-center gap-2"
              >
                {icon}
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className="text-sm font-bold text-foreground">{value}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Difficulty:</span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${diffColor}`}>{recipe.difficulty}</span>
          </div>
        </div>

        <div className="w-full h-px bg-border/40 mb-8" />

        {/* Ingredients */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <span className="text-2xl">🧂</span> Ingredients
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recipe.ingredients.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 bg-muted/20 border border-border/20 rounded-xl px-4 py-3"
              >
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                <span className="text-sm text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="w-full h-px bg-border/40 mb-8" />

        {/* Method */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <span className="text-2xl">👨‍🍳</span> Method
          </h2>
          <ol className="flex flex-col gap-5">
            {recipe.method.map((step, i) => (
              <li key={i} className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </div>
                <div className="bg-muted/20 border border-border/20 rounded-xl px-4 py-3 flex-1">
                  <p className="text-sm text-foreground leading-relaxed">{step}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Other recipes from same category */}
        {dummy.recipes.length > 1 && (
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="text-2xl">🍴</span> More Recipes
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide snap-x">
              {dummy.recipes
                .filter((_, idx) => idx !== index)
                .map((r, idx) => {
                  const originalIdx = dummy.recipes.findIndex(x => x.name === r.name);
                  return (
                    <div
                      key={r.name}
                      onClick={() => setLocation(`/recipe/${encodeURIComponent(category)}/${originalIdx}`)}
                      className="min-w-[220px] snap-start bg-card border border-border/30 rounded-2xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <img src={r.image} alt={r.name} className="w-full h-32 object-cover" />
                      <div className="p-3">
                        <p className="font-semibold text-sm text-foreground line-clamp-1">{r.name}</p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{r.description}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        )}
      </div>

      <CartDrawer />
    </div>
  );
}
