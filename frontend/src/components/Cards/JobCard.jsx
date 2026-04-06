import React from "react";
import {
  Bookmark,
  BookmarkCheck,
  Building2,
  MapPin,
  Calendar,
  BriefcaseBusiness,
  BadgeCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import moment from "moment";
import { StatusBadge } from "../StatusBadge";

const JobCard = ({
  hideShadow = false,
  job,
  onClick,
  onToggleSave,
  onApply,
  saved,
  hideApply,
  hideSaveButton,
}) => {
  const { user } = useAuth();

  if (!job) {
    return null;
  }

  const formatSalary = (num) => {
    if (!num) return "N/A";
    if (num > 1000) {
      return `${(num / 1000).toFixed(0)}k/m`;
    }
    return `${num}/m`;
  };

  const jobTypeColors = {
    "Full-Time": "badge-success",
    "Part-Time": "badge-warning",
    Contract: "badge-purple",
    Internship: "badge-primary",
  };

  return (
    <div
      onClick={onClick}
      className={`${hideShadow ? "card" : "card-hover"} p-5 cursor-pointer flex flex-col justify-between min-h-60`}
    >
      <div>
        {/* Company & Title */}
        <div className="flex items-start gap-3 mb-4">
          {job?.company?.companyLogo ? (
            <img
              src={job?.company?.companyLogo}
              alt="Company Logo"
              className="w-12 h-12 object-contain rounded-xl border border-gray-200 shrink-0"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-gray-400" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2 group-hover:text-sky-600 transition-colors">
              {job?.title || "Untitled Job"}
            </h3>
            <p className="text-gray-500 text-sm flex items-center gap-1.5 mt-1">
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                {job?.company?.companyName || "Unknown Company"}
              </span>
              {job?.company?.isCompanyVerified && (
                <BadgeCheck className="w-4 h-4 text-sky-600 shrink-0" />
              )}
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="badge badge-gray">
            <MapPin className="w-3 h-3" />
            {job?.location || "N/A"}
          </span>

          <span className={`badge ${jobTypeColors[job?.type] || "badge-gray"}`}>
            {job?.type || "N/A"}
          </span>

          <span className="badge badge-purple">
            <BriefcaseBusiness className="w-3 h-3" />
            {job?.category || "N/A"}
          </span>
        </div>

        {/* Date */}
        <div className="flex items-center gap-1.5 text-sm text-gray-400 mb-4">
          <Calendar className="w-4 h-4" />
          {job?.createdAt
            ? moment(job.createdAt).format("MMM Do, YYYY")
            : "N/A"}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <p className="text-sky-600 font-bold text-lg">
          NPR {formatSalary(job?.salaryMin)}
        </p>
        <div className="flex items-center gap-2">
          {user && user?.role === "jobSeeker" && !hideSaveButton && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave();
              }}
              title={
                job?.isSaved || saved
                  ? "Remove from saved jobs"
                  : "Save this job"
              }
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              {job?.isSaved || saved ? (
                <BookmarkCheck className="w-5 h-5 text-sky-600" />
              ) : (
                <Bookmark className="w-5 h-5 text-gray-400" />
              )}
            </button>
          )}

          {!saved &&
            user?.role === "jobSeeker" &&
            (job?.applicationStatus ? (
              <StatusBadge status={job?.applicationStatus} />
            ) : (
              !hideApply && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onApply();
                  }}
                  title="Apply for this job"
                  className="btn-primary-sm"
                >
                  Apply
                </button>
              )
            ))}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
