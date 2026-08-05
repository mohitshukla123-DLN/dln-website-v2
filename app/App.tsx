import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import RootLayout from "./layout/RootLayout";
import Analytics from "./components/common/Analytics";
import AdminLoginPage from "./pages/AdminLoginPage";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminHomepagePage from "./pages/admin/AdminHomepagePage";

const HomePage = lazy(() => import("./pages/HomePage"));
const ShopPage = lazy(() => import("./pages/ShopPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));
const NewArrivalsPage = lazy(() => import("./pages/NewArrivalsPage"));
const CollectionPage = lazy(() => import("./pages/CollectionPage"));
const SizeGuidePage = lazy(() => import("./pages/SizeGuidePage"));
const PolicyPage = lazy(() => import("./pages/PolicyPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const AdminProductsPage = lazy(() => import("./pages/admin/AdminProductsPage"));


export default function App() {
  return (
    <>
      <Analytics />

      <Suspense fallback={null}>
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
            path="/admin/login"
            element={<AdminLoginPage />}
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/products"
            element={
              <ProtectedRoute>
                <RootLayout>
                  <AdminProductsPage />
                </RootLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/homepage"
            element={
              <ProtectedRoute>
                <AdminHomepagePage />
              </ProtectedRoute>
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
      </Suspense>
    </>
  );
}