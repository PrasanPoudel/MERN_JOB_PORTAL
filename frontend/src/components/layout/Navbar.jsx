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

    // Start polling for unread count updates
    const interval = setInterval(fetchUnreadCount, 10000); // Poll every 10 seconds

    return () => {
      if (interval) clearInterval(interval);
    };
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
    `p-2 rounded-xl transition-colors duration-200
     ${
       isActive ? "bg-sky-100 text-sky-600" : "text-gray-600 hover:bg-sky-100"
     }`;

  return (
    <header className="fixed p-0 top-0 left-0 z-50 bg-white/95 w-full backdrop-blur-sm border-b border-gray-50">
      <div className="container mx-auto p-0">
        <div className="flex items-center p-0 justify-between max-h-20">
          <Link className="flex items-center" to="/">
            <img src={logo} className="h-20 w-20 object-contain mix-blend-multiply" alt="logo" />
          </Link>

          <div className="flex items-center gap-1">
            <NavLink title="Go to Homepage" to="/" className={navLinkClasses}>
              <Home className="h-6 w-6" />
            </NavLink>
            <NavLink
              title="Search for Jobs"
              to="/find-jobs"
              className={navLinkClasses}
            >
              <Search className="h-6 w-6" />
            </NavLink>
            {user && user?.role === "jobSeeker" && (
              <>
                <NavLink
                  title="Messages"
                  to="/JobSeekerChatBox"
                  className={navLinkClasses}
                >
                  <div className="relative">
                    <MessageSquare className="h-6 w-6" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </div>
                </NavLink>
              </>
            )}

            {user && user?.role === "admin" && (
              <NavLink
                title="Messages"
                to="/admin-chat-box"
                className={navLinkClasses}
              >
                <div className="relative">
                  <MessageSquare className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </div>
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
                isCompanyVerified={user?.isCompanyVerified || false}
                email={user?.email || ""}
                role={user?.role || "jobSeeker"}
                companyLogo={user?.companyLogo || null}
                onLogout={logout}
              />
            ) : (
              <a
                href="/login"
                title="Login to your account"
                className="bg-sky-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-sky-700 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
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
