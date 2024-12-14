import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Home } from "@/pages/Home";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { Profile } from "@/pages/Profile";
import { CompanyDashboard } from "@/pages/CompanyDashboard";
import { AdminDashboard } from "@/pages/AdminDashboard";
import { MedicineDetails } from "@/pages/MedicineDetails";
import { CompanyMedicines } from "@/pages/CompanyMedicines";
import { Cart } from "@/pages/Cart";
import { Orders } from "@/pages/Orders";
import { Checkout } from "@/pages/Checkout";
import { Inventory } from "@/pages/Inventory";
import { useAuth } from "@/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

// Protected Route component
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, userRole } = useAuth();
  
  if (!user || userRole !== "admin") {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user, userRole } = useAuth();

  // Redirect admin users to admin dashboard when they visit the home page
  if (user && userRole === "admin" && window.location.pathname === "/") {
    return <Navigate to="/admin" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/dashboard" element={<CompanyDashboard />} />
      <Route 
        path="/admin" 
        element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        } 
      />
      <Route path="/medicine/:id" element={<MedicineDetails />} />
      <Route path="/company/:id" element={<CompanyMedicines />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/inventory" element={<Inventory />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <AppRoutes />
            </main>
            <Footer />
          </div>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;