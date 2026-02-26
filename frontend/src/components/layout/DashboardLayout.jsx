import React, { useEffect, useState } from "react";
import { Building2, Home, LogOut, Menu, X, BadgeCheck, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
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
  const [unreadCount, setUnreadCount] = useState(0);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [pollingInterval, setPollingInterval] = useState(null);

  useEffect(() => {
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
    setPollingInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

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

  return (
    <div className="flex h-screen bg-white min-w-full">
      <div
        id="sidebar"
        className={`fixed inset-0 min-h-screen left-0 transition-transform duration-200 transform z-1000 ${
          isMobile
            ? sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"
        } ${
          sidebarCollapsed ? "w-16" : "w-64"
        } bg-white border-r-2 border-gray-200`}
      >
        <div className="flex items-start">
          <Link className={`flex items-center mt-2 w-32`} to="/">
            <img src={logo} className="w-30 h-full" />
          </Link>
          {sidebarOpen && (
            <div className="w-full flex justify-end p-2">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors delay-300"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          )}
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
                unreadCount={item.id === "EmployerChatBox" ? unreadCount : 0}
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
                unreadCount={item.id === "admin-chat-box" ? unreadCount : 0}
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
        <header className="sticky top-0 bg-white/80 backdrop-blur-sm border-b-2 border-gray-200 h-16 lg:h-20 flex items-center justify-between px-4 z-500">
          <div className="flex items-center space-x-4">
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors delay-300"
              >
                {sidebarOpen ? (
                  <X className="h-5 w-5 text-gray-600" />
                ) : (
                  <Menu className="h-5 w-5 text-gray-600" />
                )}
              </button>
            )}
            <div>
              <h1 className="text-xs sm:text-base font-semibold text-gray-900">
                Welcome back !
              </h1>
              <p className="text-sm text-gray-600 hidden sm:block">
                Get to know what's happening with your{" "}
                {user?.role === "admin" ? "platform" : "jobs"}.
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex gap-1 items-center">
            <Link
            title="Go to Homepage"
              to="/"
              className="px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-sky-50 cursor-pointer"
            >
              <Home className="w-6 h-6" />
            </Link>
            <Link
            title="Search for Jobs"
              to="/find-jobs"
              className="px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-sky-50 cursor-pointer"
            >
              <Search className="w-6 h-6" />
            </Link>
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
