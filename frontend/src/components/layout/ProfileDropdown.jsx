import React, { useState } from "react";
import {
  ChevronDown,
  LogOut,
  User,
  X,
  BriefcaseBusiness,
  BookmarkCheck,
  LayoutDashboard,
  BadgeCheck,
  ChevronUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileDropdown = ({
  isOpen,
  onToggle,
  onLogout,
  avatar,
  name,
  email,
  role,
  companyName,
  isCompanyVerified,
}) => {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    onLogout();
  };

  return (
    <div className="z-100">
      {/* Profile Button */}
      <button
        onClick={onToggle}
        title="Open profile menu"
        className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 transition cursor-pointer"
      >
        {avatar ? (
          <img
            src={avatar}
            alt="avatar"
            className="h-10 w-10 rounded-full border border-gray-200 object-cover"
          />
        ) : (
          <img
            src="/default.png"
            alt="avatar"
            className="h-10 w-10 rounded-full object-cover"
          />
        )}

        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900">{name}</p>
          <p className="text-xs text-gray-600">
            {role === "employer"
              ? "Employer"
              : role === "admin"
                ? "Admin"
                : "Job Seeker"}
          </p>
          {role === "employer" && companyName && (
            <p className="text-xs text-gray-600 flex items-center gap-1">
              <span className="max-w-32 truncate">{companyName}</span>
              {isCompanyVerified && (
                <BadgeCheck className="w-4 h-3 text-sky-600" />
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

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-gray-100">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{name}</p>
            {role === "employer" && companyName && (
              <p className="text-xs text-gray-600 flex items-center gap-1">
                <span className="max-w-32 truncate">{companyName}</span>
                {isCompanyVerified && (
                  <BadgeCheck className="w-4 h-3 text-sky-600" />
                )}
              </p>
            )}
            <p className="text-xs text-gray-600 truncate">{email}</p>
          </div>
          <div className="p-2 space-y-2">
            {(role === "employer" || role === "admin") && (
              <div
                onClick={() =>
                  navigate(
                    role === "admin"
                      ? "/admin-dashboard"
                      : "employer-dashboard",
                  )
                }
                title="Go to dashboard"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-sky-50 cursor-pointer"
              >
                <LayoutDashboard className="h-4 w-4 " />
                Dashboard
              </div>
            )}
            {role === "jobSeeker" && (
              <>
                <div
                  onClick={() => navigate("/profile")}
                  title="View your applications"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-sky-50 cursor-pointer"
                >
                  <User className="h-4 w-4 " />
                  View Profile
                </div>

                <div
                  onClick={() => navigate("/applied-applications")}
                  title="View your applications"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-sky-50 cursor-pointer"
                >
                  <BriefcaseBusiness className="h-4 w-4 " />
                  My Applications
                </div>

                <div
                  onClick={() => navigate("/saved-jobs")}
                  title="View saved jobs"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-sky-50 cursor-pointer"
                >
                  <BookmarkCheck className="h-4 w-4 " />
                  Saved Jobs
                </div>
              </>
            )}

            <div
              onClick={() => setShowLogoutConfirm(true)}
              title="Sign out of your account"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </div>
          </div>
        </div>
      )}

      {showLogoutConfirm && (
        <div className="absolute top-0 left-0 inset-0 min-h-screen min-w-full bg-black/60 flex items-center justify-center z-1200">
          <div className="bg-white rounded-xl w-80 p-5 shadow-2xl mx-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">
                Confirm Sign Out
              </h3>
              <X
                onClick={() => setShowLogoutConfirm(false)}
                title="Close"
                className="h-4 w-4 text-gray-500 cursor-pointer"
              />
            </div>

            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to sign out of your account?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                title="Cancel sign out"
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                title="Confirm sign out"
                className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 cursor-pointer"
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
