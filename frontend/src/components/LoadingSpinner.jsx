import React from "react";
import { BriefcaseBusiness } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-sky-200 border-t-sky-600 mx-auto mb-4"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <BriefcaseBusiness className="w-6 h-6 text-sky-600" />
          </div>
        </div>
        <p className="text-gray-700 font-medium">
          Finding amazing opportunities ...
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
