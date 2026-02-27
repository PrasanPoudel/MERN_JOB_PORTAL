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
  const sidebarCollapsed = false;

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
    <div className="flex h-screen bg-white min-w-full">
      <div
        id="sidebar"
        className={`fixed inset-0 min-h-screen left-0 transition-transform duration-200 transform z-1000 ${
          isMobile
            ? sidebarOpen
              ? "translate-x-0 w-full"
              : "-translate-x-full"
            : "translate-x-0"
        } ${
          sidebarCollapsed ? "w-16" : "w-64"
        } bg-white border-r-2 border-gray-200`}
      >
        <div className="flex items-start border-b-2 py-2 border-gray-300">
          <Link
            title="Go to Homepage"
            className="flex items-center mt-2 w-full"
            to="/"
          >
            <img src={logo} className="w-32 h-24 mix-blend-multiply" />
          </Link>
        </div>
        {/* Navigation */}

        {user?.role === "employer" && (
          <nav className="p-2 space-y-1" id="navigation">
            {NAVIGATION_MENU_EMPLOYER.map((item) => (
              <NavigationItem
                key={item.id}
                item={item}
                isActive={activeNavItem === item.id}
                onClick={handleNavigation}
                isCollapsed={sidebarCollapsed}
              />
            ))}
          </nav>
        )}

        {user?.role === "admin" && (
          <nav className="p-2 space-y-1" id="navigation">
            {NAVIGATION_MENU_ADMIN.map((item) => (
              <NavigationItem
                key={item.id}
                item={item}
                isActive={activeNavItem === item.id}
                onClick={handleNavigation}
                isCollapsed={sidebarCollapsed}
              />
            ))}
          </nav>
        )}
      </div>

      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => {
            setSidebarOpen(false);
          }}
        />
      )}

      {/* main content */}
      <div
        className={`flex flex-1 flex-col transition-all duration-200 ${
          isMobile ? "ml-0" : sidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <header className="sticky top-0 bg-white/80 backdrop-blur-sm border-b-2 border-gray-200 h-20 flex items-center justify-between px-4 z-500">
          <div className="flex items-center space-x-4">
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors delay-300"
              >
                {sidebarOpen ? "" : <Menu className="h-5 w-5 text-gray-600" />}
              </button>
            )}
            <div>
              <h1 className="text-xs sm:text-base font-semibold hidden sm:block text-gray-900">
                Welcome back !
              </h1>
              <p className="text-sm text-gray-600 hidden sm:block">
                Get to know what's happening with your{" "}
                {user?.role === "admin" ? "platform" : "jobs"}.
              </p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <div className="flex items-center">
              <NavLink title="Go to Homepage" to="/" className={navLinkClasses}>
                <Home className="w-6 h-6" />
              </NavLink>
              <NavLink
                title="Search for Jobs"
                to="/find-jobs"
                className={navLinkClasses}
              >
                <Search className="w-6 h-6" />
              </NavLink>
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
              {user && user?.role === "employer" && (
                <NavLink
                  title="Messages"
                  to="/EmployerChatBox"
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
            </div>
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
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
