import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Home } from "@/pages/Home";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { Profile } from "@/pages/Profile";
import { CompanyDashboard } from "@/pages/CompanyDashboard";
import { MedicineDetails } from "@/pages/MedicineDetails";
import { CompanyMedicines } from "@/pages/CompanyMedicines";
import { Cart } from "@/pages/Cart";
import { Orders } from "@/pages/Orders";
import { Checkout } from "@/pages/Checkout";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard" element={<CompanyDashboard />} />
              <Route path="/medicine/:id" element={<MedicineDetails />} />
              <Route path="/company/:id" element={<CompanyMedicines />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;