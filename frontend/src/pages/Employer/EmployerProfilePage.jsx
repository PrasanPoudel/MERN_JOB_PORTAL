import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { Building2, Mail, Edit3 } from "lucide-react";
import toast from "react-hot-toast";
import uploadImage from "../../utils/uploadImage";
import DashboardLayout from "../../components/layout/DashboardLayout";
import EditProfileDetails from "./EditProfileDetails";

const EmployerProfilePage = () => {
  const { user, updateUser } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || null,
    companyName: user?.companyName || "",
    companyLogo: user?.companyLogo || null,
    companyDescription: user?.companyDescription || "",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || null,
        companyName: user.companyName || "",
        companyLogo: user.companyLogo || null,
        companyDescription: user.companyDescription || "",
      });
      setFormData({
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || null,
        companyName: user.companyName || "",
        companyLogo: user.companyLogo || null,
        companyDescription: user.companyDescription || "",
      });
    }
  }, [user]);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...profileData });
  const [uploading, setUploading] = useState({
    avatar: false,
    companyLogo: false,
  });
  const [saving, setSaving] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (file, type) => {
    setUploading((prev) => ({ ...prev, [type]: true }));

    try {
      const imgUploadRes = await uploadImage(file);
      const imgUrl = imgUploadRes.imageUrl || "";
      const field = type === "avatar" ? "avatar" : "companyLogo";
      handleInputChange(field, imgUrl);
    } catch (err) {
      toast.error("Image upload failed. Please try again.");
      console.error("Image Upload failed: ", err);
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      const field = type === "avatar" ? "avatar" : "companyLogo";
      handleInputChange(field, previewUrl);
      //upload image
      handleImageUpload(file, type);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await axiosInstance.put(
        API_PATHS.AUTH.UPDATE_PROFILE,
        formData
      );
      if (response.status === 200) {
        toast.success("Profile Details Updated Successfully!");
        //Update profile details then exit editMode
        setProfileData({ ...formData });
        updateUser({ ...formData });
        setEditMode(false);
      }
    } catch (err) {
      console.error("Profile Update Failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...profileData });
    setEditMode(false);
  };

  if (editMode) {
    return (
      <EditProfileDetails
        formData={formData}
        handleImageChange={handleImageChange}
        handleInputChange={handleInputChange}
        handleSave={handleSave}
        handleCancel={handleCancel}
        saving={saving}
        uploading={uploading}
      />
    );
  }

  return (
    <DashboardLayout activeMenu="employer-profile">
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-sky-500 px-2 md:px-8 py-6 flex items-center justify-between">
              <h1 className="text-xl font-medium text-white">
                Employer Profile
              </h1>
              <button
                onClick={() => {
                  setEditMode(true);
                }}
                className="text-white flex items-center gap-2 bg-white/10 p-2 rounded-lg text-sm backdrop-blur-sm hover:bg-black/10 cursor-pointer hover:scale-105"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </div>

            {/* information container */}
            <div className="p-2 md:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* personal info */}
                <div id="1" className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 ">
                    Personal Information
                  </h2>
                  <div className="flex items-center space-x-4">
                    <img
                      src={profileData.avatar}
                      alt="Avatar"
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-100"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {profileData.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{profileData.email}</span>
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
                      src={profileData.companyLogo}
                      alt="Company Logo"
                      className="w-20 h-20 rounded-lg object-cover border-2 border-gray-100"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {profileData.companyName}
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
                  {profileData.companyDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmployerProfilePage;
