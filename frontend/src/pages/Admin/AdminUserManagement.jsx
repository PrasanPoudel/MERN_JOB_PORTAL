import { useEffect, useState } from "react";
import {
  Crown,
  Loader,
  Users,
  Search,
  X,
  MapPin,
  Building2,
  Calendar,
  FileText,
  Bookmark,
  BriefcaseBusiness,
  BadgeCheck,
  User,
  ShieldBan,
  ShieldCheck,
  AlertTriangle,
  ShieldUser,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layout/DashboardLayout";
import toast from "react-hot-toast";

const AdminUserManagement = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [confirmDeleteUser, setConfirmDeleteUser] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [banUserId, setBanUserId] = useState(null);
  const [banReason, setBanReason] = useState("");
  const [banning, setBanning] = useState(false);

  // Pagination
  const itemsPerPage = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const getAllUsers = async (page = 1) => {
    try {
      setIsLoading(true);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
      });

      if (roleFilter !== "all") {
        params.append("role", roleFilter);
      }
      if (userFilter !== "all") {
        params.append("user", userFilter);
      }
      if (debouncedSearchTerm) {
        params.append("search", debouncedSearchTerm);
      }

      const response = await axiosInstance.get(
        `${API_PATHS.ADMIN.GET_ALL_USERS}?${params.toString()}`,
      );

      setUsers(response.data.users || []);
      setPagination(response.data.pagination || null);
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers(1);
  }, [roleFilter, debouncedSearchTerm, userFilter]);

  useEffect(() => {
    getAllUsers(currentPage);
  }, [currentPage]);

  const handleDeleteUser = async (userId) => {
    try {
      setDeleting(true);
      await axiosInstance.delete(API_PATHS.ADMIN.DELETE_USER(userId));
      toast.success("User deleted successfully");
      // Refresh current page
      getAllUsers(currentPage);
      setConfirmDeleteUser(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  const handleMessageUser = (userId) => {
    navigate(`/admin-chat-box?userId=${userId}`);
  };

  const handleBanUser = async () => {
    if (!banReason.trim()) {
      toast.error("Please provide a ban reason");
      return;
    }

    try {
      setBanning(true);
      await axiosInstance.put(API_PATHS.ADMIN.BAN_USER(banUserId), {
        reason: banReason,
      });
      toast.success("User banned successfully");
      setBanModalOpen(false);
      setBanReason("");
      setBanUserId(null);
      // Refresh current page
      getAllUsers(currentPage);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to ban user");
    } finally {
      setBanning(false);
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      setBanning(true);
      await axiosInstance.put(API_PATHS.ADMIN.UNBAN_USER(userId));
      toast.success("User unbanned successfully");
      // Refresh current page
      getAllUsers(currentPage);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to unban user");
    } finally {
      setBanning(false);
    }
  };

  const getPaginationPages = (currentPage, totalPages) => {
    const pages = [];
    const delta = 2;

    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);

    if (left > 2) {
      pages.push("...");
    }

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (right < totalPages - 1) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <DashboardLayout activeMenu="admin-users-management">
      {confirmDeleteUser && (
        <DeleteConfirmationModal
          user={confirmDeleteUser}
          deleting={deleting}
          onCancel={() => setConfirmDeleteUser(null)}
          onConfirm={handleDeleteUser}
        />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage platform users and activity
            </p>
          </div>

          <div className="bg-sky-50 text-sky-700 px-4 py-2 rounded-xl text-sm font-semibold">
            {pagination?.total || 0} Users
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              autoComplete="off"
              id="search_users"
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            id="select_role"
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="jobSeeker">Job Seekers</option>
            <option value="employer">Employers</option>
          </select>

          <select
            id="select_user"
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500"
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
          >
            <option value="all">Show All Users</option>
            <option value="banned">Show Only Banned Users</option>
            <option value="unbanned">Show Only Unbanned Users</option>
            <option value="premium">Show Only Premium Users</option>
            <option value="nonPremium">Show Only Non Premium Users</option>
          </select>
        </div>

        {/* User Cards */}
        {isLoading ? (
          <div className="text-center py-20">
            <Loader className="animate-spin mx-auto text-sky-600" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <Users className="w-12 h-12 mx-auto text-gray-300 mb-4 shrink-0" />
            <p className="text-gray-600 font-medium">No users found</p>
          </div>
        ) : (
          <>
            {/* Result Summary */}
            <div className="flex justify-between mb-3">
              <div className="flex items-center">
                <p className="text-sm text-gray-700 lg:text-base">
                  Showing{" "}
                  <span className="font-semibold">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold">
                    {Math.min(currentPage * itemsPerPage, pagination.total)}
                  </span>{" "}
                  of <span className="font-semibold">{pagination.total}</span>{" "}
                  results
                </p>
              </div>
            </div>

            <div className="grid gap-6">
              {users.map((user) => (
                <div key={user._id} className="flex flex-col gap-2">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                    <div className="flex flex-col items-start gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-14 h-14 rounded-full bg-sky-100 flex items-center justify-center overflow-hidden shrink-0">
                          <img
                            src={user.avatar || "/default.png"}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-gray-900">
                              {user.name}
                            </p>
                            {user.isPremium && (
                              <span
                                title="Premium User"
                                className="text-white p-1 rounded-lg bg-yellow-400"
                              >
                                <Crown className="w-3.5 h-3.5" />
                              </span>
                            )}
                            {user?.isBanned && (
                              <p className="flex items-center gap-1 text-red-600">
                                <AlertTriangle className="w-4 h-4 text-red-600" />
                                Banned
                              </p>
                            )}
                            <span
                              className={`text-xs px-2 py-0.5 rounded-lg font-medium ${
                                user.role === "employer"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {user.role === "employer"
                                ? "Employer"
                                : "Job Seeker"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {user && user?.companyName && (
                          <span className="flex items-center gap-1 text-sm text-gray-600">
                            <Building2 className="w-3.5 h-3.5 shrink-0" />
                            {user.companyName}
                            {user.role === "employer" &&
                              user.isCompanyVerified && (
                                <BadgeCheck className="w-4 h-4 text-sky-600" />
                              )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="w-full flex flex-wrap gap-2 py-1 justify-end">
                    <button
                      onClick={() => navigate(`/profile/${user?._id}`)}
                      title="View user details"
                      className="px-2 sm:px-4 py-2 cursor-pointer rounded-xl text-xs sm:text-sm font-semibold bg-sky-600 text-white hover:bg-sky-700 transition"
                    >
                      View Details
                    </button>

                    <button
                      onClick={() => handleMessageUser(user._id)}
                      title="Send message to user"
                      className="px-2 sm:px-4 py-2 cursor-pointer rounded-xl text-xs sm:text-sm font-semibold border border-gray-300 hover:bg-gray-100 transition"
                    >
                      Message
                    </button>

                    {user.isBanned ? (
                      <button
                        onClick={() => handleUnbanUser(user._id)}
                        title="Unban this user"
                        className="flex items-center gap-1 px-2 sm:px-4 py-2 cursor-pointer rounded-xl text-xs sm:text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition"
                      >
                        <ShieldUser className="w-4 h-4" />
                        Unban
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setBanUserId(user._id);
                          setBanModalOpen(true);
                        }}
                        title="Ban this user"
                        className="flex items-center gap-1 px-2 sm:px-4 py-2 cursor-pointer rounded-xl text-xs sm:text-sm font-semibold bg-orange-600 text-white hover:bg-orange-700 transition"
                      >
                        <ShieldBan className="w-4 h-4" />
                        Ban
                      </button>
                    )}

                    <button
                      onClick={() => setConfirmDeleteUser(user)}
                      title="Delete this user"
                      className="px-2 sm:px-4 py-2 cursor-pointer rounded-xl text-xs sm:text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.total > itemsPerPage && (
              <div className="mt-8 flex items-center justify-between pb-16">
                {/* Mobile pagination */}
                <div className="flex flex-1 justify-between md:hidden">
                  <button
                    onClick={() => {
                      setCurrentPage(Math.max(1, currentPage - 1));
                      getAllUsers(Math.max(1, currentPage - 1));
                    }}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => {
                      setCurrentPage(
                        Math.min(pagination.totalPages, currentPage + 1),
                      );
                      getAllUsers(
                        Math.min(pagination.totalPages, currentPage + 1),
                      );
                    }}
                    disabled={currentPage === pagination.totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>

                {/* Desktop pagination */}
                <div className="hidden md:flex sm:flex-1 items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-semibold">
                        {(currentPage - 1) * itemsPerPage + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-semibold">
                        {Math.min(currentPage * itemsPerPage, pagination.total)}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold">{pagination.total}</span>{" "}
                      results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex shadow-sm -space-x-px rounded-md">
                      <button
                        onClick={() => {
                          setCurrentPage(Math.max(1, currentPage - 1));
                          getAllUsers(Math.max(1, currentPage - 1));
                        }}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium rounded-l-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      {getPaginationPages(
                        currentPage,
                        pagination.totalPages,
                      ).map((page, index) =>
                        page === "..." ? (
                          <span
                            key={`dots-${index}`}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium text-gray-500 bg-white"
                          >
                            ...
                          </span>
                        ) : (
                          <button
                            key={page}
                            onClick={() => {
                              setCurrentPage(page);
                              getAllUsers(page);
                            }}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === page
                                ? "z-10 bg-sky-50 border-sky-500 text-sky-600"
                                : "text-gray-700 border-gray-300 bg-white hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        ),
                      )}
                      <button
                        onClick={() => {
                          setCurrentPage(
                            Math.min(pagination.totalPages, currentPage + 1),
                          );
                          getAllUsers(
                            Math.min(pagination.totalPages, currentPage + 1),
                          );
                        }}
                        disabled={currentPage === pagination.totalPages}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {banModalOpen && (
        <div className="fixed inset-0 z-1300 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Ban User
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Provide a reason for banning this user
              </p>

              <textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Enter ban reason..."
                className="w-full p-3 border border-gray-300 rounded-xl text-sm mb-4 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows="4"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setBanModalOpen(false);
                    setBanReason("");
                    setBanUserId(null);
                  }}
                  disabled={banning}
                  className="flex-1 py-3 rounded-xl border border-gray-300 font-semibold hover:bg-gray-100 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={handleBanUser}
                  disabled={banning || !banReason.trim()}
                  className="flex-1 py-3 rounded-xl bg-orange-600 text-white font-semibold hover:bg-orange-700 transition disabled:opacity-50"
                >
                  {banning ? "Banning..." : "Ban User"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

const DeleteConfirmationModal = ({ user, onCancel, onConfirm, deleting }) => (
  <div className="fixed inset-0 z-1200 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Delete User?
        </h3>

        <p className="text-gray-500 text-sm mb-6">
          Permanently delete <strong>{user.name}</strong>? This action cannot be
          undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="flex-1 py-3 rounded-xl border border-gray-300 font-semibold hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={() => onConfirm(user._id)}
            disabled={deleting}
            className="flex-1 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default AdminUserManagement;
