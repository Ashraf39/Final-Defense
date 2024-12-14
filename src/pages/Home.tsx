import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Heart, ShoppingCart } from "lucide-react";

export const Home = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-8 py-4">
      {/* Hero Section - Reduced height */}
      <section className="bg-gradient-to-r from-green-600 to-green-400 text-white py-12">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Your Health, Our Priority
          </h1>
          <p className="text-lg md:text-xl">
            Find and order medicines from trusted pharmaceutical companies
          </p>
        </div>
      </section>

      {/* Search Section - Beautified */}
      <section className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2 p-3 bg-white rounded-full shadow-lg border border-green-100">
            <Input
              type="text"
              placeholder="Search medicines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-full"
            />
            <Button className="rounded-full bg-green-600 hover:bg-green-700">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Companies Section - Smaller and rounder tiles */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Featured Companies</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Example Company Card */}
          <Link
            to="/company/1"
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 border border-green-100 group"
          >
            <img
              src="/placeholder.svg"
              alt="Company Logo"
              className="w-16 h-16 mx-auto mb-3"
            />
            <h3 className="text-lg font-medium text-center text-gray-800 group-hover:text-green-600">Company Name</h3>
          </Link>
          {/* Add more company cards here */}
        </div>
      </section>

      {/* Favorites Section - Smaller and rounder tiles */}
      {user && (
        <section className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Favorites</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Example Medicine Card */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-green-100">
              <img
                src="/placeholder.svg"
                alt="Medicine"
                className="w-full h-32 object-cover rounded-t-xl"
              />
              <div className="p-4">
                <h3 className="text-base font-medium mb-1">Medicine Name</h3>
                <p className="text-sm text-gray-600 mb-3">Company Name</p>
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-green-600">$99.99</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">Buy</Button>
                  </div>
                </div>
              </div>
            </div>
            {/* Add more medicine cards here */}
          </div>
        </section>
      )}
    </div>
  );
};