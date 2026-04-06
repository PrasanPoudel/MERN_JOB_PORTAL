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
  Edit3,
  Building2,
  UserCog,
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
          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <img
            src={avatar || "/default.png"}
            alt="avatar"
            className="h-9 w-9 rounded-full border border-gray-200 object-cover"
          />
          <div className="hidden md:flex flex-col text-left">
            <p className="flex items-center gap-1 text-sm font-semibold text-gray-900 leading-tight">
              {name || "User"}
              {isPremium && (
                <span
                  title="Premium User"
                  className="text-white p-1 rounded-lg bg-yellow-400"
                >
                  <Crown className="w-3.5 h-3.5" />
                </span>
              )}
            </p>
            <p className="text-xs text-gray-500 leading-tight">{roleLabel}</p>
            {role === "employer" && companyName && (
              <div className="flex items-center gap-1">
                <p className="text-xs text-gray-500 max-w-32 truncate leading-tight">
                  {companyName}
                </p>
                {isCompanyVerified && (
                  <BadgeCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                )}
              </div>
            )}
          </div>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute -right-12 sm:right-12 mt-4 w-72 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <p className="flex items-center gap-1 text-sm font-semibold text-gray-900 truncate">
                {name || "User"}
                {isPremium && (
                  <span
                    title="Premium User"
                    className="text-white p-1 rounded-lg bg-yellow-400"
                  >
                    <Crown className="w-3.5 h-3.5" />
                  </span>
                )}
              </p>
              {role === "employer" && companyName && (
                <p className="flex items-center gap-1 text-sm text-gray-600 truncate">
                  <Building2 className="w-4 h-4" />
                  {companyName}
                  {isCompanyVerified && (
                    <BadgeCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  )}
                </p>
              )}
              <p className="text-xs text-gray-600 truncate mt-0.5">{email}</p>
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
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-gray-500" />
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
                  className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <UserCog className="w-4 h-4 text-gray-500" />
                    Account & Settings
                  </span>
                  {accountSettingsOpen ? (
                    <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  )}
                </button>

                {accountSettingsOpen && (
                  <div className="flex bg-gray-50 border border-t-0 border-gray-100 rounded-b-2xl flex-col pl-6 space-y-0.5">
                    {role === "jobSeeker" && (
                      <div
                        onClick={() => navigate("/profile")}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors"
                      >
                        <User className="w-4 h-4 text-gray-500" />
                        View Profile
                      </div>
                    )}
                    {role === "employer" && (
                      <div
                        onClick={() => navigate("/employer-profile")}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors"
                      >
                        <Building2 className="w-4 h-4 text-gray-500" />
                        Company Profile
                      </div>
                    )}

                    {role === "admin" && (
                      <div
                        onClick={() => navigate("/edit-admin-profile")}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors"
                      >
                        <Edit3 className="w-4 h-4 text-gray-500" />
                        Edit Profile
                      </div>
                    )}

                    <div
                      onClick={() => navigate("/change-password")}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      <UserLock className="w-4 h-4 text-gray-500" />
                      Change Password
                    </div>

                    <div
                      onClick={() =>
                        navigate("/delete-account", {
                          state: { userEmail: email, userRole: role },
                        })
                      }
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-red-50 cursor-pointer transition-colors hover:text-red-600"
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
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <BriefcaseBusiness className="w-4 h-4 text-gray-500" />
                    My Applications
                  </div>

                  <div
                    onClick={() => navigate("/saved-jobs")}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <BookmarkCheck className="w-4 h-4 text-gray-500" />
                    Saved Jobs
                  </div>
                </>
              )}

              {/* Divider */}
              <div className="border-t border-gray-100 my-1.5" />

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
              <h3 className="text-sm font-bold text-gray-900">
                Confirm Sign Out
              </h3>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-5">
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
