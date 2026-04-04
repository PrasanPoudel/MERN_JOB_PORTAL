import React, { useEffect, useState } from "react";
import {
  Home,
  Menu,
  MessageSquare,
  X,
  Calendar,
} from "lucide-react";
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
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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
        setUnreadCount(response?.data?.totalUnreadCount || 0);
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
    `flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
      isActive
        ? "text-sky-600 bg-sky-50"
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
    }`;

  const handleDashboardSignout = () => {
    setShowLogoutConfirm(true);
  };
  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
  };

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Helper: render nav items with sections (both employer and admin use section-based structure)
  const renderNavItems = () => {
    return navMenu.map((section, idx) => (
      <div key={section.section} className={idx > 0 ? "mt-4" : ""}>
        <p className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {section.section}
        </p>
        <div className="space-y-0.5">
          {section.items.map((item) => (
            <NavigationItem
              key={item.id}
              item={item}
              isActive={activeNavItem === item.id}
              onClick={handleNavigation}
            />
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-1000 flex flex-col bg-white border-r border-slate-200 w-64",
          "transition-all duration-300 ease-in-out",
          isMobile
            ? sidebarOpen
              ? "translate-x-0 shadow-xl"
              : "-translate-x-full"
            : "translate-x-0",
        ].join(" ")}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 shrink-0">
          {!isMobile && (
            <Link to="/" className="flex items-center overflow-hidden">
              <img
                src={logo}
                alt="Logo"
                className="h-16 w-24 object-contain shrink-0"
              />
            </Link>
          )}
          {isMobile && (
            <div className="flex justify-between items-center w-full">
              <Link to="/" className="flex items-center overflow-hidden">
                <img
                  src={logo}
                  alt="Logo"
                  className="h-10 w-12 object-contain shrink-0"
                />
              </Link>
              <button
                title="Close sidebar"
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {renderNavItems()}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-200 shrink-0">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-xs text-slate-500">Online</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={[
          "flex flex-col flex-1 min-w-0 transition-all duration-300",
          isMobile ? "ml-0" : "ml-64",
        ].join(" ")}
      >
        {/* Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between px-3 sm:px-5 bg-white/90 backdrop-blur-md border-b border-slate-200 shrink-0 h-14">
          <div className="flex items-center gap-2 min-w-0">
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}

            {!isMobile && (
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 leading-snug text-base truncate">
                  Welcome back
                  {user?.name ? `, ${user.name.split(" ")[0]}` : ""}
                </p>
                <p className="flex items-center gap-1 text-sm text-slate-600 leading-snug truncate">
                  <Calendar className="w-6 h-6"/>
                  {formattedDate}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <NavLink to="/" className={headerNavLink} title="Home">
              <Home className="w-6 h-6 shrink-0" />
              <span className="hidden md:inline">Home</span>
            </NavLink>

            {user && (
              <NavLink
                to={chatRoute}
                className={headerNavLink}
                title="Messages"
              >
                <span className="relative flex items-center">
                  <MessageSquare className="w-6 h-6 shrink-0" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white px-0.5 border-2 border-white">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </span>
                <span className="hidden md:inline">Messages</span>
              </NavLink>
            )}

            <div className="hidden sm:block border-l border-slate-200 h-5 mx-0.5" />

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
                  dashboardSignout={handleDashboardSignout}
                />
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-2 sm:p-4">{children}</div>
        </main>
      </div>

      {/* Logout Confirmation */}
      {showLogoutConfirm && (
        <div className="fixed h-screen w-full inset-0 bg-black/60 flex items-center justify-center z-1000">
          <div className="card-elevated w-80 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Confirm Sign Out
              </h3>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-5">
              Are you sure you want to sign out of your account?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="btn-secondary-sm"
              >
                Cancel
              </button>
              <button onClick={handleConfirmLogout} className="btn-danger-sm">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
