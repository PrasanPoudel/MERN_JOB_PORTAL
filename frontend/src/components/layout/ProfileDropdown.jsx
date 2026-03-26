import React, { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  ChevronUp,
  LogOut,
  User,
  UserLock,
  LayoutDashboard,
  BriefcaseBusiness,
  BookmarkCheck,
  BadgeCheck,
  Trash2,
  X,
  Crown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileDropdown = ({
  isOpen,
  onToggle,
  onLogout,
  avatar,
  name,
  isPremium,
  email,
  role,
  companyName,
  isCompanyVerified,
  dashboardSignout,
}) => {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(false);

  const dropdownRef = useRef(null);

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    onLogout();
  };

  const roleLabel =
    role === "employer"
      ? "Employer"
      : role === "admin"
        ? "Admin"
        : "Job Seeker";

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (isOpen) onToggle();
        setAccountSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen, onToggle]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={onToggle}
        title="Open profile menu"
        className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
      >
        <img
          src={avatar || "/default.png"}
          alt="avatar"
          className="h-10 w-10 rounded-full border border-gray-200 object-cover"
        />
        <div className="hidden md:flex flex-col text-left">
          <p className="flex items-center gap-1 text-sm font-semibold text-gray-900">
            {name}
            {isPremium && (
              <span
                title="Premium User"
                className="text-white p-1 rounded-2xl bg-yellow-400"
              >
                <Crown className="w-3 h-3" />
              </span>
            )}
          </p>
          <p className="text-xs text-gray-500">{roleLabel}</p>
          {role === "employer" && companyName && (
            <p className="flex items-center gap-1 text-xs text-gray-500 max-w-40 truncate">
              {companyName}{" "}
              {isCompanyVerified && (
                <BadgeCheck className="w-4 h-4 text-sky-600" />
              )}
            </p>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-gray-700" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-700" />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="flex items-center gap-1 text-sm font-semibold text-gray-900 truncate">
              {name}
              {isPremium && (
                <span
                  title="Premium User"
                  className="text-white p-1 rounded-2xl bg-yellow-400"
                >
                  <Crown className="w-3 h-3" />
                </span>
              )}
            </p>
            {role === "employer" && companyName && (
              <p className="flex items-center gap-1 text-xs text-gray-500 truncate">
                {companyName}{" "}
                {isCompanyVerified && (
                  <BadgeCheck className="w-4 h-4 text-sky-600" />
                )}
              </p>
            )}
            <p className="text-xs text-gray-400 truncate">{email}</p>
          </div>

          <div className="flex flex-col p-2 space-y-2">
            {/* Dashboard */}
            {(role === "employer" || role === "admin") && (
              <>
                <div
                  onClick={() =>
                    navigate(
                      role === "admin"
                        ? "/admin-dashboard"
                        : "/employer-dashboard",
                    )
                  }
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-sky-50 cursor-pointer transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </div>
              </>
            )}

            {/* Account & Settings Section */}
            <div className="flex flex-col">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setAccountSettingsOpen((prev) => !prev);
                }}
                className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-sky-50 cursor-pointer transition-colors"
              >
                <span className="flex items-center gap-3">
                  <User className="w-4 h-4" />
                  Account & Settings
                </span>
                {accountSettingsOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {accountSettingsOpen && (
                <div className="flex flex-col pl-8 mt-1 space-y-1">
                  {role === "jobSeeker" && (
                    <div
                      onClick={() => navigate("/profile")}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-sky-50 cursor-pointer transition-colors"
                    >
                      <User className="w-4 h-4" />
                      View Profile
                    </div>
                  )}

                  <div
                    onClick={() => navigate("/change-password")}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-sky-50 cursor-pointer transition-colors"
                  >
                    <UserLock className="w-4 h-4" />
                    Change Password
                  </div>

                  <div
                    onClick={() =>
                      navigate("/delete-account", {
                        state: { userEmail: email, userRole: role },
                      })
                    }
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </div>
                </div>
              )}
            </div>

            {/* Job seeker specific items */}
            {role === "jobSeeker" && (
              <>
                <div
                  onClick={() => navigate("/applied-applications")}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-sky-50 cursor-pointer transition-colors"
                >
                  <BriefcaseBusiness className="w-4 h-4" />
                  My Applications
                </div>

                <div
                  onClick={() => navigate("/saved-jobs")}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-sky-50 cursor-pointer transition-colors"
                >
                  <BookmarkCheck className="w-4 h-4" />
                  Saved Jobs
                </div>
              </>
            )}

            {/* Sign Out for Navbar*/}
            {onLogout && (
              <div
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </div>
            )}

            {/* Sign Out for dashboard layout*/}
            {dashboardSignout && (
              <div
                onClick={dashboardSignout}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </div>
            )}
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 min-h-screen min-w-screen bg-black/60 flex items-center justify-center z-5000">
          <div className="bg-white rounded-xl w-80 p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">
                Confirm Sign Out
              </h3>
              <X
                onClick={() => setShowLogoutConfirm(false)}
                className="h-5 w-5 text-gray-500 cursor-pointer"
              />
            </div>
            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to sign out of your account?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
