import React from "react";
import { BriefcaseBusiness, Clock, User } from "lucide-react";

const ApplicantDashboardCard = ({ applicant, position, time }) => {
  if (!applicant) return null;

  return (
    <div className="flex items-center justify-between p-2 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
      <div className="flex items-center gap-2 w-full">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden shrink-0 bg-gray-100">
          {applicant?.avatar ? (
            <img src={applicant.avatar} className="object-cover" />
          ) : (
            <User className="w-6 h-6 text-gray-500 shrink-0" />
          )}
        </div>
        <div className="flex flex-col w-full">
          <h2 className="text-gray-900 font-semibold text-xs sm:text-base truncate">
            {applicant?.name || "Unknown"}
          </h2>
          <div className="flex flex-col gap-1 items-start sm:flex-row sm:items-center justify-between">
            <p className="flex gap-1 items-center text-xs sm:text-sm text-gray-500 truncate">
              <BriefcaseBusiness className="w-4 h-4" />
              {position || "N/A"}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 shrink-0">
              <Clock className="w-4 h-4" />
              {time || "N/A"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDashboardCard;
