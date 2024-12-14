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
    <div className="space-y-12 py-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary-foreground text-white py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Your Health, Our Priority
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Find and order medicines from trusted pharmaceutical companies
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2 p-4 bg-white rounded-lg shadow-lg">
            <Input
              type="text"
              placeholder="Search medicines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow"
            />
            <Button>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Featured Companies</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Example Company Card */}
          <Link
            to="/company/1"
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
          >
            <img
              src="/placeholder.svg"
              alt="Company Logo"
              className="w-24 h-24 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold text-center">Company Name</h3>
          </Link>
          {/* Add more company cards here */}
        </div>
      </section>

      {/* Favorites Section */}
      {user && (
        <section className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Your Favorites</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Example Medicine Card */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <img
                src="/placeholder.svg"
                alt="Medicine"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold mb-2">Medicine Name</h3>
              <p className="text-gray-600 mb-4">Company Name</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-primary">$99.99</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                  <Button size="sm">Buy</Button>
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