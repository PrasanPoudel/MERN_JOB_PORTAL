import React, { useEffect, useState } from "react";
import { Home, Menu, X, Search, MessageSquare } from "lucide-react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import {
  NAVIGATION_MENU_EMPLOYER,
  NAVIGATION_MENU_ADMIN,
} from "../../utils/data";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import NavigationItem from "./NavigationItem";
import logo from "../../assets/logo.png";
import ProfileDropdown from "./ProfileDropdown";

const DashboardLayout = ({ activeMenu, children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState(
    activeMenu || "employer-dashboard",
  );
  const [isMobile, setIsMobile] = useState(false);
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
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleNavigation = (itemId) => {
    setActiveNavItem(itemId);
    navigate(`/${itemId}`);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

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
    `flex text-md items-center gap-1 p-2 font-medium rounded-xl transition-colors duration-200 hover:underline hover:text-gray-900
     ${isActive ? "underline text-sky-600" : "text-gray-700"}`;

  return (
    <div className="flex h-screen bg-white min-w-full">
      <div
        id="sidebar"
        className={`fixed inset-0 min-h-screen left-0 transition-transform duration-200 transform z-1000 ${
          isMobile
            ? sidebarOpen
              ? "translate-x-0 w-full"
              : "-translate-x-full"
            : "translate-x-0"
        } bg-white border-r-2 w-64 border-gray-200`}
      >
        {!sidebarOpen && (
          <div className="flex items-start border-b-2 p-2 border-gray-300">
            <Link
              title="Go to Homepage"
              className="flex items-center w-full"
              to="/"
            >
              <img src={logo} className="w-24 h-14 mix-blend-multiply" />
            </Link>
            {sidebarOpen && (
              <X
                className="w-6 h-6"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              />
            )}
          </div>
        )}
        {sidebarOpen && (
          <div className="px-4 py-2 flex justify-end">
            <X
              className="w-6 h-6"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            />
          </div>
        )}
        {/* Navigation */}

        {user?.role === "employer" && (
          <nav className="px-4 pt-6 space-y-1" id="navigation">
            {NAVIGATION_MENU_EMPLOYER.map((item) => (
              <NavigationItem
                key={item.id}
                item={item}
                isActive={activeNavItem === item.id}
                onClick={handleNavigation}
              />
            ))}
          </nav>
        )}

        {user?.role === "admin" && (
          <nav className="px-4 pt-6 space-y-1" id="navigation">
            {NAVIGATION_MENU_ADMIN.map((item) => (
              <NavigationItem
                key={item.id}
                item={item}
                isActive={activeNavItem === item.id}
                onClick={handleNavigation}
              />
            ))}
          </nav>
        )}
      </div>

      {/* main content */}
      <div
        className={`flex flex-1 flex-col transition-all duration-200 ${
          isMobile ? "ml-0" : "ml-64"
        }`}
      >
        <header className="sticky top-0 bg-white/80 backdrop-blur-sm border-b-2 border-gray-200 h-18 flex items-center justify-between p-2 z-500">
          <div className="flex items-center">
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors delay-300"
              >
                {sidebarOpen ? "" : <Menu className="h-6 w-6" />}
              </button>
            )}
            <div className="flex items-center">
              {!sidebarOpen && isMobile && (
                <img src={logo} className="w-14 h-10 mix-blend-multiply" />
              )}
              <div>
                <h1 className="text-xs sm:text-base font-semibold hidden lg:block text-gray-900">
                  Welcome back !
                </h1>
                <p className="text-sm text-gray-600 hidden lg:block">
                  Get to know what's happening with your{" "}
                  {user?.role === "admin" ? "platform" : "jobs"}.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center">
              <NavLink title="Go to Homepage" to="/" className={navLinkClasses}>
                <Home className="sm:h-6 sm:w-6 h-4 w-4" />
                <span className="hidden md:block">Home</span>
              </NavLink>
              <NavLink
                title="Search for Jobs"
                to="/find-jobs"
                className={navLinkClasses}
              >
                <Search className="sm:h-6 sm:w-6 h-4 w-4" />
                <span className="hidden md:block">Search for Jobs</span>
              </NavLink>
              {user && user?.role === "admin" && (
                <NavLink
                  title="Messages"
                  to="/admin-chat-box"
                  className={navLinkClasses}
                >
                  <div className="relative">
                    <MessageSquare className="sm:h-6 sm:w-6 h-4 w-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </div>
                  <span className="hidden md:block">Messages</span>
                </NavLink>
              )}
              {user && user?.role === "employer" && (
                <NavLink
                  title="Messages"
                  to="/EmployerChatBox"
                  className={navLinkClasses}
                >
                  <div className="relative">
                    <MessageSquare className="sm:h-6 sm:w-6 h-4 w-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </div>
                  <span className="hidden md:block">Messages</span>
                </NavLink>
              )}
            </div>
            {user && isAuthenticated && (
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
            )}
          </div>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
