import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import Analytics from "./components/common/Analytics";
import StructuredData from "./components/common/StructuredData";
import Favicon from "./components/common/Favicon";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import PWAInstallPrompt from "./components/common/PWAInstallPrompt";

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
const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
const AdminHomepagePage = lazy(() => import("./pages/admin/AdminHomepagePage"));
const AdminCategoriesPage = lazy(() => import("./pages/admin/AdminCategoriesPage"));
const AdminSiteSettingsPage = lazy(() => import("./pages/admin/AdminSiteSettingsPage"));
const AdminMediaLibraryPage = lazy(() => import("./pages/admin/Admin/AdminMediaLibraryPage"));


export default function App() {

  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <>
      <PWAInstallPrompt />
      
      {!isAdminRoute && <StructuredData />}
      <Analytics />
      <Favicon />

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
            path="/admin/categories"
            element={
              <ProtectedRoute>
                <AdminCategoriesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/site-settings"
            element={
              <ProtectedRoute>
                <AdminSiteSettingsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/media"
            element={
              <ProtectedRoute>
                <AdminMediaLibraryPage />
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