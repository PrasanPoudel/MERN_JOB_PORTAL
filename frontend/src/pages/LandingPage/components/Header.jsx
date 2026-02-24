import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import ProfileDropdown from "../../../components/layout/ProfileDropdown";
import logo from "../../../assets/logo.png";
import { Search } from "lucide-react";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => {
      if (profileDropdownOpen) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [profileDropdownOpen]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 z-40 bg-white/95 w-full backdrop-blur-sm border-b border-gray-50"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link className="flex items-center p-0" to="/find-jobs">
            <img src={logo} className="w-20 h-18" />
          </Link>

          <div className="flex items-center space-x-3">
            <Link
              to="/find-jobs"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-sky-50 cursor-pointer"
            >
              <Search className="h-4 w-4 " />
              <span className="hidden sm:block">Search for jobs</span>
            </Link>
            {isAuthenticated ? (
              <div id="profileDropdown" className="flex items-center space-x-3">
                <ProfileDropdown
                  isOpen={profileDropdownOpen}
                  onToggle={(e) => {
                    e.stopPropagation();
                    setProfileDropdownOpen(!profileDropdownOpen);
                  }}
                  name={user?.name || null}
                  avatar={user?.avatar || null}
                  companyName={user?.companyName || ""}
                  email={user?.email || ""}
                  role={user?.role || ""}
                  companyLogo={user?.companyLogo || null}
                  onLogout={logout}
                />
              </div>
            ) : (
              <a
                href="/login"
                className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Login
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
