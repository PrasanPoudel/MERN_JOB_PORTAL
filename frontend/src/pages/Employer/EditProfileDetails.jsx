import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  X,
  Save,
  ShieldCheck,
  MapPin,
  Globe,
  Users,
  FileText,
  CreditCard,
} from "lucide-react";

const EditProfileDetails = ({
  formData,
  handleFileChange,
  handleInputChange,
  handleSave,
  handleCancel,
  saving,
  uploading,
  errors = {},
}) => {
  return (
    <DashboardLayout activeMenu="employer-profile">
      {formData && (
        <div className="min-h-screen p-4">
          <div className="max-w-5xl">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-sky-600 px-4 sm:px-6 py-4 sm:py-6 flex justify-between items-center">
                <h1 className="text-lg sm:text-xl font-semibold text-white">
                  Edit Profile
                </h1>
                <button
                  onClick={handleCancel}
                  className="text-white flex items-center gap-2 bg-white/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-white/30 transition text-sm"
                >
                  <X className="w-4 h-4" />
                  <span className="hidden xs:inline">Cancel</span>
                </button>
              </div>

              <div className="p-4 sm:p-6 md:p-8 space-y-8 md:space-y-10">
                <section>
                  <h2 className="text-base sm:text-lg font-semibold border-b border-gray-200 pb-2 mb-4 sm:mb-6">
                    Personal Information
                  </h2>

                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="relative self-start shrink-0">
                      <img
                        src={formData.avatar || "/default.png"}
                        alt="Avatar"
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
                      />
                      {uploading?.avatar && (
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-4 min-w-0">
                      {/* Avatar file input */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Profile Picture
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          id="avatar-upload"
                          onChange={(e) => handleFileChange(e, "avatar")}
                          className="block w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 sm:file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-600 hover:file:bg-sky-100 transition-colors"
                        />
                      </div>

                      {/* Name + Email grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                              handleInputChange("name", e.target.value)
                            }
                            placeholder="Enter your full name"
                            className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all outline-none ${
                              errors.name
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300"
                            }`}
                          />
                          {errors.name && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.name}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            id="email"
                            value={formData.email}
                            disabled
                            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-base sm:text-lg font-semibold border-b border-gray-200 pb-2 mb-4 sm:mb-6">
                    Company Overview
                  </h2>

                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="relative self-start shrink-0">
                      <img
                        src={formData.companyLogo || "/default.png"}
                        alt="Company Logo"
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-contain"
                      />
                      {uploading?.companyLogo && (
                        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-4 min-w-0">
                      {/* Logo file input */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Company Logo
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          id="company-logo-upload"
                          onChange={(e) => handleFileChange(e, "companyLogo")}
                          className="block w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 sm:file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-green-50 file:text-green-600 hover:file:bg-green-100 transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Company Name
                          </label>
                          <input
                            type="text"
                            id="companyName"
                            value={formData.companyName}
                            onChange={(e) =>
                              handleInputChange("companyName", e.target.value)
                            }
                            placeholder="e.g. Acme Corporation"
                            className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all outline-none ${
                              errors.companyName
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300"
                            }`}
                          />
                          {errors.companyName && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.companyName}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Company Size
                          </label>
                          <div className="relative">
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            <select
                              id="companySize"
                              value={formData.companySize}
                              onChange={(e) =>
                                handleInputChange("companySize", e.target.value)
                              }
                              className={`w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all outline-none appearance-none bg-white ${
                                errors.companySize
                                  ? "border-red-500 bg-red-50"
                                  : "border-gray-300"
                              }`}
                            >
                              <option value="">Select company size</option>
                              <option value="1-10">1 – 10 employees</option>
                              <option value="11-50">11 – 50 employees</option>
                              <option value="51-200">51 – 200 employees</option>
                              <option value="201-500">
                                201 – 500 employees
                              </option>
                              <option value="501-1000">
                                501 – 1,000 employees
                              </option>
                              <option value="1001+">1,001+ employees</option>
                            </select>
                          </div>
                          {errors.companySize && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.companySize}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            <input
                              type="text"
                              id="companyLocation"
                              value={formData.companyLocation}
                              onChange={(e) =>
                                handleInputChange(
                                  "companyLocation",
                                  e.target.value,
                                )
                              }
                              placeholder="e.g. Buddhabhumi-9, Imiliya"
                              className={`w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all outline-none ${
                                errors.companyLocation
                                  ? "border-red-500 bg-red-50"
                                  : "border-gray-300"
                              }`}
                            />
                          </div>
                          {errors.companyLocation && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.companyLocation}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Website{" "}
                            <span className="text-gray-500">(Optional)</span>
                          </label>
                          <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            <input
                              type="url"
                              id="companyWebsiteLink"
                              value={formData.companyWebsiteLink}
                              onChange={(e) =>
                                handleInputChange(
                                  "companyWebsiteLink",
                                  e.target.value,
                                )
                              }
                              placeholder="https://www.example.com"
                              className={`w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all outline-none ${
                                errors.companyWebsiteLink
                                  ? "border-red-500 bg-red-50"
                                  : "border-gray-300"
                              }`}
                            />
                          </div>
                          {errors.companyWebsiteLink && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.companyWebsiteLink}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-base sm:text-lg font-semibold border-b border-gray-200 pb-2 mb-4 sm:mb-6">
                    Legal & Verification
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-sm">
                    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                      <p className="text-gray-500 mb-2">
                        Company Registration Number
                      </p>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                          type="text"
                          id="companyRegistrationNumber"
                          value={formData.companyRegistrationNumber}
                          onChange={(e) =>
                            handleInputChange(
                              "companyRegistrationNumber",
                              e.target.value,
                            )
                          }
                          placeholder="e.g. 123456/077/078"
                          className={`w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all outline-none bg-white ${
                            errors.companyRegistrationNumber
                              ? "border-red-500 bg-red-50"
                              : "border-gray-300"
                          }`}
                        />
                      </div>
                      {errors.companyRegistrationNumber && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.companyRegistrationNumber}
                        </p>
                      )}
                    </div>

                    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                      <p className="text-gray-500 mb-2">PAN Number</p>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                          type="text"
                          id="panNumber"
                          value={formData.panNumber}
                          onChange={(e) =>
                            handleInputChange("panNumber", e.target.value)
                          }
                          placeholder="e.g. 604123456"
                          maxLength={10}
                          className={`w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all outline-none bg-white tracking-widest ${
                            errors.panNumber
                              ? "border-red-500 bg-red-50"
                              : "border-gray-300"
                          }`}
                        />
                      </div>
                      {errors.panNumber && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.panNumber}
                        </p>
                      )}
                    </div>

                    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                      <p className="text-gray-500 mb-2">Verification Status</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                            formData.isCompanyVerified
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          {formData.isCompanyVerified
                            ? "Verified Company"
                            : "Pending Verification"}
                        </span>
                        <p className="text-xs text-gray-400">
                          * Managed by platform admin
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-base sm:text-lg font-semibold border-b border-gray-200 pb-2 mb-4 sm:mb-6">
                    About Company
                  </h2>
                  <div>
                    <textarea
                      id="companyDescription"
                      value={formData.companyDescription}
                      onChange={(e) =>
                        handleInputChange("companyDescription", e.target.value)
                      }
                      rows={6}
                      placeholder="Describe your company, its culture, mission, and what makes it a great place to work..."
                      className={`w-full px-4 py-3 sm:px-6 sm:py-4 text-sm text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-lg border focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all outline-none resize-none ${
                        errors.companyDescription
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200"
                      }`}
                    />
                    {errors.companyDescription && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.companyDescription}
                      </p>
                    )}
                  </div>
                </section>

                <div className="flex justify-end items-stretch xs:items-center gap-3 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={
                      saving ||
                      uploading?.avatar ||
                      uploading?.companyLogo ||
                      Object.keys(errors).length > 0
                    }
                    title={
                      Object.keys(errors).length > 0
                        ? "Please fill all required fields correctly"
                        : ""
                    }
                    className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    {saving ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {saving ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default EditProfileDetails;
