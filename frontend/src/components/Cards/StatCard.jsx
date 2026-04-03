import { TrendingUp } from "lucide-react";
import React from "react";

export const Card = ({
  className,
  children,
  title,
  subtitle,
  headerAction,
}) => {
  return (
    <div
      className={`card ${className}`}
    >
      {(title || headerAction) && (
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            {title && (
              <h3 className="text-base font-bold text-slate-900">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
            )}
          </div>
          {headerAction}
        </div>
      )}
      <div className={`${title ? "p-5" : "p-5"}`}>{children}</div>
    </div>
  );
};

const colorConfig = {
  sky: {
    border: "border-l-sky-500",
    iconBg: "bg-sky-100",
    iconText: "text-sky-600",
  },
  emerald: {
    border: "border-l-emerald-500",
    iconBg: "bg-emerald-100",
    iconText: "text-emerald-600",
  },
  violet: {
    border: "border-l-violet-500",
    iconBg: "bg-violet-100",
    iconText: "text-violet-600",
  },
  orange: {
    border: "border-l-orange-500",
    iconBg: "bg-orange-100",
    iconText: "text-orange-600",
  },
};

export const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  color = "sky",
}) => {
  const colors = colorConfig[color] || colorConfig.sky;

  return (
    <div
      className={`card border-l-4 ${colors.border} p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        </div>
        <div className={`${colors.iconBg} p-3 rounded-xl`}>
          <Icon className={`h-6 w-6 ${colors.iconText}`} />
        </div>
      </div>
    </div>
  );
};
