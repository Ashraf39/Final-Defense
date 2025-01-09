import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Logo and Copyright */}
          <div className="flex flex-col items-center md:items-start">
            <span className="text-xl font-semibold text-primary">PharmaCare</span>
            <p className="text-sm text-gray-500 mt-2">
              &copy; {new Date().getFullYear()} PharmaCare. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex space-x-6">
            <Link 
              to="/about" 
              className="text-sm text-gray-600 hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-sm text-gray-600 hover:text-primary transition-colors"
            >
              Contact
            </Link>
            <Link 
              to="/terms" 
              className="text-sm text-gray-600 hover:text-primary transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};