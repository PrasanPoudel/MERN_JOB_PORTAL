import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { X, Save } from "lucide-react";

const EditProfileDetails = ({
  formData,
  handleFileChange,
  handleInputChange,
  handleSave,
  handleCancel,
  saving,
  uploading,
}) => {
  return (
    <DashboardLayout activeMenu="employer-profile">
      {formData && (
        <div className="min-h-screen px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-sky-500 px-2 md:px-8 py-6 flex items-center justify-between">
                <h1 className="text-xl font-medium text-white">Edit Profile</h1>
                <button
                  onClick={handleCancel}
                  className="p-2 hover:bg-gray-100 text-white hover:text-gray-900 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-2 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Personal Information
                    </h2>

                    {/* Avatar Upload */}
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={formData.avatar}
                          alt="Avatar"
                          className="w-20 h-20 rounded-full object-fill border-2 border-gray-100"
                        />
                        {uploading?.avatar && (
                          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block">
                          <span className="sr-only">
                            Choose Profile Picture
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              handleFileChange(e, "avatar");
                            }}
                            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-600 hover:file:bg-sky-100 transition-colors"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => {
                          handleInputChange("name", e.target.value);
                        }}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                      />
                    </div>
                    {/* Email(read only) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="text"
                        value={formData.email}
                        className="w-full px-4 py-3 border bg-sky-50 border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all cursor-not-allowed"
                        disabled
                      />
                    </div>
                  </div>
                  {/* Company Information */}
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Company Information
                    </h2>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={formData.companyLogo}
                          alt="Company Logo"
                          className="w-20 h-20 rounded-lg object-fill border-2 border-gray-100"
                        />
                        {uploading?.companyLogo && (
                          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block">
                          <span className="sr-only">Choose Company Logo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              handleFileChange(e, "companyLogo");
                            }}
                            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-600 hover:file:bg-green-100 transition-colors"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Company Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => {
                          handleInputChange("companyName", e.target.value);
                        }}
                        placeholder="Enter your company name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-0 focus:border-transparent transition-all"
                      />
                    </div>
                    {/* Company Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Description
                      </label>
                      <textarea
                        type="text"
                        value={formData.companyDescription}
                        onChange={(e) => {
                          handleInputChange(
                            "companyDescription",
                            e.target.value
                          );
                        }}
                        rows={5}
                        placeholder="Describe your company..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
                  <button
                    onClick={handleCancel}
                    className="p-3 flex items-center gap-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={
                      saving || uploading.avatar || uploading.companyLogo
                    }
                    className="p-3 flex items-center gap-2 border border-gray-300 text-white rounded-lg bg-sky-600 hover:bg-sky-70 transition-colors cursor-pointer hover:bg-sky-700"
                  >
                    {saving ? (
                      <div className="animate-spin border-2 border-b-sky-600 w-4 h-4 rounded-full"></div>
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>{saving ? "Saving... " : "Save Changes"}</span>
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
