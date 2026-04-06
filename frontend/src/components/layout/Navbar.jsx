import React, { useState, useEffect } from "react";
import { Home, Menu, MessageSquare, Search, X } from "lucide-react";
import ProfileDropdown from "../../components/layout/ProfileDropdown";
import { useAuth } from "../../context/AuthContext";
import { NavLink, Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import logo from "../../assets/logo.png";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [openMenu, setOpenMenu] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user || !isAuthenticated) return;

    const fetchUnreadCount = async () => {
      try {
        const response = await axiosInstance.get(
          API_PATHS.MESSAGES.GET_UNREAD_COUNT,
        );
        setUnreadCount(response?.data?.totalUnreadCount || 0);
      } catch (err) {
        console.error("Failed to fetch unread count:", err);
      }
    };

    fetchUnreadCount();

    const interval = setInterval(fetchUnreadCount, 10000);

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

  useEffect(() => {
    const element = document.getElementById("profileDropdown_id");
    if (!element || !openMenu) return;

    const handleClickOutside = () => {
      if (openMenu) {
        setOpenMenu(false);
      }
    };
    element.addEventListener("click", handleClickOutside);

    return () => {
      element.removeEventListener("click", handleClickOutside);
    };
  }, [openMenu]);

  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
      openMenu ? "w-full" : ""
    } ${isActive ? "text-sky-600 bg-sky-50" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`;

  const chatPath =
    user?.role === "admin"
      ? "/admin-chat-box"
      : user?.role === "employer"
        ? "/EmployerChatBox"
        : "/JobSeekerChatBox";

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        <Link title="Go to Homepage" to="/" className="shrink-0">
          <img
            src={logo}
            className="h-12 w-14 object-contain"
            alt="KAAMSETU logo"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center gap-1">
          <NavLink title="Go to Homepage" to="/" className={navLinkClasses}>
            <Home className="w-6 h-6" />
            <span>Home</span>
          </NavLink>
          <NavLink title="Find Jobs" to="/find-jobs" className={navLinkClasses}>
            <Search className="w-6 h-6" />
            <span>Find Jobs</span>
          </NavLink>
          {user && (
            <NavLink title="Messages" to={chatPath} className={navLinkClasses}>
              <div className="relative">
                <MessageSquare className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full h-4 min-w-4 flex items-center justify-center font-bold px-1">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </div>
              <span>Messages</span>
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div id="profileDropdown_id">
              <ProfileDropdown
                isOpen={profileDropdownOpen}
                onToggle={(e) => {
                  e.stopPropagation();
                  setProfileDropdownOpen(!profileDropdownOpen);
                }}
                name={user?.name || ""}
                isPremium={user?.isPremium}
                avatar={user?.avatar || null}
                companyName={user?.companyName || ""}
                isCompanyVerified={user?.isCompanyVerified || false}
                email={user?.email || ""}
                role={user?.role || "jobSeeker"}
                companyLogo={user?.companyLogo || null}
                onLogout={logout}
              />
            </div>
          ) : (
            <Link
              to="/login"
              title="Login to your account"
              className="btn-primary-sm"
            >
              Login
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="sm:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            title="Toggle menu"
          >
            {openMenu ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {openMenu && (
        <div className="sm:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-200 shadow-lg py-10 px-2 flex flex-col gap-2">
          <hr className="text-gray-200" />
          <NavLink
            title="Go to Homepage"
            to="/"
            className={navLinkClasses}
            onClick={() => setOpenMenu(false)}
          >
            <Home className="w-6 h-6" />
            <span>Home</span>
          </NavLink>
          <NavLink
            title="Find Jobs"
            to="/find-jobs"
            className={navLinkClasses}
            onClick={() => setOpenMenu(false)}
          >
            <Search className="w-6 h-6" />
            <span>Find Jobs</span>
          </NavLink>
          {user && (
            <NavLink
              title="Messages"
              to={chatPath}
              className={navLinkClasses}
              onClick={() => setOpenMenu(false)}
            >
              <div className="relative">
                <MessageSquare className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full h-4 min-w-4 flex items-center justify-center font-bold px-1">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </div>
              <span>Messages</span>
            </NavLink>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
