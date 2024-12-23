import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const NavbarLogo = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      if (userRole === "admin") {
        navigate("/admin");
      } else if (userRole === "company") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  };

  return (
    <Link 
      to="/" 
      onClick={handleHomeClick} 
      className="text-2xl font-bold text-primary hover:opacity-80 transition-all duration-300 font-serif tracking-wide"
    >
      PharmaCare
    </Link>
  );
};