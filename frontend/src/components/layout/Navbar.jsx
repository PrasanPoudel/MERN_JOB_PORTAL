import React, { useState, useEffect } from "react";
import { Home, MessageSquare, Search } from "lucide-react";
import ProfileDropdown from "../../components/layout/ProfileDropdown";
import { useAuth } from "../../context/AuthContext";
import { NavLink, Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import logo from "../../assets/logo.png";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user || !isAuthenticated) return;

    const fetchUnreadCount = async () => {
      try {
        const response = await axiosInstance.get(
          API_PATHS.MESSAGES.GET_UNREAD_COUNT,
        );
        setUnreadCount(response.data.totalUnreadCount || 0);
      } catch (err) {
        console.error("Failed to fetch unread count:", err);
      }
    };
    fetchUnreadCount();

    // Poll every 5 seconds
    const interval = setInterval(fetchUnreadCount, 5000);

    return () => clearInterval(interval);
  }, [user, isAuthenticated]);

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

  const navLinkClasses = ({ isActive }) =>
    `flex gap-2 items-center p-2 rounded-xl transition-colors duration-200
     ${
       isActive ? "bg-sky-100 text-sky-600" : "text-gray-600 hover:bg-sky-100"
     }`;

  return (
    <header className="fixed top-0 left-0 z-40 bg-white/95 w-full backdrop-blur-sm border-b border-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link className="flex items-center" to="/find-jobs">
            <img src={logo} className="h-14 w-20 object-fill" alt="logo" />
          </Link>

          <div className="flex items-center space-x-2 md:space-x-6">
            <NavLink to="/" className={navLinkClasses}>
              <Home className="h-5 w-5" />
              <span className="hidden md:flex">Home</span>
            </NavLink>
            {user && user?.role === "jobSeeker" && (
              <>
                <NavLink to="/find-jobs" className={navLinkClasses}>
                  <Search className="h-5 w-5" />
                  <span className="hidden md:flex">Search for jobs</span>
                </NavLink>

                <NavLink to="/JobSeekerChatBox" className={navLinkClasses}>
                  <div className="relative">
                    <MessageSquare className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </div>
                  <span className="hidden md:flex">Messages</span>
                </NavLink>
              </>
            )}

            {user && user?.role === "admin" && (
              <NavLink to="/admin-chat-box" className={navLinkClasses}>
                <div className="relative">
                  <MessageSquare className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </div>
                <span className="hidden md:flex">Messages</span>
              </NavLink>
            )}

            {isAuthenticated ? (
              <ProfileDropdown
                isOpen={profileDropdownOpen}
                onToggle={(e) => {
                  e.stopPropagation();
                  setProfileDropdownOpen(!profileDropdownOpen);
                }}
                name={user?.name || ""}
                avatar={user?.avatar || null}
                companyName={user?.companyName || ""}
                email={user?.email || ""}
                role={user?.role || "jobSeeker"}
                companyLogo={user?.companyLogo || null}
                onLogout={logout}
              />
            ) : (
              <a
                href="/login"
                className="bg-sky-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-sky-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Login
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
