import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  Users,
  Calendar,
  MapPin,
  Clock,
  Download,
  Eye,
  ArrowLeft,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import { getInitials } from "../../utils/helper";
import ApplicantProfilePreview from "../../components/Cards/ApplicantProfilePreview";
const statusOptions = ["Applied", "In Review", "Rejected", "Hired"];
import toast from "react-hot-toast";
import { statusColor } from "../../components/StatusBadge";

const ApplicationViewer = () => {
  const location = useLocation();
  const jobId = location?.state?.jobId || null;
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const fetchApplications = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.APPLICATIONS.GET_ALL_APPLICATIONS(jobId)
      );
      setApplications(response?.data);
      // console.log(response?.data);
    } catch (err) {
      console.error("Failed to fetch applications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) {
      fetchApplications();
    } else {
      navigate("/manage-jobs");
    }
  }, []);

  const handleDownloadResume = (resumeUrl) => {
    window.open(resumeUrl, "_blank");
  };

  const onChangeStatus = async (e, id) => {
    const newStatus = e.target.value;
    setLoading(true);
    try {
      const response = await axiosInstance.put(
        API_PATHS.APPLICATIONS.UPDATE_STATUS(id),
        { status: newStatus }
      );
      // console.log(response);
      if (response.status === 200) {
        toast.success("Application status changed successfully");
        fetchApplications();
      }
    } catch (err) {
      toast.error(err);
      console.error("Failed to change application status", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <DashboardLayout activeMenu="manage-jobs">
      {loading ? (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin border-b-2 border-sky-600 rounded-full w-12 h-12 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading applications...</p>
          </div>
        </div>
      ) : (
        <div className="min-h-screen p-4">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4 sm:mb-2">
                <button
                  onClick={() => {
                    navigate("/manage-jobs");
                  }}
                  className="group flex items-center border border-gray-200 space-x-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 hover:text-white bg-white/50 hover:bg-sky-600 cursor-pointer shadow-sm hover:shadow-md hover:border-transparent transition-all duration-200 "
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <h1 className="text-xl font-semibold text-gray-900">
                  Applications Overview
                </h1>
              </div>
            </div>
          </div>

          {/* Main */}
          <div className="max-w-7xl mx-auto">
            {applications.length === 0 ? (
              <div className="text-center py-10">
                <Users className="mx-auto h-24 w-24 text-gray-400" />
                <h3 className="mt-4 text-2xl font-medium text-gray-900">
                  No application available
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Nobody has applied for this job at the moment
                </p>
              </div>
            ) : (
              <div className="flex flex-col p-1 gap-4 sm:p-4 pb-25 overflow-hidden rounded-2xl shadow-md">
                {/* Job details */}
                <div className="bg-sky-500 px-2 sm:px-4 py-4 rounded-2xl text-white">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg sm:text-2xl font-medium">
                      {applications[0].job.title}
                    </h2>
                    <p className="text-xs backdrop-blur-sm bg-white/20 py-2.5 px-3 rounded-lg">
                      {applications.length}{" "}
                      {applications.length > 1 ? "Applications" : "Application"}
                    </p>
                  </div>
                  <div className="flex text-sm mt-2 gap-5 flex-wrap">
                    <p className="flex items-center">
                      {applications[0].job.category}
                    </p>
                    <p className="flex gap-2 items-center">
                      <Clock className="w-4 h-4" />
                      {applications[0].job.type}
                    </p>
                    <p className="flex gap-2 items-center">
                      <MapPin className="w-4 h-4" />
                      {applications[0].job.location}
                    </p>
                  </div>
                </div>
                {/* Applications List */}
                <div>
                  <div className="space-y-4">
                    {applications.map((application, index) => (
                      <div
                        key={application._id}
                        className="flex flex-col lg:flex-row gap-5 lg:gap-0 lg:items-center justify-between p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div className="flex items-center gap-4">
                          {/* Avatar */}
                          <div className="flex shrink-0">
                            {application.applicant.avatar ? (
                              <img
                                src={application.applicant.avatar}
                                alt={application.applicant.name}
                                className="object-cover h-12 w-12 rounded-full"
                                style={{ imageRendering: "auto" }}
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-full bg-sky-100 flex items-center justify-center">
                                <span className="text-sky-600 font-semibold">
                                  {getInitials(application.applicant.name)}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Applicant Info */}
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {application.applicant.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {application.applicant.email}
                            </p>
                            <div className="flex items-center gap-1 mt-1 text-gray-500 text-xs">
                              <Calendar className="w-3 h-3" />
                              <span>
                                Applied on{" "}
                                {moment(application.createdAt).format(
                                  "MMMM Do, YYYY"
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 md:m-0">
                          <button
                            onClick={() => {
                              handleDownloadResume(
                                application.applicant.resume
                              );
                            }}
                            className="col-span-2 sm:col-span-1 inline-flex items-center gap-2 px-3 py-2 bg-sky-600 text-white text-sm font-medium rounded-lg hover:bg-sky-700 transition-colors cursor-pointer"
                          >
                            <Download className="w-4 h-4" />
                            Resume
                          </button>
                          <select
                            value={application.status}
                            onChange={(e) => {
                              onChangeStatus(e, application._id);
                            }}
                            disabled={loading}
                            className={`${
                              statusColor[application.status]
                            } border-2 border-gray-200 rounded-lg px-3 py-2 text-gray-900`}
                          >
                            {statusOptions.map((status, index) => (
                              <option key={index} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => {
                              setSelectedApplicant(application);
                            }}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 border-2 border-gray-200 text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                            View Profile
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {selectedApplicant && (
            <ApplicantProfilePreview
              selectedApplicant={selectedApplicant}
              setSelectedApplicant={setSelectedApplicant}
              handleDownloadResume={handleDownloadResume}
              handleClose={() => {
                setSelectedApplicant(null);
                fetchApplications();
              }}
            />
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default ApplicationViewer;
