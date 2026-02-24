import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  X,
  Trash2,
  ChevronDown,
  ChevronUp,
  Users,
  View,
} from "lucide-react";
import { toast } from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";

const ManageJobs = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortField, setSortField] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isLoading, setIsLoading] = useState(false);

  const [jobs, setJobs] = useState([]);

  const filteredAndSortedJobs = useMemo(() => {
    let filtered = jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || job.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "applicants") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }
      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    return filtered;
  }, [searchTerm, statusFilter, sortField, sortDirection, jobs]);

  //Pagination
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredAndSortedJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = filteredAndSortedJobs.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  //Change status of job
  const handleStatusChange = async (jobId) => {
    try {
      const respones = await axiosInstance.put(
        API_PATHS.JOBS.TOGGLE_CLOSE(jobId),
      );
      getPostedJobs(true);
    } catch (err) {
      console.error("Error changing job status", err);
    }
  };

  //Delete a specific job
  const handleDeleteJob = async (jobId) => {
    try {
      const response = await axiosInstance.delete(
        API_PATHS.JOBS.DELETE_JOB(jobId),
      );
      setJobs(jobs.filter((job) => job.id !== jobId));
      toast.success("Job listing deleted successfully");
    } catch (err) {
      console.error("Error deleting job", err);
    }
  };

  //Decide which sort icon to display (for sort direction and field)
  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return <ChevronDown className="w-4 h-4 text-gray-400" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4 text-sky-600" />
    ) : (
      <ChevronDown className="w-4 h-4 text-sky-600" />
    );
  };

  //Loading row
  const LoadingRow = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-12"></div>
      </td>

      <td className="px-6 py-4">
        <div className="flex space-x-2">
          <div className="h-8 bg-gray-200 rounded w-16"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
      </td>
    </tr>
  );

  const getPostedJobs = async (disableLoader) => {
    setIsLoading(!disableLoader);

    try {
      const response = await axiosInstance.get(
        API_PATHS.JOBS.GET_JOBS_EMPLOYER,
      );

      if (response.status === 200 && response.data?.length > 0) {
        const formattedJobs = response.data?.map((job) => ({
          id: job?._id,
          title: job?.title,
          company: job?.company?.name,
          status: job?.isClosed ? "Closed" : "Active",
          applicants: job?.applicationCount || 0,
          datePosted: moment(job?.createdAt).format("MMMM Do, YYYY"),
          logo: job?.company?.companyLogo,
        }));
        setJobs(formattedJobs);
      }
    } catch (err) {
      if (err.response) {
        console.error(err.response.data.message);
      } else {
        console.error("Error posting job. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPostedJobs();
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="manage-jobs">
      <div className="min-h-screen p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-xl font-semibold text-gray-900">
                  Job Management
                </h1>
                <p className="text-sm text-gray-600 ml-1">
                  Manage your job postings and track applications
                </p>
              </div>
              <button
                className="group bg-sky-600 flex items-center space-x-2 px-6 py-3 text-sm font-medium text-white hover:text-white hover:bg-sky-700 border border-gray-100 hover:border-transparent rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
                onClick={() => {
                  navigate("/post-job");
                }}
              >
                <Plus className="w-5 h-5 mr-1" />
                Add New Job
              </button>
            </div>
          </div>

          <div className="bg-white/80 rounded-2xl md:border border-gray-200 md:p-4 mb-8">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="w-full relative">
                <div className="absolute left-0 top-1/4 inset-y-0 pl-3 items-center pointer-events-none">
                  <Search className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                  className="block w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-0 transition-all duration-200 placeholder-gray-400"
                />
              </div>

              {/* Status Filter */}
              <div className="sm:w-48">
                <select
                  id="status"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                  }}
                  className="block w-full min-w-30 text-sm px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-0 transition-all duration-200"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

            {/* Results */}
            <div className="my-4">
              <p className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-bold">{paginatedJobs.length}</span> of{" "}
                <span className="font-bold">
                  {filteredAndSortedJobs.length}{" "}
                </span>
                jobs
              </p>
            </div>

            {/* Table */}
            <div className="w-full backdrop-blur-sm rounded-l-2xl border border-gray-200 overflow-hidden">
              {filteredAndSortedJobs.length === 0 && !isLoading ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No jobs found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your search and filter criteria
                  </p>
                </div>
              ) : (
                <div className="md:w-full w-[90vw] overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-linear-to-r from-gray-50 to-gray-400">
                      <tr>
                        <th
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-all duration-200 min-w-52 sm:min-w-0"
                          onClick={() => {
                            handleSort("title");
                          }}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Job Title</span>
                            <SortIcon field="title" />
                          </div>
                        </th>
                        <th
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-all duration-200 min-w-30 sm:min-w-0"
                          onClick={() => {
                            handleSort("status");
                          }}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Status</span>
                            <SortIcon field="status" />
                          </div>
                        </th>
                        <th
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-all duration-200 min-w-32 sm:min-w-0"
                          onClick={() => {
                            handleSort("applicants");
                          }}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Applicants</span>
                            <SortIcon field="applicants" />
                          </div>
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-all duration-200 min-w-45 sm:min-w-0">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 ">
                      {isLoading
                        ? Array.from({ length: 5 }).map((_, index) => (
                            <LoadingRow key={index} />
                          ))
                        : paginatedJobs.map((job, index) => (
                            <tr
                              key={job.id}
                              className="hover:bg-sky-50/30 transition-all duration-200 border-b border-gray-100"
                            >
                              <td className="px-6 py-5 whitespace-nowrap min-w-52 sm:min-w-0">
                                <div>
                                  <div className="text-sm font-semibold text-gray-900">
                                    {job.title}
                                  </div>
                                  <div className="text-xs font-medium text-gray-600">
                                    {job.company}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-5 whitespace-nowrap min-w-30 sm:min-w-0">
                                <span
                                  className={`inline-flex px-3 py-1.5 text-xs font-semibold rounded-full ${
                                    job.status === "Active"
                                      ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                      : "bg-gray-100 text-gray-700 border border-gray-200"
                                  }`}
                                >
                                  {job.status}
                                </span>
                              </td>
                              <td className="px-6 py-5 whitespace-nowrap min-w-32 sm:min-w-0">
                                <button
                                  title="View received applications"
                                  className="flex items-center text-sm text-sky-600 hover:text-sky-700 font-semibold transition-colors duration-200 hover:bg-sky-50 px-2 py-1 rounded-lg cursor-pointer"
                                  onClick={() => {
                                    navigate("/applicants", {
                                      state: { jobId: job.id },
                                    });
                                  }}
                                >
                                  <Users className="w-4 h-4 mr-1.5" />
                                  {job.applicants}
                                </button>
                              </td>
                              <td className="px-6 py-5 whitespace-nowrap min-w-45 sm:min-w-0">
                                <div className="flex space-x-2">
                                  <button
                                    title="View Job Details"
                                    className="flex items-center text-xs text-sky-600 hover:text-sky-700 font-semibold transition-colors duration-200 hover:bg-sky-50 px-2 py-1 rounded-lg cursor-pointer"
                                    onClick={() => {
                                      navigate(`/job/${job.id}`);
                                    }}
                                  >
                                    <View className="w-5 h-5" />
                                  </button>
                                  {job.status === "Active" ? (
                                    <button
                                      title="Job Won't be visible to others"
                                      className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-700 font-semibold transition-colors duration-200 hover:bg-gray-200 px-2 py-1 rounded-lg cursor-pointer"
                                      onClick={() => {
                                        handleStatusChange(job.id);
                                      }}
                                    >
                                      <X className="w-4 h-4 mr-1.5" />
                                      <span className="hidden sm:inline">
                                        Close
                                      </span>
                                    </button>
                                  ) : (
                                    <button
                                      title="Job will be visible to others"
                                      className="flex items-center gap-2 text-xs text-green-600 hover:text-green-700 font-semibold transition-colors duration-200 hover:bg-green-50 px-2 py-1 rounded-lg cursor-pointer"
                                      onClick={() => {
                                        handleStatusChange(job.id);
                                      }}
                                    >
                                      <Plus className="w-4 h-4 mr-1.5" />
                                      <span className="hidden sm:inline">
                                        Activate
                                      </span>
                                    </button>
                                  )}
                                  <button
                                    title="Delete this job post"
                                    className="flex items-center text-xs text-red-600 hover:text-red-700 font-semibold transition-colors duration-200 hover:bg-red-50 px-2 py-1 rounded-lg cursor-pointer"
                                    onClick={() => {
                                      handleDeleteJob(job.id);
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex flex-1 justify-between sm:hidden ">
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
                    Showing <span className="font-bold">{startIndex + 1}</span>{" "}
                    to{" "}
                    <span className="font-bold">
                      {Math.min(
                        startIndex + itemsPerPage,
                        filteredAndSortedJobs.length,
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-bold">
                      {filteredAndSortedJobs.length}
                    </span>{" "}
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
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => {
                            setCurrentPage(page);
                          }}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === page
                              ? "z-10 bg-sky-50 border-sky-500 text-sky-600 "
                              : "text-gray-700 border-gray-300 bg-white hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      ),
                    )}
                    <button
                      onClick={() => {
                        setCurrentPage(Math.min(totalPages, currentPage + 1));
                      }}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageJobs;
