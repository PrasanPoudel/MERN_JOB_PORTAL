import React from "react";
import { BriefcaseBusiness } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="relative inline-flex">
          <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-sky-600 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <BriefcaseBusiness className="w-6 h-6 text-sky-600" />
          </div>
        </div>
        <p className="mt-4 text-slate-600 font-medium text-sm">
          Finding amazing opportunities...
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;