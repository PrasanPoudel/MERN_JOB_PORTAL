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
      className={`bg-white h-fit rounded-xl border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}
    >
      {(title || headerAction) && (
        <div className="flex items-center justify-between p-6 pb-4">
          <div>
            {title && (
              <h3 className="text-lg text-gray-900 font-semibold">{title}</h3>
            )}
            {subtitle && (
              <h3 className="text-sm text-gray-600 mt-1">{subtitle}</h3>
            )}
          </div>
          {headerAction}
        </div>
      )}
      <div className={`${title ? "px-6 pb-6" : "p-6"}`}>{children}</div>
    </div>
  );
};

export const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = "sky",
}) => {
  const colorClasses = {
    sky: "from-sky-500 to-sky-600",
    emerald: "from-emerald-500 to-emerald-600",
    violet: "from-violet-500 to-violet-600",
    orange: "from-orange-500 to-orange-600",
  };

  return (
    <Card
      className={`bg-linear-to-br ${colorClasses[color]} text-white border-0`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {trend && (
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="font-medium">{trendValue}</span>
            </div>
          )}
        </div>
        <div className="bg-white/10 p-3 rounded-xl">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
};
