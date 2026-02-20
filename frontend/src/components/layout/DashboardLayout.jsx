import React, { useEffect, useState } from "react";
import { Building2, Home, LogOut, Menu, X } from "lucide-react";
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

const DashboardLayout = ({ activeMenu, children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState(
    activeMenu || "employer-dashboard",
  );
  const [isMobile, setIsMobile] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

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
    const interval = setInterval(fetchUnreadCount, 5000);

    return () => clearInterval(interval);
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

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
  };
  return (
    <div className="flex h-screen bg-white min-w-full">
      {showLogoutConfirm && (
        <div className="fixed inset-0 min-h-screen min-w-full bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-80 p-5 shadow-2xl mx-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">
                Confirm Sign Out
              </h3>
              <X
                onClick={() => setShowLogoutConfirm(false)}
                className="h-4 w-4 text-gray-500 cursor-pointer"
              />
            </div>

            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to sign out of your account?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        id="sidebar"
        className={`fixed inset-0 min-h-screen left-0 transition-transform duration-200 transform z-50 ${
          isMobile
            ? sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"
        } ${
          sidebarCollapsed ? "w-16" : "w-64"
        } bg-white border-r-2 border-gray-200`}
      >
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
        <Link className={`flex items-center mt-2 w-32`} to="/find-jobs">
          <img src={logo} className="w-30 h-full" />
        </Link>

        {/* Navigation */}

        {user?.role === "employer" && (
          <nav className="p-4 space-y-2" id="navigation">
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
          <nav className="p-4 space-y-2" id="navigation">
            {NAVIGATION_MENU_ADMIN.map((item) => (
              <NavigationItem
                key={item.id}
                item={item}
                isActive={activeNavItem === item.id}
                onClick={handleNavigation}
                isCollapsed={sidebarCollapsed}
                unreadCount={item.id === "admin-chat" ? unreadCount : 0}
              />
            ))}
          </nav>
        )}

        <div className="absolute bottom-4 left-4 right-4">
          <button
            className="w-full flex items-center px-3 py-2.5 font-medium rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200  cursor-pointer"
            onClick={() => setShowLogoutConfirm(true)}
          >
            <LogOut className="h-5 w-5 text-gray-600" />
            {!sidebarCollapsed && <span className="ml-3">Sign Out</span>}
          </button>
        </div>
      </div>

      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
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
        <header className="sticky top-0 bg-white/80 backdrop-blur-sm border-b-2 border-gray-200 h-16 lg:h-20 flex items-center justify-between px-4">
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
              <h1 className="text-base font-semibold text-gray-900">
                Welcome back !
              </h1>
              <p className="text-sm text-gray-600 hidden sm:block">
                Get to know what's happening with your{" "}
                {user?.role === "admin" ? "platform" : "jobs"}.
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-sky-50 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:block">Home</span>
            </Link>
            <div
              onClick={() => {
                navigate(
                  user?.role === "admin"
                    ? "/admin-dashboard"
                    : "/employer-profile",
                );
              }}
              className="flex items-center gap-2 lg:p-2 rounded-full lg:rounded-lg h-[80%] overflow-hidden cursor-pointer hover:bg-gray-100 shadow-sm shadow-black/20"
            >
              {user?.avatar && (
                <img
                  src={user?.avatar}
                  className="w-12 h-full object-fill rounded-2xl"
                />
              )}
              <div className="hidden lg:block">
                <p className="text-gray-900 font-semibold text-sm">
                  {user?.name}
                </p>
                {user?.role === "employer" && (
                  <p className="text-xs text-gray-700 font-medium flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    {user?.companyName}
                  </p>
                )}
                <p className="text-xs text-gray-600">{user?.email}</p>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
