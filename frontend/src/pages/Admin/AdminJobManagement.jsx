import { useEffect, useState, useMemo } from "react";
import {
  Loader,
  BriefcaseBusiness,
  X,
  Search,
  MapPin,
  Clock,
  Trash2,
  Info,
  Tag,
  BadgeCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layout/DashboardLayout";
import toast from "react-hot-toast";
import JobCard from "../../components/Cards/JobCard";

const AdminJobManagement = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [confirmDeleteJob, setConfirmDeleteJob] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [sortType, setSortType] = useState("Risk_Score_(Descending_Order)");

  const [deleting, setDeleting] = useState(false);

  // Pagination
  const itemsPerPage = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  // Fetch jobs with backend pagination
  const getAllJobs = async (page = 1) => {
    try {
      setIsLoading(true);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
      });

      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      if (sortType) {
        params.append("sort", sortType);
      }

      const response = await axiosInstance.get(
        `${API_PATHS.ADMIN.GET_ALL_JOBS}?${params.toString()}`,
      );

      setJobs(response.data.jobs || []);
      setPagination(response.data.pagination || null);
    } catch {
      toast.error("Failed to fetch jobs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllJobs(1);
  }, [statusFilter, searchTerm, sortType]);

  useEffect(() => {
    getAllJobs(currentPage);
  }, [currentPage]);

  const handleDeleteJob = async (jobId) => {
    try {
      setDeleting(true);
      await axiosInstance.delete(API_PATHS.ADMIN.DELETE_JOB(jobId));
      toast.success("Job deleted successfully");
      // Refresh current page
      getAllJobs(currentPage);
      setConfirmDeleteJob(null);
      setSelectedJob(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete job");
    } finally {
      setDeleting(false);
    }
  };

  const handleMessageEmployer = (employerId) => {
    navigate(`/admin-chat-box?userId=${employerId}`);
  };

  const getPaginationPages = (currentPage, totalPages) => {
    const pages = [];
    const delta = 2;

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

  return (
    <DashboardLayout activeMenu="admin-jobs-management">
      {/* Job Modal */}
      {selectedJob && (
        <JobModal
          job={selectedJob}
          loading={isLoading}
          onClose={() => setSelectedJob(null)}
          onDelete={handleDeleteJob}
          onMessage={handleMessageEmployer}
        />
      )}

      {/* Delete Confirmation */}
      {confirmDeleteJob && (
        <DeleteConfirmationModal
          job={confirmDeleteJob}
          deleting={deleting}
          onCancel={() => setConfirmDeleteJob(null)}
          onConfirm={handleDeleteJob}
        />
      )}

      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Job Management
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage all job postings
            </p>
          </div>
          <div className="bg-sky-50 text-sky-700 px-4 py-2 rounded-xl text-sm font-semibold">
            {pagination?.total || 0} Jobs
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              id="search_job"
              type="text"
              placeholder="Search jobs..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            id="select_status"
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Jobs</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>

          <select
            id="select_sortType"
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500"
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="Posted_Date_(Ascending_Order)">
              Posted Date (Ascending Order)
            </option>
            <option value="Posted_Date_(Descending_Order)">
              Posted Date (Descending Order)
            </option>
            <option value="Risk_Score_(Ascending_Order)">
              Risk Score (Ascending Order)
            </option>
            <option value="Risk_Score_(Descending_Order)">
              Risk Score (Descending Order)
            </option>
          </select>
        </div>

        {/* Job Cards */}
        {isLoading ? (
          <div className="text-center py-20">
            <Loader className="animate-spin mx-auto text-sky-600" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <BriefcaseBusiness className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 font-medium">No jobs found</p>
          </div>
        ) : (
          <>
            {/* Result Summary */}
            <div className="flex justify-between mb-3">
              <div className="flex items-center">
                <p className="text-sm text-gray-700 lg:text-base">
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
            </div>

            <div className="grid gap-6">
              {jobs?.map((job) => (
                <div key={job._id} className="flex flex-col gap-2">
                  <JobCard job={job} hideShadow={true} />
                  {job?.fraudScore !== undefined &&
                    (() => {
                      const score = job.fraudScore;
                      const percentage = Math.round(score * 100);

                      let label = "";
                      let color = "";
                      let bg = "";

                      if (score < 0.25) {
                        label = "Safe";
                        color = "text-green-600";
                        bg = "bg-green-500";
                      } else if (score < 0.4) {
                        label = "Moderate Risk";
                        color = "text-yellow-600";
                        bg = "bg-yellow-500";
                      } else {
                        label = "High Risk";
                        color = "text-red-600";
                        bg = "bg-red-500";
                      }

                      return (
                        <div className="px-4 py-3 rounded-lg border bg-gray-50 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">
                              Fraud Risk
                            </span>
                            <span className={`text-sm font-semibold ${color}`}>
                              {label}
                            </span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`${bg} h-full transition-all duration-300`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <p className={`text-sm ${color}`}>
                            {percentage}% probability
                          </p>
                        </div>
                      );
                    })()}
                  <div className="w-full flex flex-wrap gap-2 py-2 justify-end">
                    <button
                      onClick={() => setSelectedJob(job)}
                      title="View job details"
                      className="px-2 sm:px-4 py-2 cursor-pointer rounded-xl text-xs sm:text-sm font-semibold bg-sky-600 text-white hover:bg-sky-700 transition"
                    >
                      View Details
                    </button>

                    <button
                      onClick={() => handleMessageEmployer(job?.company?._id)}
                      title="Send message to employer"
                      className="px-2 sm:px-4 py-2 cursor-pointer rounded-xl text-xs sm:text-sm font-semibold border border-gray-300 hover:bg-gray-100 transition"
                    >
                      Message
                    </button>

                    <button
                      onClick={() => setConfirmDeleteJob(job)}
                      title="Delete this job"
                      className="px-2 sm:px-4 py-2 cursor-pointer rounded-xl text-xs sm:text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.total > itemsPerPage && (
              <div className="mt-8 flex items-center justify-between pb-16">
                {/* Mobile pagination */}
                <div className="flex flex-1 justify-between md:hidden">
                  <button
                    onClick={() => {
                      setCurrentPage(Math.max(1, currentPage - 1));
                      getAllJobs(Math.max(1, currentPage - 1));
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
                      getAllJobs(
                        Math.min(pagination.totalPages, currentPage + 1),
                      );
                    }}
                    disabled={currentPage === pagination.totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>

                {/* Desktop pagination */}
                <div className="hidden md:flex sm:flex-1 items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
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
                  <div>
                    <nav className="relative z-0 inline-flex shadow-sm -space-x-px rounded-md">
                      <button
                        onClick={() => {
                          setCurrentPage(Math.max(1, currentPage - 1));
                          getAllJobs(Math.max(1, currentPage - 1));
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
                              getAllJobs(page);
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
                            Math.min(pagination.totalPages, currentPage + 1),
                          );
                          getAllJobs(
                            Math.min(pagination.totalPages, currentPage + 1),
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
    </DashboardLayout>
  );
};

const JobModal = ({ job, loading, onClose, onDelete, onMessage }) => {
  const companyName = job?.company?.companyName || "Unknown Company";
  const employerName = job.company?.name || "Unknown Employer";

  return (
    <div className="fixed inset-0 z-1000 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 pb-8">
      <div className="bg-white m-auto rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 z-10"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6 sm:p-8 overflow-y-auto flex-1 pr-4">
          {loading ? (
            <Loader className="animate-spin mx-auto text-sky-600" />
          ) : (
            <>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6">
                {job?.company?.companyLogo ? (
                  <img
                    src={job.company.companyLogo}
                    alt={`${companyName} logo`}
                    className="w-20 h-20 rounded-lg object-contain border border-gray-200"
                  />
                ) : (
                  <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200 text-gray-400 text-xl font-semibold">
                    {companyName.charAt(0)}
                  </div>
                )}

                <div className="flex flex-col text-center sm:text-left">
                  <h3 className="flex items-center text-lg font-semibold text-gray-900">
                    {companyName}
                    {job?.company?.isCompanyVerified && (
                      <BadgeCheck className="w-4 h-4 text-sky-600 ml-1" />
                    )}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{employerName}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {job.company.email}
                  </p>
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {job.title}
              </h2>

              <p className="text-gray-600 text-xs text-justify mb-6 whitespace-normal wrap-break-word">
                {job.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-32">
                <InfoItem
                  icon={<Tag className="w-4 h-4 text-gray-400 shrink-0" />}
                  label="Category"
                  value={job.category || "N/A"}
                />
                <InfoItem
                  icon={<Clock className="w-4 h-4 text-gray-400 shrink-0" />}
                  label="Type"
                  value={job.type}
                />
                <InfoItem
                  icon={<MapPin className="w-4 h-4 text-gray-400 shrink-0" />}
                  label="Location"
                  value={job.location || "N/A"}
                />
                <InfoItem
                  label="Salary"
                  value={`NPR ${job.salaryMin || 0} - ${job.salaryMax || 0}`}
                />
                <InfoItem
                  icon={<Info className="w-4 h-4 text-gray-400 shrink-0" />}
                  label="Status"
                  value={job.isClosed ? "Closed" : "Active"}
                />
                <InfoItem
                  icon={<MapPin className="w-4 h-4 text-gray-400 shrink-0" />}
                  label="Required Education Level"
                  value={job.educationLevel || "N/A"}
                />
                <InfoItem
                  icon={<MapPin className="w-4 h-4 text-gray-400 shrink-0" />}
                  label="Required Experience Level"
                  value={job.experienceLevel || "N/A"}
                />
                <div className="sm:col-span-2">
                  <h3>Requirements</h3>
                  <p className="text-gray-600 my-2 text-xs text-justify whitespace-normal wrap-break-word">
                    {job.requirements || "N/A"}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <h3>Company Offer</h3>
                  <p className="text-gray-600 my-2 text-xs text-justify mb-6 whitespace-normal wrap-break-word">
                    {job.offer || "N/A"}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {!loading && (
          <div className="bg-white border border-gray-200 p-2 flex gap-2">
            <button
              onClick={() => onMessage(job.company?._id)}
              className="flex-1 text-sm bg-sky-600 text-white py-3 rounded-xl font-semibold hover:bg-sky-700 transition"
            >
              Message
            </button>

            <button
              onClick={() => onDelete(job._id)}
              className="flex-1 text-sm bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition"
            >
              Delete Job
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="bg-gray-50 p-4 rounded-xl flex items-start gap-3 min-h-18">
    {icon}
    <div>
      <p className="text-gray-500 text-xs uppercase">{label}</p>
      <p className="font-medium text-gray-900 whitespace-normal wrap-break-word">
        {value}
      </p>
    </div>
  </div>
);

const DeleteConfirmationModal = ({ job, onCancel, onConfirm, deleting }) => (
  <div className="fixed inset-0 z-1200 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-red-100 mb-4">
          <Trash2 className="text-red-600 w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Job?</h3>

        <p className="text-gray-500 text-sm mb-6">
          Permanently delete <strong>{job.title}</strong>? This action cannot be
          undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="flex-1 py-3 rounded-xl border border-gray-300 font-semibold hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={() => onConfirm(job._id)}
            disabled={deleting}
            className="flex-1 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default AdminJobManagement;
