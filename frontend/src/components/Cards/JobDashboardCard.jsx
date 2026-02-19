import React from "react";
import { BriefcaseBusiness, MapPin, Clock } from "lucide-react";
import moment from "moment";

const JobDashboardCard = ({ job }) => {
  return (
    <div className="flex items-center justify-between p-2 rounded-xl border-2 border-gray-100 hover:border-gray-200 transition-colors">
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 bg-sky-100 rounded-xl flex items-center justify-center">
          <BriefcaseBusiness className="w-5 h-5 text-sky-600" />
        </div>
        <div className="flex gap-2 flex-col">
          <h4 className="font-medium text-xl text-gray-900">{job.title}</h4>
          <div className="flex flex-col gap-1">
            <p className="flex gap-1 text-xs text-gray-600 items-center">
              <MapPin className="h-3 w-3" />
              {job.location}
            </p>
            <p className="flex gap-1 w-full text-xs text-gray-600 items-center">
              <Clock className="h-3 w-3" />
              {moment(job.createdAt)?.format("MMMM Do, YYYY")}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full ${
            job.isClosed
              ? "text-gray-600 bg-gray-100"
              : "text-green-700 bg-green-100"
          }`}
        >
          {job.isClosed ? "Closed" : "Active"}
        </span>
      </div>
    </div>
  );
};

export default JobDashboardCard;
