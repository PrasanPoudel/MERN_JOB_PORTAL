import React from "react";
import { BriefcaseBusiness, MapPin, Clock } from "lucide-react";
import moment from "moment";

const JobDashboardCard = ({ job }) => {
  if (!job) return null;

  return (
    <div className="flex flex-col items-start justify-between p-2 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all">
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 bg-sky-100 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
          <BriefcaseBusiness className="w-5 h-5 text-sky-600" />
        </div>
        <div className="flex flex-col gap-1 min-w-0">
          <h4 className="font-semibold text-xs sm:text-base max-w-fit text-slate-900 truncate">
            {job?.title || "Untitled Job"}
          </h4>
          <div className="flex flex-col items-start gap-1">
            <p className="flex items-center gap-1 text-xs sm:text-sm text-slate-500">
              <MapPin className="h-4 w-4" />
              {job?.location || "N/A"}
            </p>
            <p className="flex items-center gap-1 text-xs sm:text-sm text-slate-500">
              <Clock className="h-4 w-4" />
              {job?.createdAt
                ? moment(job.createdAt).format("MMMM Do, YYYY")
                : "N/A"}
            </p>
          </div>
        </div>
      </div>
      <div className="flex w-full shrink-0 justify-end">
        <span
          className={`badge ${job?.isClosed ? "badge-gray" : "badge-success"}`}
        >
          {job?.isClosed ? "Closed" : "Active"}
        </span>
      </div>
    </div>
  );
};

export default JobDashboardCard;
