import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import {
  Mail,
  Edit3,
  Globe,
  MapPin,
  ShieldCheck,
  User,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";
import uploadFile from "../../utils/uploadFile";
import DashboardLayout from "../../components/layout/DashboardLayout";
import EditProfileDetails from "./EditProfileDetails";

const EmployerProfilePage = () => {
  const { user, updateUser } = useAuth();

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    avatar: null,
    employerProfile: "",
    companyName: "",
    companyLogo: null,
    companyDescription: "",
    companyLocation: "",
    companyWebsiteLink: "",
    companySize: "",
    companyRegistrationNumber: "",
    panNumber: "",
    isCompanyVerified: false,
  });

  const [formData, setFormData] = useState(profileData);
  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [uploading, setUploading] = useState({
    avatar: false,
    companyLogo: false,
  });
  const [saving, setSaving] = useState(false);

  // Validation function
  const validateForm = (data) => {
    const newErrors = {};

    // Full Name validation
    if (!data.name || data.name.trim() === "") {
      newErrors.name = "Full name is required";
    }

    // Company Name validation
    if (!data.companyName || data.companyName.trim() === "") {
      newErrors.companyName = "Company name is required";
    }

    // Company Size validation
    if (!data.companySize || data.companySize === "") {
      newErrors.companySize = "Company size is required";
    }

    // Company Location validation
    if (!data.companyLocation || data.companyLocation.trim() === "") {
      newErrors.companyLocation = "Company location is required";
    }

    // Company Registration Number validation
    if (
      !data.companyRegistrationNumber ||
      data.companyRegistrationNumber.trim() === ""
    ) {
      newErrors.companyRegistrationNumber =
        "Company registration number is required";
    }

    // PAN Number validation
    if (!data.panNumber || data.panNumber.trim() === "") {
      newErrors.panNumber = "PAN number is required";
    } else if (data.panNumber.trim().length !== 10) {
      newErrors.panNumber = "PAN number must be 10 characters";
    }

    // Company Description validation
    if (!data.companyDescription || data.companyDescription.trim() === "") {
      newErrors.companyDescription = "Company description is required";
    }

    // Website link validation (optional, but if provided must be valid URL format)
    if (data.companyWebsiteLink && data.companyWebsiteLink.trim() !== "") {
      try {
        new URL(data.companyWebsiteLink);
      } catch {
        newErrors.companyWebsiteLink =
          "Please enter a valid URL (e.g., https://example.com)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (user) {
      const updatedData = {
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || null,
        companyName: user.companyName || "",
        companyLogo: user.companyLogo || null,
        companyDescription: user.companyDescription || "",
        companyLocation: user.companyLocation || "",
        companyWebsiteLink: user.companyWebsiteLink || "",
        companySize: user.companySize || "",
        companyRegistrationNumber: user.companyRegistrationNumber || "",
        panNumber: user.panNumber || "",
        isCompanyVerified: user.isCompanyVerified || false,
      };
      setProfileData(updatedData);
      setFormData(updatedData);
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const updatedData = { ...prev, [field]: value };
      validateForm(updatedData);
      return updatedData;
    });
  };

  const handleFileUpload = async (file, type) => {
    if (!file) return;
    
    setUploading((prev) => ({ ...prev, [type]: true }));
    const prevValue = formData[type === "avatar" ? "avatar" : "companyLogo"];
    try {
      const fileUploadRes = await uploadFile(file);
      const fileUrl = fileUploadRes?.fileUrl || prevValue;
      handleInputChange(type === "avatar" ? "avatar" : "companyLogo", fileUrl);
      toast.success(`${type === 'avatar' ? 'Profile picture' : 'Company logo'} uploaded successfully!`);
    } catch (err) {
      console.error("[File Upload Error]", {
        type,
        fileName: file?.name,
        error: err?.message || err
      });
      toast.error(err?.message || `${type === 'avatar' ? 'Profile picture' : 'Company logo'} upload failed. Please try again.`);
      handleInputChange(
        type === "avatar" ? "avatar" : "companyLogo",
        prevValue,
      );
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      const field = type === "avatar" ? "avatar" : "companyLogo";
      handleInputChange(field, previewUrl);
      handleFileUpload(file, type);
    }
  };

  const handleSave = async () => {
    if (!validateForm(formData)) {
      toast.error("Please fill all required fields correctly.");
      return;
    }

    setSaving(true);
    try {
      const response = await axiosInstance.put(
        API_PATHS.AUTH.UPDATE_PROFILE,
        formData,
      );
      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        setProfileData(formData);
        updateUser(formData);
        setEditMode(false);
      }
    } catch (err) {
      console.error("[Profile Update Error]", {
        error: err?.message || err
      });
      toast.error(err?.message || "Profile update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profileData);
    setEditMode(false);
  };

  if (editMode) {
    return (
      <EditProfileDetails
        formData={formData}
        handleFileChange={handleFileChange}
        handleInputChange={handleInputChange}
        handleSave={handleSave}
        handleCancel={handleCancel}
        saving={saving}
        uploading={uploading}
        errors={errors}
      />
    );
  }

  return (
    <DashboardLayout activeMenu="employer-profile">
      <div className="min-h-screen py-4 px-3 sm:py-6 sm:px-4 md:py-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-sky-600 px-4 sm:px-6 py-4 sm:py-6 flex justify-between items-center">
              <h1 className="text-lg sm:text-xl font-semibold text-white">
                Employer Profile
              </h1>
              <button
                onClick={() => setEditMode(true)}
                className="text-white flex items-center gap-2 bg-white/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-white/30 transition text-sm"
              >
                <Edit3 className="w-4 h-4" />
                <span className="hidden xs:inline">Edit Profile</span>
                <span className="xs:hidden">Edit</span>
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 md:p-8 space-y-8 md:space-y-10">
              {/* Personal Information */}
              <section>
                <h2 className="text-base sm:text-lg font-semibold border-b border-gray-200 pb-2 mb-4 sm:mb-6">
                  Personal Information
                </h2>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <img
                    src={profileData.avatar || "/default.png"}
                    alt="Avatar"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold truncate">
                      {profileData.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <Mail className="w-4 h-4 shrink-0" />
                      <span className="truncate">{profileData.email}</span>
                    </div>
                  </div>
                </div>
              </section>

              {profileData?.companyName ? (
                <>
                  {/* Company Overview */}
                  <section>
                    <h2 className="text-base sm:text-lg font-semibold border-b border-gray-200 pb-2 mb-4 sm:mb-6">
                      Company Overview
                    </h2>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                      <img
                        src={profileData.companyLogo || "/default.png"}
                        alt="Company Logo"
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-contain shrink-0"
                      />
                      <div className="min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold truncate">
                          {profileData.companyName}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <MapPin className="w-4 h-4 shrink-0" />
                          <span className="truncate">
                            {profileData.companyLocation}
                          </span>
                        </div>
                        <a
                          href={profileData.companyWebsiteLink}
                          target="_blank"
                          className="flex items-center gap-2 text-sm text-blue-500 mt-1"
                        >
                          <Globe className="w-4 h-4 shrink-0" />
                          <span className="truncate">
                            {profileData.companyWebsiteLink}
                          </span>
                        </a>
                        <p className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <User className="w-4 h-4 shrink-0" />
                          Company Size: {profileData.companySize}
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Legal & Verification */}
                  <section>
                    <h2 className="text-base sm:text-lg font-semibold border-b border-gray-200 pb-2 mb-4 sm:mb-6">
                      Legal & Verification
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-sm">
                      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                        <p className="text-gray-500">
                          Company Registration Number
                        </p>
                        <p className="font-medium mt-0.5 break-all">
                          {profileData.companyRegistrationNumber || "—"}
                        </p>
                      </div>

                      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                        <p className="text-gray-500">PAN Number</p>
                        <p className="font-medium mt-0.5 uppercase tracking-widest">
                          {profileData.panNumber || "—"}
                        </p>
                      </div>

                      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                        <p className="text-gray-500">Verification Status</p>
                        <span
                          className={`inline-flex items-center gap-1 mt-1 px-3 py-1 rounded-full text-xs font-medium ${
                            profileData.isCompanyVerified
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          {profileData.isCompanyVerified
                            ? "Verified Company"
                            : "Pending Verification"}
                        </span>
                      </div>
                    </div>
                  </section>

                  {/* About Company */}
                  <section>
                    <h2 className="text-base sm:text-lg font-semibold border-b border-gray-200 pb-2 mb-4 sm:mb-6">
                      About Company
                    </h2>
                    <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 sm:p-6 rounded-lg">
                      {profileData.companyDescription ||
                        "No description provided."}
                    </p>
                  </section>
                </>
              ) : (
                <section className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-2">
                  <p className="text-xl">Create a company profile quickly</p>
                  <button
                    onClick={() => {
                      setEditMode(true);
                    }}
                    className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 px-4 py-2 text-white rounded-2xl"
                  >
                    <Plus className="w-4 h-4" />
                    <p>Create a New Company</p>
                  </button>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmployerProfilePage;
