import React, { useEffect, useState } from "react";
import { Save, X, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import uploadImage from "../../utils/uploadImage";
import Navbar from "../../components/layout/Navbar";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const { user, updateUser } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
    resume: user?.resume || "",
  });

  const [formData, setFormData] = useState({ ...profileData });
  const [uploading, setUploading] = useState({ avatar: false, resume: false });
  const [saving, setSaving] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = async (file, type) => {
    setUploading((prev) => ({ ...prev, [type]: true }));
    try {
      const imgUploadRes = await uploadImage(file);
      const imgUrl = imgUploadRes.imageUrl || "";

      // Update form data with new image URL
      handleInputChange(type, imgUrl);
    } catch (err) {
      console.error("upload failed:", err);
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      handleInputChange(type, previewUrl);

      // Upload image
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
        toast.success("Profile Updated Successfully!");
        setProfileData({ ...formData });
        updateUser({ ...formData });
      }
    } catch (err) {
      console.log("Failed to Update Profile. Please Try Again", err);
      toast.error("Failed to Update Profile. Please Try Again");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...profileData });
  };

  const DeleteResume = async () => {
    setSaving(true);
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.DELETE_RESUME, {
        resumeUrl: user.resume || "",
      });

      if (response.status === 200) {
        toast.success("Resume Deleted Successfully!");
        setProfileData({ ...formData, resume: "" });
        updateUser({ ...formData, resume: "" });
      }
    } catch (err) {
      console.log("Failed to Delete Resume. Please Try Again", err);
      toast.error("Failed to Delete Resume. Please Try Again");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const userData = {
      name: user?.name || "",
      email: user?.email || "",
      avatar: user?.avatar || "",
      resume: user?.resume || "",
    };

    console.log(userData);
    setProfileData({ ...userData });
    setFormData({ ...userData });
    return () => {};
  }, [user]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8 px-4 mt-16 lg:m-20">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white pb-10 rounded-xl shadow-lg overflow-hidden">
            <div className="bg-sky-600 flex justify-between items-center p-4">
              <h1 className="text-xl font-medium text-white">Profile</h1>
            </div>

            <div className="p-2 md:p-8">
              <div className="space-y-6">
                <div className="flex flex-col space-y-4 items-start md:items-center md:flex-row md:space-x-4">
                  <div className="relative">
                    <img
                      src={formData.avatar}
                      alt="Avatar"
                      className="w-20 h-20 rounded-full border-2 border-gray-100 object-cover"
                    />
                    {uploading.avatar && (
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                        <div className="animate-spin w-6 h-6 rounded-full border-2 border-white border-t-transparent"></div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block cursor-pointer">
                      <span className="sr-only">Choose avatar</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          handleImageChange(e, "avatar");
                        }}
                        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-600 hover:file:bg-sky-100 transition-colors cursor-pointer"
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
                {/* Email */}
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
                {user?.resume ? (
                  <div className="px-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resume
                    </label>
                    <div className="flex items-center gap-2">
                      <p className="md:text-base text-sm text-gray-600">
                        Link:{" "}
                        <a
                          href={user?.resume}
                          target="_blank"
                          className="pl-2 text-sky-500 underline cursor-pointer break-all"
                        >
                          {user?.resume}
                        </a>
                      </p>
                      <button onClick={DeleteResume} className="cursor-pointer">
                        <Trash2 className="w-6 h-6 text-red-600" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-5">
                      Resume
                      <span className="cursor-pointer sr-only">
                        Choose File
                      </span>
                      <input
                        type="file"
                        onChange={(e) => {
                          handleImageChange(e, "resume");
                        }}
                        accept=".pdf,.doc,.docx"
                        className="mt-5 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-600 hover:file:bg-sky-100 transition-colors cursor-pointer"
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
                <Link
                  to={"/find-jobs"}
                  onClick={handleCancel}
                  className="p-3 flex items-center gap-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </Link>

                <button
                  onClick={handleSave}
                  disabled={saving || uploading.avatar || uploading.resume}
                  className="p-3 flex items-center gap-2 border border-gray-300 text-white rounded-lg bg-sky-600 hover:bg-sky-70 transition-colors cursor-pointer hover:bg-sky-700"
                >
                  {saving ? (
                    <div className="animate-spin border-2 border-b-sky-600 w-4 h-4 rounded-full"></div>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{saving ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
