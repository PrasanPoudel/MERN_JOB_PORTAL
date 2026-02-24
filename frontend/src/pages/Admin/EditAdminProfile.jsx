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

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = async (file, type) => {
    setUploading((prev) => ({ ...prev, [type]: true }));
    try {
      const fileUploadRes = await uploadFile(file);
      const fileUrl = fileUploadRes.fileUrl || "";

      // Update form data with new file URL
      handleInputChange(type, fileUrl);
    } catch (err) {
      console.error("upload failed:", err);
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      handleInputChange(type, previewUrl);

      // Upload file
      handleFileUpload(file, type);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await axiosInstance.put(
        API_PATHS.AUTH.UPDATE_PROFILE,
        formData,
      );

      if (response.status === 200) {
        toast.success("Profile Updated Successfully!");
        setProfileData({ ...formData });
        updateUser({ ...formData });
        navigate("/admin-dashboard")
      }
    } catch (err) {
      console.error("Failed to Update Profile. Please Try Again", err);
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

    console.log(userData);
    setProfileData({ ...userData });
    setFormData({ ...userData });
    return () => {};
  }, [user]);

  return (
    <DashboardLayout activeMenu={"edit-admin-profile"}>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-5xl">
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
                          handleFileChange(e, "avatar");
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
                  disabled={saving || uploading.avatar}
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
    </DashboardLayout>
  );
};

export default EditAdminProfile;
