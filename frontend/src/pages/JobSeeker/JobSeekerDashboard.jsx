import React, { useState, useEffect } from "react";
import { Search, Grid, List } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import SearchHeader from "./components/SearchHeader";
import Navbar from "../../components/layout/Navbar";
import JobCard from "../../components/Cards/JobCard";

const JobSeekerDashboard = () => {
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState(false);
  const navigate = useNavigate();

  //Pagination
  const itemsPerPage = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(jobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = jobs.slice(startIndex, startIndex + itemsPerPage);

  //Filter states
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    category: "",
    type: "",
  });

  //Fetch Jobs
  const fetchJobs = async (filterParams = {}) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (filterParams.keyword) {
        params.append("keyword", filterParams.keyword);
      }
      if (filterParams.location) {
        params.append("location", filterParams.location);
      }
      if (filterParams.category) {
        params.append("category", filterParams.category);
      }
      if (filterParams.type) {
        params.append("type", filterParams.type);
      }
      if (user) {
        params.append("userId", user?._id);
      }
      const response = await axiosInstance.get(
        `${API_PATHS.JOBS.GET_ALL_JOBS}?${params.toString()}`
      );

      const jobsData = Array.isArray(response.data)
        ? response.data
        : response.data.jobs || [];

      setJobs(jobsData);
      setCurrentPage(1);
      // console.log(jobsData);
    } catch (err) {
      console.error("Error occurred while fetching jobs:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const apiFilters = {
        keyword: filters.keyword,
        location: filters.location,
        category: filters.category,
        type: filters.type,
      };

      const hasFilters = Object.values(apiFilters).some(
        (value) =>
          value !== "" &&
          value !== false &&
          value !== null &&
          value !== undefined
      );

      if (hasFilters) {
        fetchJobs(apiFilters);
      } else {
        fetchJobs();
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [search, user]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      keyword: "",
      location: "",
      category: "",
      type: "",
    });
    handleSearch();
  };

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
      console.log("Error:", err);
      toast.error("Something went wrong! Please try again later");
    }
  };

  const applyToJob = async (jobId) => {
    if (!user) {
      toast.error("Please login before applying for job");
      return;
    }
    if (user.role === "employer") {
      toast.info("Employer cannot apply for jobs");
    }
    try {
      if (jobId) {
        await axiosInstance.post(API_PATHS.APPLICATIONS.APPLY_TO_JOB(jobId));
        toast.success("Applied to job successfully!");
      }
      fetchJobs();
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const handleSearch = () => {
    setSearch(!search);
  };

  if (jobs.length == 0 && loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen mt-16">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
          <SearchHeader
            filters={filters}
            handleFilterChange={handleFilterChange}
            clearAllFilters={clearAllFilters}
            handleSearch={handleSearch}
          />
          {/* Jobs */}
          <div className="flex-1 min-w-0">
            {/* Result Summary */}
            <div className="flex justify-between mb-3">
              <div className="flex items-center">
                <p className="text-gray-600 text-sm lg:text-base">
                  Showing{" "}
                  <span className="mr-1 font-bold text-gray-900">
                    {paginatedJobs.length}
                  </span>
                  of{" "}
                  <span className="mr-1 font-bold text-gray-900">
                    {jobs.length}
                  </span>
                  jobs
                </p>
              </div>

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

            {/* Job list*/}
            {jobs.length === 0 ? (
              <div className="text-center py-16 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/20">
                <div className="text-gray-400 mb-6">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">
                  No job found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or filters.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-sky-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-sky-700 transition-colors duration-200 cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div
                  className={`w-full ${
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6"
                      : "space-y-4 lg:space-y-6"
                  }`}
                >
                  {paginatedJobs.map((job, index) => (
                    <JobCard
                      key={job._id}
                      job={job}
                      onClick={() => {
                        navigate(`/job/${job._id}`);
                      }}
                      onToggleSave={() => {
                        toggleSavedJobs(job._id, job.isSaved);
                      }}
                      onApply={() => {
                        applyToJob(job._id);
                      }}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {jobs.length > itemsPerPage && (
                  <div className="mt-8 flex items-center justify-between">
                    <div className="flex flex-1 justify-between sm:hidden">
                      <button
                        onClick={() => {
                          setCurrentPage(Math.max(1, currentPage - 1));
                        }}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => {
                          setCurrentPage(Math.min(totalPages, currentPage + 1));
                        }}
                        disabled={currentPage === totalPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing{" "}
                          <span className="font-bold">{startIndex + 1}</span> to{" "}
                          <span className="font-bold">
                            {Math.min(startIndex + itemsPerPage, jobs.length)}
                          </span>{" "}
                          of <span className="font-bold">{jobs.length}</span>{" "}
                          results
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex shadow-sm -space-x-px rounded-md">
                          <button
                            onClick={() => {
                              setCurrentPage(Math.max(1, currentPage - 1));
                            }}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium rounded-l-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Previous
                          </button>
                          {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                          ).map((page) => (
                            <button
                              key={page}
                              onClick={() => {
                                setCurrentPage(page);
                              }}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === page
                                  ? "z-10 bg-sky-50 border-sky-500 text-sky-600"
                                  : "text-gray-700 border-gray-300 bg-white hover:bg-gray-50"
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                          <button
                            onClick={() => {
                              setCurrentPage(
                                Math.min(totalPages, currentPage + 1)
                              );
                            }}
                            disabled={currentPage === totalPages}
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
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
