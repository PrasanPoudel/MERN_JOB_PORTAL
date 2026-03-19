import React, { useEffect, useState } from "react";
import { Home, Menu, Search, MessageSquare, X } from "lucide-react";
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
    const interval = setInterval(fetchUnreadCount, 10000);
    return () => clearInterval(interval);
  }, [user, isAuthenticated]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileDropdownOpen && !e.target.closest("[data-profile-dropdown]")) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileDropdownOpen]);

  const handleNavigation = (itemId) => {
    setActiveNavItem(itemId);
    navigate(`/${itemId}`);
    if (isMobile) setSidebarOpen(false);
  };

  const navMenu =
    user?.role === "admin" ? NAVIGATION_MENU_ADMIN : NAVIGATION_MENU_EMPLOYER;
  const chatRoute =
    user?.role === "admin" ? "/admin-chat-box" : "/EmployerChatBox";

  const headerNavLink = ({ isActive }) =>
    `flex text-md gap-1 items-center p-1 font-medium  rounded-xl transition-colors duration-200 hover:underline hover:text-gray-900
     ${isActive ? "text-sky-600" : "text-gray-500"}`;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f9f9f8]">
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/25 backdrop-blur-[2px] transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 flex flex-col w-64 bg-white border-r border-gray-200",
          "transition-transform duration-300 ease-in-out",
          isMobile
            ? sidebarOpen
              ? "translate-x-0 shadow-2xl"
              : "-translate-x-full"
            : "translate-x-0",
        ].join(" ")}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 shrink-0">
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="Logo"
              className="h-16 w-24 mix-blend-multiply"
            />
          </Link>
          {isMobile && (
            <button
              title="Close"
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
          )}
        </div>

        {/* Nav items */}
        <nav className="space-y-1 p-2">
          {navMenu.map((item) => (
            <NavigationItem
              key={item.id}
              item={item}
              isActive={activeNavItem === item.id}
              onClick={handleNavigation}
            />
          ))}
        </nav>
      </aside>
      <div
        className={[
          "flex flex-col flex-1 min-w-0 transition-all duration-300",
          isMobile ? "ml-0" : "ml-64",
        ].join(" ")}
      >
        <header className="sticky top-0 z-20 flex items-center justify-between px-3 sm:px-5 bg-white/80 backdrop-blur-md border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 -ml-1 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors shrink-0"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            {isMobile && (
              <img
                src={logo}
                alt=""
                className="h-12 w-16 mix-blend-multiply shrink-0"
              />
            )}

            {!isMobile && (
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 leading-snug">
                  Welcome back
                  {user?.name ? `, ${user.name.split(" ")[0]}` : ""}
                </p>
                <p className="text-sm text-gray-600 leading-snug hidden sm:block">
                  {user?.role === "admin"
                    ? "Here's what's happening on your platform"
                    : "Here's an overview of your active jobs"}
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-0.5 shrink-0">
            <NavLink to="/" className={headerNavLink}>
              <Home className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Home</span>
            </NavLink>

            <NavLink to="/find-jobs" className={headerNavLink}>
              <Search className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Search for Jobs</span>
            </NavLink>

            {user && (
              <NavLink to={chatRoute} className={headerNavLink}>
                <span className="relative flex items-center">
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white px-0.5 border-2 border-white">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </span>
                <span className="hidden sm:inline">Messages</span>
              </NavLink>
            )}
            <div className="border h-5 border-gray-200 mx-1" />

            {user && isAuthenticated && (
              <div data-profile-dropdown>
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
            )}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
