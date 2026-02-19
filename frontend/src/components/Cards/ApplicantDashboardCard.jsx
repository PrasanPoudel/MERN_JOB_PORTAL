import React from "react";
import { Clock } from "lucide-react";

const ApplicantDashboardCard = ({ applicant, position, time }) => {
  return (
    <div className="flex items-center p-2 justify-between rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
      <div className="flex flex-col gap-1 items-start">
        <h2 className="text-gray-900 font-medium text-sm sm:text-xl">{applicant.name}</h2>
        <p className="text-xs sm:text-sm text-gray-600">{position}</p>
      </div>
      <div className="flex gap-1 items-center text-xs text-gray-600">
        <Clock className="h-3 w-3" />
        {time}
      </div>
    </div>
  );
};

export default ApplicantDashboardCard;
