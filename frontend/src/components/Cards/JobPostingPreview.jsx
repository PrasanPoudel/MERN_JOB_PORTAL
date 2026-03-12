import React, { useState } from "react";
import {
  MapPin,
  ArrowLeft,
  BriefcaseBusiness,
  Info,
  Mail,
  ChevronDown,
  ChevronUp,
  BookOpenText,
  Users,
  GraduationCap,
  Clock,
  CalendarDays,
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
            className="group flex items-center space-x-2 px-6 py-3 text-sm font-medium text-gray-600 hover:text-white hover:bg-sky-600 border border-gray-100 hover:border-transparent rounded-xl transition-all duration-200 shadow-sm hover:shadow-lg cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Edit</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="p-2 pb-24 mt-4 border border-gray-100 rounded-2xl">
          <div className="z-10 bg-white p-2 rounded-2xl">
            <div className="flex items-start gap-4 mb-0">
              {user?.companyLogo && (
                <img
                  src={user?.companyLogo}
                  alt="Company Logo"
                  className="h-16 md:h-20 w-16 md:w-20 object-contain rounded-2xl border-4 border-white/20 shadow-sm"
                />
              )}
              <div className="">
                <h1 className="font-semibold text-gray-900 text-base sm:text-xl leading-snug line-clamp-2 group-hover:text-sky-600 transition-colors mb-2">
                  {formData?.jobTitle}
                </h1>
                <div className="flex gap-2 items-start text-sm text-gray-600">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span className="font-semibold">{formData?.location}</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6 flex-wrap">
              <span className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-sm text-gray-700 font-semibold rounded-full border border-gray-200">
                <BriefcaseBusiness className="w-4 h-4" />
                {formData?.experienceLevel}
              </span>
              <span className="flex items-center gap-2 px-4 py-2 bg-green-100 text-sm text-green-800 font-semibold rounded-full border border-green-200">
                <Clock className="w-4 h-4" />
                {formData?.jobType}
              </span>
              <span className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-sm text-purple-800 font-semibold rounded-full border border-purple-200">
                <BriefcaseBusiness className="w-4 h-4" />
                {formData?.category}
              </span>
              <span className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-sm text-blue-800 font-semibold rounded-full border border-blue-200">
                <GraduationCap className="w-4 h-4" />
                {formData?.educationLevel}
              </span>
              {/* Posted Date */}
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-sm text-gray-700 font-semibold rounded-full border border-gray-200">
                <CalendarDays className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-gray-500">Posted Date:</span>
                <span>
                  {moment(formData.createdAt).format("MMMM Do, YYYY")}
                </span>
              </div>

              {/* Deadline Date */}
              {formData?.applicationDeadlineDate && (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-sm text-red-700 font-semibold rounded-full border border-red-100">
                  <CalendarDays className="w-4 h-4 shrink-0 text-red-500" />
                  <span className="font-medium text-red-500">
                    Deadline Date:
                  </span>
                  <span>
                    {moment(formData.applicationDeadlineDate).format(
                      "MMMM Do, YYYY",
                    )}
                  </span>
                </div>
              )}
              {formData?.noOfVacancy && (
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-sm text-gray-700 font-semibold rounded-full border border-gray-200">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Available Vacancy:{" "}
                  </span>
                  {formData?.noOfVacancy}
                </div>
              )}
            </div>
          </div>

          <div className="mt-10 mb-5 p-4 bg-green-100 rounded-xl text-gray-700 flex gap-4 items-center">
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
                <Info className="text-sky-600 w-4 h-4" />
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
              <div className="p-4 md:p-8 space-y-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Personal Information
                    </h2>

                    <div className="flex items-start gap-4 mb-0">
                      <img
                        src={user?.avatar || "/default.png"}
                        alt="Avatar"
                        className="w-20 h-20 rounded-full object-cover border border-gray-200"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {user?.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1 flex-wrap">
                          <Mail className="w-4 h-4" />
                          <span>{user?.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Company Overview
                    </h2>

                    <div className="flex items-start gap-4 mb-0">
                      <img
                        src={user?.companyLogo || "/default.png"}
                        alt="Company Logo"
                        className="w-20 h-20 rounded-lg object-contain border border-gray-200"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {user?.companyName}
                        </h3>

                        <p className="text-sm text-gray-600 mt-1">
                          Company Size: {user?.companySize || "N/A"}
                        </p>

                        <p className="text-sm text-gray-600 mt-1">
                          Location: {user?.companyLocation || "N/A"}
                        </p>

                        {user?.companyWebsiteLink && (
                          <a
                            href={user?.companyWebsiteLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-sky-600 hover:underline mt-1 block"
                          >
                            {user?.companyWebsiteLink}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-6">
                    Legal & Verification
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-500">
                        Company Registration Number
                      </p>
                      <p className="font-medium mt-1 break-all">
                        {user?.companyRegistrationNumber || "—"}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-500">PAN Number</p>
                      <p className="font-medium mt-1 uppercase tracking-widest">
                        {user?.panNumber || "—"}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-500">Verification Status</p>
                      <span
                        className={`inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                          user?.isCompanyVerified
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {user?.isCompanyVerified
                          ? "Verified Company"
                          : "Pending Verification"}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-6">
                    About Company
                  </h2>

                  <p className="text-sm text-gray-700 text-justify leading-relaxed bg-gray-50 p-4 md:p-6 rounded-lg">
                    {user?.companyDescription || "No description provided."}
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
            <div className="p-4 bg-purple-50 rounded-xl sm:text-base text-sm text-gray-700">
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

          {formData?.offer && (
            <div className="mt-10 space-y-5">
              <div className="flex items-center gap-4">
                <BookOpenText className="w-4 h-4" />
                <h2 className="text-xl font-semibold text-gray-900">
                  What We're offering
                </h2>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl sm:text-base text-sm text-gray-700">
                <ul className="list-disc space-y-3 px-4">
                  {formData?.offer
                    .toString()
                    .split(".")
                    .filter(Boolean)
                    .map((offer, index) => (
                      <li key={index}>{offer.trim()}</li>
                    ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default JobPostingPreview;
