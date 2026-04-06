import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { validatePassword } from "../../utils/helper";
import { toast } from "react-hot-toast";
import { API_PATHS } from "../../utils/apiPaths";
import { Lock, Key, Eye, EyeOff, ArrowLeft } from "lucide-react";

const ChangePassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [formState, setFormState] = useState({
    errors: {},
    showOldPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
    isLoading: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (formState.errors[name]) {
      setFormState((prev) => ({
        ...prev,
        errors: {
          ...prev.errors,
          [name]: "",
        },
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    // Validate old password
    if (!formData.oldPassword.trim()) {
      errors.oldPassword = "Current password is required";
    }
    // Validate new password
    if (!formData.newPassword.trim()) {
      errors.newPassword = validatePassword(formData.newPassword);
    }
    // Validate confirm password
    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    // Check if new password is same as old password
    if (formData.oldPassword && formData.newPassword === formData.oldPassword) {
      errors.newPassword =
        "New password must be different from Current password";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormState((prev) => ({
        ...prev,
        errors,
      }));
      return;
    }
    setFormState((prev) => ({
      ...prev,
      isLoading: true,
    }));

    try {
      const response = await axiosInstance.post(
        API_PATHS.AUTH.CHANGE_PASSWORD,
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        },
      );
      toast.success(response?.data?.message);
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setFormState({
        errors: {},
        showOldPassword: false,
        showNewPassword: false,
        showConfirmPassword: false,
        isLoading: false,
      });
    } catch (err) {
      console.log(err?.message);
      toast.error(
        err?.message || "Failed to change password. Please try again",
      );
    } finally {
      setFormState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <button
          onClick={() => {
            navigate(-1);
          }}
          title="Go back to previous page"
          className="group flex items-center border border-gray-200 space-x-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:text-white bg-white/50 hover:bg-sky-600 cursor-pointer shadow-sm hover:shadow-md hover:border-transparent transition-all duration-200 "
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mt-6">
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-2">
              Change Password
            </h1>
            <p className="text-slate-600 mb-6">
              Keep your account secure
            </p>
          </div>
            {/* Old Password */}
            <div>
              <p className="block text-sm font-medium text-slate-700 mb-2">
                Current Password *
              </p>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="oldPassword"
                  type={formState.showOldPassword ? "text" : "password"}
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-10 py-3 rounded-lg border ${
                    formState.errors.oldPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors placeholder:text-sm md:placeholder:text-base`}
                  placeholder="Enter your current password"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormState((prev) => ({
                      ...prev,
                      showOldPassword: !prev.showOldPassword,
                    }))
                  }
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  title={
                    formState.showOldPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {formState.showOldPassword ? (
                    <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                  )}
                </button>
              </div>
              {formState.errors.oldPassword && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  {formState.errors.oldPassword}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <p className="block text-sm font-medium text-slate-700 mb-2">
                New Password *
              </p>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="newPassword"
                  type={formState.showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-10 py-3 rounded-lg border ${
                    formState.errors.newPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors placeholder:text-sm md:placeholder:text-base`}
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormState((prev) => ({
                      ...prev,
                      showNewPassword: !prev.showNewPassword,
                    }))
                  }
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  title={
                    formState.showNewPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {formState.showNewPassword ? (
                    <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                  )}
                </button>
              </div>
              {formState.errors.newPassword && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  {formState.errors.newPassword}
                </p>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <p className="block text-sm font-medium text-slate-700 mb-2">
                Confirm New Password *
              </p>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="comfirmPassword"
                  type={formState.showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-10 py-3 rounded-lg border ${
                    formState.errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors placeholder:text-sm md:placeholder:text-base`}
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormState((prev) => ({
                      ...prev,
                      showConfirmPassword: !prev.showConfirmPassword,
                    }))
                  }
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  title={
                    formState.showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {formState.showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                  )}
                </button>
              </div>
              {formState.errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  {formState.errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm font-medium text-slate-700 mb-2">
                Password Requirements:
              </p>
              <ul className="text-xs text-slate-600 space-y-1">
                <li className="flex items-center">
                  <span
                    className={`w-2 h-2 rounded-full mr-2 ${
                      formData.newPassword.length >= 8
                        ? "bg-green-500"
                        : "bg-slate-300"
                    }`}
                  ></span>
                  At least 8 characters
                </li>
                <li className="flex items-center">
                  <span
                    className={`w-2 h-2 rounded-full mr-2 ${
                      /(?=.*[a-z])/.test(formData.newPassword)
                        ? "bg-green-500"
                        : "bg-slate-300"
                    }`}
                  ></span>
                  One lowercase letter
                </li>
                <li className="flex items-center">
                  <span
                    className={`w-2 h-2 rounded-full mr-2 ${
                      /(?=.*[A-Z])/.test(formData.newPassword)
                        ? "bg-green-500"
                        : "bg-slate-300"
                    }`}
                  ></span>
                  One uppercase letter
                </li>
                <li className="flex items-center">
                  <span
                    className={`w-2 h-2 rounded-full mr-2 ${
                      /(?=.*\d)/.test(formData.newPassword)
                        ? "bg-green-500"
                        : "bg-slate-300"
                    }`}
                  ></span>
                  Atleast one number
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={formState.isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                formState.isLoading
                  ? "bg-slate-300 cursor-not-allowed text-slate-500"
                  : "bg-sky-600 hover:bg-sky-700 text-white"
              }`}
            >
              {formState.isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Changing Password...
                </span>
              ) : (
                "Change Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
