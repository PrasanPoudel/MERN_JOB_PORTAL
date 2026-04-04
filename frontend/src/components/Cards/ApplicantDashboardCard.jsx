import React from "react";
import { Clock, User } from "lucide-react";

const ApplicantDashboardCard = ({ applicant, position, time }) => {
  if (!applicant) return null;

  return (
    <div className="flex items-center justify-between p-2 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all">
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center overflow-hidden shrink-0 bg-slate-100">
          {applicant?.avatar ? (
            <img src={applicant.avatar} className="object-cover" />
          ) : (
            <User className="w-6 h-6 text-slate-500 shrink-0" />
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <h2 className="text-slate-900 font-semibold text-xs sm:text-base truncate">
            {applicant?.name || "Unknown"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 truncate">
            {position || "N/A"}
          </p>
      <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
        <Clock className="h-4 w-4" />
        {time || "N/A"}
      </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDashboardCard;
