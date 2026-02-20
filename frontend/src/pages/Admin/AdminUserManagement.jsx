import { useEffect, useState } from "react";
import { Trash2, Mail, Eye, Crown, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import toast from "react-hot-toast";

const AdminUserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const getAllUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(API_PATHS.ADMIN.GET_ALL_USERS);
      if (response.status === 200) {
        setUsers(response.data);
        setFilteredUsers(response.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, users]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      setDeleting(true);
      await axiosInstance.delete(API_PATHS.ADMIN.DELETE_USER(userId));
      toast.success("User deleted successfully");
      setUsers(users.filter((u) => u._id !== userId));
      setSelectedUser(null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  const handleViewProfile = (userId) => {
    setSelectedUser(userId);
  };

  const handleMessageUser = (userId) => {
    navigate(`/admin-chat?userId=${userId}`);
  };

  return (
    <DashboardLayout activeMenu="admin-users">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="max-w-7xl mx-auto p-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              User Management
            </h1>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm"
              />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm"
              >
                <option value="all">All Users</option>
                <option value="jobSeeker">Job Seekers</option>
                <option value="employer">Employers</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Users List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border-2 border-gray-100 shadow-sm overflow-hidden">
                {filteredUsers.length === 0 ? (
                  <div className="p-12 text-center">
                    <p className="text-gray-500">No users found</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredUsers.map((user) => (
                      <div
                        key={user._id}
                        onClick={() => handleViewProfile(user._id)}
                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                          selectedUser === user._id ? "bg-sky-50" : ""
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-sky-600 font-semibold text-sm">
                                {user.name?.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-gray-900">
                                {user.name}
                              </p>
                              {user.isPremium && (
                                <Crown className="w-4 h-4 text-yellow-500" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              {user.email}
                            </p>
                            <div className="flex gap-2 mt-2">
                              <span
                                className={`text-xs font-semibold px-3 py-1 rounded-full ${
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
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* User Details and Actions */}
            {selectedUser && (
              <UserDetailPanel
                userId={selectedUser}
                onMessage={handleMessageUser}
                onDelete={handleDeleteUser}
                onClose={() => setSelectedUser(null)}
                deleting={deleting}
              />
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

const UserDetailPanel = ({
  userId,
  onMessage,
  onDelete,
  onClose,
  deleting,
}) => {
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
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border-2 border-gray-100 shadow-sm p-6 flex items-center justify-center h-96">
        <Loader className="w-6 h-6 animate-spin text-sky-600" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border-2 border-gray-100 shadow-sm p-6 sticky top-20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          ✕
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center mb-3 overflow-hidden">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sky-600 font-semibold text-lg">
                {user.name?.charAt(0)}
              </span>
            )}
          </div>
          <p className="font-semibold text-gray-900">{user.name}</p>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
                Role
              </p>
              <p className="text-sm text-gray-900 capitalize">
                {user.role === "employer" ? "Employer" : "Job Seeker"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
                Status
              </p>
              <p className="text-sm">
                {user.isPremium ? (
                  <span className="flex items-center gap-2 text-yellow-600">
                    <Crown className="w-4 h-4" /> Premium User
                  </span>
                ) : (
                  <span className="text-gray-900">Free User</span>
                )}
              </p>
            </div>

            {user.stats && (
              <>
                {user.role === "jobSeeker" && (
                  <>
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
                        Applications
                      </p>
                      <p className="text-sm text-gray-900">
                        {user.stats.appliedJobs}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
                        Saved Jobs
                      </p>
                      <p className="text-sm text-gray-900">
                        {user.stats.savedJobs}
                      </p>
                    </div>
                  </>
                )}

                {user.role === "employer" && (
                  <>
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
                        Posted Jobs
                      </p>
                      <p className="text-sm text-gray-900">
                        {user.stats.postedJobs}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
                        Total Applications
                      </p>
                      <p className="text-sm text-gray-900">
                        {user.stats.totalApplications}
                      </p>
                    </div>
                  </>
                )}
              </>
            )}

            {user.location && (
              <div>
                <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
                  Location
                </p>
                <p className="text-sm text-gray-900">{user.location}</p>
              </div>
            )}

            {user.companyName && (
              <div>
                <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
                  Company
                </p>
                <p className="text-sm text-gray-900">{user.companyName}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
          <button
            onClick={() => onMessage(user._id)}
            className="w-full bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Mail className="w-4 h-4" />
            Send Message
          </button>
          <button
            onClick={() => onDelete(user._id)}
            disabled={deleting}
            className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Delete User
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;
