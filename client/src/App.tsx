import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import NotFound from "@/pages/not-found";

import Home from "@/pages/storefront/Home";
import ProductDetail from "@/pages/storefront/ProductDetail";
import RecipeDetail from "@/pages/storefront/RecipeDetail";
import Profile from "@/pages/storefront/Profile";
import ComboDetail from "@/pages/storefront/ComboDetail";
import AddAddress from "@/pages/storefront/AddAddress";
import Login from "@/pages/admin/Login";
import Dashboard from "@/pages/admin/Dashboard";
import Products from "@/pages/admin/Products";
import Orders from "@/pages/admin/Orders";
import AdminLayout from "@/components/admin/AdminLayout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/profile" component={Profile} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/recipe/:category/:index" component={RecipeDetail} />
      <Route path="/combo/:id" component={ComboDetail} />
      <Route path="/add-address" component={AddAddress} />
      <Route path="/admin/login" component={Login} />

      <Route path="/admin" component={() => (
        <AdminLayout><Dashboard /></AdminLayout>
      )} />

      <Route path="/admin/products" component={() => (
        <AdminLayout><Products /></AdminLayout>
      )} />

      <Route path="/admin/orders" component={() => (
        <AdminLayout><Orders /></AdminLayout>
      )} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
