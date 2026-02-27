import { useEffect, useState } from "react";
import {
  Trash2,
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
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Pagination
  const itemsPerPage = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  // Fetch users with backend pagination
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

      if (searchTerm) {
        params.append("search", searchTerm);
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
  }, [roleFilter, searchTerm]);

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
      setSelectedUser(null);
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
      {selectedUser && (
        <UserModal
          userId={selectedUser}
          onClose={() => setSelectedUser(null)}
          onDelete={(id) =>
            setConfirmDeleteUser(users.find((u) => u._id === id))
          }
          onMessage={handleMessageUser}
        />
      )}

      {confirmDeleteUser && (
        <DeleteConfirmationModal
          user={confirmDeleteUser}
          deleting={deleting}
          onCancel={() => setConfirmDeleteUser(null)}
          onConfirm={handleDeleteUser}
        />
      )}

      <div className="max-w-7xl mx-auto p-4">
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
                  <span className="font-bold">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-bold">
                    {Math.min(currentPage * itemsPerPage, pagination.total)}
                  </span>{" "}
                  of <span className="font-bold">{pagination.total}</span>{" "}
                  results
                </p>
              </div>
            </div>

            <div className="grid gap-6">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-2 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-2">
                    <div className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center overflow-hidden">
                      <img
                        src={user.avatar || "/default.png"}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900 text-md">
                          {user.name}
                        </p>
                        {user.isPremium && (
                          <span
                            title="Premium User"
                            className="bg-yellow-50 text-yellow-500 text-xs px-2 py-1 rounded-full flex items-center gap-1"
                          >
                            <Crown className="w-3 h-3 shrink-0" />
                          </span>
                        )}
                      </div>

                      <p
                        className={`text-xs flex w-32 px-2 py-1 rounded-full font-medium ${
                          user.role === "employer"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {user.role === "employer" ? "Employer" : "Job Seeker"}
                      </p>
                      {user && user?.companyName && (
                        <p className="flex items-center w-full gap-1 text-xs sm:text-sm text-gray-700">
                          <span
                            title={user?.companyName}
                            className="flex items-center gap-1 truncate max-w-42 sm:max-w-52"
                          >
                            <Building2 className="w-4 h-4 shrink-0" />
                            {user.companyName}
                          </span>
                          {user.role === "employer" &&
                            user.isCompanyVerified && (
                              <BadgeCheck className="w-4 h-4 text-sky-600 shrink-0" />
                            )}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center py-2 gap-2 justify-end">
                    <button
                      onClick={() => setSelectedUser(user._id)}
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
                      <span className="font-bold">
                        {(currentPage - 1) * itemsPerPage + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-bold">
                        {Math.min(currentPage * itemsPerPage, pagination.total)}
                      </span>{" "}
                      of <span className="font-bold">{pagination.total}</span>{" "}
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
    </DashboardLayout>
  );
};

const UserModal = ({ userId, onClose, onDelete, onMessage }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          API_PATHS.ADMIN.GET_USER_BY_ID(userId),
        );
        setUser(response.data);
      } catch {
        toast.error("Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-1000 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white m-auto rounded-3xl shadow-2xl w-full max-w-3xl relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
        >
          <X />
        </button>

        {loading ? (
          <Loader className="animate-spin mx-auto text-sky-600" />
        ) : (
          <>
            <div className="h-[80vh] overflow-y-scroll p-4">
              <div className="pt-4 flex flex-col md:flex-row md:items-center gap-6 mb-8">
                <div className="w-24 h-24 rounded-full bg-sky-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={user.avatar || "/default.png"}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h2 className="flex items-center gap-1 text-xl font-semibold text-gray-900">
                    {user.name}
                    {user.role === "employer" && !user.isCompanyVerified && (
                      <BadgeCheck className="w-5 h-5 text-sky-600 inline" />
                    )}
                  </h2>
                  <p className="text-gray-500">{user.email}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 mb-8 text-sm">
                <InfoItem
                  icon={<User />}
                  label="Role"
                  value={
                    user.role === "employer"
                      ? "Employer"
                      : user.role === "jobSeeker"
                        ? "Job Seeker"
                        : "Admin"
                  }
                />
                <InfoItem
                  icon={<Calendar />}
                  label="Joined"
                  value={new Date(user.createdAt).toLocaleDateString()}
                />
                {user.location && (
                  <InfoItem
                    icon={<MapPin />}
                    label="Location"
                    value={user.location}
                  />
                )}
                {user.companyName && (
                  <InfoItem
                    icon={<Building2 />}
                    label="Company"
                    value={user.companyName}
                  />
                )}
              </div>

              {user.stats && (
                <div className="grid sm:grid-cols-2 gap-2 mb-8">
                  {user.role === "jobSeeker" && (
                    <>
                      <StatCard
                        icon={<FileText />}
                        label="Applications"
                        value={user.stats.appliedJobs}
                      />
                      <StatCard
                        icon={<Bookmark />}
                        label="Saved Jobs"
                        value={user.stats.savedJobs}
                      />
                    </>
                  )}
                  {user.role === "employer" && (
                    <>
                      <StatCard
                        icon={<BriefcaseBusiness />}
                        label="Posted Jobs"
                        value={user.stats.postedJobs}
                      />
                      <StatCard
                        icon={<Users />}
                        label="Total Applications"
                        value={user.stats.totalApplications}
                      />
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="absolute bottom-0 left-0 bg-white border border-gray-200 p-2 flex gap-2 w-full">
              <button
                onClick={() => onMessage(user._id)}
                className="flex-1 text-sm bg-sky-600 text-white py-3 rounded-xl font-semibold hover:bg-sky-700 transition"
              >
                Message
              </button>

              <button
                onClick={() => onDelete(user._id)}
                className="flex-1 text-sm bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition"
              >
                Delete User
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const DeleteConfirmationModal = ({ user, onCancel, onConfirm, deleting }) => (
  <div className="fixed inset-0 z-1200 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-red-100 mb-4">
          <Trash2 className="text-red-600 w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete User?</h3>

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

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 bg-gray-50 p-2 rounded-xl">
    <div className="text-sky-600">{icon}</div>
    <div>
      <p className="text-gray-500 text-xs uppercase">{label}</p>
      <p className="font-medium text-xs text-gray-900">{value}</p>
    </div>
  </div>
);

const StatCard = ({ icon, label, value }) => (
  <div className="flex flex-col bg-white border border-gray-100 rounded-xl p-6 text-center shadow-sm">
    <div className="text-sky-600 flex justify-center">{icon}</div>
    <p className="text-2xl font-semibold text-gray-900">{value}</p>
    <p className="text-gray-500 text-sm">{label}</p>
  </div>
);

export default AdminUserManagement;
