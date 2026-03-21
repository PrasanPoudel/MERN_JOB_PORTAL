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
    `flex text-md gap-1 items-center p-1 font-medium ${openMenu ? "w-full" : ""} rounded-xl transition-colors duration-500 hover:text-gray-900
     ${isActive ? "text-sky-600" : "text-gray-600"}`;

  return (
    <header className="fixed p-0 top-0 left-0 z-50 bg-white/95 w-full backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="flex items-end p-2 gap-1 justify-between h-18">
        <Link title="Go to Homepage" to="/">
          <img
            src={logo}
            className="h-14 w-16 object-contain mix-blend-multiply"
            alt="logo"
          />
        </Link>
        <div className="flex items-center gap-2">
          <div
            className={`${openMenu ? "z-1200 p-3 absolute top-20 left-0 min-w-full bg-white flex flex-col items-center gap-4 min-h-screen" : "hidden sm:flex gap-2"}`}
          >
            <NavLink title="Go to Homepage" to="/" className={navLinkClasses}>
              <Home className="h-4 w-4" />
              <span>Home</span>
            </NavLink>
            <NavLink
              title="Search for Jobs"
              to="/find-jobs"
              className={navLinkClasses}
            >
              <Search className="h-4 w-4" />
              <span>Search for Jobs</span>
            </NavLink>
            {user && user?.role === "jobSeeker" && (
              <NavLink
                title="Messages"
                to="/JobSeekerChatBox"
                className={navLinkClasses}
              >
                <div className="relative">
                  <MessageSquare className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </div>
                <span>Messages</span>
              </NavLink>
            )}

            {user && user?.role === "admin" && (
              <NavLink
                title="Messages"
                to="/admin-chat-box"
                className={navLinkClasses}
              >
                <div className="relative">
                  <MessageSquare className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </div>
                <span>Messages</span>
              </NavLink>
            )}

            {user && user?.role === "employer" && (
              <NavLink
                title="Messages"
                to="/EmployerChatBox"
                className={navLinkClasses}
              >
                <div className="relative">
                  <MessageSquare className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </div>
                <span>Messages</span>
              </NavLink>
            )}
          </div>

          <div className="flex gap-4 items-center">
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
              <a
                href="/login"
                title="Login to your account"
                className="bg-sky-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-sky-700 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
              >
                Login
              </a>
            )}
            {openMenu ? (
              <X
                className="w-6 h-6 block sm:hidden"
                onClick={() => {
                  setOpenMenu(false);
                }}
              />
            ) : (
              <Menu
                className="w-6 h-6 block sm:hidden"
                onClick={() => setOpenMenu(!openMenu)}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
