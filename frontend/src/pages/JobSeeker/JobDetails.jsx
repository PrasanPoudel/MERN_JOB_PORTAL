import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/layout/Navbar";
import axiosInstance from "../../utils/axiosInstance";
import LoadingSpinner from "../../components/LoadingSpinner";
import moment from "moment";
import {
  ArrowLeft,
  MapPin,
  BriefcaseBusiness,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Info,
  Mail,
  Users,
  BookOpenText,
  BadgeCheck,
  CalendarDays,
  Clock,
} from "lucide-react";
import { StatusBadge } from "../../components/StatusBadge";

const JobDetails = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState({});
  const [expanded, setExpanded] = useState(false);

  const { jobId } = useParams();

  const applyToJob = async (jobId) => {
    try {
      if (jobId) {
        await axiosInstance.post(API_PATHS.APPLICATIONS.APPLY_TO_JOB(jobId));
        toast.success("Applied to job successfully!");
        getJobById(jobId);
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Something went wrong. Try again",
      );
    }
  };

  const getJobById = async (jobId) => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.JOBS.GET_JOB_BY_ID(jobId),
        {
          params: { userId: user?._id || null },
        },
      );
      // console.log(response.data);
      setJob(response.data);
    } catch (err) {
      console.error("Couldn't fetch job details", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getJobById(jobId);
  }, []);

  const formatSalary = (num) => {
    if (num > 1000) {
      return `${(num / 1000).toFixed(0)}k`;
    }
  };
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-7xl">
        <button
          onClick={() => {
            navigate(-1);
          }}
          className="group mt-24 ml-5 flex items-center border border-gray-200 space-x-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 hover:text-white bg-white/50 hover:bg-sky-600 cursor-pointer shadow-sm hover:shadow-md hover:border-transparent transition-all duration-200 "
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        {user?.role === "jobSeeker" && (
          <div className="flex items-center justify-end pr-5">
            {job?.applicationStatus ? (
              <StatusBadge status={job?.applicationStatus} />
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  applyToJob(jobId);
                }}
                className="bg-sky-600 hover:bg-sky-700 hover:shadow-md text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md cursor-pointer"
              >
                Apply
              </button>
            )}
          </div>
        )}

        {/* Main Content */}
        <div className="p-2 pb-24 mt-4 border border-gray-100 rounded-2xl">
          <div className="z-10 bg-white p-2 rounded-2xl">
            <div className="flex items-start gap-4 mb-0">
              {job?.company?.companyLogo && (
                <img
                  src={job?.company?.companyLogo}
                  alt="Company Logo"
                  className="h-16 md:h-20 w-16 md:w-20 object-contain rounded-2xl border-4 border-white/20 shadow-sm"
                />
              )}
              <div className="">
                <h1 className="font-semibold text-gray-900 text-base sm:text-xl leading-snug group-hover:text-sky-600 transition-colors mb-2">
                  {job?.title}
                </h1>
                <div className="flex gap-2 items-start text-sm text-gray-600">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span className="font-semibold">{job?.location}</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6 flex-wrap">
              {job?.experienceLevel && (
                <span className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-sm text-gray-700 font-semibold rounded-full border border-gray-200">
                  <BriefcaseBusiness className="w-4 h-4" />
                  {job?.experienceLevel}
                </span>
              )}
              <span className="flex items-center gap-2 px-4 py-2 bg-green-100 text-sm text-green-800 font-semibold rounded-full border border-green-200">
                <Clock className="w-4 h-4 shrink-0" />
                {job?.type}
              </span>
              <span className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-sm text-purple-800 font-semibold rounded-full border border-sky-200">
                <BriefcaseBusiness className="w-4 h-4" />
                {job?.category}
              </span>
              {job?.educationLevel && (
                <span className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-sm text-blue-800 font-semibold rounded-full border border-blue-200">
                  <GraduationCap className="w-4 h-4" />
                  {job?.educationLevel}
                </span>
              )}
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-sm text-gray-700 font-semibold rounded-full border border-gray-200">
                <CalendarDays className="w-4 h-4" />
                <span className="text-sm font-medium">Posted Date: </span>
                <span>{moment(job?.createdAt).format("MMMM Do, YYYY")}</span>
              </div>
              {job?.no_of_vacancy && (
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-sm text-gray-700 font-semibold rounded-full border border-gray-200">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Available Vacancy:{" "}
                  </span>
                  {job?.no_of_vacancy}
                </div>
              )}
              {job?.application_deadline_date && (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-sm text-red-700 font-semibold rounded-full border border-red-100">
                  <CalendarDays className="w-4 h-4" />
                  <span className="text-sm font-medium">Deadline Date: </span>
                  {moment(job?.application_deadline_date).format(
                    "MMMM Do, YYYY",
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="mt-10 mb-5 p-4 bg-green-100 rounded-xl text-gray-700 flex gap-4 items-center">
            <div className="">
              <p className="font-semibold">Compensation</p>
              <p className="font-bold text-xl mt-2">
                NPR {formatSalary(job?.salaryMin)} to{" "}
                {formatSalary(job?.salaryMax)}
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

                    <div className="flex flex-col items-start gap-4">
                      <img
                        src={job?.company?.avatar || "/default.png"}
                        alt="Avatar"
                        className="w-20 h-20 rounded-full object-cover border border-gray-200"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {job?.company?.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <Mail className="w-4 h-4" />
                          <span>{job?.company?.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Company Overview
                    </h2>

                    <div className="flex flex-col items-start gap-4">
                      <img
                        src={job?.company?.companyLogo || "/default.png"}
                        alt="Company Logo"
                        className="w-20 h-20 rounded-lg object-contain border border-gray-200"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {job?.company?.companyName}
                          {job?.company?.isCompanyVerified && (
                            <BadgeCheck className="w-4 h-4 text-sky-600 ml-1" />
                          )}
                        </h3>

                        <p className="text-sm text-gray-600 mt-1">
                          Company Size: {job?.company?.companySize || "N/A"}
                        </p>

                        <p className="text-sm text-gray-600 mt-1">
                          Location: {job?.company?.companyLocation || "N/A"}
                        </p>

                        {job?.company?.companyWebsiteLink && (
                          <a
                            href={job?.company?.companyWebsiteLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-sky-600 hover:underline mt-1 block"
                          >
                            {job?.company?.companyWebsiteLink}
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
                        {job?.company?.companyRegistrationNumber || "—"}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-500">PAN Number</p>
                      <p className="font-medium mt-1 uppercase tracking-widest">
                        {job?.company?.panNumber || "—"}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-500">Verification Status</p>
                      <span
                        className={`inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                          job?.company?.isCompanyVerified
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {job?.company?.isCompanyVerified
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

                  <p className="text-sm text-justify text-gray-700 leading-relaxed bg-gray-50 p-4 md:p-6 rounded-lg">
                    {job?.company?.companyDescription ||
                      "No description provided."}
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
              {job?.description}
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
                {job?.requirements
                  .toString()
                  .split(".")
                  .filter(Boolean)
                  .map((requirement, index) => (
                    <li key={index}>{requirement.trim()}</li>
                  ))}
              </ul>
            </div>
          </div>
          {job?.offer && (
            <div className="mt-10 space-y-5">
              <div className="flex items-center gap-4">
                <BookOpenText className="w-4 h-4" />
                <h2 className="text-xl font-semibold text-gray-900">
                  What We're offering
                </h2>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl sm:text-base text-sm text-gray-700">
                <ul className="list-disc space-y-3 px-4">
                  {job?.offer
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
    </>
  );
};

export default JobDetails;
