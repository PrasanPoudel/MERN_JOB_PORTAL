import React from "react";
import { BriefcaseBusiness, MapPin, Clock } from "lucide-react";
import moment from "moment";

const JobDashboardCard = ({ job }) => {
  if (!job) return null;

  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all">
      <div className="flex items-center gap-4">
        <div className="h-11 w-11 bg-sky-100 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
          <BriefcaseBusiness className="w-5 h-5 text-sky-600" />
        </div>
        <div className="flex flex-col gap-1 min-w-0">
          <h4 className="font-semibold text-sm sm:text-base text-slate-900 truncate">
            {job?.title || "Untitled Job"}
          </h4>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <p className="flex items-center gap-1 text-xs sm:text-sm text-slate-500">
              <MapPin className="h-3.5 w-3.5" />
              {job?.location || "N/A"}
            </p>
            <p className="flex items-center gap-1 text-xs sm:text-sm text-slate-500">
              <Clock className="h-3.5 w-3.5" />
              {job?.createdAt ? moment(job.createdAt).format("MMMM Do, YYYY") : "N/A"}
            </p>
          </div>
        </div>
      </div>
      <div className="shrink-0">
        <span
          className={`badge ${
            job?.isClosed ? "badge-gray" : "badge-success"
          }`}
        >
          {job?.isClosed ? "Closed" : "Active"}
        </span>
      </div>
    </div>
  );
};

export default JobDashboardCard;