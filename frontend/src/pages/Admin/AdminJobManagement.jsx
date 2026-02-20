import { useEffect, useState } from "react";
import { Trash2, Mail, Loader, BriefcaseBusiness } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import toast from "react-hot-toast";
import moment from "moment";

const AdminJobManagement = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const getAllJobs = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(API_PATHS.ADMIN.GET_ALL_JOBS);
      if (response.status === 200) {
        setJobs(response.data);
        setFilteredJobs(response.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch jobs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllJobs();
  }, []);

  useEffect(() => {
    let filtered = jobs;

    if (statusFilter !== "all") {
      if (statusFilter === "active") {
        filtered = filtered.filter((job) => !job.isClosed);
      } else if (statusFilter === "closed") {
        filtered = filtered.filter((job) => job.isClosed);
      }
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredJobs(filtered);
  }, [searchTerm, statusFilter, jobs]);

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      setDeleting(true);
      await axiosInstance.delete(API_PATHS.ADMIN.DELETE_JOB(jobId));
      toast.success("Job deleted successfully");
      setJobs(jobs.filter((j) => j._id !== jobId));
      setSelectedJob(null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete job");
    } finally {
      setDeleting(false);
    }
  };

  const handleMessageEmployer = (employerId) => {
    navigate(`/admin-chat?userId=${employerId}`);
  };

  return (
    <DashboardLayout activeMenu="admin-jobs">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="max-w-7xl mx-auto p-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Job Management
            </h1>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <input
                type="text"
                placeholder="Search by job title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm"
              >
                <option value="all">All Jobs</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Jobs List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border-2 border-gray-100 shadow-sm overflow-hidden">
                {filteredJobs.length === 0 ? (
                  <div className="p-12 text-center">
                    <p className="text-gray-500">No jobs found</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredJobs.map((job) => (
                      <div
                        key={job._id}
                        onClick={() => setSelectedJob(job)}
                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                          selectedJob?._id === job._id ? "bg-sky-50" : ""
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                            {job.company?.companyLogo ? (
                              <img
                                src={job.company.companyLogo}
                                alt={job.company.companyName}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <BriefcaseBusiness className="w-6 h-6 text-orange-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900">
                              {job.title}
                            </p>
                            <p className="text-sm text-gray-600">
                              {job.company?.companyName}
                            </p>
                            <div className="flex gap-2 mt-2">
                              <span
                                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                  job.isClosed
                                    ? "bg-red-100 text-red-700"
                                    : "bg-green-100 text-green-700"
                                }`}
                              >
                                {job.isClosed ? "Closed" : "Active"}
                              </span>
                              <span className="text-xs text-gray-600 px-3 py-1">
                                {moment(job.createdAt).fromNow()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Job Details and Actions */}
            {selectedJob && (
              <JobDetailPanel
                job={selectedJob}
                onDelete={handleDeleteJob}
                onMessageEmployer={handleMessageEmployer}
                onClose={() => setSelectedJob(null)}
                deleting={deleting}
              />
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

const JobDetailPanel = ({
  job,
  onDelete,
  onMessageEmployer,
  onClose,
  deleting,
}) => {
  return (
    <div className="bg-white rounded-xl border-2 border-gray-100 shadow-sm p-6 sticky top-20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Job Details</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          ✕
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
            Title
          </p>
          <p className="text-sm font-semibold text-gray-900">{job.title}</p>
        </div>

        <div>
          <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
            Company
          </p>
          <p className="text-sm text-gray-900">{job.company?.companyName}</p>
        </div>

        <div>
          <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
            Type
          </p>
          <p className="text-sm text-gray-900">{job.type}</p>
        </div>

        {job.location && (
          <div>
            <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
              Location
            </p>
            <p className="text-sm text-gray-900">{job.location}</p>
          </div>
        )}

        {job.category && (
          <div>
            <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
              Category
            </p>
            <p className="text-sm text-gray-900">{job.category}</p>
          </div>
        )}

        {(job.salaryMin || job.salaryMax) && (
          <div>
            <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
              Salary
            </p>
            <p className="text-sm text-gray-900">
              ${job.salaryMin?.toLocaleString()} - $
              {job.salaryMax?.toLocaleString()}
            </p>
          </div>
        )}

        <div>
          <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
            Status
          </p>
          <p className="text-sm">
            <span
              className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                job.isClosed
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {job.isClosed ? "Closed" : "Active"}
            </span>
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
            Posted
          </p>
          <p className="text-sm text-gray-900">
            {moment(job.createdAt).format("MMM DD, YYYY")}
          </p>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <p className="text-xs text-gray-600 uppercase font-semibold mb-2">
            Description
          </p>
          <p className="text-sm text-gray-700 line-clamp-3">
            {job.description}
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
          <button
            onClick={() => onMessageEmployer(job.company._id)}
            className="w-full bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Mail className="w-4 h-4" />
            Message Employer
          </button>
          <button
            onClick={() => onDelete(job._id)}
            disabled={deleting}
            className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Delete Job
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminJobManagement;
