import React, { useState } from "react";
import {
  MapPin,
  ArrowLeft,
  Building2,
  BriefcaseBusiness,
  Calendar,
  Info,
  Mail,
  ChevronDown,
  ChevronUp,
  DollarSign,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import moment from "moment";

const JobPostingPreview = ({ formData, setIsPreview }) => {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const formatSalary = (num) => {
    if (num > 1000) {
      return `${(num / 1000).toFixed(0)}k`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto bg-white p-2">
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">Job Preview</h2>
          </div>
          <button
            onClick={() => {
              setIsPreview(false);
            }}
            className="group flex items-center space-x-2 px-6 py-3 text-sm font-medium text-gray-600 hover:text-white hover:bg-sky-600 border border-gray-100 hover:border-transparent rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Edit</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="p-4 pb-24 mt-8 border border-gray-100 rounded-2xl">
          <div className="z-10">
            <div className="flex items-start justify-between mb-0">
              <div className="">
                <h1 className="text-xl font-medium mb-2 leading-tight text-gray-900">
                  {formData.jobTitle}
                </h1>
                <div className="flex items-center space-x-4 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {formData.isRemote ? "Remote" : formData.location}
                    </span>
                  </div>
                </div>
              </div>
              {user?.companyLogo ? (
                <img
                  src={user.companyLogo}
                  alt="Company Logo"
                  className="h-16 md:h-20 w-16 md:w-20 object-fill rounded-2xl border-4 border-white/20 shadow-lg"
                />
              ) : (
                <div className="h-20 w-20 bg-gray-50 border-2 border-gray-200 rounded-2xl flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-gray-700" />
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <span className="px-4 py-2 bg-green-100 text-sm text-green-800 font-semibold rounded-full border border-purple-200">
                {formData.jobType}
              </span>
              <span className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-sm text-purple-800 font-semibold rounded-full border border-sky-200">
                <BriefcaseBusiness className="w-4 h-4" />
                {formData.category}
              </span>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-sm text-gray-700 font-semibold rounded-full border border-gray-200">
                <Calendar className="w-4 h-4" />
                <span>
                  {moment(formData.createdAt).format("MMMM Do, YYYY")}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-10 mb-5 p-4 bg-green-100 rounded-xl text-gray-700 flex gap-4 items-center">
            <div className="bg-green-400 text-2xl rounded-2xl w-20 h-20 flex items-center justify-center text-white">
              <DollarSign className="w-6 h-6" />
            </div>
            <div className="">
              <p className="font-semibold">Compensation</p>
              <p className="font-bold text-xl mt-2">
                NPR {formatSalary(formData.salaryMin)} to{" "}
                {formatSalary(formData.salaryMax)}
                <span className="text-sm font-medium ml-2">per Month</span>
              </p>
            </div>
          </div>

          {/* Employer Info */}

          <div className="bg-white rounded-2xl shadow-sm">
            <div
              className="flex items-center justify-between px-3 py-6 cursor-pointer"
              onClick={() => setExpanded(!expanded)}
            >
              <div className="flex items-center gap-4">
                <Info className="text-sky-600" size={22} />
                <h2 className="sm:text-xl text-lg font-semibold text-gray-900">
                  Employer Information
                </h2>
              </div>

              {expanded ? (
                <ChevronUp className="text-sky-600" />
              ) : (
                <ChevronDown className="text-sky-600" />
              )}
            </div>

            {/* Expanded Content */}
            {expanded && (
              <div className="px-4 py-4 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* personal info */}
                  <div id="1" className="space-y-6">
                    <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 ">
                      Personal Information
                    </h2>
                    <div className="flex items-center space-x-4">
                      <img
                        src={user?.avatar}
                        alt="Avatar"
                        className="w-20 h-20 rounded-full object-fill border-2 border-gray-100"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {user?.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span>{user?.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* company info */}
                  <div id="2" className="space-y-6">
                    <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 ">
                      Company Information
                    </h2>
                    {/* company logo and name */}
                    <div className="flex items-center space-x-4">
                      <img
                        src={user?.companyLogo}
                        alt="Company Logo"
                        className="w-20 h-20 rounded-lg object-fill border-2 border-gray-100"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {user?.companyName}
                        </h3>
                        <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
                          <Building2 className="w-4 h-4" />
                          <span>Company</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* company description */}
                <div className="mt-8">
                  <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-6">
                    About Company
                  </h2>
                  <p className="text-sm text-gray-700 text-justify leading-relaxed bg-gray-50 p-3 md:p-6 rounded-lg">
                    {user.companyDescription}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-10 space-y-5">
            <div className="flex items-center gap-2 h-auto">
              <div className="w-1 h-10 bg-linear-to-b from-sky-600  to-sky-700 rounded-xl shadow-sm"></div>
              <h2 className="text-xl font-semibold text-gray-900">
                About This Job
              </h2>
            </div>
            <p className="sm:text-base text-sm text-justify p-4 bg-sky-50 rounded-xl text-gray-700">
              {formData.description}
            </p>
          </div>

          <div className="mt-10 space-y-5">
            <div className="flex items-center gap-2 h-auto">
              <div className="w-1 h-10 bg-linear-to-b from-purple-600  to-purple-700 rounded-xl shadow-sm"></div>
              <h2 className="text-xl font-semibold text-gray-900">
                What We're Looking For
              </h2>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl sm:text-base text-sm text-justify text-gray-700">
              <ul className="list-disc space-y-3 px-4">
                {formData.requirements
                  .toString()
                  .split(".")
                  .filter(Boolean)
                  .map((requirement, index) => (
                    <li key={index}>{requirement.trim()}</li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default JobPostingPreview;
