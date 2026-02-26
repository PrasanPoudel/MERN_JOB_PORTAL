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
  const navigate = useNavigate();

  //Pagination
  const itemsPerPage = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  //Filter states
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    category: "",
    type: "",
  });

  //Fetch Jobs
  const fetchJobs = async (page = 1, filterParams = {}) => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
      });

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
        `${API_PATHS.JOBS.GET_ALL_JOBS}?${params.toString()}`,
      );

      setJobs(response.data.jobs || []);
      setPagination(response.data.pagination || null);
    } catch (err) {
      console.error("Error occurred while fetching jobs:", err);
      setJobs([]);
      setPagination(null);
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
          value !== undefined,
      );

      if (hasFilters) {
        fetchJobs(1, apiFilters);
      } else {
        fetchJobs(1);
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [filters, user]);

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
    fetchJobs(1);
  };

  const toggleSavedJobs = async (jobId, isSaved) => {
    try {
      if (isSaved) {
        await axiosInstance.delete(API_PATHS.JOBS.UNSAVE_JOB(jobId));
        toast.success("Job removed from saved list!");
      } else {
        await axiosInstance.post(API_PATHS.JOBS.SAVE_JOB(jobId));
        toast.success("Job saved successfully!");
      }
      // Refresh current page
      fetchJobs(currentPage, filters);
    } catch (err) {
      console.error("[Toggle Save Job Error]", err);
      toast.error(
        err?.message || "Failed to save/unsave job. Please try again.",
      );
    }
  };

  const applyToJob = async (jobId) => {
    if (!user) {
      toast.error("Please login before applying for jobs");
      return;
    }
    if (user.role === "employer") {
      toast.info("Employers cannot apply for jobs");
      return;
    }
    try {
      if (jobId) {
        await axiosInstance.post(API_PATHS.APPLICATIONS.APPLY_TO_JOB(jobId));
        toast.success("Application submitted successfully!");
      }
      // Refresh current page
      fetchJobs(currentPage, filters);
    } catch (err) {
      console.error("[Apply Job Error]", err);
      toast.error(err?.message || "Failed to apply. Please try again.");
    }
  };

  const getPaginationPages = (currentPage, totalPages) => {
    const pages = [];
    const delta = 2; // pages before & after current

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

  if (jobs.length == 0 && loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen mt-24">
        <div className="max-w-full mx-auto px-4 sm:px-6 py-2">
          <SearchHeader
            filters={filters}
            handleFilterChange={handleFilterChange}
            clearAllFilters={clearAllFilters}
          />
          {/* Jobs */}
          <div className="flex-1 min-w-0">
            {/* Result Summary */}
            <div className="flex justify-between mb-3">
              <div className="flex items-center">
                <p className="text-xs text-gray-700 lg:text-base pl-2">
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
                  {jobs.map((job, index) => (
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
                {pagination && pagination.total > itemsPerPage && (
                  <div className="mt-8 flex items-center justify-between pb-16">
                    <div className="flex flex-1 justify-between md:hidden">
                      <button
                        onClick={() => {
                          setCurrentPage(Math.max(1, currentPage - 1));
                          fetchJobs(Math.max(1, currentPage - 1), filters);
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
                          fetchJobs(
                            Math.min(pagination.totalPages, currentPage + 1),
                            filters,
                          );
                        }}
                        disabled={currentPage === pagination.totalPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden md:flex sm:flex-1 items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing{" "}
                          <span className="font-bold">
                            {(currentPage - 1) * itemsPerPage + 1}
                          </span>{" "}
                          to{" "}
                          <span className="font-bold">
                            {Math.min(
                              currentPage * itemsPerPage,
                              pagination.total,
                            )}
                          </span>{" "}
                          of{" "}
                          <span className="font-bold">{pagination.total}</span>{" "}
                          results
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex shadow-sm -space-x-px rounded-md">
                          <button
                            onClick={() => {
                              setCurrentPage(Math.max(1, currentPage - 1));
                              fetchJobs(Math.max(1, currentPage - 1), filters);
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
                                  fetchJobs(page, filters);
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
                                Math.min(
                                  pagination.totalPages,
                                  currentPage + 1,
                                ),
                              );
                              fetchJobs(
                                Math.min(
                                  pagination.totalPages,
                                  currentPage + 1,
                                ),
                                filters,
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
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
