import React, { useState, useEffect } from "react";
import {
  Zap,
  UserCheck,
  MessageCircle,
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
    title: "Personalized Jobs",
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
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAdminStats();
  }, []);

  return (
    <section className="relative mt-16 py-20 bg-sky-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-100 text-sky-700 rounded-full text-sm font-bold mb-6">
              #KAAMSETU
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
              Where Careers Meet
              <span className="text-sky-600"> Opportunities</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              Connecting people with opportunities through Nepal's own job
              portal
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Link
                to="/find-jobs"
                title="Explore available jobs"
                className="btn-primary text-lg px-8 py-4"
              >
                <Search className="w-5 h-5" />
                Find Jobs
                <ArrowRight className="w-5 h-5" />
              </Link>
              {user && user?.role === "employer" && (
                <Link
                  to="/employer-dashboard"
                  title="Go to employer dashboard"
                  className="btn-secondary text-lg px-8 py-4"
                >
                  Go to Dashboard
                </Link>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2.5">
                  <div className="bg-sky-100 p-2 rounded-lg shrink-0">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-sm text-slate-900">
                    {feature.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Image with Stats */}
          <div className="relative">
            <img
              src={HeroBanner}
              alt="Job search illustration"
              className="w-full h-auto rounded-2xl shadow-lg"
            />

            {/* Stats Card - Top Right */}
            <div className="absolute -top-4 -right-4 card-elevated p-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">
                    Total Active Users
                  </div>
                  <div className="text-lg font-bold text-slate-900">
                    {dashboardData?.counts?.totalUsers || "10+"}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Card - Bottom Left */}
            <div className="absolute -bottom-4 -left-4 card-elevated p-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-sky-100 rounded-xl flex items-center justify-center">
                  <BriefcaseBusiness className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Jobs Available</div>
                  <div className="text-lg font-bold text-slate-900">
                    {dashboardData?.counts?.totalActiveJobs || "100+"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Searches */}
        <div className="mt-16 text-center">
          <p className="text-slate-500 text-sm mb-4">Popular searches:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {jobCategories.map((category, index) => (
              <span
                key={index}
                className="inline-block bg-white border border-slate-200 rounded-full px-4 py-2 text-sm font-medium text-slate-700 hover:bg-sky-50 hover:border-sky-200 hover:text-sky-700 transition-colors cursor-pointer"
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
