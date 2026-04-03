import { useEffect, useState } from "react";
import {
  Plus,
  BriefcaseBusiness,
  Users,
  Building2,
  CheckCircle2,
} from "lucide-react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Card, StatCard } from "../../components/Cards/StatCard";
import JobDashboardCard from "../../components/Cards/JobDashboardCard";
import ApplicantDashboardCard from "../../components/Cards/ApplicantDashboardCard";

const QuickActions = [
  {
    title: "Post New Job",
    icon: Plus,
    color: "bg-sky-50 text-sky-700",
    path: "/post-job",
  },
  {
    title: "Review Applications",
    icon: Users,
    color: "bg-green-50 text-green-700",
    path: "/manage-jobs",
  },
  {
    title: "Company Profile",
    icon: Building2,
    color: "bg-orange-50 text-orange-700",
    path: "/employer-profile",
  },
];

const EmployerDashboard = () => {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getDashboardOverview = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.OVERVIEW);
      // console.log(response.data);
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
    getDashboardOverview();
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="employer-dashboard">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
            <StatCard
              title="Active Jobs"
              value={dashboardData?.counts?.totalActiveJobs || 0}
              icon={BriefcaseBusiness}
              trend={true}
              color="emerald"
            />
            <StatCard
              title="Total Applicants"
              value={dashboardData?.counts?.totalApplications || 0}
              icon={Users}
              trend={true}
              color="sky"
            />
            <StatCard
              title="Hired"
              value={dashboardData?.counts?.totalHired || 0}
              icon={CheckCircle2}
              trend={true}
              color="violet"
            />
          </div>

          {/* Recent Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card
              title="Recent Job Posts"
              subtitle="Your latest job postings"
              headerAction={
                <button
                  className="font-medium text-sky-500 hover:text-sky-600 cursor-pointer hover:underline"
                  onClick={() => navigate("/manage-jobs")}
                >
                  View All
                </button>
              }
            >
              <div className="space-y-3">
                {dashboardData?.data?.recentJobs?.length > 0 ? (
                  dashboardData.data.recentJobs
                    .slice(0, 3)
                    .map((job, index) => (
                      <JobDashboardCard key={job._id || index} job={job} />
                    ))
                ) : (
                  <p className="text-slate-900 mt-10">
                    You haven't posted any job yet
                  </p>
                )}
              </div>
            </Card>
            <Card
              title="Recent Applications"
              subtitle="Latest candidate applications"
              headerAction={
                <button
                  className="font-medium text-sky-500 hover:text-sky-600 cursor-pointer hover:underline shrink-0"
                  onClick={() => navigate("/manage-jobs")}
                >
                  View All
                </button>
              }
            >
              <div className="space-y-3">
                {dashboardData?.data?.recentApplications?.length > 0 ? (
                  dashboardData.data.recentApplications
                    .slice(0, 3)
                    .map((data, index) => (
                      <ApplicantDashboardCard
                        key={data._id || index}
                        applicant={data?.applicant}
                        position={data?.job?.title}
                        time={moment(data?.updatedAt).fromNow()}
                      />
                    ))
                ) : (
                  <p className="text-slate-900 mt-10">No applicant</p>
                )}
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card
            title="Quick Actions"
            subtitle="Common tasks to get you started"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {QuickActions.map((action, index) => (
                <button
                  key={index}
                  className="flex items-center space-x-3 p-4 rounded-xl border-2 border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200 text-left cursor-pointer"
                  onClick={() => {
                    navigate(action.path);
                  }}
                >
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <span className="text-slate-900 font-medium">
                    {action.title}
                  </span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default EmployerDashboard;
