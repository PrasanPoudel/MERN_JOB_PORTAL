import React, { useState, useEffect } from "react";
import { ArrowLeft, BriefcaseBusiness, Grid, List } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import JobCard from "../../components/Cards/JobCard";
import Navbar from "../../components/layout/Navbar";
import LoadingSpinner from "../../components/LoadingSpinner";
import toast from "react-hot-toast";

const AppliedApplications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);

  const getMyApplications = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.APPLICATIONS.GET_MY_APPLICATIONS,
      );
      setApplications(response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getMyApplications();
    }
  }, [user]);

  const toggleSavedJobs = async (jobId, isSaved) => {
    try {
      if (isSaved) {
        await axiosInstance.delete(API_PATHS.JOBS.UNSAVE_JOB(jobId));
        toast.success("Job removed from saved list successfully!");
      } else {
        await axiosInstance.post(API_PATHS.JOBS.SAVE_JOB(jobId));
        toast.success("Job saved successfully!");
      }
      fetchJobs();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Something went wrong. Try again");
    }
  };

  if (!user || loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Navbar />
      <div className="mt-16 bg-white">
        {applications !== null && (
          <div className="min-h-screen">
            <div className="mx-auto p-4 lg:p-12">
              <div className="flex items-center gap-4 pb-4">
                <button
                  onClick={() => {
                    navigate(-1);
                  }}
                  className="group flex items-center border border-gray-200 space-x-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 hover:text-white bg-white/50 hover:bg-sky-600 cursor-pointer shadow-sm hover:shadow-md hover:border-transparent transition-all duration-200 "
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <h1 className="text-xl font-semibold text-gray-900">
                  My Applications
                </h1>
              </div>

              <div className="flex items-center justify-end pb-4">
                <div className="flex w-fit p-2 gap-3 rounded-2xl items-center bg-white">
                  <button
                    onClick={() => {
                      setViewMode("grid");
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "grid"
                        ? "md:bg-sky-600 bg-gray-100 text-gray-400 md:text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setViewMode("list");
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "list"
                        ? "bg-sky-600 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {applications.length === 0 ? (
                  <div className="text-center py-16 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/20">
                    <div className="text-gray-400 mb-6">
                      <BriefcaseBusiness className="w-16 h-16 mx-auto" />
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">
                      You haven't applied to any job yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Start applying to jobs that match your skills and
                      interests
                    </p>
                    <button
                      onClick={() => {
                        navigate("/find-jobs");
                      }}
                      className="bg-sky-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-sky-700 transition-colors duration-200 cursor-pointer"
                    >
                      Browse Jobs
                    </button>
                  </div>
                ) : (
                  <>
                    <div
                      className={`w-full pb-24 ${
                        viewMode === "grid"
                          ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6"
                          : "space-y-4 lg:space-y-6"
                      }`}
                    >
                      {applications.map((application) => (
                        <JobCard
                          key={application?._id}
                          job={application?.job}
                          onClick={() => {
                            navigate(`/job/${application?.job._id}`);
                          }}
                          hideApply={true}
                          hideSaveButton
                          onToggleSave={() => {
                            toggleSavedJobs(
                              application?.job._id,
                              application?.job.isSaved,
                            );
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default AppliedApplications;
