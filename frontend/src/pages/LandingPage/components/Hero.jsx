import React, { useState, useEffect } from "react";
import {
  Zap,
  UserCheck,
  MessageCircle,
  LayoutDashboard,
  Search,
  ArrowRight,
  Mail,
  BriefcaseBusiness,
} from "lucide-react";
import { Link } from "react-router-dom";
import HeroBanner from "/recruitment-agency-searching-job-candidates.avif";
import { useAuth } from "../../../context/AuthContext";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";

const features = [
  {
    icon: <Mail className="text-sky-600 w-5 h-5" />,
    title: "Job Notification",
  },
  {
    icon: <MessageCircle className="text-sky-600 w-5 h-5" />,
    title: "Secured Communication",
  },
  {
    icon: <Zap className="text-sky-600 w-5 h-5" />,
    title: "One-Click Apply",
  },
  {
    icon: <BriefcaseBusiness className="text-sky-600 w-5 h-5" />,
    title: "Personalized Jobs Listing",
  },
];

const jobCategories = [
  "Web Developer",
  "Data Analyst",
  "Product Manager",
  "UI/UX Designer",
  "Software Engineer",
];

const Hero = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);

  const getAdminStats = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.LANDING_PAGE_STATS.GET_STATS,
      );
      if (response.status === 200) {
        setDashboardData(response.data);
        console.log(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAdminStats();
  }, []);

  return (
    <section className="relative mt-16 py-20 overflow-hidden bg-linear-to-br from-sky-50 via-white to-blue-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-sky-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-100 text-sky-700 rounded-full text-sm font-semibold mb-6">
              #KAAMSETU
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
              Where Careers Meet
              <span className="text-sky-600"> Opportunities</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              Connecting people with opportunities through Nepal's own job
              portal
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Link
                to="/find-jobs"
                title="Explore available jobs"
                className="inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <Search className="w-5 h-5" />
                Explore Jobs
                <ArrowRight className="w-5 h-5" />
              </Link>
              {user && user?.role === "employer" && (
                <Link
                  to="/employer-dashboard"
                  title="Go to employer dashboard"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-sky-300 transition-all shadow-lg cursor-pointer"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Go to Dashboard
                </Link>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="bg-sky-100 p-1.5 rounded-lg shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-900">
                      {feature.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative">
              <img
                src={HeroBanner}
                alt="Job search illustration"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />

              <div className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">
                      Total Active Users
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {dashboardData?.counts?.totalUsers || "10+"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
                    <BriefcaseBusiness className="w-6 h-6 text-sky-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Jobs Available</div>
                    <div className="text-lg font-bold text-gray-900">
                      {dashboardData?.counts?.totalActiveJobs || "100+"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 text-center">
          <p className="text-gray-500 text-sm mb-5">Popular searches:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {jobCategories.map((category, index) => (
              <span
                key={index}
                className="inline-block bg-white border border-gray-200 rounded-full px-4 py-2 text-sm font-medium hover:bg-sky-50 hover:border-sky-200 transition-colors shadow-sm cursor-pointer"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
