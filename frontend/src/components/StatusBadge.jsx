import React from "react";
import { CheckCheck, Clock } from "lucide-react";

export const statusColor = {
  Applied: "bg-gray-100 text-gray-600",
  "In Interview": "bg-blue-100 text-blue-800",
  Rejected: "bg-red-100 text-red-800",
  Hired: "bg-violet-100 text-violet-800",
};

export const StatusBadge = ({ status }) => {
  return (
    <span
      className={`px-3 max-w-40 py-2 rounded-xl text-center text-base font-medium ${
        statusColor[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status === "Applied" ? (
        <p className="flex items-center justify-center gap-1">
          <CheckCheck className="w-4 h-4" />
          {status}
        </p>
      ) : status === "In Interview" ? (
        <p className="flex items-center justify-center gap-1">
          <Clock className="w-4 h-4" />
          {status}
        </p>
      ) : (
        <p className="flex items-center justify-center">{status}</p>
      )}
    </span>
  );
};
