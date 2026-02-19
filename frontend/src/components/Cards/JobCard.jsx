import React from "react";
import {
  Bookmark,
  BookmarkCheck,
  Building2,
  MapPin,
  Calendar,
  BriefcaseBusiness,
  DollarSign,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import moment from "moment";
import { StatusBadge } from "../StatusBadge";

const JobCard = ({ job, onClick, onToggleSave, onApply, saved, hideApply, hideSaveButton }) => {
  const { user } = useAuth();

  const formatSalary = (num) => {
    if (num > 1000) {
      return `${(num / 1000).toFixed(0)}k/m`;
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white mx-auto min-w-full min-h-60 rounded-2xl border border-gray-200 p-5 hover:shadow-md hover:shadow-gray-200 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
    >
      {/* Top section */}
      <div>
        <div className="flex items-start gap-4 mb-4">
          {job?.company?.companyLogo ? (
            <img
              src={job?.company?.companyLogo}
              alt="Company Logo"
              className="w-14 h-14 object-contain rounded-2xl border border-gray-200"
            />
          ) : (
            <div className="w-14 h-14 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center">
              <Building2 className="w-7 h-7 text-gray-400" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2 group-hover:text-sky-600 transition-colors">
              {job?.title}
            </h3>
            <p className="text-gray-600 text-xs flex items-center gap-1 mt-1 truncate">
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              {job?.company?.companyName}
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4 text-xs">
          <span className="flex items-center gap-1 bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full font-medium">
            <MapPin className="w-3 h-3" />
            {job?.location}
          </span>

          <span
            className={`px-2.5 py-1 rounded-full font-medium ${
              job?.type === "Full-Time"
                ? "bg-green-100 text-green-800"
                : job?.type === "Part-Time"
                ? "bg-yellow-100 text-yellow-800"
                : job?.type === "Contract"
                ? "bg-purple-100 text-purple-800"
                : "bg-sky-100 text-sky-800"
            }`}
          >
            {job?.type}
          </span>

          <span className="flex items-center gap-1 bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full font-medium">
            <BriefcaseBusiness className="w-3 h-3" />
            {job?.category}
          </span>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 text-sm pl-2 text-gray-500 mb-4">
          <Calendar className="w-4 h-4" />
          {job?.createdAt
            ? moment(job.createdAt).format("MMM Do, YYYY")
            : "N/A"}
        </div>
      </div>

      <div className="flex items-center justify-between p-0">
        <p className="flex items-center gap-1 text-sky-600 font-semibold text-lg">
          <DollarSign className="w-5 h-5" />
          NPR {formatSalary(job.salaryMin)}
        </p>
        <div className="flex items-center justify-end gap-2">
          {(user && user?.role ==="jobSeeker" && !hideSaveButton) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave();
              }}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              {job?.isSaved || saved ? (
                <BookmarkCheck className="w-5 h-5 text-sky-600" />
              ) : (
                <Bookmark className="w-5 h-5 text-gray-600" />
              )}
            </button>
          )}

          {(!saved && user?.role ==="jobSeeker" ) &&
            (job?.applicationStatus ? (
              <StatusBadge status={job?.applicationStatus} />
            ) : (
              !hideApply && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onApply();
                  }}
                  className="bg-sky-600 hover:bg-sky-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md cursor-pointer"
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
