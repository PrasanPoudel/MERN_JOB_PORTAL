import { useEffect, useState } from "react";
import {
  Users,
  BriefcaseBusiness,
  Crown,
  MessageSquare,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import { StatCard } from "../../components/Cards/StatCard";

const BarGraph = ({ data, days, onDaysChange, riskData }) => {
  const navigate = useNavigate();
  if (!data || data.length === 0) return null;

  const QuickActions = [
    {
      title: "Manage Users",
      icon: Users,
      color: "bg-sky-50 text-sky-700",
      path: "/admin-users-management",
    },
    {
      title: "Manage Jobs",
      icon: BriefcaseBusiness,
      color: "bg-green-50 text-green-700",
      path: "/admin-jobs-management",
    },
    {
      title: "Admin Messages",
      icon: MessageSquare,
      color: "bg-purple-50 text-purple-700",
      path: "/admin-chat-box",
    },
  ];

  const userChartData = data.map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    "User Registrations": d.userRegistrations,
  }));

  const jobChartData = data.map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    "Job Postings": d.jobPostings,
  }));

  const COLORS = {
    Safe: "#10b981",
    "Moderate Risk": "#f97316",
    "High Risk": "#ef4444",
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <select
          id="selectDays"
          value={days}
          onChange={(e) => onDaysChange(Number(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value={7}>Last 7 Days</option>
          <option value={14}>Last 14 Days</option>
          <option value={30}>Last 30 Days</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border-2 border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Daily User Registrations
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={userChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
            <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
              cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />
            <Bar
              dataKey="User Registrations"
              fill="#0ea5e9"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl border-2 border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Daily Job Postings
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={jobChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
            <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
              cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />
            <Bar dataKey="Job Postings" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border-2 border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Job Risk Distribution
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
              >
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-6 space-y-2">
            {riskData.map((item, index) => {
              const total = riskData.reduce((sum, d) => sum + d.value, 0);
              const percentage = ((item.value / total) * 100).toFixed(2);

              return (
                <div
                  key={index}
                  className="flex justify-between text-sm text-gray-700"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[item.name] }}
                    />
                    {item.name}
                  </span>
                  <span className="font-medium">{percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>
        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-4">
          {QuickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                title={action.title}
                className="bg-white rounded-xl border-2 border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 p-6 text-left cursor-pointer flex gap-2 items-center"
              >
                <div
                  className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage platform data
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [riskData, setRiskData] = useState([]);
  const [revenueData, setRevenueData] = useState(null);
  const [days, setDays] = useState(7);
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

  const getDailyAnalytics = async (numDays) => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.ADMIN.GET_DAILY_ANALYTICS + `?days=${numDays}`,
      );
      if (response.status === 200) {
        setAnalyticsData(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getRiskDistribution = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.ADMIN.GET_RISK_DISTRIBUTION,
      );
      if (response.status === 200) {
        setRiskData(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getRevenueStats = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.ADMIN.GET_REVENUE_STATS,
      );
      if (response.status === 200) {
        setRevenueData(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAdminStats();
    getDailyAnalytics(days);
    getRiskDistribution();
    getRevenueStats();
  }, [days]);

  return (
    <DashboardLayout activeMenu="admin-dashboard">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="max-w-7xl mx-auto space-y-8 p-4">
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <StatCard
              title="Total Platform Revenue"
              value={`रू ${revenueData?.totalRevenue || 0}`}
              icon={DollarSign}
              color="emerald"
            />
            <StatCard
              title="Revenue This Month"
              value={`रू ${revenueData?.monthlyRevenue || 0}`}
              icon={TrendingUp}
              color="sky"
            />
          </div>
          <BarGraph
            data={analyticsData}
            days={days}
            onDaysChange={setDays}
            riskData={riskData}
          />
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
