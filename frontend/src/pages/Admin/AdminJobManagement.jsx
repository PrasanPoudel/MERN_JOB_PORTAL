import { useEffect, useState } from "react";
import {
  Loader,
  BriefcaseBusiness,
  X,
  Search,
  MapPin,
  Clock,
  Banknote,
  Info,
  Tag,
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
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [confirmDeleteJob, setConfirmDeleteJob] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Pagination
  const itemsPerPage = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

  // Fetch all jobs
  const getAllJobs = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(API_PATHS.ADMIN.GET_ALL_JOBS);
      if (response.status === 200) {
        setJobs(response.data);
        setFilteredJobs(response.data);
      }
    } catch {
      toast.error("Failed to fetch jobs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllJobs();
  }, []);

  // Filtering
  useEffect(() => {
    let filtered = jobs;

    if (statusFilter !== "all") {
      filtered = filtered.filter((j) =>
        statusFilter === "active" ? !j.isClosed : j.isClosed,
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (j) =>
          j.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          j.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredJobs(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchTerm, statusFilter, jobs]);

  const handleDeleteJob = async (jobId) => {
    try {
      setDeleting(true);
      await axiosInstance.delete(API_PATHS.ADMIN.DELETE_JOB(jobId));
      toast.success("Job deleted successfully");
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
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
            {filteredJobs.length} Jobs
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Jobs</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Job Cards */}
        {isLoading ? (
          <div className="text-center py-20">
            <Loader className="animate-spin mx-auto text-sky-600" />
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <BriefcaseBusiness className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 font-medium">No jobs found</p>
          </div>
        ) : (
          <>
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
                    {filteredJobs.length}
                  </span>
                  jobs
                </p>
              </div>
            </div>

            <div className="grid gap-6">
              {paginatedJobs.map((job) => (
                <div key={job._id} className="flex flex-col gap-2">
                  <JobCard job={job} hideShadow={true} />
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
            {filteredJobs.length > itemsPerPage && (
              <div className="mt-8 flex items-center justify-between pb-16">
                {/* Mobile pagination */}
                <div className="flex flex-1 justify-between md:hidden">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
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
                      <span className="font-bold">{startIndex + 1}</span> to{" "}
                      <span className="font-bold">
                        {Math.min(startIndex + itemsPerPage, filteredJobs.length)}
                      </span>{" "}
                      of <span className="font-bold">{filteredJobs.length}</span>{" "}
                      results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex shadow-sm -space-x-px rounded-md">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium rounded-l-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      {getPaginationPages(currentPage, totalPages).map(
                        (page, index) =>
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
                              onClick={() => setCurrentPage(page)}
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
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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
    </DashboardLayout>
  );
};

const JobModal = ({ job, loading, onClose, onDelete, onMessage }) => {
  const companyName = job?.company?.companyName || "Unknown Company";
  const employerName = job.company?.name || "Unknown Employer";

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 pb-8">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col relative overflow-hidden">
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
                  <h3 className="text-lg font-semibold text-gray-900">
                    {companyName}
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

              <p className="text-gray-600 mb-6 whitespace-normal wrap-break-word">
                {job.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
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
                  icon={
                    <Banknote className="w-4 h-4 text-gray-400 shrink-0" />
                  }
                  label="Salary"
                  value={`NPR ${job.salaryMin || 0} - ${job.salaryMax || 0}`}
                />
                <InfoItem
                  icon={<Info className="w-4 h-4 text-gray-400 shrink-0" />}
                  label="Status"
                  value={job.isClosed ? "Closed" : "Active"}
                />
                <div className="sm:col-span-2">
                  <InfoItem
                    label="Requirements"
                    value={job.requirements || "N/A"}
                  />
                </div>
                <div className="sm:col-span-2">
                  <InfoItem label="Offer" value={job.offer || "N/A"} />
                </div>
              </div>
            </>
          )}
        </div>

        {!loading && (
          <div className="bg-white border border-gray-200 p-4 flex flex-row gap-4 fixed bottom-0 left-0 right-0 max-w-3xl mx-auto z-20 shadow-md">
            <button
              onClick={() => onMessage(job.company?._id)}
              className="flex-1 bg-sky-600 text-white py-3 rounded-xl font-semibold hover:bg-sky-700 transition"
            >
              Message
            </button>

            <button
              onClick={() => onDelete(job._id)}
              className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition"
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

export default AdminJobManagement;