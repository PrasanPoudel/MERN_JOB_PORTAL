import React, { useState } from "react";
import {
  ChevronDown,
  LogOut,
  User,
  X,
  BriefcaseBusiness,
  BookmarkCheck,
  MessageSquare,
  Plus,
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
}) => {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    onLogout();
  };

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={onToggle}
        className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 transition cursor-pointer"
      >
        {avatar ? (
          <img
            src={avatar}
            alt="avatar"
            className="h-10 w-10 rounded-full object-fill"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-sky-600 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900">{name}</p>
          <p className="text-xs text-gray-600">
            {role === "employer" ? "Employer" : "Job Seeker"}
          </p>
        </div>

        <ChevronDown className="h-4 w-4 text-gray-700" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-gray-100">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{name}</p>
            <p className="text-xs text-gray-600 truncate">{email}</p>
          </div>

          <div className="p-2 space-y-2">
            <div
              onClick={() =>
                navigate(
                  role === "jobSeeker" ? "/profile" : "/employer-profile",
                )
              }
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-sky-50 cursor-pointer"
            >
              <User className="h-4 w-4 " />
              View Profile
            </div>

            {role === "jobSeeker" && (
              <>
              <div
                onClick={() =>
                  navigate("/applied-applications")
                }
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-sky-50 cursor-pointer"
              >
                <BriefcaseBusiness className="h-4 w-4 " />
                My Applications
              </div>
  
              <div
                onClick={() =>
                  navigate("/saved-jobs")
                }
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-sky-50 cursor-pointer"
              >
                <BookmarkCheck className="h-4 w-4 " />
                Saved Jobs
              </div>
              </>
            )}

            {role === "employer" && (
              <>
              <div
                onClick={() =>
                  navigate("/manage-jobs")
                }
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-sky-50 cursor-pointer"
              >
                <BriefcaseBusiness className="h-4 w-4 " />
                Manage Jobs
              </div>
  
              <div
                onClick={() =>
                  navigate("/post-job")
                }
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-sky-50 cursor-pointer"
              >
                <Plus className="h-4 w-4 " />
                Post Job
              </div>

              <div
                onClick={() =>
                  navigate("/EmployerChatBox")
                }
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-sky-50 cursor-pointer"
              >
                <MessageSquare className="h-4 w-4 " />
                Messages
              </div>
              </>
            )}

            <div
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </div>
          </div>
        </div>
      )}

      {showLogoutConfirm && (
        <div className="fixed inset-0 min-h-screen min-w-screen bg-black/60 flex items-center justify-center z-50">
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
    </div>
  );
};

export default ProfileDropdown;
