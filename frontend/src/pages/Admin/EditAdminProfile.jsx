import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import uploadFile from "../../utils/uploadFile";
import DashboardLayout from "../../components/layout/DashboardLayout";

const EditAdminProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
  });

  const [formData, setFormData] = useState({ ...profileData });
  const [uploading, setUploading] = useState({ avatar: false });
  const [saving, setSaving] = useState(false);
  const [tempFiles, setTempFiles] = useState({ avatar: null });
  const [tempPreviews, setTempPreviews] = useState({ avatar: null });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setTempFiles((prev) => ({ ...prev, [type]: file }));
      setTempPreviews((prev) => ({ ...prev, [type]: previewUrl }));
      handleInputChange(type, previewUrl);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let avatarUrl = formData.avatar;

      if (tempFiles.avatar) {
        setUploading((prev) => ({ ...prev, avatar: true }));
        try {
          const avatarUploadRes = await uploadFile(tempFiles.avatar);
          avatarUrl = avatarUploadRes?.fileUrl || "";
        } catch (err) {
          console.error("[Avatar Upload Error]", {
            fileName: tempFiles.avatar?.name,
            error: err?.message || err,
          });
          toast.error("Profile picture upload failed. Please try again.");
          return;
        } finally {
          setUploading((prev) => ({ ...prev, avatar: false }));
        }
      }

      const updatedFormData = {
        ...formData,
        avatar: avatarUrl,
      };

      const response = await axiosInstance.put(
        API_PATHS.AUTH.UPDATE_PROFILE,
        updatedFormData,
      );

      if (response.status === 200) {
        toast.success("Profile Updated Successfully!");
        setProfileData({ ...updatedFormData });
        updateUser({ ...updatedFormData });
        setTempFiles({ avatar: null });
        setTempPreviews({ avatar: null });
        navigate("/admin-dashboard");
      }
    } catch (err) {
      console.error("Failed to Update Profile.", err);
      toast.error("Failed to Update Profile. Please Try Again");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...profileData });
  };

  useEffect(() => {
    const userData = {
      name: user?.name || "",
      email: user?.email || "",
      avatar: user?.avatar || "",
    };

    setProfileData({ ...userData });
    setFormData({ ...userData });
  }, [user]);

  return (
    <DashboardLayout activeMenu={"edit-admin-profile"}>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-5xl">
          <div className="bg-white pb-10 rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <h1 className="text-xl bg-sky-600 p-4 font-medium text-white">
              Profile
            </h1>

            <div className="p-2 md:p-8">
              <div className="space-y-6">
                {/* Avatar Upload */}
                <div className="flex flex-col space-y-4 items-start md:items-center md:flex-row md:space-x-6">
                  <div className="relative">
                    <img
                      src={formData.avatar}
                      alt="User Avatar"
                      className="w-20 h-20 rounded-full border-2 border-gray-100 object-cover"
                    />
                    {uploading.avatar && (
                      <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                        <div className="animate-spin w-6 h-6 rounded-full border-2 border-white border-t-transparent"></div>
                      </div>
                    )}
                  </div>

                  <div className="w-full md:w-auto">
                    <label
                      htmlFor="avatar"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Profile Picture
                    </label>

                    <input
                      id="avatar"
                      name="avatar"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "avatar")}
                      className="block w-full text-sm text-gray-600 
                        file:mr-4 file:py-2 file:px-4 
                        file:rounded-full file:border-0 
                        file:text-sm file:font-semibold 
                        file:bg-sky-50 file:text-sky-600 
                        hover:file:bg-sky-100 transition-colors cursor-pointer"
                    />
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Full Name
                  </label>

                  <input
                    autoComplete="off"
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                      focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>

                  <input
                    autoComplete="off"
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-3 border bg-sky-50 border-gray-300 
                      rounded-lg focus:ring-2 focus:ring-sky-500 
                      focus:border-transparent transition-all cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
                <Link
                  to={"/find-jobs"}
                  onClick={handleCancel}
                  className="p-3 flex items-center gap-2 border border-gray-300 
                    text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </Link>

                <button
                  onClick={handleSave}
                  disabled={saving || uploading.avatar}
                  className="p-3 flex items-center gap-2 text-white rounded-lg 
                    bg-sky-600 hover:bg-sky-700 transition-colors disabled:opacity-70"
                >
                  {saving ? (
                    <div className="animate-spin border-2 border-white border-t-transparent w-4 h-4 rounded-full"></div>
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
    </DashboardLayout>
  );
};

export default EditAdminProfile;
