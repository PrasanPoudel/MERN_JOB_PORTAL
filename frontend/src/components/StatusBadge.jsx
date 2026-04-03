
import React from "react";
import { CheckCheck, Clock, XCircle, Award } from "lucide-react";

export const statusConfig = {
  Applied: {
    className: "badge-gray",
    icon: CheckCheck,
  },
  "In Interview": {
    className: "badge-primary",
    icon: Clock,
  },
  Rejected: {
    className: "badge-danger",
    icon: XCircle,
  },
  Hired: {
    className: "badge-success",
    icon: Award,
  },
};

export const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || { className: "badge-gray", icon: null };
  const Icon = config.icon;

  return (
    <span className={`badge ${config.className}`}>
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {status || "Unknown"}
    </span>
  );
};