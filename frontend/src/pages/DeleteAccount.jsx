import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";

const DeleteAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    password: "",
  });
  const [formState, setFormState] = useState({
    showPassword: false,
    isLoading: false,
    error: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (formState.error) {
      setFormState((prev) => ({
        ...prev,
        error: "",
      }));
    }
  };

  const handleFirstStep = () => {
    setStep(2);
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    if (!formData.password.trim()) {
      setFormState((prev) => ({
        ...prev,
        error: "Password is required",
      }));
      return;
    }

    setFormState((prev) => ({
      ...prev,
      isLoading: true,
      error: "",
    }));

    try {
      const response = await axiosInstance.delete(
        API_PATHS.AUTH.DELETE_USER(location.state?.userEmail || ""),
      );

      if (response.status === 200) {
        setStep(3);
        toast.success("Account deleted successfully");
        // Logout user after successful deletion
        setTimeout(() => {
          logout();
          navigate("/");
        }, 2000);
      }
    } catch (err) {
      console.error("Delete account error:", err);
      setFormState((prev) => ({
        ...prev,
        isLoading: false,
        error:
          err.response?.data?.message ||
          "Failed to delete account. Please try again.",
      }));
    }
  };

  const handleGoBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      navigate(-1);
    }
  };

  const renderStep1 = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="text-center">
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-2">
          Delete Your Account
        </h1>
        <p className="text-slate-600 mb-6 max-w-md mx-auto">
          This action is{" "}
          <strong className="text-red-600">permanent and irreversible</strong>.
          All your data will be permanently deleted.
        </p>
      </div>

      <div className="bg-slate-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-slate-900 mb-3">
          What will be deleted:
        </h3>
        <ul className="space-y-2 text-sm text-slate-600">
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            Profile information and personal data
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            All job applications and saved jobs
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            Messages and notifications
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            Resume and other uploaded files
          </li>
          {location.state?.userRole === "employer" && (
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              All posted jobs and applications
            </li>
          )}
          <li className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-600" />
            <span className="text-red-600">Cannot be undone</span>
          </li>
        </ul>
      </div>

      <div className="flex">
        <button
          onClick={handleFirstStep}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex-1"
        >
          <Trash2 className="w-4 h-4" />I Understand, Continue
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Confirm Your Password
        </h1>
        <p className="text-slate-600">
          Enter your current password to verify this action
        </p>
      </div>

      <form onSubmit={handleDeleteAccount} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Password *
          </label>
          <div className="relative">
            <input
              id="password"
              type={formState.showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 placeholder:text-sm rounded-lg border ${
                formState.error ? "border-red-500" : "border-gray-300"
              }  transition-colors`}
              placeholder="Enter your current password"
            />
            <button
              type="button"
              onClick={() =>
                setFormState((prev) => ({
                  ...prev,
                  showPassword: !prev.showPassword,
                }))
              }
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              title={formState.showPassword ? "Hide password" : "Show password"}
            >
              {formState.showPassword ? (
                <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
              ) : (
                <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
              )}
            </button>
          </div>
          {formState.error && (
            <p className="text-red-500 text-sm mt-1">{formState.error}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleGoBack}
            className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <button
            type="submit"
            disabled={formState.isLoading}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
              formState.isLoading
                ? "bg-slate-300 cursor-not-allowed text-slate-500"
                : "bg-red-600 hover:bg-red-700 text-white"
            } flex-1`}
          >
            {formState.isLoading ? (
              <span className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Deleting Account...
              </span>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete Account
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );

  const renderStep3 = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Account Deleted Successfully
        </h1>
        <p className="text-slate-600 mb-6">
          Your account has been permanently deleted. You will be logged out and
          redirected to the home page shortly.
        </p>
        <div className="flex justify-center">
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="flex items-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go to Home Page
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            title="Go back to previous page"
            className="group flex items-center border border-gray-200 space-x-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:text-white bg-white/50 hover:bg-sky-600 cursor-pointer shadow-sm hover:shadow-md hover:border-transparent transition-all duration-200 "
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        <div className="space-y-4">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-1 text-sm text-slate-500">
            <div
              className={`flex items-center gap-2 ${
                step >= 1 ? "text-slate-900 font-medium" : ""
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  step >= 1 ? "bg-slate-900" : "bg-slate-300"
                }`}
              ></div>
              Confirm
            </div>
            <div className="w-6 h-0.5 bg-slate-300"></div>
            <div
              className={`flex items-center gap-2 ${
                step >= 2 ? "text-slate-900 font-medium" : ""
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  step >= 2 ? "bg-slate-900" : "bg-slate-300"
                }`}
              ></div>
              Verify
            </div>
            <div className="w-6 h-0.5 bg-slate-300"></div>
            <div
              className={`flex items-center gap-2 ${
                step >= 3 ? "text-slate-900 font-medium" : ""
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  step >= 3 ? "bg-slate-900" : "bg-slate-300"
                }`}
              ></div>
              Complete
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccount;
