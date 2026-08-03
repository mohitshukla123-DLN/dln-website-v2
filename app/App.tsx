import { Routes, Route } from "react-router-dom";

import RootLayout from "./layout/RootLayout";

import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ProductPage from "./pages/ProductPage";
import CategoryPage from "./pages/CategoryPage";
import WishlistPage from "./pages/WishlistPage";
import NewArrivalsPage from "./pages/NewArrivalsPage";
import CollectionPage from "./pages/CollectionPage";
import SizeGuidePage from "./pages/SizeGuidePage";
import PolicyPage from "./pages/PolicyPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RootLayout>
            <HomePage />
          </RootLayout>
        }
      />

      <Route
        path="/shop"
        element={
          <RootLayout>
            <ShopPage />
          </RootLayout>
        }
      />

      <Route
        path="/new-arrivals"
        element={
          <RootLayout>
            <NewArrivalsPage />
          </RootLayout>
        }
      />

      <Route
        path="/products/:slug"
        element={
          <RootLayout>
            <ProductPage />
          </RootLayout>
        }
      />

      <Route
        path="/about"
        element={
          <RootLayout>
            <AboutPage />
          </RootLayout>
        }
      />

      <Route
        path="/category/:slug"
        element={
          <RootLayout>
            <CategoryPage />
          </RootLayout>
        }
      />

      <Route
        path="/contact"
        element={
          <RootLayout>
            <ContactPage />
          </RootLayout>
        }
      />

      <Route
        path="/wishlist"
        element={
          <RootLayout>
            <WishlistPage />
          </RootLayout>
        }
      />

      <Route
        path="/collections/:slug"
        element={
          <RootLayout>
            <CollectionPage />
          </RootLayout>
        }
      />

      <Route
        path="/size-guide"
        element={
          <RootLayout>
            <SizeGuidePage />
          </RootLayout>
        }
      />

      <Route
        path="/policies"
        element={
          <RootLayout>
            <PolicyPage />
          </RootLayout>
        }
      />

      <Route
      path="*"
      element={
        <RootLayout>
          <NotFoundPage />
        </RootLayout>
      }
    />
      
    </Routes>
  );
}