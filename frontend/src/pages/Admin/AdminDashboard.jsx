import { useEffect, useState } from "react";
import { Users, BriefcaseBusiness, Crown, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import { StatCard } from "../../components/Cards/StatCard";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getAdminStats = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(API_PATHS.ADMIN.GET_STATS);
      if (response.status === 200) {
        setDashboardData(response.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAdminStats();
  }, []);

  const QuickActions = [
    {
      title: "Manage Users",
      icon: Users,
      color: "bg-sky-50 text-sky-700",
      path: "/admin-users",
    },
    {
      title: "Manage Jobs",
      icon: BriefcaseBusiness,
      color: "bg-green-50 text-green-700",
      path: "/admin-jobs",
    },
    {
      title: "Admin Messages",
      icon: MessageSquare,
      color: "bg-purple-50 text-purple-700",
      path: "/admin-chat",
    },
  ];

  return (
    <DashboardLayout activeMenu="admin-dashboard">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="max-w-7xl mx-auto space-y-8 p-4">
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Users"
              value={dashboardData?.counts?.totalUsers || 0}
              icon={Users}
              color="sky"
            />
            <StatCard
              title="Premium Users"
              value={dashboardData?.counts?.totalPremiumUsers || 0}
              icon={Crown}
              color="violet"
            />
            <StatCard
              title="Active Jobs"
              value={dashboardData?.counts?.totalActiveJobs || 0}
              icon={BriefcaseBusiness}
              color="emerald"
            />
            <StatCard
              title="Total Jobs"
              value={dashboardData?.counts?.totalJobs || 0}
              icon={BriefcaseBusiness}
              color="orange"
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {QuickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className="bg-white rounded-xl border-2 border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 p-6 text-left"
                >
                  <div
                    className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage platform data
                  </p>
                </button>
              );
            })}
          </div>

          {/* Recent Users */}
          {dashboardData?.data?.recentUsers &&
            dashboardData.data.recentUsers.length > 0 && (
              <div className="bg-white rounded-xl border-2 border-gray-100 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Users
                </h3>
                <div className="space-y-3">
                  {dashboardData.data.recentUsers.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
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
                        <p className="font-medium text-gray-900 text-sm">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {user.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${user.role === "employer" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}`}
                        >
                          {user.role === "employer" ? "Employer" : "Job Seeker"}
                        </span>
                        {user.isPremium && (
                          <Crown className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
