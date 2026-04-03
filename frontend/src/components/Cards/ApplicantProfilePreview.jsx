import React, { useState } from "react";
import { Calendar, Download, X } from "lucide-react";
import moment from "moment";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { statusConfig, StatusBadge } from "../StatusBadge";

const statusOptions = ["Applied", "In Review", "Rejected", "Hired"];

const ApplicantProfilePreview = ({
  selectedApplicant,
  setSelectedApplicant,
  handleDownloadResume,
  handleClose,
}) => {
  const [currentStatus, setCurrentStatus] = useState(selectedApplicant.status);
  const [loading, setLoading] = useState(false);

  const onChangeStatus = async (e) => {
    const newStatus = e.target.value;
    setLoading(true);
    setCurrentStatus(newStatus);
    try {
      const response = await axiosInstance.put(
        API_PATHS.APPLICATIONS.UPDATE_STATUS(selectedApplicant._id),
        { status: newStatus },
      );
      // console.log(response);
      if (response.status === 200) {
        toast.success("Application status changed successfully");
        setSelectedApplicant({ ...selectedApplicant, status: newStatus });
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Something went wrong. Try again",
      );
      console.error("Failed to change application status", err);
      setCurrentStatus(selectedApplicant.status);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed min-h-screen min-w-screen bg-black/75 inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[95vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 ">
          <h3 className="text-xl font-semibold text-slate-900">
            Applicant Profile
          </h3>
          <button
            onClick={() => {
              handleClose();
            }}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="p-4">
          <div className="text-center mb-6">
            <img
              src={selectedApplicant.applicant.avatar || "/default.png"}
              alt={selectedApplicant.applicant.name}
              className="object-fill h-20 w-20 rounded-full mx-auto"
              style={{ imageRendering: "auto" }}
            />
            <h4 className="mt-4 text-xl font-semibold text-slate-900">
              {selectedApplicant.applicant.name}
            </h4>
            <p className="text-slate-600">
              {selectedApplicant.applicant.email}
            </p>
          </div>

          <div className="space-y-4">
            {/* Change Status */}
            <div className="mt-4">
              <label className="block mb-2 text-sm text-slate-700 font-medium ">
                Change Application Status
              </label>
              <select
                value={currentStatus}
                onChange={onChangeStatus}
                disabled={loading}
                className={`${
                  statusConfig[selectedApplicant.status]
                } border-2 border-gray-200 rounded-lg px-3 py-2 text-slate-900 w-full`}
              >
                {statusOptions.map((status, index) => (
                  <option key={index} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {loading && (
                <p className="text-slate-500 text-xs mt-1">
                  Changing status...
                </p>
              )}
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <h5 className="font-medium text-slate-900 mb-2">
                Applied Position
              </h5>
              <p className="text-slate-700">{selectedApplicant.job.title}</p>
              <p className="text-slate-600 text-sm mt-1">
                {selectedApplicant.job.location} | {selectedApplicant.job.type}
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <h5 className="font-medium text-slate-900 mb-2">
                Application Details
              </h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Status:</span>
                  <StatusBadge status={currentStatus} />
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Applied Date:</span>
                  <span className="text-slate-900 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {moment(selectedApplicant.createdAt)?.format(
                      "MMMM Do, YYYY",
                    )}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                handleDownloadResume(selectedApplicant.applicant.resume);
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-600 text-white hover:bg-sky-700 rounded-lg font-medium shadow-sm hover:shadow-lg transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantProfilePreview;
