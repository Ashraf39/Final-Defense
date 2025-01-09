import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Instagram, Shield } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-primary/10 to-secondary/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-primary">PharmaCare</h3>
            <p className="text-gray-600">
              Your trusted partner in healthcare solutions.
            </p>
            <div className="flex gap-4">
              <Facebook className="h-5 w-5 text-gray-600 hover:text-primary cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-600 hover:text-primary cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-600 hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-gray-800">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-primary transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-gray-800">Contact Us</h4>
            <ul className="space-y-2 text-gray-600">
              <li>Email: support@pharmacare.com</li>
              <li>Phone: (555) 123-4567</li>
              <li>Address: 123 Health Street</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-gray-800">Newsletter</h4>
            <div className="flex flex-col gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/50"
              />
              <Button variant="default" className="bg-primary hover:bg-primary/90">
                Subscribe
              </Button>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Shield className="h-4 w-4" />
              <span className="text-sm">Secure Payment Partner</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200/20 text-center text-gray-600">
          <p>&copy; 2024 PharmaCare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};