import React, { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import {
  AlertCircle,
  MapPin,
  Users,
  Building2,
  CheckCircle2,
  ArrowRight,
  CreditCard,
  FileTextIcon,
  Info,
  Crown,
  Phone,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const JobPostNotAllowed = ({ user }) => {
  const navigate = useNavigate();
  return (
    <DashboardLayout activeMenu="post-job">
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="rounded-2xl mb-4 p-2">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 p-2 rounded-full text-sm font-medium mb-4">
                <AlertCircle className="w-4 h-4" />
                <span>Company Profile Required</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">
                Complete Your Company Profile First
              </h1>

              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Before you can post jobs on our platform, you need to complete
                your company profile. This helps candidates learn more about
                your organization and builds trust in your job postings.
              </p>

              <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Required Information:
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Building2
                      className={`w-5 h-5 ${user?.companyName?.trim() ? "text-green-500" : "text-gray-300"}`}
                    />
                    <span
                      className={
                        user?.companyName?.trim()
                          ? "text-green-600"
                          : "text-gray-500"
                      }
                    >
                      Company Name
                    </span>
                    {user?.companyName?.trim() ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />
                    ) : null}
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin
                      className={`w-5 h-5 ${user?.companyLocation?.trim() ? "text-green-500" : "text-gray-300"}`}
                    />
                    <span
                      className={
                        user?.companyLocation?.trim()
                          ? "text-green-600"
                          : "text-gray-500"
                      }
                    >
                      Company Location
                    </span>
                    {user?.companyLocation?.trim() ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />
                    ) : null}
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone
                      className={`w-5 h-5 ${user?.companyPhoneNumber?.trim() ? "text-green-500" : "text-gray-300"}`}
                    />
                    <span
                      className={
                        user?.companyPhoneNumber?.trim()
                          ? "text-green-600"
                          : "text-gray-500"
                      }
                    >
                      Company Phone Number
                    </span>
                    {user?.companyPhoneNumber?.trim() ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />
                    ) : null}
                  </div>
                  <div className="flex items-center gap-3">
                    <Users
                      className={`w-5 h-5 ${user?.companySize?.trim() ? "text-green-500" : "text-gray-300"}`}
                    />
                    <span
                      className={
                        user?.companySize?.trim()
                          ? "text-green-600"
                          : "text-gray-500"
                      }
                    >
                      Company Size
                    </span>
                    {user?.companySize?.trim() ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />
                    ) : null}
                  </div>
                  <div className="flex items-center gap-3">
                    <Info
                      className={`w-5 h-5 ${user?.companyDescription?.trim() ? "text-green-500" : "text-gray-300"}`}
                    />
                    <span
                      className={
                        user?.companyDescription?.trim()
                          ? "text-green-600"
                          : "text-gray-500"
                      }
                    >
                      Company Description
                    </span>
                    {user?.companyDescription?.trim() ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />
                    ) : null}
                  </div>
                  <div className="flex items-center gap-3">
                    <FileTextIcon
                      className={`w-5 h-5 ${user?.companyRegistrationNumber?.trim() ? "text-green-500" : "text-gray-300"}`}
                    />
                    <span
                      className={
                        user?.companyRegistrationNumber?.trim()
                          ? "text-green-600"
                          : "text-gray-500"
                      }
                    >
                      Company Registration Number
                    </span>
                    {user?.companyRegistrationNumber?.trim() ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />
                    ) : null}
                  </div>
                  <div className="flex items-center gap-3">
                    <CreditCard
                      className={`w-5 h-5 ${user?.panNumber?.trim() ? "text-green-500" : "text-gray-300"}`}
                    />
                    <span
                      className={
                        user?.panNumber?.trim()
                          ? "text-green-600"
                          : "text-gray-500"
                      }
                    >
                      PAN/Tax Number
                    </span>
                    {user?.panNumber?.trim() ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />
                    ) : null}
                  </div>
                </div>
                <button
                  onClick={() =>
                    navigate("/employer-profile?editProfileDetails=true")
                  }
                  className="mt-10 inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  Create a company profile
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="w-full md:w-100">
              <div className="bg-white flex flex-col gap-2 items-center justify-center mb-8 rounded-2xl py-4 shadow-lg border border-gray-100">
                <div className="inline-flex items-center gap-2 bg-yellow-400 text-white p-2 rounded-full text-sm font-medium mb-3">
                  <Crown className="w-4 h-4" />
                  <span>Premium Employer User</span>
                </div>
                <p className="flex items-center gap-1 justify-center text-gray-600 max-w-2xl mx-auto">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Post Unlimited Jobs
                </p>
                <p className="text-sm sm:text-lg font-semibold">
                  Free users can only have 1 active job
                </p>
                <button
                  onClick={() => {
                    navigate("/pricing");
                  }}
                  className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  View Pricing
                  <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-gray-600">Starting at just रू 100/month</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobPostNotAllowed;
