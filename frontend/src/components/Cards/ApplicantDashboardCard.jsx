import React from "react";
import { Clock, User } from "lucide-react";

const ApplicantDashboardCard = ({ applicant, position, time }) => {
  if (!applicant) return null;

  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full flex items-center justify-center overflow-hidden shrink-0">
          {applicant?.avatar ? (
            <img src={applicant.avatar} className="object-cover" />
          ) : (
            <User className="w-5 h-5 text-slate-500" />
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <h2 className="text-slate-900 font-semibold text-sm sm:text-base truncate">
            {applicant?.name || "Unknown"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 truncate">
            {position || "N/A"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
        <Clock className="h-3.5 w-3.5" />
        {time || "N/A"}
      </div>
    </div>
  );
};

export default ApplicantDashboardCard;
