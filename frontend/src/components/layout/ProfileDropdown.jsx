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
    <>
      <div className="relative" ref={dropdownRef}>
        {/* Profile Button */}
        <button
          onClick={onToggle}
          title="Open profile menu"
          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <img
            src={avatar || "/default.png"}
            alt="avatar"
            className="h-9 w-9 rounded-full border border-slate-200 object-cover"
          />
          <div className="hidden md:flex flex-col text-left">
            <p className="flex items-center gap-1 text-sm font-semibold text-slate-900 leading-tight">
              {name || "User"}
              {isPremium && (
                <span title="Premium User" className="text-amber-500">
                  <Crown className="w-3.5 h-3.5" />
                </span>
              )}
            </p>
            <p className="text-xs text-slate-500 leading-tight">{roleLabel}</p>
            {role === "employer" && companyName && (
              <p className="flex items-center gap-1 text-xs text-slate-500 max-w-36 truncate leading-tight">
                {companyName}
                {isCompanyVerified && (
                  <BadgeCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                )}
              </p>
            )}
          </div>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-slate-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-500" />
          )}
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-4 w-60 bg-white rounded-xl shadow-lg border border-slate-200 z-50 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
              <p className="flex items-center gap-1 text-sm font-semibold text-slate-900 truncate">
                {name || "User"}
                {isPremium && (
                  <span title="Premium User" className="text-amber-500">
                    <Crown className="w-3.5 h-3.5" />
                  </span>
                )}
              </p>
              {role === "employer" && companyName && (
                <p className="flex items-center gap-1 text-xs text-slate-500 truncate">
                  {companyName}
                  {isCompanyVerified && (
                    <BadgeCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  )}
                </p>
              )}
              <p className="text-xs text-slate-400 truncate mt-0.5">{email}</p>
            </div>

            <div className="flex flex-col p-1.5">
              {/* Dashboard */}
              {(role === "employer" || role === "admin") && (
                <div
                  onClick={() =>
                    navigate(
                      role === "admin"
                        ? "/admin-dashboard"
                        : "/employer-dashboard",
                    )
                  }
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-500" />
                  Dashboard
                </div>
              )}

              {/* Account & Settings Section */}
              <div className="flex flex-col">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setAccountSettingsOpen((prev) => !prev);
                  }}
                  className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <User className="w-4 h-4 text-slate-500" />
                    Account & Settings
                  </span>
                  {accountSettingsOpen ? (
                    <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </button>

                {accountSettingsOpen && (
                  <div className="flex flex-col pl-6 mt-0.5 space-y-0.5">
                    {role === "jobSeeker" && (
                      <div
                        onClick={() => navigate("/profile")}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
                      >
                        <User className="w-4 h-4 text-slate-500" />
                        View Profile
                      </div>
                    )}

                    <div
                      onClick={() => navigate("/change-password")}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
                    >
                      <UserLock className="w-4 h-4 text-slate-500" />
                      Change Password
                    </div>

                    <div
                      onClick={() =>
                        navigate("/delete-account", {
                          state: { userEmail: email, userRole: role },
                        })
                      }
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
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
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
                  >
                    <BriefcaseBusiness className="w-4 h-4 text-slate-500" />
                    My Applications
                  </div>

                  <div
                    onClick={() => navigate("/saved-jobs")}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
                  >
                    <BookmarkCheck className="w-4 h-4 text-slate-500" />
                    Saved Jobs
                  </div>
                </>
              )}

              {/* Divider */}
              <div className="border-t border-slate-100 my-1.5" />

              {/* Sign Out */}
              {onLogout && (
                <div
                  onClick={() => setShowLogoutConfirm(true)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </div>
              )}

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
      </div>
      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 h-screen w-full bg-black/60 flex items-center justify-center z-1000">
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
    </>
  );
};

export default ProfileDropdown;
